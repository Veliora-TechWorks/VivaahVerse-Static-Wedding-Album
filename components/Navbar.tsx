"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import coupleData from "@/data/couple.json";
import { useMusic } from "@/components/MusicToggle";

const links = [
  { href: "/",          label: "Home",      icon: "🏠", short: "Home"    },
  { href: "/story",     label: "Our Story", icon: "💕", short: "Story"   },
  { href: "/events",    label: "Events",    icon: "🎉", short: "Events"  },
  { href: "/gallery",   label: "Gallery",   icon: "📸", short: "Gallery" },
  { href: "/videos",    label: "Videos",    icon: "🎬", short: "Videos"  },
  { href: "/guestbook", label: "Guestbook", icon: "✍️", short: "Book"    },
];

// Bottom bar: all 6 tabs

/* ─── Music button ───────────────────────────────────────────── */
function MusicBtn({ playing, onToggle, scrolled }: {
  playing: boolean; onToggle: () => void; scrolled: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      title={playing ? "Pause music" : "Play music"}
      className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
        scrolled
          ? "bg-[#6B2737]/10 hover:bg-[#6B2737]/20"
          : "bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15"
      }`}
    >
      {playing ? (
        <span className="flex gap-[2px] items-end h-3.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-[2.5px] rounded-full"
              style={{ background: scrolled ? "#6B2737" : "rgba(255,255,255,0.8)" }}
              animate={{ height: ["4px", "12px", "4px"] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            />
          ))}
        </span>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
          className={scrolled ? "text-[#6B2737]" : "text-white/80"}
        >
          <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z" />
        </svg>
      )}
    </motion.button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { playing, toggle: toggleMusic } = useMusic();
  const [bride] = coupleData.bride.split(" ");
  const [groom] = coupleData.groom.split(" ");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ══════════════════════════════════════════
          TOP HEADER
      ══════════════════════════════════════════ */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-3"}`}
      >
        <motion.div
          className="absolute inset-0 bg-white/92 backdrop-blur-2xl border-b border-[#6B2737]/8 shadow-[0_4px_32px_rgba(107,39,55,0.08)]"
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#6B2737] to-transparent"
          animate={{ scaleX: scrolled ? 1 : 0, opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-10 h-10 shrink-0">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#6B2737" strokeWidth="1" strokeOpacity="0.35" />
                <motion.circle
                  cx="20" cy="20" r="18" fill="none" stroke="#D4A853" strokeWidth="1.5"
                  strokeDasharray="113" strokeDashoffset="113"
                  animate={{ strokeDashoffset: scrolled ? 0 : 113 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeLinecap="round"
                  style={{ rotate: "-90deg", transformOrigin: "center" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`font-serif text-sm font-semibold transition-colors duration-300 ${scrolled ? "text-[#6B2737]" : "text-white"}`}>
                  {bride[0]}{groom[0]}
                </span>
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-serif text-xl font-semibold tracking-wide transition-colors duration-300 ${scrolled ? "text-[#6B2737]" : "text-white"}`}>
                VivaahVerse
              </span>
              <span className={`text-[9px] tracking-[0.28em] uppercase transition-colors duration-300 ${scrolled ? "text-[#D4A853]" : "text-white/55"}`}>
                {bride} &amp; {groom}
              </span>
            </div>
          </Link>

          {/* Mobile: date pill + music */}
          <div className="md:hidden flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
              scrolled ? "bg-[#6B2737]/8" : "bg-white/10 backdrop-blur-sm border border-white/15"
            }`}>
              <span className="text-[11px]">💍</span>
              <span className={`text-[9px] tracking-[0.18em] uppercase font-light transition-colors duration-300 ${
                scrolled ? "text-[#6B2737]" : "text-white/70"
              }`}>
                {coupleData.weddingDate}
              </span>
            </div>
            <MusicBtn playing={playing} onToggle={toggleMusic} scrolled={scrolled} />
          </div>

          {/* Desktop nav (lg+) */}
          <nav className="hidden lg:flex items-center">
            <div className={`flex items-center gap-0.5 px-2 py-1.5 rounded-full transition-all duration-500 ${
              scrolled ? "bg-[#FDF8F2]" : "bg-white/10 backdrop-blur-md border border-white/15"
            }`}>
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}
                    className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] tracking-[0.12em] uppercase font-medium transition-all duration-300 group"
                  >
                    {active && (
                      <motion.span layoutId="desktop-pill"
                        className="absolute inset-0 rounded-full bg-[#6B2737] shadow-[0_2px_12px_rgba(107,39,55,0.35)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 text-sm">{link.icon}</span>
                    <span className={`relative z-10 transition-colors duration-200 ${
                      active ? "text-white" : scrolled ? "text-[#1C1C1E]/65 group-hover:text-[#6B2737]" : "text-white/75 group-hover:text-white"
                    }`}>{link.short}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Tablet nav (md) */}
          <nav className="hidden md:flex lg:hidden items-center">
            <div className={`flex items-center gap-0.5 px-2 py-1.5 rounded-full transition-all duration-500 ${
              scrolled ? "bg-[#FDF8F2]" : "bg-white/10 backdrop-blur-md border border-white/15"
            }`}>
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} title={link.label}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full text-base transition-all duration-300"
                  >
                    {active && (
                      <motion.span layoutId="tablet-pill"
                        className="absolute inset-0 rounded-full bg-[#6B2737] shadow-[0_2px_12px_rgba(107,39,55,0.35)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.icon}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Music toggle */}
            <MusicBtn playing={playing} onToggle={toggleMusic} scrolled={scrolled} />

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/guestbook"
                className={`relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium border transition-all duration-300 ${
                  scrolled
                    ? "bg-[#6B2737] text-white border-[#6B2737] shadow-[0_4px_16px_rgba(107,39,55,0.3)] hover:shadow-[0_6px_24px_rgba(107,39,55,0.45)]"
                    : "border-white/50 text-white hover:bg-white/15"
                }`}
              >
                <span className="absolute inset-0 bg-white/10 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-500 skew-x-12 pointer-events-none" />
                <span className="relative">✍️</span>
                <span className="relative">Sign Guestbook</span>
              </Link>
            </motion.div>
          </div>

        </div>
      </motion.header>

      {/* ══════════════════════════════════════════
          MOBILE BOTTOM TAB BAR  (all 6 tabs)
      ══════════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Top accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#6B2737]/30 to-transparent" />

        <div className="bg-white/96 backdrop-blur-2xl shadow-[0_-8px_32px_rgba(107,39,55,0.1)]">
          <div className="flex items-stretch px-1 py-2">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex-1 flex flex-col items-center justify-center py-3 gap-1 min-w-0"
                >
                  {/* Active pill background */}
                  {active && (
                    <motion.span
                      layoutId="bottom-tab-bg"
                      className="absolute inset-x-0.5 inset-y-0.5 rounded-xl bg-[#6B2737]/8"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}

                  {/* Active top indicator */}
                  {active && (
                    <motion.span
                      layoutId="bottom-tab-bar"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] rounded-full bg-[#6B2737]"
                      transition={{ type: "spring", stiffness: 600, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <motion.span
                    animate={active ? { y: -1, scale: 1.15 } : { y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="relative z-10 text-[19px] leading-none"
                  >
                    {link.icon}
                  </motion.span>

                  {/* Label */}
                  <motion.span
                    animate={{ color: active ? "#6B2737" : "rgba(28,28,30,0.4)" }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 text-[9px] tracking-wide font-medium leading-none truncate w-full text-center px-0.5"
                  >
                    {link.short}
                  </motion.span>
                </Link>
              );
            })}
          </div>

          {/* Safe area spacer for devices with home indicator */}
          <div className="h-safe-bottom" style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
        </div>
      </div>
    </>
  );
}
