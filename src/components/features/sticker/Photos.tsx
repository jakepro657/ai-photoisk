"use client";
import ImageComponent from "next/image";
import React from "react";

type Props = {
  imageUrls: string[] | null;
  selections?: string[];
  setSelections?: (selections: string[]) => void;
  download?: boolean;
  setResponseIdx?: (responseIdx: number) => void;
  isUserMode?: boolean;
  filter: boolean;
  type?: string;
};

function Photos({ setResponseIdx, imageUrls, setSelections, selections, download, isUserMode, filter, type }: Props) {
  if (!imageUrls) {
    return null;
  }

  const onClickToToggleSelect = (url: string) => {

    if (!setSelections) {
      return;
    }

    if (!selections) {
      return;
    }

    if (selections.includes(url)) {
      setSelections(selections.filter((selection) => selection !== url));
    } else {
      setSelections([url]);
    }
  };

  const flipAndDownload = (image: string) => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (isUserMode) {
        ctx?.translate(img.width, 0);
        ctx?.scale(-1, 1);
      }
      if (filter) {
        ctx?.drawImage(img, 0, 0);
        const imageData = ctx?.getImageData(0, 0, img.width, img.height);
        const grayscaleData = grayscaleFilter(imageData!);
        ctx?.putImageData(grayscaleData, 0, 0);
        const flippedDataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = flippedDataUrl;
        a.download = flippedDataUrl.split("/").pop() || "download";
        a.target = '_blank';
        a.click();
        return
      }
      if (type == "sticker") {
        const a = document.createElement('a');
        a.href = image;
        a.download = image.split("/").pop() || "download";
        a.target = '_blank';
        a.click();
        return
      }

      ctx?.drawImage(img, 0, 0);
      const flippedDataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = flippedDataUrl;
      a.download = flippedDataUrl.split("/").pop() || "download";
      a.target = '_blank';
      a.click();

    };
  };

  function grayscaleFilter(pixels: ImageData) {
    var d = pixels.data; for (var i = 0; i < d.length; i += 4) {
      var r = d[i]; var g = d[i + 1]; var b = d[i + 2];
      var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      d[i] = d[i + 1] = d[i + 2] = v
    } return pixels;
  }


  const toggleResponseIdx = (idx: number) => {
    if (!setResponseIdx) {
      return;
    }
    setResponseIdx(idx);
  }

  return (
    <div className="grid grid-cols-5 gap-2 w-full h-fit p-5">
      {imageUrls?.map((url, index) => (
        <button
          key={index}
          className={`${selections?.includes(url) ? "border-4 border-indigo-300 rounded-xl" : "rounded-xl"
            }`}
          onClick={download ? () => {
            toggleResponseIdx(index)
            // flipAndDownload(url)
          } : () => { onClickToToggleSelect(url); }} //flipAndDownload(url) }}
        >
          {/* className={`rounded-xl shadow-md`} ${isUserMode ? "scale-x-[-1]" : ""} */}
          <ImageComponent
            className={`rounded-xl shadow-md ${isUserMode ? "scale-x-[-1]" : ""}`}
            src={`${url}`}
            width={500}
            height={500}
            style={{ filter: filter ? "grayscale(100%)" : "", WebkitFilter: filter ? "grayscale(100%)" : "" }}
            alt={`webcam-${index}`}
          />
        </button>
      ))}
      {imageUrls && [...Array(5 - imageUrls.length)].map((_, index) => (
        <div key={index} className="w-full sm:w-[88px] h-30 bg-gray-200 rounded-xl shadow-md"></div>
      ))}
    </div>
  );
}

export default Photos;
