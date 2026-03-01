import { NextResponse } from "next/server";
import { currentUser, auth } from "@clerk/nextjs/server";
import prisma from "@/utils/prisma";

export async function GET() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  // Perform your Route Handler's logic with the returned user object

  try {
    const userExists = await prisma?.user.findUnique({
      where: { email: user?.emailAddresses[0]?.emailAddress! },
    });

    if (userExists) return NextResponse.json({ user: user }, { status: 200 });

    await prisma?.user.create({
      data: {
        email: user?.emailAddresses[0]?.emailAddress!,
        name: user?.fullName!,
        paymentsCount: 5,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json({ user: user }, { status: 200 });
}
