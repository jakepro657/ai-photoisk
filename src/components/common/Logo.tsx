import Image from "next/image";
import Link from "next/link";
import React from "react";
// import LogoImage from "/public/Logo.png";
import LogoImage from "/public/NEW_LOGO.svg";

type Props = {};

function Logo({}: Props) {
  return (
    <Link href={"/"}>
      <button className="flex items-center gap-2 w-8 h-8">
        <Image src={LogoImage} alt="SSCC" className="w-full h-full" />
        <div className="font-TTHakgyoansimUndongjangL bg-gradient-to-r from-red-600 to-indigo-400 inline-block text-transparent bg-clip-text invisible sm:visible">
          PHOTOisk
        </div>
      </button>
    </Link>
  );
}

export default Logo;
