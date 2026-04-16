"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#FDF8F2] z-[200] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Spinning ring */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6B2737] border-r-[#6B2737]/30"
          />
          <div className="absolute inset-3 rounded-full border border-[#EDD9A3]/50 flex items-center justify-center">
            <span className="text-xl">💍</span>
          </div>
        </div>

        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-serif text-2xl text-[#6B2737] font-light"
        >
          VivaahVerse
        </motion.p>
        <p className="text-[#1C1C1E]/40 text-xs tracking-widest uppercase mt-2">Loading memories...</p>
      </motion.div>
    </div>
  );
}
