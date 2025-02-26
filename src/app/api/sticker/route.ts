import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Replicate from "replicate";
import { put } from "@vercel/blob";
import prisma from "@/utils/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
const openai = new OpenAI();

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { image, prompt } = body;

  // image가 없으면 에러 응답 반환
  if (!image) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

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
  const { url: originalUrl } = await put(originalFileName, blob, { access: "public" });
  console.log("originalUrl", originalUrl);

  // GPT-4o API 호출 시, 이미지 입력은 images 필드로 전달합니다.
  const gptResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `<context>
  output format is string only with just one word.
  example:
  - Man
  - Woman
</context>
<instruction>
  Distinguish man or woman in the image.
</instruction>`,
      },
      {
        role: "user",
        content: "", // 메시지 내용은 빈 문자열 처리
      },
    ],
    images: [
      {
        image_url: originalUrl,
      },
    ],
  } as any)

  const gender = gptResponse.choices[0].message.content as string;

  const gptResponseForDetailed = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `<context>
  output format is string only with just one words separated by comma.
  example:
  - a person, white blouse, long hair, glasses, smiling
</context>
<instruction>
  Describe the image in detail.
  !important: only 5 features of the person in the image.
</instruction>`,
      },
      {
        role: "user",
        content: "",
      },
    ],
    images: [
      {
        image_url: originalUrl,
      },
    ],
  } as any)

  let detailedPrompt = null;
  if (prompt) {
    detailedPrompt = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `<context>
  output format is string only with just one words separated by comma.
  IMPORTANT: OUTPUT SHOULD BE WRITTEN IN ENGLISH.
  example:
  - a person, white blouse, long hair, glasses, smiling
</context>
<instruction>
  Rewrite the input texts in detail.
</instruction>`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
  }

  const description = gptResponseForDetailed.choices[0].message.content as string;

  const replicatePrompt =
    `(masterpiece), (detailed), frontal face, ID photo, ${gender}, ${description}` +
    (prompt === "" ? "" : `, ${detailedPrompt}`);

  const output = await replicate.run(process.env.REPLICATE_MODEL as any, {
    input: {
      num_steps: 50,
      input_image: originalUrl,
      prompt: replicatePrompt,
      negative_prompt:
        "face painting, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, low resolution, 3d model, deformed hands, deformed feet, deformed face, deformed body parts, same haircut, eyes without pupils, doubled image, mid aged man, old men, logo in frame, gun, man with more than one penis on body, scared facial expression, drawing, painting, blur focus, blur, photo effects, skinny guy, make-up on male, angry facial expression, same human face in one frame, illustration, anime, cartoon, ugly face, bruises, cartoon, anime, painting, red color saturation, unattractive face, jpeg artifacts, frame, Violence, Gore, Blood, War, Weapons, Death, Destruction, Fire, Explosions, Pollution, Garbage, Graffiti, Vandalism, Rust, Decay, Filth, Disease, Insects, Rodents, Vermin, Darkness, Shadows, Nightmares, Fear, Horror, Sadness, Depression, Pain, Suffering, Anguish, Despair, Loneliness, Isolation, Neglect, Abandonment, Negativity, Hate, Racism, Sexism, Homophobia, Discrimination, Intolerance, Prejudice, Ignorance, Arrogance, Greed, Selfishness, Cruelty, Insanity, Madness, lowres, text, error, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, deformed, ugly, mutilated, disfigured, text, extra limbs, face cut, head cut, extra fingers, extra arms, poorly drawn face, mutation, bad proportions, cropped head, malformed limbs, mutated hands, fused fingers, long neck, illustration, painting, drawing, art, sketch, disfigured, kitsch, ugly, oversaturated, grain, low-res, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ugly, disgusting, poorly drawn, childish, mutilated, , mangled, old, surreal, decoration, particles",
      style_strength_ratio: 35,
    },
  });

  console.log("output", output);
  const imageUrl = (output as string[])?.[0];
  console.log("imageUrl", imageUrl);

  const imageFile = await fetch(imageUrl).then((res) => res.blob());
  const filename = `img_${Date.now()}.png`;
  const { url } = await put(filename, imageFile, { access: "public" });

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
