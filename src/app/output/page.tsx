"use client";
import { Loading } from "@/components/Loading";
import Logo from "@/components/Logo";
import MainCard from "@/components/MainCard";
import NavBar from "@/components/NavBar";
import WaveBackground from "@/components/WaveBackground";
import { Button } from "@/components/ui/button";
import { Instagram, LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { toast } from "react-hot-toast";
import TopNavbar from "@/components/v2/nav/TopNavbar";

type Props = {};

function Home({ }: Props) {
  const search = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showingImg, setShowingImg] = useState<any>(null);

  useLayoutEffect(() => {
    setTimeout(() => {
      setUrl(search.get("image") || "");
    }, 1500);
  }, []);

  useEffect(() => {
    // URL로 File 객체 가져오기

    if (!url) return;

    fetch("/api/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
      }),
    })
      .then((res) => res.blob())
      .then((data) => {
        const tmp = data as any
        const shareData = new File([tmp], "image.png", {
          type: "image/png",
        });
        setFile(shareData);
        setShowingImg(`https://${process.env.NEXT_PUBLIC_STORAGE_DOMAIN}/${url}`);
        setLoading(false);
      })
      .catch(() => {
        console.log("Error");
        setUrl("");
        setLoading(false);
      });
  }, [url]);


  if (loading) {
    return (
      <div className="w-full h-full py-6 px-10">
        <div className="flex items-center justify-center w-full h-full">
          <Loading />
        </div>
      </div>
    );
  }

  return (

    <div className="w-full h-full py-6 px-10">
      <WaveBackground />
      <div className="flex flex-col justify-evenly w-full h-full z-10">
        <TopNavbar />
        <div className="relative w-full h-full z-10">
          <div
            // bg-white
            className={`absolute flex-wrap w-full sm:w-[500px] left-1/2 -translate-x-1/2 h-full flex flex-col justify-center items-center gap-4 text-center bg-no-repeat`}
          >
            {showingImg ? (
              <Image src={showingImg} alt="Image" width={128} height={256} />
            ) : (
              <h1 className="text-3xl sm:text-6xl mt-auto font-TTHakgyoansimUndongjangL bg-gradient-to-r from-red-600 to-indigo-400 inline-block text-transparent bg-clip-text">
                오류가 발생했습니다.
              </h1>
            )}
            <Button
              onClick={() =>
                navigator.share({
                  files: [file as any],
                  title: "숭실대 SSCC & PHOTOisk",
                  text: "PHOTOisk에서 나만의 AI사진을 만들어보세요!",
                })
              }
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
            >
              인스타로 공유하기
              <Instagram className="ml-2" size={24} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
