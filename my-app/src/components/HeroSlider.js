"use client";

import Link from "next/link";
import { useState } from "react";

const heroVideos = [
  "/assets/videos/forrest.webm",
  "/assets/videos/mountains.webm",
  "/assets/videos/wave.webm",
];

export default function HeroSlider() {
  const [activeVideo, setActiveVideo] = useState(0);

  const handleVideoEnded = () => {
    setActiveVideo((current) => (current + 1) % heroVideos.length);
  };

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[calc(100vh-145px)] items-center overflow-hidden bg-[#42454c]"
    >
      <video
        key={heroVideos[activeVideo]}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
      >
        <source src={heroVideos[activeVideo]} type="video/webm" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(66,69,76,0.74),rgba(75,142,154,0.42),rgba(109,123,187,0.28))]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,transparent,rgba(238,239,242,0.18))]" />

      <div className="relative mx-auto flex w-full max-w-5xl justify-center px-6 py-20 text-center">
        <div className="max-w-3xl space-y-5 text-white">
          <div className="mx-auto inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium tracking-[0.28em] text-white/80 backdrop-blur">
            COUNSELLING • COACHING • SUPPORT
          </div>

          <h1 className="text-3xl font-semibold tracking-[0.08em] sm:text-5xl">
            Ability to Thrive
          </h1>

          <p className="text-base text-white/90 sm:text-lg">
            Guiding you towards a fulfilling life
          </p>

          <p className="mx-auto max-w-2xl text-xs leading-6 tracking-wide text-white/80 sm:text-sm">
            ACA registered Counsellor, Life Coach, Clinical Supervisor, NDIS
            registered provider
          </p>

          <div className="pt-4">
            <Link
              href="/booking"
              className="inline-block rounded-full bg-[#926ab9] px-6 py-3 text-sm font-medium text-white shadow-[0_18px_40px_rgba(146,106,185,0.35)] transition hover:bg-[#7d58a3]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
