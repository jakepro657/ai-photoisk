import { NextResponse } from "next/server";
import { analyzeImage } from "@/lib/ai";

export async function POST(req: Request) {
  const { prompt, imgUrl } = await req.json();

  const systemPrompt = `
                <context>
                    You get an image and texts.
                </context>

                <instruction>
                    !IMPORTANT: WRITE IN KOERAN.
                    Please generate a 100-word diary entry based on the image and texts.
                </instruction>
            `;

  const texts = await analyzeImage(
    imgUrl,
    prompt,
    systemPrompt
  );

  return NextResponse.json({
    message: texts,
  });
}
