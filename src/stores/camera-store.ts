import { create } from "zustand";

interface CameraState {
  /* ---------- state ---------- */
  imageUrls: string[];
  poseUrl: string;
  isUserMode: boolean;
  filter: boolean;

  /* ---------- actions ---------- */
  setImageUrls: (urls: string[]) => void;
  addImage: (url: string) => void;
  removeImage: (index: number) => void;
  setPoseUrl: (url: string) => void;
  setIsUserMode: (mode: boolean) => void;
  setFilter: (filter: boolean) => void;
  reset: () => void;
}

const initialState = {
  imageUrls: [] as string[],
  poseUrl: "",
  isUserMode: true,
  filter: false,
};

export const useCameraStore = create<CameraState>((set) => ({
  ...initialState,

  setImageUrls: (urls) => set({ imageUrls: urls }),
  addImage: (url) =>
    set((state) => ({ imageUrls: [...state.imageUrls, url] })),
  removeImage: (index) =>
    set((state) => ({
      imageUrls: state.imageUrls.filter((_, i) => i !== index),
    })),
  setPoseUrl: (url) => set({ poseUrl: url }),
  setIsUserMode: (mode) => set({ isUserMode: mode }),
  setFilter: (filter) => set({ filter }),
  reset: () => set(initialState),
}));
