"use client";
import React, { useRef, useState } from "react";
import { useWebcamContext } from "../WebcamProvider";
import { Button } from "../ui/button";
import Photos from "../Photos";

type Props = {};

function PhotoiskPage({}: Props) {
  const { imageUrls, setImageUrls } = useWebcamContext();

  // const [imageFile, setImageFile] = useState<any>(null);
  // const ref = useRef<HTMLInputElement>(null);
  const [response, setResponse] = useState<ImageResponse[] | null>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  // const [style, setStyle] = useState("anime")
  const [style, setStyle] = useState("pixel-art");

  const onClickToGenerateImage = async () => {
    for (const image of selectedImages) {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          init_image: image,
          positivePrompt:
            "just the way it is, Enhance lighting, natural, bright, Remove noise, detail sharp, Sharpen details, clear faces, background, Blur background, depth of field, focus subject, Restore old photo, remove scratches, enhance clarity, revive colors, vintage, Increase contrast, colors pop, lighting balance, Correct exposure, brighten underexposed, adjust overexposed, balanced light, Add warmth, golden hour look, warm tones, natural balance, Retouch portrait, smooth skin, remove imperfections, enhance eyes, lips, natural polished",
          negativePrompt:
            "out of image context, Do not overexpose, avoid artificial brightness, Prevent oversharpening, details too harsh, No excessive blurring, background clear, Avoid over-saturation, colors unnatural, Do not distort, keep original proportions, Avoid heavy retouching, maintain natural features, No fake warmth, colors true to life, Prevent flattening, preserve depth, texture, Avoid making too dark, maintain visibility, Do not remove essential details, characters, Keep authentic, avoid over-modification",
          style: style,
        }),
      });
      const data = await res.json();
      console.log(data);
      setResponse((prev: any) => [...prev, data]);
    }
  };

  // const onUploadImage = (e: any) => {
  //   const reader = new FileReader();
  //   const file = e.target.files?.[0];
  //   reader.readAsDataURL(file);
  //   reader.onload = (data) => {
  //     setImageFile(reader.result);
  //     console.log(reader.result);
  //   };
  // };

  return (
    <>
      <Photos
        selections={selectedImages}
        setSelections={setSelectedImages}
        imageUrls={imageUrls}
      />
      <Photos
        imageUrls={
          response?.map(
            (res) => "data:image/png;base64," + res.artifacts?.[0].base64
          ) || null
        }
      />
      <Button
        onClick={onClickToGenerateImage}
        className="fixed bottom-4 w-[90%] sm:w-[432px]"
      >
        이미지 생성
      </Button>
    </>
  );
}

export default PhotoiskPage;
