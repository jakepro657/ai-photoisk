import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  const img = await req.blob();

  const filename = `toEval_${Date.now()}.png`;

  const { url } = await put(filename, img, {
    access: "public",
  });

  const evalResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
                <context>
                    You are given an image to evaluate.
                    To improve user's photo taking experience, please provide feedback on the image.
                    The feedback should be strict and constructive.
                    Have more focus on the user's body posture, facial expression.
                    Have less focus on the background than the user.
                </context>

                <instruction>
                    Evaluate and describe the image with following criteria: 
                    - Body posture
                    - Facial expression
                    - Background
                    
                    example:
                        Good:
                        - Body posture: The user is standing straight...(skip)
                        - Facial expression: The user is smiling...(skip)
                        - Background: The background is blurred...(skip)

                        Bad:
                        - Body posture: The user is slouching...(skip)
                        - Facial expression: The user is frowning...(skip)
                        - Background: The background is distracting...(skip)

                        Feedback:
                        - The user should stand straight...(skip)
                        - The user should smile...(skip)
                        - The background should be blurred...(skip)
                </instruction>
                `,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: url,
            },
          },
        ],
      },
    ],
  });

  const outputContent = evalResponse.choices[0].message.content as string;

  return NextResponse.json({
    message: outputContent,
  });
}
