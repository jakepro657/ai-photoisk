import { motion } from "framer-motion";

export const Loading = () => (
  <motion.div
    className="w-16 h-16 bg-black rounded-full"
    animate={{
      scale: [1, 2, 2, 1, 1],
      rotate: [0, 0, 270, 270, 0],
      borderRadius: ["20%", "20%", "50%", "50%", "20%"],
    }}
    transition={{ repeat: Infinity, duration: 2 }}
  />
);
