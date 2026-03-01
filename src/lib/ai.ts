// src/lib/ai.ts
// AI API 추상화 레이어
// 향후 Gemini API로 교체 예정

/**
 * 이미지를 분석하여 텍스트 결과를 반환한다.
 * 용도: 성별 감지, 특징 추출, 일기용 이미지 분석 등
 *
 * @param imageBase64 - Base64 인코딩된 이미지
 * @param prompt - 분석 프롬프트
 * @param systemPrompt - 시스템 프롬프트 (선택)
 * @returns 분석 결과 텍스트
 */
export async function analyzeImage(
  imageBase64: string,
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  // TODO: Gemini Vision API 구현
  throw new Error("AI analyzeImage not implemented - Gemini API 연동 필요");
}

/**
 * 프롬프트 기반 텍스트를 생성한다.
 * 용도: 일기 생성, 포즈 피드백, 투어 추천 랭킹 등
 *
 * @param prompt - 사용자 프롬프트
 * @param systemPrompt - 시스템 프롬프트 (선택)
 * @returns 생성된 텍스트
 */
export async function generateText(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  // TODO: Gemini Text API 구현
  throw new Error("AI generateText not implemented - Gemini API 연동 필요");
}

/**
 * 프롬프트 기반 이미지를 생성한다.
 * 용도: 포즈 가이드 이미지
 *
 * @param prompt - 이미지 생성 프롬프트
 * @returns 생성된 이미지 URL
 */
export async function generateImage(
  prompt: string
): Promise<string> {
  // TODO: Gemini Imagen 또는 대체 이미지 생성 API 구현
  throw new Error("AI generateImage not implemented - Gemini API 연동 필요");
}

/**
 * 사진 스타일을 변환한다.
 * 용도: 디즈니 스타일 스티커 변환
 *
 * @param imageUrl - 원본 이미지 URL
 * @param style - 변환 스타일 (예: "disney")
 * @returns 변환된 이미지 URL
 */
export async function transformImage(
  imageUrl: string,
  style: string
): Promise<string> {
  // TODO: Gemini 또는 대체 이미지 변환 API 구현
  throw new Error("AI transformImage not implemented - Gemini API 연동 필요");
}
