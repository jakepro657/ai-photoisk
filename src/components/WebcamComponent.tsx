"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useWebcamContext } from "./WebcamProvider";

type Props = {};

const videoConstraints = {
  width: 512,
  height: 512,
  facingMode: "user",
};

function WebcamComponent({}: Props) {
  const { imageUrls, setImageUrls } = useWebcamContext();
  const [limit, setLimit] = useState(0);

  const webcamRef = useRef<Webcam>(null);

  // 웹캠 사진 캡쳐
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;
    if (!imageUrls) return;

    setImageUrls((prev: any) => [...prev, imageSrc]);
  }, [imageUrls, setImageUrls]);

  // 5초마다 웹캠 캡쳐
  useEffect(() => {
    const interval = setInterval(() => {
      if (limit >= 5) {
        clearInterval(interval);
        return;
      }

      capture();
      setLimit((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Webcam
      mirrored={true}
      audio={false}
      width={500}
      height={500}
      ref={webcamRef}
      screenshotFormat="image/png"
      videoConstraints={videoConstraints}
    />
  );
}

export default WebcamComponent;
