"use client";
import WebcamComponent from '@/components/camera/WebcamComponent';
import WebcamProvider from "@/components/camera/WebcamProvider";
import PhotoiskPage from "@/components/features/sticker/PhotoiskPage";
import React from "react";

type Props = {};

function Main({ }: Props) {

  return (
    <WebcamProvider>
      <WebcamComponent />
      <PhotoiskPage />
    </WebcamProvider>
  );
}

export default Main;
