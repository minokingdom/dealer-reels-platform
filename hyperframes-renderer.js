/**
 * hyperframes-renderer.js
 * 
 * HeyGen HyperFrames 아키텍처 기반 결정론적(Deterministic) 타임라인 시킹 렌더러 모듈.
 * 
 * 원리:
 * 1) 각 딜러별 신상정보가 주입된 HyperFrames 규격 HTML(data-start, data-duration, window.__timelines)을 생성합니다.
 * 2) 임시서버에서는 이 HTML 자체가 0.1초 만에 열리는 초경량 실시간 프리뷰 플레이어로 작동합니다.
 * 3) 딜러가 [승인]을 누르면 헤드리스 브라우저(Puppeteer/Playwright) 또는 캔버스 캡처 파이프라인이
 *    window.__timelines["main"].seek(frame / fps)를 프레임 단위(0 ~ 719 프레임, 60fps, 12초)로 호출하여
 *    100% 픽셀 오차 없는 MP4 파일을 FFmpeg로 인코딩합니다.
 */

const fs = require('fs');
const path = require('path');

/**
 * HyperFrames 헤드리스 시킹 렌더러 실행 스크립트 생성
 * @param {Object} params
 * @param {string} params.compositionUrl - 딜러별 HyperFrames HTML URL (예: https://staging.autoreels.kr/v/tok_minjun?render=1)
 * @param {string} params.outputPath - 렌더링될 최종 MP4 경로
 * @param {number} [params.fps=60] - 초당 프레임 수
 * @param {number} [params.durationSec=12] - 전체 영상 길이(초) (0~8초 본편 + 8~12초 딜러 3D 명함 엔딩)
 */
function buildHyperFramesRenderPipeline({
  compositionUrl,
  outputPath,
  fps = 60,
  durationSec = 12
}) {
  const totalFrames = Math.round(fps * durationSec);

  const rendererScript = `
// HyperFrames Deterministic Seeking Renderer (60fps Pixel-Exact MP4)
const { spawn } = require('child_process');
const puppeteer = require('puppeteer');

async function renderHyperFramesReel() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--use-gl=angle'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto('${compositionUrl}', { waitUntil: 'networkidle0' });

  // FFmpeg 파이프 프로세스 시작 (image2pipe -> H.264 MP4)
  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'image2pipe',
    '-r', '${fps}',
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'fast',
    '-crf', '20',
    '-movflags', '+faststart',
    '${outputPath}'
  ]);

  for (let frame = 0; frame < ${totalFrames}; frame++) {
    const timeInSeconds = frame / ${fps};
    // HyperFrames 표준: 등록된 모든 타임라인을 정확한 초(t)로 seek
    await page.evaluate((t) => {
      if (window.__timelines) {
        Object.values(window.__timelines).forEach((tl) => tl.seek(t));
      }
    }, timeInSeconds);

    const pngBuffer = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1920 } });
    ffmpeg.stdin.write(pngBuffer);
  }

  ffmpeg.stdin.end();
  await new Promise((resolve) => ffmpeg.on('close', resolve));
  await browser.close();
  console.log('HyperFrames MP4 렌더링 완료:', '${outputPath}');
}

renderHyperFramesReel();
`.trim();

  return {
    fps,
    durationSec,
    totalFrames,
    compositionUrl,
    outputPath,
    rendererScript
  };
}

module.exports = {
  buildHyperFramesRenderPipeline
};
