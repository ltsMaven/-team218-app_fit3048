"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { fallbackAboutContent } from "@/lib/cms-homepage";

export default function AboutMeClient({ content = fallbackAboutContent }) {
  return (
    <div className="min-h-screen bg-transparent pb-24">
      <section className="px-6 pt-24 pb-12 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-semibold leading-tight text-[#42454c] sm:text-5xl lg:text-6xl mb-6">
            {content.hero_heading}
          </h1>
          <p className="text-xl text-[#5c6069] font-medium">
            {content.hero_subheading}
          </p>
        </div>
      </section>

      <section className="px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <article className="md:col-span-5 rounded-[2.5rem] border border-[#d9deeb] bg-white p-10 shadow-sm transition hover:shadow-md">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4eff8]">
                <ShieldCheck className="h-6 w-6 text-[#926ab9]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#42454c] mb-6">
                {content.philosophy_heading}
              </h2>
              <p className="text-base leading-8 text-[#5d6169]">
                {content.philosophy_body_1}
              </p>
              <div className="mt-6 h-px w-12 bg-[#926ab9]/30" />
              <p className="mt-6 text-base leading-8 text-[#5d6169]">
                {content.philosophy_body_2}
              </p>
            </article>

            <div className="md:col-span-7 flex flex-col gap-8">
              <article className="flex-grow rounded-[2.5rem] border border-[#d8dfeb] bg-white p-10 shadow-sm transition hover:shadow-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3f5]">
                    <GraduationCap className="h-6 w-6 text-[#4b8e9a]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#42454c]">
                    {content.background_heading}
                  </h2>
                </div>
                <p className="text-base leading-8 text-[#5d6169]">
                  {content.background_body}
                </p>
              </article>

              <div className="rounded-[2rem] border border-white/40 bg-[#edf0f7] p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#6d7bbb] mb-4">
                  {content.focus_label}
                </p>
                <div className="flex flex-wrap gap-3">
                  {(content.focus_tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-[#42454c] shadow-sm border border-[#cdd8e7]/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 mt-16">
        <div className="mx-auto max-w-6xl">
          <article className="rounded-[2.5rem] border border-[#d9deeb] bg-[#42454c] p-10 md:p-16 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-semibold mb-2">
                {content.story_heading}
              </h2>
              <p className="text-[#7ea6d8] font-medium mb-8">
                {content.story_subheading}
              </p>
              <div className="max-w-3xl text-white/80 leading-relaxed">
                <p className="mb-6">{content.story_body_1}</p>
                <p>{content.story_body_2}</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 mt-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 bg-white border border-[#d9deeb] rounded-[2.5rem] p-12 shadow-sm">
            <div className="space-y-4">
              <p className="text-5xl font-light text-[#7ea6d8]">
                {content.stat_1_value}
              </p>
              <h3 className="text-lg font-medium text-[#42454c]">
                {content.stat_1_label}
              </h3>
              <p className="text-[#5d6169] text-sm leading-relaxed">
                {content.stat_1_body}
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-5xl font-light text-[#926ab9]">
                {content.stat_2_value}
              </p>
              <h3 className="text-lg font-medium text-[#42454c]">
                {content.stat_2_label}
              </h3>
              <p className="text-[#5d6169] text-sm leading-relaxed">
                {content.stat_2_body}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#42454c]">
                {content.stat_3_label}
              </h3>
              <p className="text-[#5d6169] text-sm leading-relaxed">
                {content.stat_3_body}
              </p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 text-[#4b8e9a] font-semibold hover:underline"
              >
                {content.stat_3_button_label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
