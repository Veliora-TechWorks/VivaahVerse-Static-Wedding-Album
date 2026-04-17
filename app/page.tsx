"use client";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import Lightbox from "@/components/Lightbox";
import coupleData from "@/data/couple.json";

/* ─── Countdown ─────────────────────────────────────────────── */
function useCountdown(target: string) {
  const calc = () => {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  // Start as null — only populate after mount to avoid SSR/client mismatch
  const [time, setTime] = useState<ReturnType<typeof calc> | null>(null);
  useEffect(() => {
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return time;
}

/* ─── Magnetic cursor blob ───────────────────────────────────── */
function CursorBlob() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX - 200); y.set(e.clientY - 200); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return (
    <motion.div
      style={{ left: sx, top: sy }}
      className="pointer-events-none fixed z-0 w-[400px] h-[400px] rounded-full opacity-[0.06]"
      aria-hidden
    >
      <div className="w-full h-full rounded-full bg-[radial-gradient(circle,#6B2737_0%,transparent_70%)]" />
    </motion.div>
  );
}

/* ─── Floating petals ────────────────────────────────────────── */
const PETALS = ["🌸", "🌺", "✿", "❀", "🌼"];
function FloatingPetals() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none select-none text-xl"
          style={{ left: `${8 + i * 11}%`, top: "-30px" }}
          animate={{ y: "110vh", rotate: [0, 180, 360], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 7 + i * 1.8, repeat: Infinity, delay: i * 1.2, ease: "linear" }}
        >
          {PETALS[i % PETALS.length]}
        </motion.span>
      ))}
    </>
  );
}

/* ─── Countdown tile ─────────────────────────────────────────── */
function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white leading-none"
      >
        {String(value).padStart(2, "0")}
      </motion.div>
      <span className="text-[#EDD9A3] text-[10px] tracking-[0.3em] uppercase mt-1">{label}</span>
    </div>
  );
}

/* ─── Events data ────────────────────────────────────────────── */
const events = [
  {
    emoji: "🌼",
    label: "Haldi",
    date: "Feb 12, 2025",
    desc: "Turmeric blessings, marigold showers & folk songs filling the air.",
    img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    accent: "#F59E0B",
    tag: "Morning Ritual",
  },
  {
    emoji: "🌿",
    label: "Mehendi",
    date: "Feb 12, 2025",
    desc: "Intricate henna patterns weaving their love story into art.",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    accent: "#10B981",
    tag: "Evening Ceremony",
  },
  {
    emoji: "🎶",
    label: "Sangeet",
    date: "Feb 13, 2025",
    desc: "Dance, music & fireworks lighting up the Udaipur sky.",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    accent: "#A855F7",
    tag: "Night Celebration",
  },
  {
    emoji: "💒",
    label: "Wedding",
    date: "Feb 14, 2025",
    desc: "Sacred vows, Saptapadi steps & a love sealed for eternity.",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    accent: "#F43F5E",
    tag: "The Sacred Union",
  },
  {
    emoji: "🥂",
    label: "Reception",
    date: "Feb 14, 2025",
    desc: "Starlit lakeside elegance, toasts & midnight celebrations.",
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    accent: "#6B2737",
    tag: "Grand Finale",
  },
];


/* ─── Gallery images ─────────────────────────────────────────── */
const GALLERY_IMAGES = [
  { id: 0,  src: "https://picsum.photos/seed/bento-a/1200/900",  caption: "Sacred Moments",   event: "Wedding" },
  { id: 1,  src: "https://picsum.photos/seed/bento-b/800/600",   caption: "Golden Hour",       event: "Haldi" },
  { id: 2,  src: "https://picsum.photos/seed/bento-c/800/600",   caption: "Bridal Glow",       event: "Mehendi" },
  { id: 3,  src: "https://picsum.photos/seed/bento-d/1200/500",  caption: "Together Forever",  event: "Wedding" },
  { id: 4,  src: "https://picsum.photos/seed/bento-e/600/500",   caption: "Dance of Joy",      event: "Sangeet" },
  { id: 5,  src: "https://picsum.photos/seed/bento-f/600/500",   caption: "Family Blessings",  event: "Haldi" },
  { id: 6,  src: "https://picsum.photos/seed/bento-g/600/500",   caption: "Starlit Night",     event: "Reception" },
  { id: 7,  src: "https://picsum.photos/seed/bento-h/600/500",   caption: "Eternal Love",      event: "Wedding" },
  { id: 8,  src: "https://picsum.photos/seed/gal-m0/800/800",    caption: "Henna Art",         event: "Mehendi" },
  { id: 9,  src: "https://picsum.photos/seed/gal-m1/800/800",    caption: "Marigold Shower",   event: "Haldi" },
  { id: 10, src: "https://picsum.photos/seed/gal-m2/800/800",    caption: "Vows",              event: "Wedding" },
  { id: 11, src: "https://picsum.photos/seed/gal-m3/800/800",    caption: "Celebration",       event: "Sangeet" },
];

