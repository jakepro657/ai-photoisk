"use client";
import React, { createContext, useContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

interface ContextType {
  imageUrls: string[];
  setImageUrls: any;
  poseUrl: string;
  setPoseUrl: any;
  isUserMode: boolean;
  setIsUserMode: any;
  filter: boolean;
  setFilter: any;
}

const WebcamContext = createContext<ContextType>({
  imageUrls: [],
  setImageUrls: () => { },
  poseUrl: "",
  setPoseUrl: () => { },
  isUserMode: false,
  setIsUserMode: () => { },
  filter: false,
  setFilter: () => { },
});

export function useWebcamContext() {
  const context = useContext(WebcamContext);
  return context;
}

function WebcamProvider({ children }: Props) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [poseUrl, setPoseUrl] = useState<string>("");
  const [isUserMode, setIsUserMode] = useState<boolean>(true);
  const [filter, setFilter] = useState<boolean>(false);

  return (
    <WebcamContext.Provider value={{ imageUrls, setImageUrls, poseUrl, setPoseUrl, isUserMode, setIsUserMode, filter, setFilter }}>
      {children}
    </WebcamContext.Provider>
  );
}

export default WebcamProvider;
