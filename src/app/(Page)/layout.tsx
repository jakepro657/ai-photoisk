"use client";
import IconButton from "@/components/v2/buttons/IconButton";
import BottomNavbar from "@/components/v2/nav/BottomNavbar";
import WaveBackground from "@/components/WaveBackground";
import { paths } from "@/utils/data";
import { EyeIcon, Image, MapPin, ScanFaceIcon, User2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const data = [
  {
    icon: <ScanFaceIcon size={24} />,
    label: "얼굴 스티커",
    pathname: "/sticker",
  },
  {
    icon: <Image size={24} />,
    label: "나의 활동",
    pathname: "/main",
  },
  {
    icon: <EyeIcon size={24} />,
    label: "포즈 가이드",
    pathname: "/feedback",
  },
];

function Layout({ children }: Props) {
  const pathname = usePathname();

  return (
    <main className="select-none flex flex-col justify-start items-center w-full h-full sm:w-[500px] overflow-y-scroll scrollbar-hide font-IBMPlexSansKRSemiBold overflow-x-clip pb-16">
      {/* <WaveBackground /> */}
      {children}
      <BottomNavbar>
        {paths.map((path, index) => (
          <Link href={path.pathname} key={index}>
            <IconButton
              className={
                path.pathname === pathname
                  ? "text-indigo-500 px-2 rounded-lg py-1 text-sm"
                  : "px-2 rounded-lg py-1 text-sm"
              }
              size="md"
              direction="column"
              icon={data[index].icon}
              label={data[index].label}
            />
          </Link>
        ))}
      </BottomNavbar>
    </main>
  );
}

export default Layout;
