import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1E] text-white/70 py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-serif text-4xl font-semibold text-[#D4A853] mb-2">Apurva & Shubham</p>
        <p className="text-sm tracking-[0.3em] uppercase text-[#6B2737]/80 mb-8">May 14, 2026 · Nashik</p>

        <div className="gold-divider mb-8" />

        <nav className="flex flex-wrap justify-center gap-6 mb-8 text-xs tracking-widest uppercase">
          {["/", "/story", "/events", "/gallery", "/videos", "/guestbook"].map((href, i) => (
            <Link
              key={href}
              href={href}
              className="text-white/50 hover:text-[#D4A853] transition-colors"
            >
              {["Home", "Our Story", "Events", "Gallery", "Videos", "Guestbook"][i]}
            </Link>
          ))}
        </nav>

        <p className="font-serif italic text-lg text-white/40 mb-6">
          "Two souls, one heart, forever entwined."
        </p>

        <p className="text-xs text-white/25 tracking-widest">
          © 2026 VivaahVerse · Crafted with ♥ for Apurva & Shubham
        </p>
      </div>
    </footer>
  );
}
