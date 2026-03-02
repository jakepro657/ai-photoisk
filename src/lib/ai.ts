import { GoogleGenAI } from "@google/genai";
import { put } from "@vercel/blob";

let _ai: GoogleGenAI | null = null;
function getAi() {
  if (!_ai) {
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }
  return _ai;
}

const TEXT_MODEL = "gemini-3-flash-preview";
const IMAGE_MODEL = "gemini-3.1-flash-image-preview";

/**
 * 이미지를 분석하여 텍스트 결과를 반환한다.
 * 용도: 성별 감지, 특징 추출, 일기용 이미지 분석, 포즈 피드백 등
 *
 * @param imageUrl - 이미지 URL (Vercel Blob 등)
 * @param prompt - 분석 프롬프트
 * @param systemPrompt - 시스템 프롬프트 (선택)
 * @returns 분석 결과 텍스트
 */
export async function analyzeImage(
  imageUrl: string,
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString("base64");
  const mimeType = imageResponse.headers.get("content-type") || "image/png";

  const contents = [
    { text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt },
    {
      inlineData: {
        mimeType,
        data: base64Image,
      },
    },
  ];

  const response = await getAi().models.generateContent({
    model: TEXT_MODEL,
    contents,
  });

  return response.text ?? "";
}

/**
 * 프롬프트 기반 텍스트를 생성한다.
 * 용도: 번역, 투어 추천 랭킹 등
 *
 * @param prompt - 사용자 프롬프트
 * @param systemPrompt - 시스템 프롬프트 (선택)
 * @returns 생성된 텍스트
 */
export async function generateText(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const contents = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

  const response = await getAi().models.generateContent({
    model: TEXT_MODEL,
    contents,
  });

  return response.text ?? "";
}

/**
 * 프롬프트 기반 이미지를 생성한다.
 * 생성된 이미지는 Vercel Blob에 업로드되고 URL을 반환한다.
 * 용도: 포즈 가이드 이미지
 *
 * @param prompt - 이미지 생성 프롬프트
 * @returns Vercel Blob에 업로드된 이미지 URL
 */
export async function generateImage(prompt: string): Promise<string> {
  const response = await getAi().models.generateContent({
    model: IMAGE_MODEL,
    contents: prompt,
    config: {
      responseModalities: ["image", "text"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("이미지 생성 실패: 응답에 파트가 없습니다");
  }

  for (const part of parts) {
    if (part.inlineData) {
      const uint8 = new Uint8Array(
        Buffer.from(part.inlineData.data!, "base64")
      );
      const blob = new Blob([uint8], {
        type: part.inlineData.mimeType || "image/png",
      });

      const filename = `generated_${Date.now()}.png`;
      const { url } = await put(filename, blob, { access: "public" });
      return url;
    }
  }

  throw new Error("이미지 생성 실패: 응답에 이미지 데이터가 없습니다");
}

/**
 * 사진 스타일을 변환한다.
 * 원본 이미지를 입력받아 스타일 변환 후 Vercel Blob에 업로드하고 URL을 반환한다.
 * 용도: 디즈니 스타일 스티커 변환
 *
 * @param imageUrl - 원본 이미지 URL
 * @param style - 변환 스타일 프롬프트
 * @returns Vercel Blob에 업로드된 변환 이미지 URL
 */
export async function transformImage(
  imageUrl: string,
  style: string
): Promise<string> {
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString("base64");
  const mimeType = imageResponse.headers.get("content-type") || "image/png";

  const contents = [
    { text: style },
    {
      inlineData: {
        mimeType,
        data: base64Image,
      },
    },
  ];

  const response = await getAi().models.generateContent({
    model: IMAGE_MODEL,
    contents,
    config: {
      responseModalities: ["image", "text"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("이미지 변환 실패: 응답에 파트가 없습니다");
  }

  for (const part of parts) {
    if (part.inlineData) {
      const uint8 = new Uint8Array(
        Buffer.from(part.inlineData.data!, "base64")
      );
      const blob = new Blob([uint8], {
        type: part.inlineData.mimeType || "image/png",
      });

      const filename = `transformed_${Date.now()}.png`;
      const { url } = await put(filename, blob, { access: "public" });
      return url;
    }
  }

  throw new Error("이미지 변환 실패: 응답에 이미지 데이터가 없습니다");
}
