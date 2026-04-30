"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fallbackAboutContent } from "@/lib/cms-homepage";

export default function AboutMeClient({ content = fallbackAboutContent }) {
  return (
    <div className="min-h-screen bg-[#f7f7f6] text-[#42454c] pb-24">
      {/* HERO IMAGE */}
      <section className="px-6 pt-24 lg:pt-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem]">
          <img
            src={content.hero_image_url || "/assets/about/about-hero.jpeg"}
            alt="About hero"
            className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[420px]"
          />
        </div>
      </section>

    {/* HERO TEXT */}
    <section className="px-6 pt-10 pb-4">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="mb-6 text-4xl font-semibold leading-tight text-[#42454c] sm:text-5xl lg:text-6xl">
          {content.hero_heading}
        </h1>
        <p className="text-xl font-medium text-[#5c6069]">
          {content.hero_subheading}
        </p>
      </div>
    </section>

      {/* STORY / INTRO EDITORIAL LAYOUT */}
      <section className="px-6 mt-8">
        <div className="mx-auto max-w-7xl">

          <div className="bg-white rounded-[2.5rem] border border-[#d9deeb] shadow-[0_10px_25px_rgba(0,0,0,0.08)] px-10 py-12 lg:px-16 lg:py-14">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

              <div>
                <h2 className="text-3xl font-semibold text-[#42454c] leading-tight">
                  {content.story_heading}
                </h2>

                <p className="mt-4 text-lg text-[#5c6069]">
                  {content.story_subheading}
                </p>
              </div>

              <div className="space-y-6 text-base leading-8 text-[#5d6169]">
                <p>{content.story_body_1}</p>

                <div className="h-px w-16 bg-[#d9deeb]"></div>

                <p>{content.story_body_2}</p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-6 mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-[2.5rem]">
              <img
                src={
                  content.philosophy_image_url ||
                  "/assets/about/about-philosophy.png"
                }
                alt={content.philosophy_heading}
                className="h-[320px] w-full object-cover lg:h-[520px]"
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
                {content.philosophy_heading}
              </p>

              <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#42454c] sm:text-4xl">
                {content.philosophy_heading}
              </h2>

              <p className="mt-8 text-base leading-9 text-[#5d6169]">
                {content.philosophy_body_1}
              </p>

              <div className="mt-6 h-px w-16 bg-[#926ab9]/30" />

              <p className="mt-6 text-base leading-9 text-[#5d6169]">
                {content.philosophy_body_2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BACKGROUND */}
      <section className="px-6 mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
                {content.background_heading}
              </p>

              <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#42454c] sm:text-4xl">
                {content.background_heading}
              </h2>

              <p className="mt-8 text-base leading-9 text-[#5d6169]">
                {content.background_body}
              </p>
            </div>

            <div className="order-1 overflow-hidden rounded-[2.5rem] lg:order-2">
              <img
                src={
                  content.background_image_url ||
                  "/assets/about/about-background.png"
                }
                alt={content.background_heading}
                className="h-[320px] w-full object-cover lg:h-[520px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOCUS AREAS */}
      <section className="px-6 mt-24">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#edf0f7] px-8 py-10 lg:px-12 lg:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
                {content.focus_label}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {(content.focus_tags || []).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-[#42454c] shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS / SUPPORT */}
      <section className="px-6 mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_0.9fr_1.2fr]">
            <div>
              <p className="text-5xl font-light text-[#7ea6d8] lg:text-6xl">
                {content.stat_1_value}
              </p>
              <h3 className="mt-4 text-2xl font-medium text-[#42454c]">
                {content.stat_1_label}
              </h3>
              <p className="mt-4 text-base leading-8 text-[#5d6169]">
                {content.stat_1_body}
              </p>
            </div>

            <div>
              <p className="text-5xl font-light text-[#926ab9] lg:text-6xl">
                {content.stat_2_value}
              </p>
              <h3 className="mt-4 text-2xl font-medium text-[#42454c]">
                {content.stat_2_label}
              </h3>
              <p className="mt-4 text-base leading-8 text-[#5d6169]">
                {content.stat_2_body}
              </p>
            </div>

            <div className="rounded-[2rem] bg-white px-8 py-10 shadow-sm">
             <div className="h-[35px]" />   

              <h3 className="text-2xl font-medium text-[#42454c]">
                {content.stat_3_label}
              </h3>
              <p className="mt-4 text-base leading-8 text-[#5d6169]">
                {content.stat_3_body}
              </p>
              
            </div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH IMAGE TEXT SECTION */}
      <section className="mt-24">
        <div className="relative overflow-hidden">
          <img
            src="/assets/about/about-cta.jpeg"
            alt="About closing section"
            className="h-[620px] w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="max-w-4xl text-center text-white">
            <h1 className="text-4xl lg:text-6xl font-semibold text-white">
              Ready to take the next step?
            </h1>

              <div className="mt-20">
                <Link
                  href="/booking"
                  className="inline-flex rounded-full bg-[#9a72c5] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#865fb0]"
                >
                  Book a Session
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
