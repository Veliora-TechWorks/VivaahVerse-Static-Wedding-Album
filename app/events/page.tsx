"use client";
import { useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import eventsData from "@/data/events.json";
import galleryData from "@/data/gallery.json";
import Lightbox from "@/components/Lightbox";

/* ─── Accent colours per event ──────────────────────────────── */
const ACCENTS: Record<string, { hex: string; pill: string; glow: string }> = {
  "Mehendi Ceremony": { hex: "#4a7c59", pill: "bg-emerald-50 text-emerald-700 border-emerald-200", glow: "rgba(74,124,89,0.25)"   },
  "Seemant Pujan":    { hex: "#c2410c", pill: "bg-orange-50 text-orange-700 border-orange-200",   glow: "rgba(194,65,12,0.25)"  },
  "Haldi Ceremony":   { hex: "#d97706", pill: "bg-amber-50 text-amber-700 border-amber-200",      glow: "rgba(217,119,6,0.25)"  },
  "Sangeet Night":    { hex: "#9333ea", pill: "bg-purple-50 text-purple-700 border-purple-200",   glow: "rgba(147,51,234,0.25)" },
  "Lagna — Wedding":  { hex: "#be123c", pill: "bg-rose-50 text-rose-700 border-rose-200",         glow: "rgba(190,18,60,0.25)"  },
  "Reception":        { hex: "#0369a1", pill: "bg-sky-50 text-sky-700 border-sky-200",            glow: "rgba(3,105,161,0.25)"  },
};

const IMG_SEEDS: Record<string, string> = {
  "Mehendi Ceremony": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80",
  "Seemant Pujan":    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=80",
  "Haldi Ceremony":   "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=80",
  "Sangeet Night":    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80",
  "Lagna — Wedding":  "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80",
  "Reception":        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80",
};

/* ─── Gallery modal ─────────────────────────────────────────── */
interface GalleryModalProps {
  eventName: string;
  onClose: () => void;
}

function GalleryModal({ eventName, onClose }: GalleryModalProps) {
  const images = galleryData.filter((g) => g.event === eventName && g.type === "image");
  const accent = ACCENTS[eventName];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // close on backdrop click
  const handleBackdrop = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  // keyboard close
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape" && lightboxIndex === null) onClose();
  }, [onClose, lightboxIndex]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
        onClick={handleBackdrop}
        onKeyDown={handleKey}
        tabIndex={-1}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#FDF8F2] w-full sm:max-w-3xl lg:max-w-5xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDD9A3]/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: accent.hex }} />
              <span className="text-[#1C1C1E]/40 text-[10px] tracking-[0.35em] uppercase font-light">Gallery</span>
              <span className="font-serif text-2xl font-light text-[#1C1C1E]">{eventName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-widest uppercase text-[#1C1C1E]/40">{images.length} photos</span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1C1C1E]/8 hover:bg-[#1C1C1E]/15 flex items-center justify-center text-[#1C1C1E]/60 hover:text-[#1C1C1E] transition-all text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* Accent bar */}
          <div className="h-0.5 shrink-0" style={{ background: `linear-gradient(to right, ${accent.hex}, transparent)` }} />

          {/* Grid */}
          <div className="overflow-y-auto p-4 sm:p-6">
            {images.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-serif italic text-[#1C1C1E]/40 text-xl">No photos yet — check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {images.map((img, i) => (
                  <motion.button
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setLightboxIndex(i)}
                    className="relative block aspect-square rounded-2xl overflow-hidden group cursor-zoom-in"
                  >
                    <Image
                      src={img.thumb}
                      alt={img.caption || ""}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                    {/* Zoom icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                        <span className="text-white text-base">⊕</span>
                      </div>
                    </div>
                    {/* Caption */}
                    {img.caption && (
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white text-[9px] font-serif italic truncate">{img.caption}</p>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={images.map((img) => ({ id: img.id, src: img.src, caption: img.caption, event: img.event }))}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((p) => (p! - 1 + images.length) % images.length)}
          onNext={() => setLightboxIndex((p) => (p! + 1) % images.length)}
        />
      )}
    </>
  );
}

/* ─── Parallax hero ─────────────────────────────────────────── */
/* ─── Parallax hero ─────────────────────────────────────────── */
function EventsHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[32vh] sm:h-[38vh] lg:h-[42vh] min-h-[200px] sm:min-h-[260px] flex items-center justify-center overflow-hidden" style={{ position: "relative" }}>
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=85"
          alt="Wedding Events"
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)]" />
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
            Five Days of Celebration
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
            The Events
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-serif italic text-white/60 text-sm sm:text-base mt-3"
        >
          &ldquo;Every ritual, every smile, every moment — a memory forever.&rdquo;
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ─── Mobile: full-width stacked cards ─────────────────────── */
function MobileEvents({ onOpenGallery }: { onOpenGallery: (name: string) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="sm:hidden px-4 py-12 space-y-5">
      {eventsData.map((event, index) => {
        const accent = ACCENTS[event.name];
        const isOpen = expanded === index;

        return (
          <FadeIn key={event.id} delay={index * 0.07}>
            <motion.div
              layout
              className="rounded-3xl overflow-hidden shadow-sm border border-[#EDD9A3]/30 bg-white"
            >
              {/* Image banner */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={IMG_SEEDS[event.name]}
                  alt={event.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Emoji badge */}
                <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-2xl">
                  {event.emoji}
                </div>

                {/* Name + date */}
                <div className="absolute bottom-4 left-4">
                  <h3 className="font-serif text-3xl text-white font-light leading-tight">{event.name}</h3>
                  <p className="text-white/60 text-[10px] tracking-widest uppercase mt-1">{event.date}</p>
                </div>

                {/* Accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: accent.hex }} />
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3 text-[10px] tracking-widest uppercase text-[#1C1C1E]/50">
                  <span>⏰ {event.time}</span>
                  <span className="w-1 h-1 rounded-full bg-[#6B2737]/40" />
                  <span>📍 {event.location}</span>
                </div>

                <p className="text-[#1C1C1E]/60 text-sm leading-relaxed font-light mb-4">{event.description}</p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {event.highlights.map((h) => (
                    <span key={h} className={`text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full border font-light ${accent.pill}`}>
                      {h}
                    </span>
                  ))}
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setExpanded(isOpen ? null : index)}
                    className="flex items-center gap-2 text-[10px] tracking-widest uppercase font-light"
                    style={{ color: accent.hex }}
                  >
                    <span>{isOpen ? "Less Details" : "More Details"}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      ↓
                    </motion.span>
                  </button>
                  <button
                    onClick={() => onOpenGallery(event.name)}
                    className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-light text-[#1C1C1E]/50 hover:text-[#1C1C1E] transition-colors"
                  >
                    <span>🖼</span>
                    <span>Gallery</span>
                  </button>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-[#EDD9A3]/40">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Date",       value: event.date,      icon: "📅" },
                            { label: "Time",       value: event.time,      icon: "⏰" },
                            { label: "Venue",      value: event.location,  icon: "📍" },
                            { label: "Dress Code", value: event.dresscode, icon: "👗" },
                          ].map((d) => (
                            <div key={d.label} className="bg-[#FDF8F2] rounded-2xl p-3">
                              <p className="text-[9px] tracking-widest uppercase text-[#1C1C1E]/40 mb-1">{d.icon} {d.label}</p>
                              <p className="text-[#1C1C1E]/70 text-xs font-light leading-snug whitespace-pre-line">{d.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </FadeIn>
        );
      })}
    </div>
  );
}

/* ─── Tablet: 2-col grid with tall image cards ──────────────── */
function TabletEvents({ onOpenGallery }: { onOpenGallery: (name: string) => void }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="hidden sm:block md:hidden px-6 py-16">
      <FadeIn className="text-center mb-12">
        <p className="text-[#6B2737] text-[10px] tracking-[0.4em] uppercase mb-3">Celebrations</p>
        <h2 className="font-serif text-4xl font-light text-[#1C1C1E]">Every Moment, Cherished</h2>
        <div className="gold-divider max-w-[100px] mx-auto mt-4" />
      </FadeIn>

      <div className="grid grid-cols-2 gap-4">
        {eventsData.map((event, index) => {
          const accent = ACCENTS[event.name];
          const isActive = active === index;

          return (
            <FadeIn key={event.id} delay={index * 0.08} direction={index % 2 === 0 ? "left" : "right"}>
              <motion.div
                layout
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActive(isActive ? null : index)}
                className={`rounded-3xl overflow-hidden bg-white shadow-sm border cursor-pointer transition-all duration-300 ${
                  isActive ? "border-[#6B2737] shadow-lg" : "border-[#EDD9A3]/30"
                }`}
                style={isActive ? { boxShadow: `0 8px 32px ${accent.glow}` } : {}}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={IMG_SEEDS[event.name]}
                    alt={event.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />

                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-xl">
                    {event.emoji}
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <h3 className="font-serif text-2xl text-white font-light">{event.name}</h3>
                  </div>

                  {/* Active indicator */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 transition-opacity duration-300"
                    style={{ background: accent.hex, opacity: isActive ? 1 : 0 }}
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-[9px] tracking-widest uppercase text-[#1C1C1E]/50">
                    <span>{event.date}</span>
                  </div>
                  <p className="text-[#1C1C1E]/60 text-xs leading-relaxed font-light line-clamp-3 mb-3">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {event.highlights.slice(0, 2).map((h) => (
                      <span key={h} className={`text-[8px] tracking-widest uppercase px-2 py-0.5 rounded-full border font-light ${accent.pill}`}>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-[#EDD9A3]/40 pt-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] text-[#1C1C1E]/60">
                            <span>⏰</span><span>{event.time}</span>
                          </div>
                          <div className="flex items-start gap-2 text-[10px] text-[#1C1C1E]/60">
                            <span>📍</span><span className="leading-snug">{event.location}</span>
                          </div>
                          <div className="flex items-start gap-2 text-[10px] text-[#1C1C1E]/60">
                            <span>👗</span><span className="leading-snug whitespace-pre-line">{event.dresscode}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {event.highlights.slice(2).map((h) => (
                            <span key={h} className={`text-[8px] tracking-widest uppercase px-2 py-0.5 rounded-full border font-light ${accent.pill}`}>
                              {h}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); onOpenGallery(event.name); }}
                          className="mt-3 w-full py-2 rounded-xl text-[9px] tracking-widest uppercase font-light border transition-all duration-200 hover:opacity-80"
                          style={{ borderColor: accent.hex, color: accent.hex }}
                        >
                          🖼 View Gallery
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Desktop: immersive side-panel layout ──────────────────── */
function DesktopEvents({ onOpenGallery }: { onOpenGallery: (name: string) => void }) {
  const [active, setActive] = useState(0);
  const event = eventsData[active];
  const accent = ACCENTS[event.name];

  return (
    <div className="hidden md:block py-20 px-6 lg:px-12 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <p className="text-[#6B2737] text-[10px] tracking-[0.4em] uppercase mb-3">Celebrations</p>
        <h2 className="font-serif text-5xl lg:text-6xl font-light text-[#1C1C1E]">Every Moment, Cherished</h2>
        <div className="gold-divider max-w-[120px] mx-auto mt-5" />
      </FadeIn>

      <div className="flex gap-8 lg:gap-12 items-start">

        {/* ── Left: event selector tabs ── */}
        <div className="w-56 lg:w-64 shrink-0 space-y-2 sticky top-24">
          {eventsData.map((ev, index) => {
            const a = ACCENTS[ev.name];
            const isActive = active === index;
            return (
              <motion.button
                key={ev.id}
                onClick={() => setActive(index)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 ${
                  isActive
                    ? "bg-white shadow-md border border-[#EDD9A3]/50"
                    : "hover:bg-white/60 border border-transparent"
                }`}
                style={isActive ? { boxShadow: `0 4px 20px ${a.glow}` } : {}}
              >
                {/* Accent dot */}
                <div
                  className="w-2 h-2 rounded-full shrink-0 transition-all duration-300"
                  style={{ background: isActive ? a.hex : "#6B273733" }}
                />
                <span className="text-xl">{ev.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-serif text-lg font-light leading-tight transition-colors duration-300 ${isActive ? "text-[#1C1C1E]" : "text-[#1C1C1E]/50"}`}>
                    {ev.name}
                  </p>
                  <p className="text-[9px] tracking-widest uppercase text-[#1C1C1E]/40 truncate">{ev.date}</p>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="tab-arrow"
                    className="text-[#6B2737] text-sm"
                  >
                    →
                  </motion.div>
                )}
              </motion.button>
            );
          })}

          {/* Progress indicator */}
          <div className="pt-4 px-4">
            <div className="flex gap-1.5">
              {eventsData.map((_, i) => (
                <div
                  key={i}
                  className="h-0.5 flex-1 rounded-full transition-all duration-300"
                  style={{ background: i === active ? accent.hex : "#6B273722" }}
                />
              ))}
            </div>
            <p className="text-[9px] tracking-widest uppercase text-[#1C1C1E]/30 mt-2">
              {active + 1} of {eventsData.length}
            </p>
          </div>
        </div>

        {/* ── Right: event detail panel ── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              {/* Hero image */}
              <div className="relative h-80 lg:h-96 rounded-3xl overflow-hidden mb-8 shadow-xl">
                <Image
                  src={IMG_SEEDS[event.name]}
                  alt={event.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                {/* Accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl" style={{ background: accent.hex }} />

                {/* Overlay content */}
                <div className="absolute bottom-6 left-7 right-7 flex items-end justify-between">
                  <div>
                    <p className="text-[#EDD9A3] text-[10px] tracking-[0.4em] uppercase mb-2">{event.date} · {event.time}</p>
                    <h2 className="font-serif text-5xl lg:text-6xl text-white font-light leading-none">{event.name}</h2>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl">
                    {event.emoji}
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: "📅", label: "Date",       value: event.date      },
                  { icon: "⏰", label: "Time",       value: event.time      },
                  { icon: "📍", label: "Venue",      value: event.location  },
                  { icon: "👗", label: "Dress Code", value: event.dresscode },
                ].map((d) => (
                  <div key={d.label} className="bg-white rounded-2xl p-4 border border-[#EDD9A3]/30 shadow-sm">
                    <p className="text-[9px] tracking-widest uppercase text-[#1C1C1E]/40 mb-1">{d.icon} {d.label}</p>
                    <p className="text-[#1C1C1E]/70 text-sm font-light leading-snug whitespace-pre-line">{d.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-white rounded-3xl p-7 lg:p-8 border border-[#EDD9A3]/30 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 rounded-full" style={{ background: accent.hex }} />
                  <h3 className="font-serif text-2xl font-light text-[#1C1C1E]">About the Ceremony</h3>
                </div>
                <p className="text-[#1C1C1E]/60 leading-relaxed font-light">{event.description}</p>
              </div>

              {/* Highlights + Gallery CTA */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div className="flex-1">
                  <p className="text-[10px] tracking-[0.35em] uppercase text-[#1C1C1E]/40 mb-3">Highlights</p>
                  <div className="flex flex-wrap gap-2">
                    {event.highlights.map((h, i) => (
                      <motion.span
                        key={h}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}
                        className={`text-xs tracking-widest uppercase px-4 py-2 rounded-full border font-light ${accent.pill}`}
                      >
                        {h}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Gallery CTA */}
                <motion.button
                  key={`gallery-btn-${active}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => onOpenGallery(event.name)}
                  className="shrink-0 flex items-center gap-2.5 px-6 py-3 rounded-2xl border text-sm font-light tracking-widest uppercase transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ borderColor: accent.hex, color: accent.hex, boxShadow: `0 0 0 0 ${accent.glow}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 8px 24px ${accent.glow}`)}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <span>🖼</span>
                  <span>View Gallery</span>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function EventsPage() {
  const [galleryEvent, setGalleryEvent] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FDF8F2]">
      <EventsHero />

      {/* Intro */}
      <FadeIn>
        <div className="py-7 px-6 max-w-xl mx-auto text-center">
          <div className="gold-divider mb-4" />
          <p className="font-serif italic text-base sm:text-lg text-[#1C1C1E]/50 leading-relaxed">
            Five ceremonies, five emotions, one unforgettable celebration of love.
          </p>
          <div className="gold-divider mt-4" />
        </div>
      </FadeIn>

      {/* Responsive layouts */}
      <MobileEvents onOpenGallery={setGalleryEvent} />
      <TabletEvents onOpenGallery={setGalleryEvent} />
      <DesktopEvents onOpenGallery={setGalleryEvent} />

      {/* Gallery modal */}
      <AnimatePresence>
        {galleryEvent && (
          <GalleryModal eventName={galleryEvent} onClose={() => setGalleryEvent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
