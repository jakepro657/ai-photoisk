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

  const gptResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `

        <context>
          output format is string only with just one word.

          example:
          - Man
          - Woman
        </context>

        <instruction>
          Distinguish man or woman in the image.
        </instruction>
        `,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: originalUrl
            },
          },
        ],
      },
    ],
  });

  const gender = gptResponse.choices[0].message.content as string;

  const gptReponseForDetailed = await openai.chat.completions.create({
    model: "gpt-4o-2024-05-13",
    messages: [
      {
        role: "system",
        content: `

        <context>
          output format is string only with just one words separated by comma.

          example
          - a person, white blouse, long hair, glasses, smiling
        </context>

        <instruction>
          Describe the image in detail.
          !important: only 5 features of the person in the image.
        </instruction>
        `,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: originalUrl
            },
          },
        ],
      },
    ],
  });

  // 턱수염이 조금 있고 뒷 배경의 색감이 알록달록 하면 좋겠어.
  let detailedPrompt = null;

  if (prompt) {
    detailedPrompt = await openai.chat.completions.create({
      model: "gpt-4o-2024-05-13",
      messages: [
        {
          role: "system",
          content: `
          <instruction>
            Translate the input texts in English.
          </instruction>
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    })
  }

  const trans = detailedPrompt?.choices[0].message.content as string;

  const description = gptReponseForDetailed.choices[0].message
    .content as string;

  console.log ("description", description);

  console.log("url", originalUrl);

  const output = await replicate.run(process.env.REPLICATE_MODEL as any, {
    input: {
      prompt: `(masterpiece), (detailed), frontal face, ID photo img, ${gender}, ${description}, ${trans}`,
      num_steps: 50,
      input_image: originalUrl == "" ? blob : originalUrl,
      image: originalUrl == "" ? blob : originalUrl,
      negative_prompt:
        "face painting, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, low resolution, 3d model, deformed hands, deformed feet, deformed face, deformed body parts, same haircut, eyes without pupils, doubled image, mid aged man, old men, logo in frame, gun, man with more than one penis on body, scared facial expression, drawing, painting, blur focus, blur, photo effects, skinny guy, make-up on male, angry facial expression, same human face in one frame, illustration, anime, cartoon, ugly face, bruises, cartoon, anime, painting, red color saturation, unattractive face, jpeg artifacts, frame, Violence, Gore, Blood, War, Weapons, Death, Destruction, Fire, Explosions, Pollution, Garbage, Graffiti, Vandalism, Rust, Decay, Filth, Disease, Insects, Rodents, Vermin, Darkness, Shadows, Nightmares, Fear, Horror, Sadness, Depression, Pain, Suffering, Anguish, Despair, Loneliness, Isolation, Neglect, Abandonment, Negativity, Hate, Racism, Sexism, Homophobia, Discrimination, Intolerance, Prejudice, Ignorance, Arrogance, Greed, Selfishness, Cruelty, Insanity, Madness, lowres, text, error, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, deformed, ugly, mutilated, disfigured, text, extra limbs, face cut, head cut, extra fingers, extra arms, poorly drawn face, mutation, bad proportions, cropped head, malformed limbs, mutated hands, fused fingers, long neck, illustration, painting, drawing, art, sketch, disfigured, kitsch, ugly, oversaturated, grain, low-res, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ugly, disgusting, poorly drawn, childish, mutilated, , mangled, old, surreal, decoration, particles",
      style_strength_ratio: 35
    },
  });

  console.log("output", output);

  const imageUrl = (output as string[])?.[0];

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
