"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import VideoModal from "@/components/VideoModal";

const videos = [
  { id: 1, title: "Haldi Ceremony Highlights", event: "Haldi", thumb: "https://picsum.photos/seed/vid-haldi/600/400", src: "/videos/haldi.mp4", duration: "3:24" },
  { id: 2, title: "Mehendi Evening", event: "Mehendi", thumb: "https://picsum.photos/seed/vid-mehendi/600/400", src: "/videos/mehendi.mp4", duration: "4:12" },
  { id: 3, title: "Sangeet Night", event: "Sangeet", thumb: "https://picsum.photos/seed/vid-sangeet/600/400", src: "/videos/sangeet.mp4", duration: "6:45" },
  { id: 4, title: "Wedding Ceremony", event: "Wedding", thumb: "https://picsum.photos/seed/vid-wedding/600/400", src: "/videos/wedding.mp4", duration: "12:30" },
  { id: 5, title: "Baraat Procession", event: "Wedding", thumb: "https://picsum.photos/seed/vid-baraat/600/400", src: "/videos/baraat.mp4", duration: "5:18" },
  { id: 6, title: "Reception Highlights", event: "Reception", thumb: "https://picsum.photos/seed/vid-reception/600/400", src: "/videos/reception.mp4", duration: "8:02" },
  { id: 7, title: "Couple's First Dance", event: "Reception", thumb: "https://picsum.photos/seed/vid-dance/600/400", src: "/videos/dance.mp4", duration: "4:55" },
  { id: 8, title: "Full Wedding Film", event: "Wedding", thumb: "https://picsum.photos/seed/vid-film/600/400", src: "/videos/full-film.mp4", duration: "28:00" },
];

const eventColors: Record<string, string> = {
  Haldi: "bg-yellow-100 text-amber-600",
  Mehendi: "bg-green-100 text-emerald-600",
  Sangeet: "bg-purple-100 text-purple-600",
  Wedding: "bg-rose-100 text-rose-600",
  Reception: "bg-amber-100 text-amber-700",
};

export default function VideosPage() {
  const [activeVideo, setActiveVideo] = useState<(typeof videos)[0] | null>(null);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative h-[28vh] sm:h-[32vh] lg:h-[36vh] min-h-[180px] sm:min-h-[220px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/seed/videos-hero/1920/800"
          alt="Videos"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#FDF8F2]" />
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#EDD9A3] text-xs tracking-[0.4em] uppercase mb-4"
          >
            Relive Every Moment
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white"
          >
            Video Gallery
          </motion.h1>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <p className="text-[#6B2737] text-xs tracking-[0.4em] uppercase mb-4">Cinematic Memories</p>
          <h2 className="font-serif text-4xl font-light text-[#1C1C1E] mb-4">Our Wedding Films</h2>
          <div className="gold-divider max-w-xs mx-auto mb-4" />
          <p className="text-[#1C1C1E]/50 font-light text-sm max-w-xl mx-auto">
            Place your wedding videos in <code className="text-[#6B2737]">/public/videos/</code> to enable playback.
            Thumbnails are shown below.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <FadeIn key={video.id} delay={index * 0.07}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#EDD9A3]/30 cursor-pointer group"
                onClick={() => setActiveVideo(video)}
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={video.thumb}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-14 h-14 rounded-full glass flex items-center justify-center"
                    >
                      <span className="text-white text-2xl ml-1">▶</span>
                    </motion.div>
                  </div>
                  {/* Duration badge */}
                  <div className="absolute bottom-3 right-3 glass-dark text-white text-xs px-2 py-1 rounded-md">
                    {video.duration}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-light ${eventColors[video.event] || "bg-gray-100 text-gray-600"}`}>
                    {video.event}
                  </span>
                  <h3 className="font-serif text-lg font-light text-[#1C1C1E] mt-2">{video.title}</h3>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          src={activeVideo.src}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  );
}
