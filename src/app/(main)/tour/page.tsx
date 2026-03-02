"use client";

import { useState } from "react";
// import useKakaoLoader from "@/hooks/useKakaoLoader";
import KakaoMap from "@/components/features/tour/KakaoMap";

export default function TourPage() {

  // TODO: 카카오맵 로딩 오류 해결 후 주석 해제
  // useKakaoLoader();
  const [position, setPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold">투어 추천</h1>
        <p className="text-sm text-gray-500">주변 포토 스팟을 찾아보세요</p>
      </div>
      <div className="flex-1">
        <KakaoMap position={position} setPosition={setPosition} />
      </div>
    </div>
  );
}
