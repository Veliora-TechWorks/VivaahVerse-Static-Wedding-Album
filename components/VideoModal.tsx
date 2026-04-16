"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoModalProps {
  src: string;
  title?: string;
  onClose: () => void;
}

export default function VideoModal({ src, title, onClose }: VideoModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
        onClick={onClose}
      >
        <button
          className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl z-10 w-10 h-10 flex items-center justify-center"
          onClick={onClose}
        >
          ×
        </button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <p className="font-serif italic text-white/80 text-xl text-center mb-4">{title}</p>
          )}
          <video
            src={src}
            controls
            autoPlay
            className="w-full rounded-xl shadow-2xl max-h-[75vh]"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
