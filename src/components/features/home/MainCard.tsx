"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useUser,
  useAuth,
  SignInButton
} from '@clerk/nextjs'
import CircleLoading from "@/components/common/CircleLoading";
import { toast } from "react-hot-toast";
import "./MainCard.css"



type Props = {};

function MainCard({ }: Props) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();

  const onClickToMain = () => {
    router.push("/sticker");
  };

  useEffect(() => {
    async function fetchCreateUser() {

      if (!isSignedIn) {
        return;
      }

      try {
        await fetch("/api/user", {
          method: "GET",
        });
      } catch (error) {
        console.error(error);
        toast.error("로그인에 문제가 발생했습니다. 다시 시도해주세요.");
        signOut();
      }
    }

    fetchCreateUser();
  }, [isSignedIn]);

  if (!isLoaded) {
    return <div className="h-full w-full flex justify-center items-center">
      <CircleLoading />
    </div>
  }

  return (
    <>
      {isSignedIn ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="text-lg sm:text-3xl mt-auto mb-12 w-fit self-center p-6 sm:p-8 space-x-2 rounded-full shadow-xl"
              variant="default"
            >
              <div>나만의 AI사진 찍기!</div>
              <Camera className="camera-icon" />
            </Button>
          </DialogTrigger>
          <DialogContent className="dialog-content">
            <DialogHeader>
              <DialogTitle>약관 및 동의</DialogTitle>
              <DialogDescription>
                본 프로그램의 약관을 꼼꼼이 읽어주세요
              </DialogDescription>
            </DialogHeader>
            <a target="_blank" href={"/terms"} className="dialog-link">
              전문 보기
            </a>
            <DialogFooter>
              <Button
                onClick={onClickToMain}
                className="dialog-footer-button"
              >
                동의 후 다음으로
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <SignInButton
            >
              <Button
                className="text-lg sm:text-3xl mt-auto mb-12 w-fit self-center p-6 sm:p-8 space-x-2 rounded-full shadow-xl"
                variant="default"
              >먼저 로그인 후 이용해주세요!</Button>
            </SignInButton>
          </DialogTrigger>
        </Dialog>
      )}
    </>
  );
}

export default MainCard;
