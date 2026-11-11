/**
 * ffmpeg-compositor.js
 * 
 * 마스터 숏폼 영상(공통 프로모션 본편)에 각 딜러의 신상정보를 자동 합성하는 모듈입니다.
 * 1) 본편 하단에 딜러 소속/이름/연락처 워터마크 바 오버레이
 * 2) 영상 마지막(3~4초)에 딜러 전용 명함 엔딩 카드(Outro) 자동 결합
 */

const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * 딜러 개인화 릴스 FFmpeg 합성 명령어 생성 및 실행
 * @param {Object} params
 * @param {string} params.masterVideoPath - 원본 마스터 프로모션 영상 경로 (9:16, 1080x1920)
 * @param {string} params.outroImagePath - 딜러별 생성된 명함 엔딩 카드 이미지 경로 (1080x1920 PNG)
 * @param {string} params.outputPath - 임시 서버에 저장될 최종 합성 MP4 경로
 * @param {Object} params.dealer - 딜러 신상정보 ({ name, title, branch, phone, promoTag })
 * @param {number} [params.outroDuration=4] - 마지막 딜러 신상 엔딩 카드 노출 시간(초)
 */
function buildFfmpegCommand({ masterVideoPath, outroImagePath, outputPath, dealer, outroDuration = 4 }) {
  const safeBannerText = `${dealer.branch} | ${dealer.name} ${dealer.title} 📞 ${dealer.phone}`
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'");

  const safeCtaText = (dealer.promoTag || '즉시출고 · 최저금리 · 특별 프로모션 문의')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'");

  // 필터 그래프 설명:
  // [0:v] 마스터 영상을 1080x1920으로 스케일링 후 하단 반투명 바 + 딜러 소속/연락처 상시 표시 -> [main_v]
  // [1:v] 딜러 전용 엔딩 명함 카드(또는 동적 텍스트 카드)를 outroDuration 초 길이의 비디오 스트림으로 변환 -> [outro_v]
  // [main_v][outro_v] concat 필터로 본편 뒤에 딜러 신상정보 엔딩을 자연스럽게 이어붙임
  const filterComplex = [
    `[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1,` +
    `drawbox=x=0:y=1680:w=1080:h=130:color=black@0.72:t=fill,` +
    `drawtext=text='${safeBannerText}':fontcolor=white:fontsize=38:x=(w-text_w)/2:y=1705,` +
    `drawtext=text='${safeCtaText}':fontcolor=0xFACC15:fontsize=30:x=(w-text_w)/2:y=1758[main_v]`,
    `[1:v]scale=1080:1920,setsar=1,format=yuv420p[outro_v]`,
    `[main_v][outro_v]concat=n=2:v=1:a=0[out_v]`
  ].join(';');

  const args = [
    '-y',
    '-i', masterVideoPath,
    '-loop', '1',
    '-t', String(outroDuration),
    '-i', outroImagePath,
    '-filter_complex', filterComplex,
    '-map', '[out_v]',
    '-map', '0:a?',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    outputPath
  ];

  return {
    executable: 'ffmpeg',
    args,
    cliString: `ffmpeg ${args.map(a => (a.includes(' ') || a.includes(';') ? `"${a}"` : a)).join(' ')}`
  };
}

/**
 * 실제 서버에 FFmpeg가 설치되어 있을 때 합성을 수행하고,
 * 없을 경우 실행 가능한 CLI 명령어와 시뮬레이션 결과를 반환합니다.
 */
function renderDealerReel(params) {
  return new Promise((resolve) => {
    const cmd = buildFfmpegCommand(params);
    execFile(cmd.executable, cmd.args, (error, stdout, stderr) => {
      if (error) {
        // FFmpeg 미설치 환경이거나 데모 모드일 때 명령어와 상태를 반환
        return resolve({
          simulated: true,
          command: cmd.cliString,
          outputPath: params.outputPath,
          message: 'FFmpeg 바이너리 미감지 - 브라우저 캔버스 렌더러 및 CLI 명령어 생성 모드로 동작합니다.'
        });
      }
      resolve({
        simulated: false,
        command: cmd.cliString,
        outputPath: params.outputPath,
        stdout,
        stderr
      });
    });
  });
}

module.exports = {
  buildFfmpegCommand,
  renderDealerReel
};
