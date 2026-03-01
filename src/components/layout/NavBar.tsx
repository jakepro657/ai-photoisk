import React from "react";
import { motion } from "framer-motion";

type Props = {
  children?: React.ReactNode;
};

function NavBar({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="z-20 flex items-center text-xl sm:text-3xl w-full"
    >
      {children}
    </motion.div>
  );
}

export default NavBar;
