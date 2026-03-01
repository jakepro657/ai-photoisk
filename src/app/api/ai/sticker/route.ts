import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import prisma from "@/utils/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { analyzeImage, generateText, transformImage } from "@/lib/ai";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

function b64toBlob(b64Data: string, contentType = "") {
  const image_data = atob(b64Data.split(",")[1]);
  const arraybuffer = new ArrayBuffer(image_data.length);
  const view = new Uint8Array(arraybuffer);
  for (let i = 0; i < image_data.length; i++) {
    view[i] = image_data.charCodeAt(i) & 0xff;
  }
  return new Blob([arraybuffer], { type: contentType });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { image, prompt } = body;

  const user = await currentUser();
  const foundUser = await prisma?.user.findFirst({
    where: { email: user?.emailAddresses[0]?.emailAddress! },
  });

  // 원본 이미지를 Vercel Blob에 업로드
  const blob = b64toBlob(image, "image/png");
  const originalFileName = `original_${Date.now()}.png`;
  const { url: originalUrl } = await put(originalFileName, blob, {
    access: "public",
  });

  // Step 1: 성별 감지
  const gender = await analyzeImage(
    originalUrl,
    "Distinguish man or woman in the image.",
    `<context>
      output format is string only with just one word.
      example:
      - Man
      - Woman
    </context>
    <instruction>
      Distinguish man or woman in the image.
    </instruction>`
  );

  // Step 2: 인물 특징 추출
  const description = await analyzeImage(
    originalUrl,
    "Describe the image in detail. Only 5 features of the person in the image.",
    `<context>
      output format is string only with just one words separated by comma.
      example
      - a person, white blouse, long hair, glasses, smiling
    </context>
    <instruction>
      Describe the image in detail.
      !important: only 5 features of the person in the image.
    </instruction>`
  );

  // Step 3: 사용자 프롬프트 번역 (있을 경우)
  let trans: string | null = null;
  if (prompt) {
    trans = await generateText(
      prompt,
      `<instruction>Translate the input texts in English.</instruction>`
    );
  }

  // Step 4: 이미지 스타일 변환 (Vercel Blob URL 반환)
  const transformPrompt = `(masterpiece), (detailed), frontal face, ID photo img, ${gender}, ${description}, ${trans}`;
  const generatedUrl = await transformImage(originalUrl, transformPrompt);

  // DB 저장
  await prisma?.original.create({
    data: {
      url: originalUrl,
      gender,
      filename: originalFileName,
      userId: foundUser?.id,
    },
  });

  const generatedFilename = generatedUrl.split("/").pop() || `img_${Date.now()}.png`;
  await prisma?.generated.create({
    data: {
      url: generatedUrl,
      gender,
      filename: generatedFilename,
      userId: foundUser?.id,
    },
  });

  return NextResponse.json(generatedFilename);
}
