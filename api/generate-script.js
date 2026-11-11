/**
 * Vercel Serverless Function: POST /api/generate-script
 * ----------------------------------------------------------------------------
 * 방식 A (SaaS 중앙 AI 엔진):
 * 딜러들은 아무런 로그인이나 설정 없이 한 줄 상황만 입력하면,
 * 백엔드 서버가 대표님(관리자)의 LLM 엔진(OpenAI GPT-4o-mini / Google Gemini 2.5 Flash / 즉시 작동 클라우드 LLM)을
 * 호출하여 100% 새롭게 창작된 4컷 임팩트 자막, 카카오톡 1:1 실제 상담 대화, 금융 조건, SNS 캡션을 생성합니다.
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({
      service: 'AutoReels Central AI Copywriting Engine (방식 A)',
      status: 'READY',
      configuredEnvKeys: {
        openai: Boolean(process.env.OPENAI_API_KEY),
        gemini: Boolean(process.env.GEMINI_API_KEY)
      }
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const prompt = (body.prompt || '').trim();
    const currentVehicle = body.vehicle || '2026 쏘렌토 하이브리드';
    const currentDiscountNum = Number(body.discountNum) || 480;
    const currentDiscount = body.discount || '월 46만원대 · 3일 즉시출고';
    const dealerName = body.dealerName || '김민준';
    const dealerTitle = body.dealerTitle || '수석 카마스터';
    const dealerBranch = body.dealerBranch || '현대·기아 공식전시장';
    const dealerPromo = body.dealerPromo || '신차패키지 8종 무상지원';

    // 관리자(대표님)가 웹 대시보드에서 입력해 둔 키 또는 Vercel 환경변수 키 확인
    const adminOpenAiKey = (body.adminOpenAiKey || process.env.OPENAI_API_KEY || '').trim();
    const adminGeminiKey = (body.adminGeminiKey || process.env.GEMINI_API_KEY || '').trim();

    const systemInstruction = `당신은 대한민국 상위 0.1% 자동차 딜러(카마스터) 전문 숏폼(릴스·쇼츠·틱톡) 카피라이터입니다.
딜러가 입력한 한 줄 출고/재고/프로모션 상황을 바탕으로, 고정 템플릿 느낌이 전혀 나지 않고 실제 사람 냄새가 나는 생생하고 후킹력 높은 숏폼 대본을 JSON 형식으로만 응답하세요.

반드시 아래 JSON 스키마만 출력하세요 (마크다운 백틱 없이 순수 JSON 객체만 출력):
{
  "vehicle": "차종 풀네임 (예: 더 뉴 카니발 하이브리드 9인승)",
  "discountNum": 숫자만(만원 단위 할인액 또는 혜택 환산액, 예: 450),
  "discount": "월 납입금 및 출고 핵심 조건 한 줄 (20자 이내, 예: 월 52만원대 · 부가세 환급 즉시출고)",
  "hook": "상단 메인 후킹 한 줄 (26자 이내)",
  "cutCaptions": [
    "1컷(0~2초): 초반 시선강탈 강렬한 후킹 자막 (26자 이내)",
    "2컷(2~4초): 고객 상황 공감 또는 실내·옵션·재고 핵심 어필 (26자 이내)",
    "3컷(4~6초): 구체적인 금액 혜택·절세·할인 조건 (26자 이내)",
    "4컷(6~8초): 출고·탁송 약속 및 댓글 유도 문구 (26자 이내)"
  ],
  "kakaoChat": [
    { "role": "customer", "text": "고객의 실제 카톡 질문 1 (이모지 포함, 현실적인 말투, 38자 이내)" },
    { "role": "dealer", "text": "딜러의 친절하고 자신감 있는 카톡 답변 1 (38자 이내)" },
    { "role": "customer", "text": "고객의 추가 질문 2 (할인/월납입금/탁송/절세 등, 38자 이내)" },
    { "role": "dealer", "text": "딜러의 핵심 조건 제시 답변 2 (38자 이내)" }
  ],
  "bullets": [
    "✔ 핵심 혜택 체크리스트 1 (28자 이내)",
    "✔ 핵심 혜택 체크리스트 2 (28자 이내)"
  ],
  "ctaKeyword": "댓글 유도 2~4글자 키워드 (예: 견적, 즉시출고, 부산탁송, 특판)",
  "ctaBanner": "하단 노란색 배너 문구 (예: 💬 댓글에 [견적] 남기시면 1:1 비밀 조건표 DM 발송!)"
}`;

    const userMessage = `[딜러 입력 상황]: "${prompt || `${currentVehicle} 특별 프로모션 및 즉시출고 상담`}"
[기본 참고 차종]: ${currentVehicle}
[기본 참고 할인액]: ${currentDiscountNum}만원 (${currentDiscount})
[담당 카마스터]: ${dealerBranch} ${dealerName} ${dealerTitle} (사은품: ${dealerPromo})
[생성 시각 시드]: ${new Date().toISOString()} (매번 새로운 표현과 구어체를 사용하세요)`;

    let aiResult = null;
    let providerUsed = '';

    // 1순위: 대표님의 OpenAI API Key (GPT-4o-mini)
    if (adminOpenAiKey) {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminOpenAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.85,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userMessage }
          ]
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const rawText = data.choices?.[0]?.message?.content || '{}';
        aiResult = JSON.parse(rawText);
        providerUsed = 'OpenAI GPT-4o-mini (관리자 전용 키)';
      }
    }

    // 2순위: 대표님의 Google Gemini API Key (gemini-2.5-flash / gemini-2.0-flash)
    if (!aiResult && adminGeminiKey) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(adminGeminiKey)}`;
      const resp = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\n${userMessage}` }] }],
          generationConfig: {
            temperature: 0.85,
            responseMimeType: 'application/json'
          }
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        aiResult = JSON.parse(rawText);
        providerUsed = 'Google Gemini 2.0 Flash (관리자 전용 키)';
      }
    }

    // 3순위: 별도 키 입력 전에도 즉시 100% 실제 LLM 창작이 작동하도록 클라우드 OpenAI 호환 엔드포인트 호출
    if (!aiResult) {
      const cloudResp = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          temperature: 0.85,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (cloudResp.ok) {
        const data = await cloudResp.json();
        let rawText = data.choices?.[0]?.message?.content || '';
        rawText = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        aiResult = JSON.parse(rawText);
        providerUsed = 'AutoReels Cloud LLM (GPT-4o-mini 실시간 생성)';
      }
    }

    if (!aiResult || !Array.isArray(aiResult.cutCaptions)) {
      throw new Error('AI 응답 파싱에 실패했습니다.');
    }

    return res.status(200).json({
      ok: true,
      provider: providerUsed,
      data: aiResult
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message || 'AI 대본 생성 중 오류가 발생했습니다.'
    });
  }
};
