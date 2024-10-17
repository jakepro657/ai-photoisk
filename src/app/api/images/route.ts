import { NextResponse } from "next/server";
import OpenAI from "openai";
// import { currentUser } from "@clerk/nextjs/dist/types/server";
import { put } from "@vercel/blob";
import prisma from "@/utils/prisma";

const openai = new OpenAI();

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

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    // const user = await currentUser();

    // const foundUser = await prisma?.user.findFirst({
    //   where: { email: user?.emailAddresses[0]?.emailAddress! },
    // });

    const blob = b64toBlob(image, contentType);

    const originalFileName = `original_${Date.now()}.png`;
    const { url: originalUrl } = await put(originalFileName, blob, {
      access: "public",
    });

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
                url: image,
              },
            },
          ],
        },
      ],
    });

    // const gender = gptResponse.choices[0].message.content as string;

    // await prisma?.original.create({
    //   data: {
    //     url: originalUrl,
    //     gender: gender,
    //     filename: originalFileName,
    //     userId: ,
    //   },
    // });

    const gptReponseForDetailed = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `

          <context>
            You are writing a detailed description of the image.
            Should include:
              - The person's nose
              - The person's eyes
              - The person's mouth
              - The person's hair
              - The person's face shape
            You can refer to the types of person like people usually describe the ideal type of lover.

            For example:
              A person with a sharp nose like a bird, big eyes like a deer, and a small mouth like a cat.

            output format is string only with just one words separated by comma.
            IMPORTANT: OUTPUT SHOULD BE WRITTEN IN ENGLISH.
            For example:
              - big_bird_nose, small_deer_eyes, small_cat_mouth, long_brown_hair, round_face_shape
              - sharp_nose, big_eyes, small_mouth, long_hair, round_face_shape
          </context>
  
          <instruction>
            Describe the face of the person in the image.
          </instruction>
        `,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    });

    const description = gptReponseForDetailed.choices[0].message
      .content as string;

    const generatedImage = await fetch(
      `${process.env.ML_SERVER_URL}/generate?prompt=${description}`,
      {
        method: "GET",
      }
    );

    const generatedImageId = await generatedImage.json();

    const generatedImageBlob = await fetch(
      `${process.env.ML_SERVER_URL}/image/${generatedImageId}`
    );

    const b = await generatedImageBlob.blob();

    return NextResponse.json({ id: generatedImageId, image: b });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}
