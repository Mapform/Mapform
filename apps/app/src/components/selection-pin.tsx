import { motion } from "motion/react";

export function SelectionPin() {
  return (
    <motion.div
      animate={{
        opacity: 1,
      }}
      className="z-[100] flex -translate-y-1/2 flex-col items-center"
      key="pin"
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="z-10 size-4 rounded-full border-4 border-black bg-white" />
      <div className="-mt-1.5 h-8 w-[5px] bg-black" />
    </motion.div>
  );
}