/* ─── Gallery Preview with Lightbox ─────────────────────────── */
function GalleryPreview() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open  = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);
  const prev  = () => setLightboxIndex((p) => (p! - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  const next  = () => setLightboxIndex((p) => (p! + 1) % GALLERY_IMAGES.length);

  // Shared tile — renders a clickable image with zoom + overlay
  const Tile = ({
    index, className, rounded = "rounded-2xl",
  }: { index: number; className?: string; rounded?: string }) => {
    const img = GALLERY_IMAGES[index];
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
        onClick={() => open(index)}
        className={`relative overflow-hidden ${rounded} ${className} group cursor-zoom-in`}
        aria-label={img.caption}
      >
        <Image
          src={img.src}
          alt={img.caption}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
        {/* Zoom icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
            <span className="text-white text-lg">⊕</span>
          </div>
        </div>
        {/* Caption on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-xs font-serif italic truncate">{img.caption}</p>
        </div>
      </motion.button>
    );
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FDF8F2]">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-12 sm:mb-16">
          <p className="text-[#6B2737] text-[10px] tracking-[0.4em] uppercase mb-3">Memories</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#1C1C1E] mb-4">Captured Moments</h2>
          <div className="gold-divider max-w-[100px] mx-auto" />
        </FadeIn>

        {/* ── Mobile: 2-col uniform grid ── */}
        <div className="grid grid-cols-2 gap-2 sm:hidden mb-8">
          {[0,1,2,3,4,5].map((idx, i) => (
            <FadeIn key={idx} delay={i * 0.06}>
              <Tile index={idx} className="aspect-square w-full" />
            </FadeIn>
          ))}
        </div>

        {/* ── Tablet: 3-col grid ── */}
        <div className="hidden sm:grid md:hidden grid-cols-3 gap-3 mb-8">
          {[0,1,2,3,4,5].map((idx, i) => (
            <FadeIn key={idx} delay={i * 0.06}>
              <Tile index={idx} className={`w-full ${i === 0 ? "aspect-[4/5]" : "aspect-square"}`} />
            </FadeIn>
          ))}
        </div>

        {/* ── Desktop: bento mosaic ── */}
        <div className="hidden md:grid grid-cols-4 grid-rows-3 gap-3 h-[600px] mb-10">
          <FadeIn direction="left" className="col-span-2 row-span-2">
            <Tile index={0} className="w-full h-full" rounded="rounded-3xl" />
          </FadeIn>
          {[1, 2].map((idx, i) => (
            <FadeIn key={idx} delay={0.1 + i * 0.1} direction="right" className="col-span-1 row-span-1">
              <Tile index={idx} className="w-full h-full" />
            </FadeIn>
          ))}
          <FadeIn delay={0.2} direction="right" className="col-span-2 row-span-1">
            <Tile index={3} className="w-full h-full" />
          </FadeIn>
          {[4, 5, 6, 7].map((idx, i) => (
            <FadeIn key={idx} delay={0.1 * i} className="col-span-1 row-span-1">
              <Tile index={idx} className="w-full h-full" />
            </FadeIn>
          ))}
        </div>

        <FadeIn className="text-center">
          <Link href="/gallery" className="inline-block px-10 py-4 border border-[#6B2737] text-[#6B2737] text-xs tracking-widest uppercase font-light rounded-full hover:bg-[#6B2737] hover:text-white transition-all duration-300 hover:-translate-y-0.5">
            View Full Gallery
          </Link>
        </FadeIn>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={GALLERY_IMAGES}
          currentIndex={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const countdown = useCountdown(coupleData.weddingDate);
  const [bride] = coupleData.bride.split(" ");
  const [groom] = coupleData.groom.split(" ");

  return (
    <div className="relative overflow-x-hidden">
      <CursorBlob />

      {/* ══════════════════════════════════════════════════════
          HERO — cinematic split with real wedding photo
      ══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen min-h-[640px] overflow-hidden">

        {/* ── Full-bleed wedding photo with parallax ── */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 scale-110">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=85"
            alt="Wedding ceremony"
            fill
            className="object-cover object-center"
            priority
            unoptimized
          />
        </motion.div>

        {/* ── Layered overlays ── */}
        {/* Dark vignette edges */}
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)]" />
        {/* Bottom fade to cream */}
        <div className="absolute inset-x-0 bottom-0 z-[2] h-48 bg-gradient-to-t from-[#FDF8F2] to-transparent" />
        {/* Left content panel — desktop only */}
        <div className="absolute inset-y-0 left-0 z-[2] w-full lg:w-[52%] bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        {/* Subtle gold tint top */}
        <div className="absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b from-black/40 to-transparent" />

        <FloatingPetals />

        {/* ── Hero content — left-aligned on desktop, centered on mobile ── */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex items-center"
        >
          <div className="w-full lg:w-[52%] px-6 sm:px-10 lg:px-16 xl:px-24 flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Top ornament line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="flex items-center gap-3 mb-6 sm:mb-8 origin-left"
            >
              <div className="h-px w-10 sm:w-16 bg-[#6B2737]" />
              <span className="text-[#EDD9A3] text-[10px] tracking-[0.45em] uppercase font-light">Together Forever</span>
              <div className="h-px w-10 sm:w-16 bg-[#6B2737]" />
            </motion.div>

            {/* Names with staggered word reveal */}
            <div className="overflow-hidden mb-2">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif font-light text-white leading-[0.9] text-[clamp(3.8rem,11vw,7.5rem)]"
              >
                {bride}
              </motion.h1>
            </div>

            <div className="overflow-hidden mb-2">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-serif gold-text font-light leading-none text-[clamp(2.2rem,6vw,4.5rem)]">
                  &amp;
                </span>
              </motion.div>
            </div>

            <div className="overflow-hidden mb-6 sm:mb-8">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif font-light text-white leading-[0.9] text-[clamp(3.8rem,11vw,7.5rem)]"
              >
                {groom}
              </motion.h1>
            </div>

            {/* Gold divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="w-24 h-px bg-gradient-to-r from-[#6B2737] to-[#EDD9A3] mb-6 sm:mb-8 origin-left"
            />

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1 }}
              className="font-serif italic text-white/70 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-sm leading-relaxed"
            >
              &ldquo;{coupleData.heroQuote}&rdquo;
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.35 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
            >
              <Link
                href="/story"
                className="group relative overflow-hidden px-8 sm:px-10 py-3.5 sm:py-4 bg-[#6B2737] text-white text-[11px] tracking-[0.2em] uppercase font-light rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-[#6B2737]/40 hover:-translate-y-0.5 text-center"
              >
                <span className="relative z-10">Our Story</span>
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
              </Link>
              <Link
                href="/gallery"
                className="px-8 sm:px-10 py-3.5 sm:py-4 border border-white/40 text-white text-[11px] tracking-[0.2em] uppercase font-light rounded-full hover:border-[#6B2737] hover:text-[#EDD9A3] transition-all duration-300 hover:-translate-y-0.5 text-center backdrop-blur-sm"
              >
                View Gallery
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Bottom info bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-14 sm:bottom-16 left-0 right-0 z-10 px-6 sm:px-10 lg:px-16 xl:px-24"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8">
            {[
              { icon: "📅", text: coupleData.weddingDate },
              { icon: "📍", text: coupleData.weddingLocation },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2.5">
                <span className="text-base">{item.icon}</span>
                <span className="text-white/60 text-[11px] tracking-[0.2em] uppercase font-light">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-[1px] h-8 bg-gradient-to-b from-[#6B2737] to-transparent" />
            <div className="w-1 h-1 rounded-full bg-[#6B2737]" />
          </motion.div>
        </motion.div>

        {/* ── Decorative right-side vertical text — desktop only ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 flex-col items-center gap-4"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#6B2737]/50" />
          <p
            className="text-white/30 text-[9px] tracking-[0.4em] uppercase font-light"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll to explore
          </p>
          <div className="w-px h-16 bg-gradient-to-t from-transparent to-[#6B2737]/50" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          COUNTDOWN BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#1C1C1E] py-10 sm:py-14 px-4 relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute left-1/2 top-1/2 w-[500px] h-[500px] rounded-full border border-[#6B2737]/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 w-[300px] h-[300px] rounded-full border border-[#6B2737]/8 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <FadeIn className="text-center mb-6 sm:mb-8">
          <p className="text-[#6B2737] text-[10px] tracking-[0.4em] uppercase">Counting Down To</p>
          <p className="font-serif text-2xl sm:text-3xl text-white font-light mt-1">The Big Day</p>
        </FadeIn>

        <FadeIn>
          <div className="flex justify-center items-center gap-6 sm:gap-10 md:gap-16">
            <Tile value={countdown?.days    ?? 0} label="Days" />
            <span className="text-[#6B2737] text-3xl sm:text-4xl font-light mb-4">:</span>
            <Tile value={countdown?.hours   ?? 0} label="Hours" />
            <span className="text-[#6B2737] text-3xl sm:text-4xl font-light mb-4">:</span>
            <Tile value={countdown?.minutes ?? 0} label="Minutes" />
            <span className="text-[#6B2737] text-3xl sm:text-4xl font-light mb-4">:</span>
            <Tile value={countdown?.seconds ?? 0} label="Seconds" />
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════════════════════════
          COUPLE SECTION
          Mobile: stacked cards
          Tablet: side-by-side diagonal split
          Desktop: large asymmetric layout
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FDF8F2] overflow-hidden">
        <FadeIn className="text-center mb-12 sm:mb-16">
          <p className="text-[#6B2737] text-[10px] tracking-[0.4em] uppercase mb-3">The Couple</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#1C1C1E]">
            Two Worlds, One Heart
          </h2>
          <div className="gold-divider max-w-[120px] mx-auto mt-5" />
        </FadeIn>

        {/* Mobile: stacked | md: side-by-side | lg: asymmetric */}
        <div className="max-w-6xl mx-auto">
          {/* ── Mobile & Tablet cards ── */}
          <div className="lg:hidden">

            {/* MOBILE: full-bleed portrait stack with floating name tag */}
            <div className="flex flex-col gap-5 sm:hidden">
              {[
                {
                  name: coupleData.bride,
                  role: "The Bride",
                  img: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=85",
                  desc: "A passionate soul with a love for art, music, and filter coffee. She brings warmth and grace to every room she enters.",
                  traits: ["Architect", "Art Lover", "Coffee Addict"],
                  side: "left",
                },
                {
                  name: coupleData.groom,
                  role: "The Groom",
                  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85",
                  desc: "A visionary with a heart of gold. His quiet strength and infectious laughter make him the perfect partner for life.",
                  traits: ["Entrepreneur", "Adventurer", "Music Fan"],
                  side: "right",
                },
              ].map((person, i) => (
                <FadeIn key={person.name} delay={i * 0.15}>
                  <motion.div
                    whileTap={{ scale: 0.985 }}
                    className="relative rounded-[2rem] overflow-hidden shadow-xl"
                    style={{ aspectRatio: "3/4" }}
                  >
                    {/* Photo */}
                    <Image
                      src={person.img}
                      alt={person.name}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />

                    {/* Gradient layers */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

                    {/* Role badge — top */}
                    <div className="absolute top-5 left-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B2737]" />
                        <span className="text-[10px] tracking-[0.25em] uppercase text-white/80 font-light">{person.role}</span>
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {/* Trait pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {person.traits.map((t) => (
                          <span key={t} className="text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#6B2737]/20 border border-[#6B2737]/30 text-[#EDD9A3] font-light">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Name */}
                      <h3 className="font-serif text-3xl text-white font-light leading-tight mb-2">
                        {person.name}
                      </h3>

                      {/* Gold divider */}
                      <div className="w-10 h-px bg-[#6B2737] mb-3" />

                      {/* Desc */}
                      <p className="text-white/55 text-xs leading-relaxed font-light">{person.desc}</p>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}

              {/* Connector between cards */}
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#6B2737]/40" />
                <span className="font-serif text-3xl gold-text font-light">&amp;</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#6B2737]/40" />
              </div>
            </div>

            {/* TABLET: side-by-side with overlapping center ampersand */}
            <div className="hidden sm:block">
              <div className="relative grid grid-cols-2 gap-4">

                {[
                  {
                    name: coupleData.bride,
                    role: "The Bride",
                    img: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=85",
                    desc: "Passionate architect with a love for art, music, and filter coffee.",
                    traits: ["Architect", "Art Lover", "Coffee Addict"],
                    align: "items-start",
                    gradient: "from-black/80 via-black/30 to-transparent",
                  },
                  {
                    name: coupleData.groom,
                    role: "The Groom",
                    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85",
                    desc: "Tech entrepreneur with a heart of gold and an infectious laugh.",
                    traits: ["Entrepreneur", "Adventurer", "Music Fan"],
                    align: "items-end",
                    gradient: "from-black/80 via-black/30 to-transparent",
                  },
                ].map((person, i) => (
                  <FadeIn key={person.name} delay={i * 0.15} direction={i === 0 ? "left" : "right"}>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.01 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="group relative rounded-[2rem] overflow-hidden shadow-2xl"
                      style={{ aspectRatio: "2/3" }}
                    >
                      {/* Photo */}
                      <Image
                        src={person.img}
                        alt={person.name}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />

                      {/* Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${person.gradient}`} />

                      {/* Top badge */}
                      <div className={`absolute top-5 w-full flex px-5 ${person.align}`}>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/15">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6B2737]" />
                          <span className="text-[9px] tracking-[0.25em] uppercase text-white/75 font-light">{person.role}</span>
                        </span>
                      </div>

                      {/* Bottom content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        {/* Trait pills */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {person.traits.map((t) => (
                            <span key={t} className="text-[8px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#6B2737]/20 border border-[#6B2737]/30 text-[#EDD9A3] font-light">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Name */}
                        <h3 className="font-serif text-2xl text-white font-light leading-tight mb-1.5">
                          {person.name}
                        </h3>

                        {/* Animated gold line */}
                        <div className="w-0 group-hover:w-10 h-px bg-[#6B2737] transition-all duration-500 mb-3" />

                        {/* Desc — reveals on hover */}
                        <p className="text-white/0 group-hover:text-white/55 text-[11px] leading-relaxed font-light transition-colors duration-500 line-clamp-2">
                          {person.desc}
                        </p>
                      </div>
                    </motion.div>
                  </FadeIn>
                ))}

                {/* Floating center ampersand badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-14 h-14 rounded-full bg-[#FDF8F2] shadow-xl border border-[#EDD9A3]/60 flex items-center justify-center"
                  >
                    <span className="font-serif text-2xl gold-text font-light leading-none">&amp;</span>
                  </motion.div>
                </div>
              </div>

              {/* Story link below */}
              <FadeIn className="text-center mt-8">
                <Link
                  href="/story"
                  className="inline-flex items-center gap-2 text-[#6B2737] text-[11px] tracking-[0.3em] uppercase font-light hover:gap-3 transition-all duration-300"
                >
                  <span>Read Their Story</span>
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>→</motion.span>
                </Link>
              </FadeIn>
            </div>

          </div>

          {/* ── Desktop asymmetric layout ── */}
          <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
            {/* Left: bride image large */}
            <FadeIn direction="left" className="col-span-5">
              <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.4 }} className="group relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
                <Image src="https://picsum.photos/seed/bride-portrait-2/600/800" alt={coupleData.bride} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-[#EDD9A3] text-[10px] tracking-[0.3em] uppercase mb-2">The Bride</p>
                  <h3 className="font-serif text-4xl text-white font-light">{coupleData.bride}</h3>
                  <p className="text-white/60 text-sm mt-2 font-light leading-relaxed max-w-xs">A passionate soul with a love for art, music, and filter coffee.</p>
                </div>
              </motion.div>
            </FadeIn>

            {/* Center: ampersand + story teaser */}
            <FadeIn className="col-span-2 flex flex-col items-center gap-6 text-center">
              <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#6B2737] to-transparent" />
              <span className="font-serif text-7xl gold-text font-light leading-none">&amp;</span>
              <div className="w-px h-20 bg-gradient-to-b from-[#6B2737] via-[#6B2737] to-transparent" />
              <Link href="/story" className="text-[10px] tracking-[0.3em] uppercase text-[#6B2737] hover:text-[#b8943e] transition-colors">
                Read Story →
              </Link>
            </FadeIn>

            {/* Right: groom image + two small accent cards */}
            <div className="col-span-5 flex flex-col gap-4">
              <FadeIn direction="right">
                <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.4 }} className="group relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
                  <Image src="https://picsum.photos/seed/groom-portrait-2/600/800" alt={coupleData.groom} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-[#EDD9A3] text-[10px] tracking-[0.3em] uppercase mb-2">The Groom</p>
                    <h3 className="font-serif text-4xl text-white font-light">{coupleData.groom}</h3>
                    <p className="text-white/60 text-sm mt-2 font-light leading-relaxed max-w-xs">A visionary with a heart of gold and an infectious laugh.</p>
                  </div>
                </motion.div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EVENTS / CATEGORY SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-[#FDF8F2] relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <FadeIn className="text-center mb-14 sm:mb-20">
            <p className="text-[#6B2737] text-[10px] tracking-[0.5em] uppercase mb-4 font-light">The Celebrations</p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#1C1C1E] mb-5">
              Five Days of Magic
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#6B2737]" />
              <span className="text-[#6B2737] text-lg">✦</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#6B2737]" />
            </div>
          </FadeIn>

          {/* ── MOBILE: full-image stacked cards with text overlay ── */}
          <div className="sm:hidden flex flex-col gap-4">
            {events.map((ev, i) => (
              <FadeIn key={ev.label} delay={i * 0.08}>
                <Link href="/events">
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    className="relative rounded-2xl overflow-hidden shadow-lg group"
                    style={{ height: i === 0 ? 260 : 200 }}
                  >
                    <Image src={ev.img} alt={ev.label} fill className="object-cover transition-transform duration-700 group-active:scale-105" unoptimized />
                    {/* Dark gradient from bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                    {/* Accent top bar */}
                    <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: ev.accent }} />
                    {/* Top-right: number + tag */}
                    <div className="absolute top-4 right-4 text-right">
                      <span className="font-serif text-4xl font-light text-white/20 leading-none block">{String(i+1).padStart(2,"0")}</span>
                    </div>
                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-[9px] tracking-[0.35em] uppercase font-light block mb-1" style={{ color: ev.accent }}>{ev.tag} · {ev.date}</span>
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <h3 className="font-serif text-2xl text-white font-light leading-tight">{ev.emoji} {ev.label}</h3>
                          <p className="text-white/55 text-xs mt-1 font-light leading-relaxed line-clamp-2">{ev.desc}</p>
                        </div>
                        <div className="shrink-0 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                          <span className="text-white/70 text-sm">→</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </FadeIn>
            ))}
          </div>

          {/* ── TABLET: 2-col mixed-height full-image cards ── */}
          <div className="hidden sm:grid md:hidden grid-cols-2 gap-4">
            {events.map((ev, i) => {
              const height = i === 0 ? 340 : i === 1 ? 280 : i === 4 ? 200 : 260;
              const colSpan = i === 4 ? "col-span-2" : "col-span-1";
              return (
                <FadeIn key={ev.label} delay={i * 0.09} className={colSpan}>
                  <Link href="/events" className="block">
                    <motion.div
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ duration: 0.3 }}
                      className="relative rounded-2xl overflow-hidden group shadow-lg"
                      style={{ height }}
                    >
                      <Image src={ev.img} alt={ev.label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      {/* Accent left bar */}
                      <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: ev.accent }} />
                      {/* Index watermark */}
                      <span className="absolute top-3 right-4 font-serif text-5xl font-light text-white/15 leading-none select-none">{String(i+1).padStart(2,"0")}</span>
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <span className="text-[9px] tracking-[0.35em] uppercase font-light block mb-1.5" style={{ color: ev.accent }}>{ev.tag}</span>
                        <h3 className="font-serif text-2xl text-white font-light leading-tight mb-1">{ev.emoji} {ev.label}</h3>
                        <p className="text-white/45 text-[10px] tracking-widest uppercase font-light mb-2">{ev.date}</p>
                        <p className="text-white/60 text-xs leading-relaxed font-light line-clamp-2">{ev.desc}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-px w-5" style={{ background: ev.accent }} />
                          <span className="text-[9px] tracking-[0.3em] uppercase font-light" style={{ color: ev.accent }}>View</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>

          {/* ── DESKTOP: bento full-image grid with text overlay ── */}
          <div className="hidden md:grid gap-4" style={{ gridTemplateColumns: "repeat(4,1fr)", gridTemplateRows: "300px 260px" }}>

            {/* 0 — LARGE 2×2 */}
            <FadeIn delay={0} className="col-span-2 row-span-2 h-full">
              <Link href="/events" className="block h-full">
                <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.4 }}
                  className="group relative h-full rounded-3xl overflow-hidden shadow-xl">
                  <Image src={events[0].img} alt={events[0].label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: events[0].accent }} />
                  <span className="absolute top-5 right-6 font-serif text-8xl font-light text-white/10 leading-none select-none">01</span>
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <span className="text-[10px] tracking-[0.4em] uppercase font-light block mb-2" style={{ color: events[0].accent }}>{events[0].tag}</span>
                    <h3 className="font-serif text-5xl text-white font-light leading-none mb-2">{events[0].emoji} {events[0].label}</h3>
                    <p className="text-white/45 text-[10px] tracking-widest uppercase font-light mb-3">{events[0].date}</p>
                    <p className="text-white/65 text-sm leading-relaxed font-light max-w-sm">{events[0].desc}</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-px w-10" style={{ background: events[0].accent }} />
                      <span className="text-[10px] tracking-[0.35em] uppercase font-light" style={{ color: events[0].accent }}>Explore →</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </FadeIn>

            {/* 1 — TALL 1×2 */}
            <FadeIn delay={0.1} className="col-span-1 row-span-2 h-full">
              <Link href="/events" className="block h-full">
                <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.4 }}
                  className="group relative h-full rounded-3xl overflow-hidden shadow-xl">
                  <Image src={events[1].img} alt={events[1].label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: events[1].accent }} />
                  <span className="absolute top-5 right-4 font-serif text-6xl font-light text-white/10 leading-none select-none">02</span>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-[9px] tracking-[0.35em] uppercase font-light block mb-1.5" style={{ color: events[1].accent }}>{events[1].tag}</span>
                    <h3 className="font-serif text-3xl text-white font-light leading-tight mb-1">{events[1].emoji} {events[1].label}</h3>
                    <p className="text-white/40 text-[10px] tracking-widest uppercase font-light mb-2">{events[1].date}</p>
                    <p className="text-white/60 text-xs leading-relaxed font-light">{events[1].desc}</p>
                    <div className="mt-4 h-px w-8" style={{ background: events[1].accent }} />
                  </div>
                </motion.div>
              </Link>
            </FadeIn>

            {/* 2 — SMALL 1×1 */}
            <FadeIn delay={0.15} className="col-span-1 row-span-1 h-full">
              <Link href="/events" className="block h-full">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}
                  className="group relative h-full rounded-2xl overflow-hidden shadow-lg">
                  <Image src={events[2].img} alt={events[2].label} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: events[2].accent }} />
                  <span className="absolute top-3 right-4 font-serif text-4xl font-light text-white/15 leading-none select-none">03</span>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-[9px] tracking-[0.3em] uppercase font-light block mb-1" style={{ color: events[2].accent }}>{events[2].tag}</span>
                    <h3 className="font-serif text-xl text-white font-light">{events[2].emoji} {events[2].label}</h3>
                    <p className="text-white/40 text-[9px] tracking-widest uppercase font-light mt-0.5">{events[2].date}</p>
                  </div>
                </motion.div>
              </Link>
            </FadeIn>

            {/* 3 — SMALL 1×1 */}
            <FadeIn delay={0.2} className="col-span-1 row-span-1 h-full">
              <Link href="/events" className="block h-full">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}
                  className="group relative h-full rounded-2xl overflow-hidden shadow-lg">
                  <Image src={events[3].img} alt={events[3].label} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: events[3].accent }} />
                  <span className="absolute top-3 right-4 font-serif text-4xl font-light text-white/15 leading-none select-none">04</span>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-[9px] tracking-[0.3em] uppercase font-light block mb-1" style={{ color: events[3].accent }}>{events[3].tag}</span>
                    <h3 className="font-serif text-xl text-white font-light">{events[3].emoji} {events[3].label}</h3>
                    <p className="text-white/40 text-[9px] tracking-widest uppercase font-light mt-0.5">{events[3].date}</p>
                  </div>
                </motion.div>
              </Link>
            </FadeIn>

            {/* 4 — WIDE 2×1 */}
            <FadeIn delay={0.25} className="col-span-2 row-span-1 h-full">
              <Link href="/events" className="block h-full">
                <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }}
                  className="group relative h-full rounded-2xl overflow-hidden shadow-lg">
                  <Image src={events[4].img} alt={events[4].label} fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: events[4].accent }} />
                  <span className="absolute top-4 right-5 font-serif text-5xl font-light text-white/10 leading-none select-none">05</span>
                  <div className="absolute inset-0 flex flex-col justify-center pl-7 pr-16">
                    <span className="text-[9px] tracking-[0.35em] uppercase font-light block mb-2" style={{ color: events[4].accent }}>{events[4].tag}</span>
                    <h3 className="font-serif text-3xl text-white font-light mb-1">{events[4].emoji} {events[4].label}</h3>
                    <p className="text-white/40 text-[10px] tracking-widest uppercase font-light mb-2">{events[4].date}</p>
                    <p className="text-white/60 text-xs leading-relaxed font-light max-w-xs">{events[4].desc}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="h-px w-6" style={{ background: events[4].accent }} />
                      <span className="text-[9px] tracking-[0.3em] uppercase font-light" style={{ color: events[4].accent }}>Explore →</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </FadeIn>

          </div>

          {/* Bottom CTA */}
          <FadeIn className="text-center mt-12 sm:mt-14">
            <Link href="/events"
              className="group inline-flex items-center gap-3 px-8 py-4 border border-[#6B2737] text-[#6B2737] text-[11px] tracking-[0.3em] uppercase font-light rounded-full hover:bg-[#6B2737] hover:text-white transition-all duration-300 hover:-translate-y-0.5">
              <span>View All Events</span>
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>→</motion.span>
            </Link>
          </FadeIn>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          GALLERY PREVIEW — click any image to open lightbox
      ══════════════════════════════════════════════════════ */}
      <GalleryPreview />

      {/* ══════════════════════════════════════════════════════
          QUOTE BANNER — full-bleed cinematic
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-28 sm:py-36 px-4 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image src="https://picsum.photos/seed/quote-bg/1920/600" alt="" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-[#1C1C1E]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#6B2737]/10 via-transparent to-[#6B2737]/10" />
        </div>

        <FadeIn className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Decorative top ornament */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#6B2737]" />
            <span className="text-[#6B2737] text-2xl">✦</span>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#6B2737]" />
          </div>

          <p className="font-serif italic text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-light leading-relaxed">
            &ldquo;In all the world, there is no heart for me like yours.&rdquo;
          </p>
          <p className="text-[#6B2737] text-xs tracking-[0.4em] uppercase mt-8">— Maya Angelou</p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-[#6B2737]" />
            <span className="text-[#6B2737] text-2xl">✦</span>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-[#6B2737]" />
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════════════════════════
          GUESTBOOK CTA
      ══════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-14 px-4 bg-[#FDF8F2]">
        <FadeIn className="max-w-2xl mx-auto text-center">
          <p className="text-[#6B2737]/60 text-[9px] tracking-[0.45em] uppercase mb-2">Leave a Wish</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1C1E] mb-3">Sign Our Guestbook</h2>
          <div className="gold-divider max-w-[80px] mx-auto mb-4" />
          <p className="text-[#1C1C1E]/50 text-sm font-light leading-relaxed mb-7 max-w-md mx-auto">
            Your words mean the world to us. Leave a message, a memory, or a blessing as they begin their forever.
          </p>
          <Link
            href="/guestbook"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#1C1C1E] text-white text-[11px] tracking-widest uppercase font-light rounded-full hover:bg-[#6B2737] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#6B2737]/20"
          >
            <span>✍️</span>
            <span>Write a Message</span>
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
