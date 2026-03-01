// Paddle 결제 - 임시 비활성화
// TODO: 결제 시스템 재활성화 시 복원

import { NextResponse } from "next/server";

// 결제 시스템 비활성화 중 - 항상 available: true 반환
export async function GET() {
  return NextResponse.json({ available: true }, { status: 200 });
}

// 결제 시스템 비활성화 중 - 아무 동작 없이 성공 응답
export async function POST() {
  return NextResponse.json({ available: true }, { status: 200 });
}

/*
// --- 원본 코드 (결제 시스템 재활성화 시 복원) ---

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();

  const limit = await prisma?.user.findFirst({
    where: { email: user?.emailAddresses[0]?.emailAddress! },
    select: { paymentsCount: true },
  });

  if (!limit) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  if (limit.paymentsCount <= 0) {
    return NextResponse.json({ available: false }, { status: 200 });
  }

  await prisma?.user.update({
    where: { email: user?.emailAddresses[0]?.emailAddress! },
    data: { paymentsCount: limit.paymentsCount - 1 },
  });

  return NextResponse.json({ available: true }, { status: 200 });
}

export async function POST(req: Request) {
  const { type } = await req.json();

  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();

  const limit = await prisma?.user.findFirst({
    where: { email: user?.emailAddresses[0]?.emailAddress! },
    select: { paymentsCount: true },
  });

  if (!limit) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  if (type !== "increment") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  let count = limit.paymentsCount;

  count++;

  await prisma?.user.update({
    where: { email: user?.emailAddresses[0]?.emailAddress! },
    data: { paymentsCount: count },
  });

  return NextResponse.json({ available: true }, { status: 200 });
}
*/
