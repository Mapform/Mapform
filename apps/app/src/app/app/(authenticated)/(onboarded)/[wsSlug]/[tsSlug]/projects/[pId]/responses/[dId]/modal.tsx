"use client";

import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export function Modal({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <motion.div
            animate={{ opacity: 0.5 }}
            className="fixed inset-0 bg-black"
            onClick={() => {
              router.back();
            }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          />
          <motion.div
            animate={{
              scale: 1,
              opacity: 1,
              y: "-50%",
              x: "-50%",
            }}
            className="fixed left-1/2 top-1/2 flex h-[calc(100vh-40px)] w-[calc(100vw-40px)] overflow-y-auto rounded-lg bg-white shadow-lg"
            exit={{
              scale: 0.95,
              opacity: 0,
              y: "-50%",
              x: "-50%",
            }}
            initial={{
              scale: 0.95,
              opacity: 0,
              y: "-50%",
              x: "-50%",
            }}
            transition={{
              type: "spring",
              duration: 0.3,
            }}
          >
            <button
              className="absolute right-4 top-5 z-50"
              onClick={() => {
                // We need to go back twice because the query params get set and add an
                // extra push to the route history
                router.back();
              }}
            >
              <XIcon className="size-5 text-gray-500" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
