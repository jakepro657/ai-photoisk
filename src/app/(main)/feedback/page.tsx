"use client";
import { Loading } from "@/components/common/Loading";
import Photos from "@/components/features/sticker/Photos";
import { Button } from "@/components/ui/button";
import CircleLoading from "@/components/common/CircleLoading";
import WaveBackground from "@/components/common/WaveBackground";
import WebcamComponent from "@/components/camera/WebcamComponent";
import { useCameraStore } from "@/stores/camera-store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { FilterIcon } from "lucide-react";

type Props = {};

function Feedback({ }: Props) {
  const { imageUrls, setPoseUrl, isUserMode, filter, setFilter } = useCameraStore();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [popup, setPopup] = useState<boolean>(false);

  const [, setImageUrl] = useState<string>("");
  const [poseDescription, setPoseDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onClickToGeneratePose = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!poseDescription) {
      toast.error("원하는 포즈를 묘사해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/payLimit", {
        method: "GET",
      });

      const limit = await res.json();

      if (!limit.available) {
        setPopup(true);
        toast("이미지 생성 횟수를 초과하였습니다. 결제 후 이용해주세요.", {
          icon: "🔒",
        });
        return;
      }

      setLoading(true);
      const image = await fetch("/api/ai/img", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: poseDescription,
        }),
      });

      const data = await image.json();
      const url = data.url;

      setPoseUrl(url);
      setImageUrl(url);
      setLoading(false);
    } catch (error) {
      toast.error("포즈 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      setLoading(false);
      setPoseUrl("");
    }
  };

  return (
    <>
      <WebcamComponent mode="pose" />
      <WaveBackground />
      <div className="relative w-full h-full sm:w-[500px] bg-indigo-200 pb-16">
        <div className="flex flex-col gap-8 justify-center items-center">
          <div className="pb-20 rounded-t-3xl shadow-[0px_-0.5px_gray] flex flex-col justify-center w-full h-full bg-white">
            <div className="text-start ml-[5%] text-md sm:text-xl font-PretendardBold pt-8 text-indigo-600">
              AI 포즈 생성
            </div>
            <div className="text-start ml-[5%] text-sm sm:text-md font-PretendardRegular pt-1 pb-4">
              원하는 포즈를 생성하여 사진을 찍어주세요!
            </div>
            <textarea
              value={poseDescription}
              onChange={(e) => setPoseDescription(e.target.value)}
              placeholder={`포즈를 묘사해주세요\n\n에시: 인스타에 들어갈만한, 눈은 왼쪽 끝을 바라보고 앉아있는 모습을 그려줘. 정면 사진이고 힙한 느낌으로 팔 자연스럽게 허벅지에 둔 상태의 모습이야.`}
              className="text-sm mx-auto w-[90%] h-32 break-keep p-4 border-2 font-PretendardRegular border-gray-300 rounded-md resize-none"
            ></textarea>
            <Photos
              filter={filter}
              isUserMode={isUserMode}
              selections={selectedImages}
              setSelections={setSelectedImages}
              imageUrls={imageUrls}
              download={true}
            />
            <button className="absolute w-fit border-white border-4 z-30 top-80 right-8 p-2 bg-gray-800 rounded-full"
              onClick={() => setFilter(!filter)}
            >
              {filter ? <FilterIcon size={16} color="red" /> : <FilterIcon size={16} color="white" />}
            </button>
            {loading && (
              <div className="w-full gap-8 flex flex-col items-center justify-center">
                <CircleLoading />
                <p>최대 3분이 걸릴 수 있습니다...</p>
              </div>
            )}
            <div className="relative flex justify-center items-center bg-white w-full pb-16">
              <Button
                className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[90%] sm:w-[432px]"
                disabled={loading}
                onClick={onClickToGeneratePose}
              >
                포즈 생성하기
              </Button>
            </div>
          </div>
        </div>

        {popup && (
          <Dialog open={popup} onOpenChange={setPopup}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>유료 서비스</DialogTitle>
              </DialogHeader>
              <div className="text-start font-PretendardMedium text-md break-keep leading-7">
                더 많은 이미지를 생성하시려면 결제가 필요합니다.
              </div>
              <DialogFooter>
                <DialogClose
                  onClick={() => setPopup(false)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full rounded-md"
                >
                  <Link href={"/pay"} target="_blank">
                    결제하기
                  </Link>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}

export default Feedback;
