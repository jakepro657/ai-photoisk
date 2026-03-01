import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import prisma from "@/utils/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { analyzeImage, generateText, transformImage } from "@/lib/ai";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { image, prompt } = body;

  console.log(image, prompt);

  // const { userId } = auth();

  // if (!userId) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const user = await currentUser();

  const foundUser = await prisma?.user.findFirst({
    where: { email: user?.emailAddresses[0]?.emailAddress! },
  });

  function b64toBlob(b64Data: string, contentType = "") {
    const image_data = atob(b64Data.split(",")[1]);

    const arraybuffer = new ArrayBuffer(image_data.length);
    const view = new Uint8Array(arraybuffer);

    for (let i = 0; i < image_data.length; i++) {
      view[i] = image_data.charCodeAt(i) & 0xff;
    }

    return new Blob([arraybuffer], { type: contentType });
  }

  const contentType = "image/png";

  const blob = b64toBlob(image, contentType);

  const originalFileName = `original_${Date.now()}.png`;
  const { url: originalUrl } = await put(originalFileName, blob, {
    access: "public",
  });

  console.log(originalUrl);

  // if (!originalUrl) {
  //   return NextResponse.json({ error: "No image provided" }, { status: 400 });
  // }

  // Step 1: Detect gender from image
  const gender = await analyzeImage(
    originalUrl,
    "Distinguish man or woman in the image.",
    `
        <context>
          output format is string only with just one word.

          example:
          - Man
          - Woman
        </context>

        <instruction>
          Distinguish man or woman in the image.
        </instruction>
        `
  );

  // Step 2: Get detailed description of the person in the image
  const description = await analyzeImage(
    originalUrl,
    "Describe the image in detail. Only 5 features of the person in the image.",
    `
        <context>
          output format is string only with just one words separated by comma.

          example
          - a person, white blouse, long hair, glasses, smiling
        </context>

        <instruction>
          Describe the image in detail.
          !important: only 5 features of the person in the image.
        </instruction>
        `
  );

  // Step 3: Translate user prompt to English (if provided)
  let trans: string | null = null;

  if (prompt) {
    trans = await generateText(
      prompt,
      `
          <instruction>
            Translate the input texts in English.
          </instruction>
          `
    );
  }

  console.log("description", description);
  console.log("url", originalUrl);

  // Step 4: Transform image to Disney character style
  const transformPrompt = `(masterpiece), (detailed), frontal face, ID photo img, ${gender}, ${description}, ${trans}`;
  const imageUrl = await transformImage(originalUrl, transformPrompt);

  console.log("imageUrl", imageUrl);

  const imageFile = await fetch(imageUrl).then((res) => res.blob());

  console.log("imageFile", imageFile);

  const filename = `img_${Date.now()}.png`;

  const { url } = await put(filename, imageFile, {
    access: "public",
  });

  await prisma?.original.create({
    data: {
      url: originalUrl,
      gender: gender,
      filename: originalFileName,
      userId: foundUser?.id,
    },
  });

  await prisma?.generated.create({
    data: {
      url: url,
      gender: gender,
      filename: filename,
      userId: foundUser?.id,
    },
  });

  const onlyFilename = url.split("/").pop();

  return NextResponse.json(onlyFilename);
}
