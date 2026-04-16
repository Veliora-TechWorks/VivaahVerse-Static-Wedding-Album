"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import FadeIn from "@/components/FadeIn";
import coupleData from "@/data/couple.json";

const SEEDS = [
  "story-meet",
  "story-love",
  "story-proposal",
  "story-engagement",
  "story-wedding",
];

/* ── Parallax hero ─────────────────────────────────────────── */
function StoryHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[32vh] sm:h-[38vh] lg:h-[42vh] min-h-[200px] sm:min-h-[260px] flex items-center justify-center overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image
          src="https://picsum.photos/seed/story-hero/1920/800"
          alt="Our Story"
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </motion.div>

      {/* Layered overlays — matches home page style */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-gradient-to-t from-[#FDF8F2] to-transparent" />
      <div className="absolute inset-0 bg-black/30" />

      <motion.div style={{ opacity }} className="relative z-10 text-center px-6">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-6 origin-center"
        >
          <div className="h-px w-12 bg-[#6B2737]" />
          <span className="text-[#EDD9A3] text-[10px] tracking-[0.45em] uppercase font-light">
            The Beginning of Forever
          </span>
          <div className="h-px w-12 bg-[#6B2737]" />
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-none"
          >
            Our Story
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-serif italic text-white/60 text-sm sm:text-base mt-3"
        >
          &ldquo;Every love story is beautiful, but ours is our favorite.&rdquo;
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ── Chapter number ornament ───────────────────────────────── */
function ChapterBadge({ index, icon }: { index: number; icon: string }) {
  return (
    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
      <div className="absolute inset-0 rounded-full border-2 border-[#6B2737]/40" />
      <div className="absolute inset-[5px] rounded-full border border-[#6B2737]/20" />
      <span className="text-2xl z-10">{icon}</span>
      <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-[#6B2737] flex items-center justify-center text-white text-[9px] font-light tracking-wide">
        {index + 1}
      </span>
    </div>
  );
}

/* ── Mobile layout: vertical card stack ────────────────────── */
function MobileTimeline() {
  return (
    <div className="sm:hidden px-4 py-12 space-y-6">
      {coupleData.story.map((item, index) => (
        <FadeIn key={item.id} delay={index * 0.08}>
          {/* Image */}
          <div className="relative h-56 rounded-3xl overflow-hidden mb-4 shadow-lg">
            <Image
              src={`https://picsum.photos/seed/${SEEDS[index]}/600/500`}
              alt={item.title}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {/* Phase pill */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className="glass text-white text-[9px] tracking-widest uppercase px-3 py-1 rounded-full">
                {item.phase}
              </span>
            </div>
            {/* Date badge */}
            <div className="absolute top-4 right-4">
              <span className="glass text-[#EDD9A3] text-[9px] tracking-widest uppercase px-3 py-1 rounded-full">
                {item.date}
              </span>
            </div>
          </div>

          {/* Text card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#EDD9A3]/30">
            <div className="flex items-center gap-3 mb-3">
              <ChapterBadge index={index} icon={item.icon} />
              <div>
                <p className="text-[#6B2737] text-[9px] tracking-widest uppercase font-light">{item.phase}</p>
                <h3 className="font-serif text-2xl font-light text-[#1C1C1E] leading-tight">{item.title}</h3>
              </div>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-[#6B2737]/40 to-transparent mb-4" />
            <p className="text-[#1C1C1E]/60 text-sm leading-relaxed font-light">{item.description}</p>
          </div>

          {/* Connector dot — not after last */}
          {index < coupleData.story.length - 1 && (
            <div className="flex flex-col items-center py-2 gap-1">
              <div className="w-px h-4 bg-[#6B2737]/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#6B2737]/50" />
              <div className="w-px h-4 bg-[#6B2737]/30" />
            </div>
          )}
        </FadeIn>
      ))}
    </div>
  );
}

/* ── Tablet layout: alternating horizontal cards ───────────── */
function TabletTimeline() {
  return (
    <div className="hidden sm:block md:hidden px-6 py-16">
      {/* Section label */}
      <FadeIn className="text-center mb-12">
        <p className="text-[#6B2737] text-[10px] tracking-[0.4em] uppercase mb-3">Chapter by Chapter</p>
        <h2 className="font-serif text-4xl font-light text-[#1C1C1E]">How It All Began</h2>
        <div className="gold-divider max-w-[100px] mx-auto mt-4" />
      </FadeIn>

      <div className="space-y-8">
        {coupleData.story.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <FadeIn key={item.id} delay={0.1} direction={isEven ? "left" : "right"}>
              <div className={`flex gap-5 items-stretch ${isEven ? "flex-row" : "flex-row-reverse"}`}>
                {/* Image */}
                <div className="relative w-44 shrink-0 rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={`https://picsum.photos/seed/${SEEDS[index]}/400/500`}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-[#EDD9A3]/30 flex flex-col justify-center">
                  <span className="text-[#6B2737] text-[9px] tracking-widest uppercase font-light mb-1">{item.date}</span>
                  <span className="text-[#1C1C1E]/40 text-[9px] tracking-widest uppercase font-light mb-2">{item.phase}</span>
                  <h3 className="font-serif text-2xl font-light text-[#1C1C1E] mb-3 leading-tight">{item.title}</h3>
                  <div className="w-8 h-px bg-[#6B2737] mb-3" />
                  <p className="text-[#1C1C1E]/60 text-sm leading-relaxed font-light">{item.description}</p>
                </div>
              </div>

              {/* Step connector */}
              {index < coupleData.story.length - 1 && (
                <div className={`flex items-center gap-2 mt-3 ${isEven ? "pl-[calc(11rem+1.25rem)]" : "pr-[calc(11rem+1.25rem)] justify-end"}`}>
                  <div className="w-px h-6 bg-gradient-to-b from-[#6B2737]/40 to-transparent mx-auto" />
                </div>
              )}
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}

/* ── Desktop layout: cinematic alternating with center spine ── */
function DesktopTimeline() {
  return (
    <div className="hidden md:block px-6 lg:px-12 py-20 max-w-6xl mx-auto">
      {/* Section header */}
      <FadeIn className="text-center mb-20">
        <p className="text-[#6B2737] text-[10px] tracking-[0.4em] uppercase mb-3">Chapter by Chapter</p>
        <h2 className="font-serif text-5xl lg:text-6xl font-light text-[#1C1C1E]">How It All Began</h2>
        <div className="gold-divider max-w-[120px] mx-auto mt-5" />
      </FadeIn>

      <div className="relative">
        {/* Center spine */}
        <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-[#6B2737]/10 via-[#6B2737]/60 to-[#6B2737]/10" />

        {coupleData.story.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div key={item.id} className="relative mb-20 lg:mb-28">
              {/* Spine dot */}
              <div className="absolute left-1/2 -translate-x-1/2 top-10 z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="w-14 h-14 rounded-full bg-[#FDF8F2] border-2 border-[#6B2737] flex items-center justify-center shadow-lg text-xl"
                >
                  {item.icon}
                </motion.div>
                {/* Chapter number */}
                <div className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-[#6B2737] flex items-center justify-center text-white text-[9px]">
                  {index + 1}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left slot */}
                <div className={isLeft ? "pr-8 lg:pr-12" : "pl-8 lg:pl-12 col-start-2"}>
                  <FadeIn direction={isLeft ? "right" : "left"} delay={0.15}>
                    {isLeft ? (
                      /* Text card on left */
                      <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-[#EDD9A3]/30 hover:shadow-md transition-shadow group">
                        <span className="text-[#6B2737] text-[9px] tracking-[0.35em] uppercase font-light">{item.date}</span>
                        <div className="flex items-center gap-2 mt-1 mb-4">
                          <div className="w-1 h-1 rounded-full bg-[#6B2737]" />
                          <span className="text-[#1C1C1E]/40 text-[9px] tracking-widest uppercase font-light">{item.phase}</span>
                        </div>
                        <h3 className="font-serif text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-4 leading-tight group-hover:text-[#6B2737] transition-colors duration-300">
                          {item.title}
                        </h3>
                        <div className="w-10 h-px bg-gradient-to-r from-[#6B2737] to-transparent mb-5" />
                        <p className="text-[#1C1C1E]/60 leading-relaxed font-light text-[15px]">{item.description}</p>
                      </div>
                    ) : (
                      /* Image on left (for right-side text items) */
                      <motion.div
                        whileHover={{ scale: 1.02, rotateZ: -0.8 }}
                        transition={{ duration: 0.35 }}
                        className="relative h-72 lg:h-80 rounded-3xl overflow-hidden shadow-xl"
                      >
                        <Image
                          src={`https://picsum.photos/seed/${SEEDS[index]}/600/500`}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-5 left-5">
                          <span className="glass text-white text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full">
                            {item.phase}
                          </span>
                        </div>
                        <div className="absolute top-5 right-5">
                          <span className="glass text-[#EDD9A3] text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full">
                            {item.date}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </FadeIn>
                </div>

                {/* Right slot */}
                <div className={isLeft ? "pl-8 lg:pl-12 col-start-2" : "pr-8 lg:pr-12 row-start-1"}>
                  <FadeIn direction={isLeft ? "left" : "right"} delay={0.25}>
                    {isLeft ? (
                      /* Image on right */
                      <motion.div
                        whileHover={{ scale: 1.02, rotateZ: 0.8 }}
                        transition={{ duration: 0.35 }}
                        className="relative h-72 lg:h-80 rounded-3xl overflow-hidden shadow-xl"
                      >
                        <Image
                          src={`https://picsum.photos/seed/${SEEDS[index]}/600/500`}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-5 left-5">
                          <span className="glass text-white text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full">
                            {item.phase}
                          </span>
                        </div>
                        <div className="absolute top-5 right-5">
                          <span className="glass text-[#EDD9A3] text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full">
                            {item.date}
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      /* Text card on right */
                      <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-[#EDD9A3]/30 hover:shadow-md transition-shadow group">
                        <span className="text-[#6B2737] text-[9px] tracking-[0.35em] uppercase font-light">{item.date}</span>
                        <div className="flex items-center gap-2 mt-1 mb-4">
                          <div className="w-1 h-1 rounded-full bg-[#6B2737]" />
                          <span className="text-[#1C1C1E]/40 text-[9px] tracking-widest uppercase font-light">{item.phase}</span>
                        </div>
                        <h3 className="font-serif text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-4 leading-tight group-hover:text-[#6B2737] transition-colors duration-300">
                          {item.title}
                        </h3>
                        <div className="w-10 h-px bg-gradient-to-r from-[#6B2737] to-transparent mb-5" />
                        <p className="text-[#1C1C1E]/60 leading-relaxed font-light text-[15px]">{item.description}</p>
                      </div>
                    )}
                  </FadeIn>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F2]">
      <StoryHero />

      {/* Intro divider */}
      <FadeIn>
        <div className="py-7 px-6 max-w-xl mx-auto text-center">
          <div className="gold-divider mb-4" />
          <p className="font-serif italic text-base sm:text-lg text-[#1C1C1E]/50 leading-relaxed">
            A love story written in stolen glances, late-night calls, and a lifetime of tomorrows.
          </p>
          <div className="gold-divider mt-4" />
        </div>
      </FadeIn>

      {/* Responsive timeline — only one renders at a time */}
      <MobileTimeline />
      <TabletTimeline />
      <DesktopTimeline />
    </div>
  );
}
