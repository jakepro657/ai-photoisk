"use client";
import { CameraIcon, SwitchCameraIcon } from "lucide-react";
import React, { useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { useCameraStore } from "@/stores/camera-store";
import { Camera } from "react-camera-pro";
import { motion, useAnimate } from "framer-motion";
import Image from "next/image";

type Props = {
  mode?: "general" | "pose";
};

const defaultErrorMessages = {
  noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
  permissionDenied: 'Permission denied. Please refresh and give camera permission.',
  switchCamera:
    'It is not possible to switch camera to different one because there is only one video device accessible.',
  canvas: 'Canvas is not supported.'
}

function WebcamComponent({ mode }: Props) {
  const { imageUrls, setImageUrls, addImage, poseUrl, setIsUserMode, isUserMode } = useCameraStore();

  const [scope, animate] = useAnimate();

  const webcamRef = useRef<any>(null);

  const flipCamera = () => {
    webcamRef.current.switchCamera()
    setIsUserMode(!isUserMode);
  }

  // 웹캠 사진 캡쳐
  const capture = useCallback(() => {

    if (imageUrls?.length >= 5) {
      toast.error("이미지는 최대 5장까지 촬영 가능합니다");
      return;
    }

    const imageSrc = webcamRef.current.takePhoto();
    animate(scope.current, { backgroundColor: ["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"], transition: { duration: 0.1 } });
    if (!imageSrc) return;
    if (!imageUrls) return;


    addImage(imageSrc);
  }, [imageUrls, addImage]);


  return (
    <div className="relative z-50 h-full bg-white">
      <div
        ref={scope}
        className="absolute w-full h-full z-10"
      >
      </div>
      <div className="z-1 w-full h-[calc(100vh-64px)] aspect-portrait">
        <Camera
          errorMessages={defaultErrorMessages}
          ref={webcamRef}
        />
      </div>
      {mode === "pose" && (
        <>
          {poseUrl !== "" ?
            <div className="z-50 absolute left-4 top-4 w-24 h-24">
              <Image
                width={600}
                height={600}
                src={poseUrl}
                alt="pose"
                className="w-full h-full object-cover"
              />
            </div> : <div className="z-50 absolute text-white flex items-center justify-center text-center left-4 top-4 w-24 h-24 break-keep bg-black bg-opacity-30 text-xs">
              이곳에 생성된 포즈가 나타납니다
            </div>
          }
        </>
      )}
      <button className="absolute w-fit border-white border-4 z-30 top-8 right-8 p-2 bg-gray-800 text-white rounded-full" onClick={flipCamera}>
        <SwitchCameraIcon size={32} />
      </button>
      <button
        className="absolute w-fit border-white border-4 z-30 bottom-8 left-0 right-0 mx-auto p-2 bg-gray-800 text-white rounded-full"
        onClick={capture}
      >
        <CameraIcon size={32} />
      </button>
    </div>
  );
}

export default WebcamComponent;
