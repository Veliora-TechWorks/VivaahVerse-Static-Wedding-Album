"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import guestbookData from "@/data/guestbook.json";

interface Message {
  id: number;
  name: string;
  relation: string;
  message: string;
  date: string;
  avatar: string;
}

const avatarColors = [
  "bg-rose-200 text-rose-700",
  "bg-amber-200 text-amber-700",
  "bg-emerald-200 text-emerald-700",
  "bg-purple-200 text-purple-700",
  "bg-blue-200 text-blue-700",
  "bg-pink-200 text-pink-700",
];

export default function GuestbookPage() {
  const [messages, setMessages] = useState<Message[]>(guestbookData);
  const [form, setForm] = useState({ name: "", relation: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.message.trim()) e.message = "Message is required";
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const newMsg: Message = {
      id: Date.now(),
      name: form.name.trim(),
      relation: form.relation.trim() || "Guest",
      message: form.message.trim(),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      avatar: form.name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    };

    setMessages([newMsg, ...messages]);
    setForm({ name: "", relation: "", message: "" });
    setErrors({});
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative h-[28vh] sm:h-[32vh] lg:h-[36vh] min-h-[180px] sm:min-h-[220px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/seed/guestbook-hero/1920/800"
          alt="Guestbook"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[#FDF8F2]" />
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#EDD9A3] text-xs tracking-[0.4em] uppercase mb-4"
          >
            Words of Love
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white"
          >
            Guestbook
          </motion.h1>
        </div>
      </section>

      <section className="py-20 px-6 max-w-6xl mx-auto">
        <FadeIn className="text-center mb-16">
          <p className="text-[#6B2737] text-xs tracking-[0.4em] uppercase mb-4">Blessings & Wishes</p>
          <h2 className="font-serif text-4xl font-light text-[#1C1C1E] mb-4">Leave Your Love</h2>
          <div className="gold-divider max-w-xs mx-auto" />
        </FadeIn>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Add Message Form */}
          <div className="lg:col-span-2">
            <FadeIn direction="right">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#EDD9A3]/30 sticky top-24">
                <h3 className="font-serif text-2xl font-light text-[#1C1C1E] mb-6">Share Your Wishes</h3>

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-light"
                    >
                      🎉 Your message has been added! Thank you for your wishes.
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border font-light text-sm focus:outline-none focus:border-[#6B2737] transition-colors ${
                        errors.name ? "border-red-300" : "border-[#EDD9A3]"
                      }`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Relation (e.g. Friend, Cousin)"
                      value={form.relation}
                      onChange={(e) => setForm({ ...form, relation: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#EDD9A3] font-light text-sm focus:outline-none focus:border-[#6B2737] transition-colors"
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Your heartfelt message... *"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border font-light text-sm focus:outline-none focus:border-[#6B2737] transition-colors resize-none ${
                        errors.message ? "border-red-300" : "border-[#EDD9A3]"
                      }`}
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 bg-[#6B2737] text-white text-sm tracking-widest uppercase font-light rounded-xl hover:bg-[#b8943e] transition-colors"
                  >
                    Send Wishes ✨
                  </motion.button>
                </form>
              </div>
            </FadeIn>
          </div>

          {/* Messages */}
          <div className="lg:col-span-3 space-y-5">
            <FadeIn>
              <p className="text-[#1C1C1E]/40 text-sm font-light mb-6">
                {messages.length} heartfelt messages
              </p>
            </FadeIn>

            {messages.map((msg, index) => (
              <FadeIn key={msg.id} delay={index * 0.05}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-[#EDD9A3]/30"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                        avatarColors[index % avatarColors.length]
                      }`}
                    >
                      {msg.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-medium text-[#1C1C1E] text-sm">{msg.name}</h4>
                        <span className="text-[#1C1C1E]/30 text-xs flex-shrink-0">{msg.date}</span>
                      </div>
                      <p className="text-[#6B2737] text-xs tracking-widest uppercase font-light mb-3">{msg.relation}</p>
                      <p className="font-serif italic text-[#1C1C1E]/70 leading-relaxed text-sm">"{msg.message}"</p>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="py-12 sm:py-14 px-6 bg-[#1C1C1E]">
        <FadeIn className="max-w-xl mx-auto text-center">
          <p className="text-[#D4A853]/60 text-[9px] tracking-[0.45em] uppercase mb-2">Share the Love</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-4">Share This Album</h2>
          <p className="text-white/40 text-sm font-light mb-6">
            Scan the QR code to share this wedding album with friends and family
          </p>
          <div className="inline-block p-5 bg-white rounded-3xl shadow-2xl">
            <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center mx-auto border-4 border-[#1C1C1E]">
              <div className="text-center p-3">
                <div className="text-4xl mb-1">💍</div>
                <p className="text-[#1C1C1E] text-xs font-bold tracking-wider">VIVAAHVERSE</p>
                <p className="text-[#6B2737] text-[9px] mt-1">Scan to visit</p>
              </div>
            </div>
            <p className="text-[#1C1C1E]/40 text-[10px] mt-3 tracking-widest uppercase">vivaahverse.vercel.app</p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
