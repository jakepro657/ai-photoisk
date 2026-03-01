"use client";
import { useLayoutEffect, useState } from "react";
import WaveBackground from "@/components/common/WaveBackground";
import TopNavbar from "@/components/layout/TopNavbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainCard from "@/components/features/home/MainCard";


export default function Home() {

  const router = useRouter();

  useLayoutEffect(() => {
    router.prefetch("/sticker");
  }, []);

  return (
    <div className="w-full h-full py-6 px-10">
      <WaveBackground />
      <div className="flex flex-col justify-evenly w-full h-full z-10">
        <TopNavbar />
        <div className="my-auto h-full flex justify-center items-center space-x-8">
          <div
            // bg-white
            className={`flex flex-col justify-center w-full sm:w-3/4 h-3/4 gap-4 text-center rounded-lg drop-shadow-2xl bg-no-repeat`}
          >
            <h1 className="text-3xl sm:text-6xl mt-auto font-TTHakgyoansimUndongjangL bg-gradient-to-r from-red-600 to-indigo-400 inline-block text-transparent bg-clip-text">
              PHOTOisk
            </h1>
            <p className="text:md sm:text-2xl text-black">
              AI로 남기는 여러분의 소중한 인생샷
            </p>
            <MainCard />
            <button className="w-full">
              <Link href="/terms" className="border-b-2 border-black text-black">
                약관보기: Terms of Service, Privacy Notice, Refund Policy
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
