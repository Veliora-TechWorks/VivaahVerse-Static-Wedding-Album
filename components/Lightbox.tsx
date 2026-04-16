"use client";
import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LightboxItem {
  id: number;
  src: string;
  caption?: string;
  event?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ items, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const current = items[currentIndex];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close */}
        <button
          className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl z-10 w-10 h-10 flex items-center justify-center"
          onClick={onClose}
        >
          ×
        </button>

        {/* Counter */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest">
          {currentIndex + 1} / {items.length}
        </div>

        {/* Prev */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 glass-dark rounded-full flex items-center justify-center text-white hover:text-[#6B2737] transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          ‹
        </button>

        {/* Image */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-5xl max-h-[85vh] w-full mx-16"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={current.src}
            alt={current.caption || "Gallery image"}
            width={1200}
            height={800}
            className="object-contain max-h-[80vh] w-full rounded-lg"
            unoptimized
          />
          {current.caption && (
            <div className="absolute bottom-0 left-0 right-0 glass-dark rounded-b-lg px-6 py-3 text-center">
              <p className="font-serif italic text-white/90 text-lg">{current.caption}</p>
              {current.event && (
                <p className="text-[#6B2737] text-xs tracking-widest uppercase mt-1">{current.event}</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Next */}
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 glass-dark rounded-full flex items-center justify-center text-white hover:text-[#6B2737] transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          ›
        </button>

        {/* Download */}
        <a
          href={current.src}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-5 right-5 glass-dark text-white/70 hover:text-[#6B2737] text-xs tracking-widest uppercase px-4 py-2 rounded-full transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          ↓ Download
        </a>
      </motion.div>
    </AnimatePresence>
  );
}
