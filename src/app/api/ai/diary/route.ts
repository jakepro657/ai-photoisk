import { NextResponse } from "next/server";
import OpenAI from "openai";
import prisma from "@/utils/prisma";

const openai = new OpenAI();

export async function POST(req: Request) {
  const { prompt, imgUrl } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
                <context>
                    You get an image and texts.
                </context>

                <instruction>
                    !IMPORTANT: WRITE IN KOERAN.
                    Please generate a 100-word diary entry based on the image and texts.
                </instruction>
            `,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: imgUrl,
            },
          },
        ],
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const texts = response.choices[0].message.content;

  return NextResponse.json({
    message: texts,
  });
}
