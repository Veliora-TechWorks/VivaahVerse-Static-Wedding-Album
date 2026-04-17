import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MusicToggle from "@/components/MusicToggle";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "VivaahVerse — Apurva & Shubham",
  description: "A premium wedding album celebrating the love story of Apurva & Shubham",
  keywords: "wedding, album, VivaahVerse, Apurva, Shubham, love story",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FDF8F2] text-[#1C1C1E] antialiased">
        <MusicToggle>
          <Navbar />
          <PageTransition>
            <main className="pb-[64px] md:pb-0">{children}</main>
          </PageTransition>
          <Footer />
        </MusicToggle>
      </body>
    </html>
  );
}
