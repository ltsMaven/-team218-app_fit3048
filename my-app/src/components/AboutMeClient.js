"use client";

import Link from "next/link";
import { Quote, ArrowRight, Sparkles, GraduationCap, HeartHandshake, ShieldCheck } from "lucide-react";

const TEXT_PREVIEW_LENGTH = 160;

function getPreview(text) {
  if (text.length <= TEXT_PREVIEW_LENGTH) return text;
  const trimmed = text.slice(0, TEXT_PREVIEW_LENGTH);
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${trimmed.slice(0, lastSpace > 0 ? lastSpace : trimmed.length)}...`;
}

export default function AboutMeClient() {
  return (
    <div className="min-h-screen bg-transparent pb-24">
      <section className="px-6 pt-24 pb-12 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">

          <h1 className="text-4xl font-semibold leading-tight text-[#42454c] sm:text-5xl lg:text-6xl mb-6">
            From Struggle to <span className="italic text-[#926ab9]">Success</span>
          </h1>
          <p className="text-xl text-[#5c6069] font-medium">
            "Optimism That Inspires Change."
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
              <h2 className="text-2xl font-semibold text-[#42454c] mb-6">My Philosophy</h2>
              <p className="text-base leading-8 text-[#5d6169]">
                I believe that everyone has the potential to live a fulfilling and meaningful life. My mission is to empower you to live authentically, aligned with your values. By identifying and working towards your goals, we unlock your full potential using a holistic approach to counselling and stress management.
              </p>
              <div className="mt-6 h-px w-12 bg-[#926ab9]/30" />
              <p className="mt-6 text-base leading-8 text-[#5d6169]">
                I provide a safe, non-judgmental space where you can explore challenges through substance abuse counselling, relationship support, and dedicated LGBTQIA+ advocacy.
              </p>
            </article>

            <div className="md:col-span-7 flex flex-col gap-8">
              <article className="flex-grow rounded-[2.5rem] border border-[#d8dfeb] bg-white p-10 shadow-sm transition hover:shadow-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3f5]">
                    <GraduationCap className="h-6 w-6 text-[#4b8e9a]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#42454c]">Professional Background</h2>
                </div>
                <p className="text-base leading-8 text-[#5d6169]">
                  I have over <span className="font-semibold text-[#926ab9]">15 years of experience</span> as a counsellor and life coach. My expertise spans substance abuse, trauma, and relationship counselling, as well as navigating criminal and legal challenges. I am deeply committed to supporting people with disabilities, their carers, and members of the LGBTQIA+ community to improve overall well-being.
                </p>
              </article>

              <div className="rounded-[2rem] border border-white/40 bg-[#edf0f7] p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#6d7bbb] mb-4">Core Focus Areas</p>
                <div className="flex flex-wrap gap-3">
                  {["Substance Abuse", "LGBTQIA+ Support", "Trauma", "Relationships", "NDIS / Disabilities", "Legal & Criminal Challenges"].map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-[#42454c] shadow-sm border border-[#cdd8e7]/50">{tag}</span>
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
              <h2 className="text-3xl font-semibold mb-2">Survivor — Now Living my Best Life</h2>
              <p className="text-[#7ea6d8] font-medium mb-8">Child Abuse, Domestic and Family Violence, Substance Misuse</p>
              <div className="max-w-3xl text-white/80 leading-relaxed">
                <p className="mb-6">
                  "Guided by Kindness, Driven by Hope." I have lived experience in all of these areas and more. I don't believe in regret; without the challenges of my past, I would not be where I am today.
                </p>
                <p>
                  For the past 2 years in private practice, I have had the privilege to journey alongside individuals overcoming challenges that held them back. I know through my own journey that with the right support, we all have the <strong>"Ability To Thrive."</strong>
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 mt-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 bg-white border border-[#d9deeb] rounded-[2.5rem] p-12 shadow-sm">
            <div className="space-y-4">
              <p className="text-5xl font-light text-[#7ea6d8]">13<span className="text-2xl">yrs</span></p>
              <h3 className="text-lg font-medium text-[#42454c]">Residential Rehab</h3>
              <p className="text-[#5d6169] text-sm leading-relaxed">Wealth of skills working with substance misuse, coexisting mental health diagnoses, and related traumas.</p>
            </div>
            <div className="space-y-4">
              <p className="text-5xl font-light text-[#926ab9]">2<span className="text-2xl">yrs</span></p>
              <h3 className="text-lg font-medium text-[#42454c]">NDIS & Advocacy</h3>
              <p className="text-[#5d6169] text-sm leading-relaxed">Supporting people with disabilities and families, addressing carer burnout and unique systemic challenges.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#42454c]">Wrap-Around Support</h3>
              <p className="text-[#5d6169] text-sm leading-relaxed">A holistic approach to free yourself from the challenges that keep you stuck. Reach out today.</p>
              <Link href="/booking" className="inline-flex items-center gap-2 text-[#4b8e9a] font-semibold hover:underline">Book a session <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}