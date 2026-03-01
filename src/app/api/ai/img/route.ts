import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateImage } from "@/lib/ai";
// TODO: 결제 시스템 재활성화 시 복원
// import { auth } from "@clerk/nextjs/server";
// import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  // const { userId } = auth();

  // if (!userId) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const _user = await currentUser();

  // if (!user) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  // TODO: 결제 시스템 재활성화 시 복원
  // const limit = await prisma?.user.findFirst({
  //   where: { email: user?.emailAddresses[0]?.emailAddress! },
  //   select: { paymentsCount: true },
  // });

  // if (!limit) {
  //   return NextResponse.json(
  //     { error: "Something went wrong" },
  //     { status: 500 }
  //   );
  // }

  // if (limit.paymentsCount <= 0) {
  //   return NextResponse.json(
  //     { error: "Payment limit exceeded" },
  //     { status: 402 }
  //   );
  // }

  const { prompt } = await req.json();

  // 인스타에 들어갈만한, 눈은 왼쪽 끝을 바라보고 앉아있는 모습, 정면 사진, 힙한 느낌, 팔 자연스럽게 가랑이 사이 허벅지에 둔 상태.
  const imgUrl = await generateImage(`
        <ImagePrompt>
            ${prompt}
        </ImagePrompt>
        <Instruction>
            Make a person's pose with just simple outline for a photo.
        </Instruction>
        `);

  // TODO: 결제 시스템 재활성화 시 복원
  // await prisma?.user.update({
  //   where: { email: user?.emailAddresses[0]?.emailAddress! },
  //   data: { paymentsCount: limit.paymentsCount - 1 },
  // });

  return NextResponse.json({
    url: imgUrl,
  });
}
