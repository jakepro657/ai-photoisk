import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/utils/prisma";

export async function POST(req: Request) {
  const { title, content, location, image, result, placeForRecId } =
    await req.json();

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

  const originalFileName = `place_${Date.now()}.png`;
  const { url: originalUrl } = await put(originalFileName, blob, {
    access: "public",
  });

  await prisma?.diary.create({
    data: {
      title: title,
      content: content,
      location: location,
      imageSrc: originalUrl,
      placeForRecId: parseInt(placeForRecId),
      userId: foundUser?.id as number,
      result: result,
    },
  });

  return NextResponse.json({
    message: "success",
  });
}

export async function GET() {
  const user = await currentUser();

  const userExists = await prisma?.user.findUnique({
    where: { email: user?.emailAddresses[0]?.emailAddress! },
  });

  const diaries = await prisma?.diary.findMany({
    where: {
      userId: userExists?.id as number,
    },
  });

  return NextResponse.json({
    message: diaries,
  });
}
