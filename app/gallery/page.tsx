"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion, AnimatePresence, useScroll, useTransform,
  useInView, useMotionValue, useAnimation,
} from "framer-motion";
import Image from "next/image";
import Lightbox from "@/components/Lightbox";
import galleryData from "@/data/gallery.json";

/* ─────────────────────────────────────────────────────────────
   TYPES & CONSTANTS
───────────────────────────────────────────────────────────── */
type GalleryItem = typeof galleryData[number];

const EVENTS = [
  { id: "All",       label: "All Moments", icon: "✦",  color: "#6B2737", bg: "rgba(107,39,55,0.10)"  },
  { id: "Haldi",     label: "Haldi",       icon: "🌼", color: "#D97706", bg: "rgba(217,119,6,0.10)"  },
  { id: "Mehendi",   label: "Mehendi",     icon: "🌿", color: "#059669", bg: "rgba(5,150,105,0.10)"  },
  { id: "Sangeet",   label: "Sangeet",     icon: "🎶", color: "#7C3AED", bg: "rgba(124,58,237,0.10)" },
  { id: "Wedding",   label: "Wedding",     icon: "💒", color: "#DC2626", bg: "rgba(220,38,38,0.10)"  },
  { id: "Reception", label: "Reception",   icon: "🥂", color: "#B45309", bg: "rgba(180,83,9,0.10)"   },
];

const META: Record<string, { color: string; bg: string; quote: string }> = {
  Haldi:     { color: "#D97706", bg: "rgba(217,119,6,0.08)",   quote: "Golden turmeric, golden memories." },
  Mehendi:   { color: "#059669", bg: "rgba(5,150,105,0.08)",   quote: "Every pattern tells our story." },
  Sangeet:   { color: "#7C3AED", bg: "rgba(124,58,237,0.08)",  quote: "Music, dance, and pure joy." },
  Wedding:   { color: "#DC2626", bg: "rgba(220,38,38,0.08)",   quote: "The sacred union of two souls." },
  Reception: { color: "#B45309", bg: "rgba(180,83,9,0.08)",    quote: "Starlit celebrations, forever cherished." },
};

const HERO_IMG = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=85";

