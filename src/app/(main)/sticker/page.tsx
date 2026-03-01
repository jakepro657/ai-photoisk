"use client";
import WebcamComponent from '@/components/camera/WebcamComponent';
import PhotoiskPage from "@/components/features/sticker/PhotoiskPage";
import React from "react";

type Props = {};

function Main({ }: Props) {

  return (
    <>
      <WebcamComponent />
      <PhotoiskPage />
    </>
  );
}

export default Main;
