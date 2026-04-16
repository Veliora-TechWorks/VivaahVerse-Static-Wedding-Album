"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

// Bottom bar: 3 main tabs + More
const TAB_LINKS  = [links[0], links[3], links[4]]; // Home, Gallery, Videos
const MORE_LINKS = [links[1], links[2], links[5]]; // Story, Events, Guestbook

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
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const { playing, toggle: toggleMusic } = useMusic();
  const [bride] = coupleData.bride.split(" ");
  const [groom] = coupleData.groom.split(" ");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMoreOpen(false); }, [pathname]);

  const moreActive = MORE_LINKS.some((l) => l.href === pathname);

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
          MOBILE BOTTOM TAB BAR  (3 tabs + More)
      ══════════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white/96 backdrop-blur-2xl border-t border-[#6B2737]/10 shadow-[0_-8px_32px_rgba(107,39,55,0.1)]">
          <div className="flex items-stretch">

            {/* 3 main tabs */}
            {TAB_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  className="relative flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 group"
                >
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        layoutId="bottom-tab-bg"
                        className="absolute inset-x-1 inset-y-1 rounded-2xl bg-[#6B2737]/8"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.span
                    animate={active ? { y: -2, scale: 1.2 } : { y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="relative z-10 text-[18px] leading-none"
                  >
                    {link.icon}
                  </motion.span>

                  <motion.span
                    animate={{ color: active ? "#6B2737" : "rgba(28,28,30,0.38)" }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 text-[9px] tracking-wide font-medium"
                  >
                    {link.short}
                  </motion.span>

                  <AnimatePresence>
                    {active && (
                      <motion.span
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 600, damping: 30 }}
                        className="absolute bottom-1 w-4 h-[2px] rounded-full bg-[#6B2737]"
                      />
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}

            {/* More tab */}
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className="relative flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5"
            >
              <AnimatePresence>
                {(moreActive || moreOpen) && (
                  <motion.span
                    layoutId="bottom-tab-bg"
                    className="absolute inset-x-1 inset-y-1 rounded-2xl bg-[#6B2737]/8"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </AnimatePresence>

              <motion.span
                animate={moreOpen ? { rotate: 90, scale: 1.1 } : { rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="relative z-10 text-[18px] leading-none"
              >
                {moreOpen ? "✕" : "⋯"}
              </motion.span>

              <motion.span
                animate={{ color: moreActive || moreOpen ? "#6B2737" : "rgba(28,28,30,0.38)" }}
                transition={{ duration: 0.2 }}
                className="relative z-10 text-[9px] tracking-wide font-medium"
              >
                More
              </motion.span>

              <AnimatePresence>
                {moreActive && !moreOpen && (
                  <motion.span
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 0, opacity: 0 }}
                    className="absolute bottom-1 w-4 h-[2px] rounded-full bg-[#6B2737]"
                  />
                )}
              </AnimatePresence>
            </button>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MORE SHEET
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setMoreOpen(false)}
            />

            <motion.div
              key="sheet"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="md:hidden fixed bottom-[56px] left-0 right-0 z-50 bg-[#FDF8F2] rounded-t-3xl shadow-[0_-8px_40px_rgba(107,39,55,0.15)]"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#1C1C1E]/15" />
              </div>

              {/* Label */}
              <div className="px-5 pt-2 pb-3 border-b border-[#6B2737]/8">
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#1C1C1E]/35 font-light">More Pages</p>
              </div>

              {/* Links */}
              <div className="px-3 py-3 space-y-1">
                {MORE_LINKS.map((link, i) => {
                  const active = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                          active ? "bg-[#6B2737]/8" : "hover:bg-[#1C1C1E]/5"
                        }`}
                      >
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                          active ? "bg-[#6B2737]/12" : "bg-[#1C1C1E]/5"
                        }`}>
                          {link.icon}
                        </span>
                        <p className={`flex-1 text-sm font-medium tracking-wide ${active ? "text-[#6B2737]" : "text-[#1C1C1E]/70"}`}>
                          {link.label}
                        </p>
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-[#6B2737] shrink-0" />}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#1C1C1E]/20 shrink-0">
                          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <div className="h-3" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
