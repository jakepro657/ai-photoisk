"use client";
import React, { useState } from "react";
import { useCameraStore } from "@/stores/camera-store";
import { Button } from "@/components/ui/button";
import Photos from "./Photos";
import WaveBackground from "@/components/common/WaveBackground";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { FilterIcon, LinkIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import CircleLoading from "@/components/common/CircleLoading";

type Props = {};
// 밝은 조명에서 하면 더 잘 나옴, 정면 얼굴이 가장 잘 나옴
function PhotoiskPage({ }: Props) {
  const { imageUrls, filter, setFilter, isUserMode } = useCameraStore();
  const [response, setResponse] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [additionalDecoPrompt, setAdditionalDecoPrompt] = useState<string>("");

  const [responseIdx, setResponseIdx] = useState(0);

  const [, setClickedCount] = useState(0);
  const [popup, setPopup] = useState(false);

  const onClickToRegenerateImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res = await fetch("/api/payLimit", {
      method: "GET",
    });

    const data = await res.json();

    if (!data.available) {
      setPopup(true);
      toast("이미지 생성 횟수를 초과하였습니다. 결제 후 이용해주세요.", {
        icon: "🔒",
      });
      return;
    }

    setClicked(true);
    setLoading(true);
    await generateImage();
    setClickedCount((prev) => prev + 1);
    setLoading(false);
    setClicked(false);
  };

  const onClickToRetouchImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res = await fetch("/api/payLimit", {
      method: "GET",
    });

    const data = await res.json();

    if (!data.available) {
      setPopup(true);
      toast("이미지 생성 횟수를 초과하였습니다. 결제 후 이용해주세요.", {
        icon: "🔒",
      });
      return;
    }

    if (selectedImages.length === 0) {
      toast.error("이미지를 선택해주세요");
      return;
    }

    if (clicked) {
      toast.error("이미지 생성 중입니다...");
      return;
    }
    setClicked(true);
    setLoading(true);
    await generateImage();
    setClickedCount((prev) => prev + 1);
    setLoading(false);
    setClicked(false);
  };

  const generateImage = async () => {
    for (const image of selectedImages) {
      const res = await fetch("/api/ai/sticker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          additionalDecoPrompt === ""
            ? JSON.stringify({
              image: image,
            })
            : JSON.stringify({
              image: image,
              prompt: additionalDecoPrompt,
            }),
      });

      try {
        const data = await res.json();
        setResponse((prev) => [...prev, data]);
      } catch (e) {
        toast.error(
          "이미지 생성에 실패했습니다. 새로고침 후 다시 시도해주세요."
        );
        window.location.reload();
      }
    }
  };

  const handleAdditionalDecoPrompt = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalDecoPrompt(e.target.value);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(
      `https://photoisk.com/output?image=${response?.[responseIdx]}`
    );
    toast.success("공유링크가 복사되었습니다");
  };

  const shareToInstagram = async () => {
    const shareUrl = `https://photoisk.com/output?image=${response?.[responseIdx]}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI 사진",
          url: shareUrl,
        });
      } catch {
        toast.error("공유에 실패했습니다");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("공유링크가 복사되었습니다. 인스타그램에 붙여넣기 해주세요.");
    }
  };

  return (
    <>
      <WaveBackground />
      <div className="relative w-full h-full sm:w-[500px] bg-indigo-200 pb-16">
        <div className="flex flex-col pb-16 rounded-t-3xl bg-white shadow-[0px_-0.5px_gray]">
          <div className="text-start ml-[5%] text-md sm:text-xl font-PretendardBold pt-8 text-indigo-600">
            AI 사진 변환
          </div>
          <div className="text-start ml-[5%] text-sm sm:text-md font-PretendardRegular pt-1 pb-4">
            사진 촬영 후 AI로 변환할 이미지를 선택해주세요!
          </div>
          <textarea
            value={additionalDecoPrompt}
            onChange={handleAdditionalDecoPrompt}
            placeholder="예: 꽃무늬 배경, 파란 모자 착용"
            className="mx-auto w-[90%] h-32 p-4 border-2 font-PretendardRegular border-gray-300 rounded-md resize-none"
          ></textarea>
          <div className="text-start ml-[5%] text-sm font-PretendardBold pt-4 pb-1 text-gray-600">
            촬영한 사진
          </div>
          <Photos
            isUserMode={isUserMode}
            download={false}
            selections={selectedImages}
            setSelections={setSelectedImages}
            imageUrls={imageUrls}
            filter={filter}
          />
          <button className="absolute w-fit border-white border-4 z-30 top-80 right-8 p-2 bg-gray-800 rounded-full"
            onClick={() => setFilter(!filter)}
          >
            {filter ? <FilterIcon size={16} color="red" /> : <FilterIcon size={16} color="white" />}
          </button>

          {response && response.length > 0 && (
            <>
              <div className="mx-[5%] my-4 border-t border-gray-200" />
              <div className="text-start ml-[5%] text-sm font-PretendardBold pb-1 text-gray-600">
                생성된 AI 사진
              </div>
            </>
          )}
          <Photos
            download={true}
            imageUrls={
              response?.map((res) => {
                return `https://${process.env.NEXT_PUBLIC_STORAGE_DOMAIN}/${res}`;
              }) || null
            }
            filter={filter}
            setResponseIdx={setResponseIdx}
            type="sticker"
          />
          {loading && (
            <div className="w-full gap-8 flex flex-col items-center justify-center">
              <CircleLoading />
              <p>최대 3분이 걸릴 수 있습니다...</p>
            </div>
          )}
          <div className="relative bg-transparent pt-20">
            {response && response.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary hover:text-white text-primary-foreground hover:bg-primary/90 absolute right-8 bottom-4 w-[40%] sm:w-[200px]"
                    variant="outline"
                    disabled={loading || clicked || response.length === 0}
                  >
                    공유
                  </Button>
                </DialogTrigger>
                <DialogContent className="font-PretendardBold sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>공유하기</DialogTitle>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col gap-3 items-center justify-center">
                    <Button
                      onClick={copyUrl}
                      className="w-[90%] mx-auto"
                      variant="outline"
                    >
                      <LinkIcon size={20} className="mr-2" />
                      링크 복사
                    </Button>
                    <Button
                      onClick={shareToInstagram}
                      className="w-[90%] mx-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      인스타그램 공유
                    </Button>
                    <DialogClose className="font-PretendardMedium bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-[90%] mx-auto rounded-md">
                      닫기
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
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
            {response && response.length > 0 ? (
              <Button
                disabled={clicked}
                onClick={onClickToRegenerateImage}
                className="absolute left-8 bottom-4 w-[40%] sm:w-[200px] bg-white text-black hover:bg-primary hover:text-white border-2 border-primary"
              >
                이미지 재생성
              </Button>
            ) : (
              <Button
                disabled={clicked}
                onClick={onClickToRetouchImage}
                className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[90%] sm:w-[432px] bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-lg rounded-xl py-3"
              >
                이미지 생성
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PhotoiskPage;