/* ─────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────── */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const op  = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[32vh] sm:h-[38vh] lg:h-[42vh] min-h-[200px] sm:min-h-[260px] flex items-center justify-center overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image src={HERO_IMG} alt="Gallery" fill className="object-cover" priority unoptimized />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-gradient-to-t from-[#FDF8F2] to-transparent" />
      <div className="absolute inset-0 bg-black/30" />

      <motion.div style={{ opacity: op }} className="relative z-10 text-center px-6">
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-4 origin-center"
        >
          <div className="h-px w-8 sm:w-12 bg-[#D4A853]" />
          <span className="text-[#EDD9A3] text-[9px] sm:text-[10px] tracking-[0.4em] uppercase font-light">Memories in Frames</span>
          <div className="h-px w-8 sm:w-12 bg-[#D4A853]" />
        </motion.div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }} animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-none"
          >
            Gallery
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-serif italic text-white/55 text-sm sm:text-base mt-3 sm:mt-4"
        >
          &ldquo;Every photograph is a moment that will never come again.&rdquo;
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FILTER BAR
───────────────────────────────────────────────────────────── */
function FilterBar({ active, onChange, counts }: {
  active: string;
  onChange: (id: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="sticky top-14 md:top-16 z-40 bg-[#FDF8F2]/95 backdrop-blur-xl border-b border-[#6B2737]/8 shadow-[0_2px_20px_rgba(107,39,55,0.06)]">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 py-3 max-w-7xl mx-auto">
        {EVENTS.map((ev) => {
          const isActive = active === ev.id;
          return (
            <motion.button
              key={ev.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => onChange(ev.id)}
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[10px] sm:text-[11px] tracking-[0.12em] uppercase font-medium whitespace-nowrap shrink-0 transition-all duration-300"
              style={{
                background: isActive ? ev.color : "transparent",
                color: isActive ? "#fff" : "#1C1C1E77",
                border: isActive ? "none" : "1px solid #1C1C1E12",
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-active"
                  className="absolute inset-0 rounded-full"
                  style={{ background: ev.color }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{ev.icon}</span>
              <span className="relative z-10">{ev.label}</span>
              <span className="relative z-10 text-[9px] tabular-nums" style={{ opacity: 0.55 }}>
                {counts[ev.id] ?? 0}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MOBILE: PLAYING CARD STACK  (drag to swipe)
───────────────────────────────────────────────────────────── */
function CardStack({ images, onOpen }: { images: GalleryItem[]; onOpen: (i: number) => void }) {
  const [stack, setStack] = useState(images.map((_, i) => i)); // indices, top = last
  const [gone, setGone]   = useState<Set<number>>(new Set());
  const meta = META[images[0]?.event] ?? META["Wedding"];

  // Reset when images change (filter change)
  useEffect(() => {
    setStack(images.map((_, i) => i));
    setGone(new Set());
  }, [images]);

  const removeTop = useCallback(() => {
    setStack((prev) => {
      if (prev.length === 0) return prev;
      const top = prev[prev.length - 1];
      setGone((g) => new Set(g).add(top));
      return prev.slice(0, -1);
    });
  }, []);

  const reset = () => {
    setStack(images.map((_, i) => i));
    setGone(new Set());
  };

  const visibleStack = stack.slice(-4); // show max 4 cards in stack

  return (
    <div className="relative flex flex-col items-center">
      {/* Card stack area */}
      <div className="relative w-full" style={{ height: "72vw", maxHeight: 320 }}>
        {visibleStack.map((imgIdx, stackPos) => {
          const isTop = stackPos === visibleStack.length - 1;
          const depth = visibleStack.length - 1 - stackPos; // 0 = top
          const img = images[imgIdx];

          return (
            <DraggableCard
              key={imgIdx}
              img={img}
              isTop={isTop}
              depth={depth}
              color={meta.color}
              onSwipedAway={removeTop}
              onClick={() => isTop && onOpen(imgIdx)}
            />
          );
        })}

        {/* Empty state */}
        {stack.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed"
            style={{ borderColor: meta.color + "40" }}
          >
            <span className="text-4xl mb-3">🎉</span>
            <p className="font-serif italic text-[#1C1C1E]/40 text-base">All caught up!</p>
            <button
              onClick={reset}
              className="mt-4 px-5 py-2 rounded-full text-[10px] tracking-widest uppercase font-medium text-white"
              style={{ background: meta.color }}
            >
              View Again
            </button>
          </motion.div>
        )}
      </div>

      {/* Counter + swipe hint */}
      {stack.length > 0 && (
        <div className="flex items-center justify-between w-full mt-3 px-1">
          <span className="text-[10px] tracking-widest uppercase text-[#1C1C1E]/35">
            {stack.length} of {images.length}
          </span>
          <div className="flex items-center gap-1.5 text-[#1C1C1E]/30">
            <span className="text-sm">←</span>
            <span className="text-[9px] tracking-widest uppercase">swipe</span>
            <span className="text-sm">→</span>
          </div>
        </div>
      )}
    </div>
  );
}

function DraggableCard({ img, isTop, depth, color, onSwipedAway, onClick }: {
  img: GalleryItem;
  isTop: boolean;
  depth: number;
  color: string;
  onSwipedAway: () => void;
  onClick: () => void;
}) {
  const x        = useMotionValue(0);
  const controls = useAnimation();

  // All useTransform calls unconditionally at top level — no conditionals
  const rotate       = useTransform(x, [-200, 0, 200], [-18, 0, 18]);
  const cardOpacity  = useTransform(x, [-200, -120, 0, 120, 200], [0, 1, 1, 1, 0]);
  const nextOpacity  = useTransform(x, [20, 100],  [0, 1]);
  const backOpacity  = useTransform(x, [-20, -100], [0, 1]);

  const yOffset = depth * 10;
  const scale   = 1 - depth * 0.05;
  const zIndex  = 10 - depth;

  const handleDragEnd = async (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold  = 100;
    const vThreshold = 500;
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > vThreshold) {
      const dir = info.offset.x > 0 ? 1 : -1;
      await controls.start({ x: dir * 400, opacity: 0, transition: { duration: 0.3 } });
      onSwipedAway();
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 500, damping: 30 } });
    }
  };

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        zIndex,
        y: yOffset,
        scale,
        x:       isTop ? x          : 0,
        rotate:  isTop ? rotate      : 0,
        opacity: isTop ? cardOpacity : 1,
      }}
      animate={isTop ? controls : { y: yOffset, scale }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileTap={isTop ? { cursor: "grabbing" } : {}}
      className="rounded-3xl overflow-hidden shadow-xl cursor-grab select-none"
      onClick={onClick}
    >
      <Image
        src={img.thumb}
        alt={img.caption || img.event}
        fill
        className="object-cover pointer-events-none"
        unoptimized
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Swipe indicators — always rendered, opacity driven by motion value */}
      <motion.div
        style={{ opacity: nextOpacity, display: isTop ? undefined : "none" }}
        className="absolute top-5 right-5 px-3 py-1.5 rounded-full border-2 border-emerald-400 text-emerald-400 text-[10px] tracking-widest uppercase font-bold rotate-12"
      >
        Next ›
      </motion.div>
      <motion.div
        style={{ opacity: backOpacity, display: isTop ? undefined : "none" }}
        className="absolute top-5 left-5 px-3 py-1.5 rounded-full border-2 border-rose-400 text-rose-400 text-[10px] tracking-widest uppercase font-bold -rotate-12"
      >
        ‹ Back
      </motion.div>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-serif italic text-white text-sm leading-snug">{img.caption}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-1 h-1 rounded-full" style={{ background: color }} />
          <span className="text-[9px] tracking-widest uppercase text-white/50">{img.event}</span>
        </div>
      </div>

      {/* Tap hint — only visible on top card */}
      {isTop && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 glass px-3 py-1 rounded-full">
          <span className="text-white/60 text-[8px] tracking-widests uppercase">tap to open</span>
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TABLET / DESKTOP: HORIZONTAL SCROLL RAIL
───────────────────────────────────────────────────────────── */
function ScrollRail({ images, onOpen, color }: {
  images: GalleryItem[];
  onOpen: (i: number) => void;
  color: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = railRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [images]);

  const scroll = (dir: "left" | "right") => {
    railRef.current?.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  return (
    <div className="relative group/rail">
      {/* Left arrow */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-[#1C1C1E]/8 flex items-center justify-center text-[#1C1C1E]/60 hover:text-[#1C1C1E] transition-colors -translate-x-1/2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Right arrow */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-[#1C1C1E]/8 flex items-center justify-center text-[#1C1C1E]/60 hover:text-[#1C1C1E] transition-colors translate-x-1/2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fade edges */}
      {canScrollLeft  && <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#FDF8F2] to-transparent z-[5] pointer-events-none" />}
      {canScrollRight && <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FDF8F2] to-transparent z-[5] pointer-events-none" />}

      {/* Rail */}
      <div
        ref={railRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-2 scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {images.map((img, i) => {
          // Vary card sizes for visual rhythm
          const wide = i % 5 === 0;
          return (
            <motion.button
              key={img.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.45 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpen(i)}
              className="relative shrink-0 overflow-hidden rounded-2xl group cursor-zoom-in"
              style={{
                width: wide ? 320 : 220,
                height: 260,
                scrollSnapAlign: "start",
              }}
            >
              <Image
                src={img.thumb}
                alt={img.caption || img.event}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                unoptimized
              />
              <div className="absolute inset-0 bg-transparent group-hover:bg-black/35 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/70 to-transparent">
                <p className="font-serif italic text-white text-xs leading-snug">{img.caption}</p>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                style={{ background: color }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <span className="text-white text-sm">⊕</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Bottom prev / next bar ── */}
      <div className="flex items-center justify-between mt-3 px-0.5">
        {/* Left: scroll position dots */}
        <div className="flex items-center gap-1.5">
          {!canScrollLeft && !canScrollRight ? (
            <span className="text-[9px] tracking-widest uppercase text-[#1C1C1E]/25">All visible</span>
          ) : (
            <>
              <div className={`h-[3px] rounded-full transition-all duration-300 ${!canScrollLeft ? "w-6 opacity-100" : "w-2 opacity-30"}`} style={{ background: color }} />
              <div className={`h-[3px] rounded-full transition-all duration-300 ${canScrollLeft && canScrollRight ? "w-6 opacity-100" : "w-2 opacity-30"}`} style={{ background: color }} />
              <div className={`h-[3px] rounded-full transition-all duration-300 ${!canScrollRight ? "w-6 opacity-100" : "w-2 opacity-30"}`} style={{ background: color }} />
            </>
          )}
        </div>

        {/* Right: prev / next buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[10px] tracking-[0.15em] uppercase font-medium border transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed"
            style={{
              borderColor: canScrollLeft ? color : "#1C1C1E22",
              color: canScrollLeft ? color : "#1C1C1E44",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 10L4 6l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Prev</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[10px] tracking-[0.15em] uppercase font-medium border transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed"
            style={{
              borderColor: canScrollRight ? color : "#1C1C1E22",
              color: canScrollRight ? color : "#1C1C1E44",
            }}
          >
            <span>Next</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────────── */
function SectionHeader({ eventId, count }: { eventId: string; count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const ev   = EVENTS.find((e) => e.id === eventId)!;
  const meta = META[eventId];

  return (
    <div ref={ref} className="mb-5 sm:mb-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
        className="flex items-end justify-between gap-4 mb-3"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
            style={{ background: meta.bg }}
          >
            {ev.icon}
          </div>
          <div>
            <p className="text-[9px] tracking-[0.45em] uppercase font-light" style={{ color: meta.color }}>
              {count} photos
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1C1E] leading-tight">
              {ev.label}
            </h2>
          </div>
        </div>
        <p className="font-serif italic text-[#1C1C1E]/35 text-sm hidden sm:block pb-0.5">{meta.quote}</p>
      </motion.div>

      {/* Animated divider */}
      <motion.div
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="h-px origin-left"
        style={{ background: `linear-gradient(to right, ${meta.color}, ${meta.color}40, transparent)` }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   EVENT SECTION  (card stack on mobile, scroll rail on tablet+)
───────────────────────────────────────────────────────────── */
function EventSection({ eventId, images, onOpen }: {
  eventId: string;
  images: GalleryItem[];
  onOpen: (i: number, list: GalleryItem[]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const meta = META[eventId];
  if (!images.length) return null;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
    >
      <SectionHeader eventId={eventId} count={images.length} />

      {/* ── Mobile: playing card stack ── */}
      <div className="sm:hidden">
        <CardStack images={images} onOpen={(i) => onOpen(i, images)} />
      </div>

      {/* ── Tablet / Desktop: horizontal scroll rail ── */}
      <div className="hidden sm:block">
        <ScrollRail images={images} onOpen={(i) => onOpen(i, images)} color={meta.color} />
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FEATURED SECTION  (1 large + 3 small bento — tablet/desktop)
   On mobile this is also a card stack
───────────────────────────────────────────────────────────── */
function FeaturedSection({ images, onOpen }: {
  images: GalleryItem[];
  onOpen: (i: number, list: GalleryItem[]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  if (images.length < 4) return null;
  const [hero, ...rest] = images.slice(0, 4);

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
        className="text-center mb-7"
      >
        <p className="text-[#6B2737]/50 text-[9px] tracking-[0.5em] uppercase mb-1.5">Highlights</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1C1E]">Best Moments</h2>
        <div className="gold-divider max-w-[70px] mx-auto mt-3" />
      </motion.div>

      {/* Mobile: card stack of top 6 */}
      <div className="sm:hidden">
        <CardStack images={images.slice(0, 6)} onOpen={(i) => onOpen(i, images.slice(0, 6))} />
      </div>

      {/* Tablet / Desktop: bento grid */}
      <div className="hidden sm:grid grid-cols-3 grid-rows-2 gap-3 h-[420px] lg:h-[500px]">
        {/* Large hero */}
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65 }}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={() => onOpen(0, images.slice(0, 4))}
          className="col-span-2 row-span-2 relative overflow-hidden rounded-3xl group cursor-zoom-in"
        >
          <Image src={hero.src} alt={hero.caption || ""} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" />
            <span className="text-white text-[9px] tracking-[0.3em] uppercase font-light">Featured</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="font-serif italic text-white text-xl mb-1">{hero.caption}</p>
            <p className="text-[#EDD9A3] text-[9px] tracking-widest uppercase">{hero.event}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <span className="text-white text-xl">⊕</span>
            </div>
          </div>
        </motion.button>

        {/* 3 small */}
        {rest.map((img, i) => (
          <motion.button
            key={img.id}
            initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.55 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onOpen(i + 1, images.slice(0, 4))}
            className="relative overflow-hidden rounded-2xl group cursor-zoom-in"
          >
            <Image src={img.thumb} alt={img.caption || ""} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
            <div className="absolute inset-0 bg-transparent group-hover:bg-black/35 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent">
              <p className="font-serif italic text-white text-xs truncate">{img.caption}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function GalleryPage() {
  const [filter,       setFilter]       = useState("All");
  const [lightboxIdx,  setLightboxIdx]  = useState<number | null>(null);
  const [lightboxList, setLightboxList] = useState<GalleryItem[]>([]);
  const [slideshow,    setSlideshow]    = useState(false);

  const allImages = galleryData.filter((g) => g.type === "image");

  const byEvent = Object.fromEntries(
    EVENTS.filter((e) => e.id !== "All").map((e) => [
      e.id, allImages.filter((g) => g.event === e.id),
    ])
  );

  const counts: Record<string, number> = { All: allImages.length };
  EVENTS.forEach((e) => { if (e.id !== "All") counts[e.id] = byEvent[e.id]?.length ?? 0; });

  const filteredImages = filter === "All" ? allImages : (byEvent[filter] ?? []);

  useEffect(() => {
    if (!slideshow || lightboxIdx === null) return;
    const id = setInterval(() => setLightboxIdx((p) => (p! + 1) % lightboxList.length), 3000);
    return () => clearInterval(id);
  }, [slideshow, lightboxIdx, lightboxList.length]);

  const openLightbox = useCallback((idx: number, list: GalleryItem[]) => {
    setLightboxList(list);
    setLightboxIdx(idx);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIdx(null);
    setSlideshow(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF8F2]">

      <HeroSection />

      <FilterBar active={filter} onChange={setFilter} counts={counts} />

      <AnimatePresence mode="wait">
        {filter === "All" ? (
          <motion.div
            key="all"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          >
            {/* Featured bento */}
            <FeaturedSection images={allImages.slice(0, 6)} onOpen={openLightbox} />

            {/* Divider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="gold-divider" />
            </div>

            {/* Per-event sections */}
            {EVENTS.filter((e) => e.id !== "All").map((ev) => (
              <EventSection
                key={ev.id}
                eventId={ev.id}
                images={byEvent[ev.id] ?? []}
                onOpen={openLightbox}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4"
          >
            <SectionHeader eventId={filter} count={filteredImages.length} />

            {/* Mobile card stack */}
            <div className="sm:hidden mt-4">
              <CardStack images={filteredImages} onOpen={(i) => openLightbox(i, filteredImages)} />
            </div>

            {/* Tablet/Desktop scroll rail */}
            <div className="hidden sm:block mt-4">
              <ScrollRail
                images={filteredImages}
                onOpen={(i) => openLightbox(i, filteredImages)}
                color={META[filter]?.color ?? "#6B2737"}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      {lightboxIdx !== null && lightboxList.length > 0 && (
        <>
          <Lightbox
            items={lightboxList.map((g) => ({ id: g.id, src: g.src, caption: g.caption, event: g.event }))}
            currentIndex={lightboxIdx}
            onClose={closeLightbox}
            onPrev={() => setLightboxIdx((p) => (p! - 1 + lightboxList.length) % lightboxList.length)}
            onNext={() => setLightboxIdx((p) => (p! + 1) % lightboxList.length)}
          />
          <motion.button
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => setSlideshow((s) => !s)}
            className="fixed bottom-20 md:bottom-5 left-4 z-[101] flex items-center gap-2 px-4 py-2 rounded-full text-[11px] tracking-widest uppercase font-light"
            style={{
              background: slideshow ? "#6B2737" : "rgba(0,0,0,0.55)",
              backdropFilter: "blur(12px)",
              color: "#fff",
              boxShadow: slideshow ? "0 4px 20px rgba(107,39,55,0.5)" : "none",
            }}
          >
            <span>{slideshow ? "⏸" : "▶"}</span>
            <span>{slideshow ? "Pause" : "Slideshow"}</span>
          </motion.button>
        </>
      )}
    </div>
  );
}