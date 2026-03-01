import React from "react";

type Props = {
  children: React.ReactNode;
};

function BottomNavbar({ children }: Props) {
  return (
    <div className="z-[60] h-16 fixed flex items-center justify-evenly bottom-0 w-full sm:w-[500px] bg-white shadow-xl shadow-black">
      {children}
    </div>
  );
}

export default BottomNavbar;
