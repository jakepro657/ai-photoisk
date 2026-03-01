"use client";
import React, { useEffect } from "react";
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
        <Button
          onClick={onClickToMain}
          className="text-lg sm:text-3xl mt-auto mb-12 w-fit self-center p-6 sm:p-8 space-x-2 rounded-full shadow-xl"
          variant="default"
        >
          <div>나만의 AI사진 찍기!</div>
          <Camera className="camera-icon" />
        </Button>
      ) : (
        <SignInButton>
          <Button
            className="text-lg sm:text-3xl mt-auto mb-12 w-fit self-center p-6 sm:p-8 space-x-2 rounded-full shadow-xl"
            variant="default"
          >먼저 로그인 후 이용해주세요!</Button>
        </SignInButton>
      )}
    </>
  );
}

export default MainCard;
