import Link from "next/link";
import { Quote, ArrowRight, Sparkles } from "lucide-react";

const TEXT_PREVIEW_LENGTH = 160;

function getPreview(text) {
  if (text.length <= TEXT_PREVIEW_LENGTH) return text;
  const trimmed = text.slice(0, TEXT_PREVIEW_LENGTH);
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${trimmed.slice(0, lastSpace > 0 ? lastSpace : trimmed.length)}...`;
}

const aboutSections = [
  {
    id: "mission",
    title: 'About Me - "From Struggle to Success"',
    quote: "Optimism That Inspires Change.",
    accentColor: "text-[#926ab9]",
    bgColor: "bg-[#f4eff8]",
    text: "My mission as a Counsellor and Life Coach is to empower and inspire my clients to live a life that is authentic, fulfilling, and aligned with their values. I believe that everyone has the potential to create positive change in their lives, and I am here to support you on your journey towards personal growth and transformation providing a holistic approach to counselling and stress management.",
  },
  {
    id: "survivor",
    title: "Survivor - Now Living my Best Life",
    subtitle: "Child Abuse, Domestic and Family Violence, Substance Misuse",
    quote: "Guided by Kindness, Driven by Hope.",
    accentColor: "text-[#4b8e9a]",
    bgColor: "bg-[#eaf3f5]",
    text: "I have lived experience in all of these areas and more. I don't believe in regret as without the challenges of my past I would not be where I am today. I have had the privilege to be able to journey alongside many individuals in overcoming the challenges that have held them back from the life they deserve. I see myself as a 'Survivor' and know through my own life challenges that with the right support we all have the 'Ability To Thrive'. For the past 2 years in private practice, I have been engaged in providing support to people with disabilities and their families through disability counselling, supporting with carer burnout and stress management, and as a life coach.",
  },
  {
    id: "services",
    title: "My Services",
    quote: "Support Without Judgment, Change Without Pressure.",
    accentColor: "text-[#6d7bbb]",
    bgColor: "bg-[#edf0f7]",
    text: "I offer one-on-one counselling sessions, and recovery coaching sessions. My areas of expertise include Addictions and related traumas, Domestic and Family Violence, Grief, Relationships coaching, disability counselling with a special focus on hoarding and shop-a-holic inclinations. Work-related Stress management and personal development as a counsellor and life coach. Contact me today to learn more about how I can help you achieve your goals.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-transparent px-6 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center flex flex-col items-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7ea6d8]/30 bg-white/70 px-5 py-2 backdrop-blur">
              <Sparkles className="h-[18px] w-[18px] text-[#926ab9]" />
              <span className="text-sm font-medium tracking-wide text-[#42454c] uppercase">
                My Story & Approach
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight text-[#42454c] sm:text-5xl lg:text-6xl">
              Welcome to{" "}
              <span className="italic text-[#926ab9]">Ability to Thrive</span>
            </h1>
            <p className="mt-6 text-xl text-[#5c6069] font-medium max-w-2xl mx-auto">
              Life Coach and Counsellor
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-start">
            {aboutSections.map((section) => (
              <article
                key={section.id}
                className="flex flex-col h-full rounded-3xl border border-[#d9deeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(238,239,242,0.82))] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h2 className="text-2xl font-semibold text-[#42454c] mb-2 text-center">
                  {section.title}
                </h2>

                {section.subtitle && (
                  <p className="text-sm font-medium text-[#6d7bbb] text-center mb-6">
                    {section.subtitle}
                  </p>
                )}

                <div
                  className={`my-6 ${section.bgColor} p-5 rounded-2xl flex items-start gap-3 border border-white/60 shadow-sm`}
                >
                  <Quote
                    className={`w-6 h-6 ${section.accentColor} flex-shrink-0 mt-0.5`}
                  />
                  <p className="font-semibold italic text-[#42454c] leading-relaxed">
                    "{section.quote}"
                  </p>
                </div>

                <div className="mt-2 flex-grow">
                  {section.text.length > TEXT_PREVIEW_LENGTH ? (
                    <details className="group">
                      <summary className="list-none cursor-pointer [&::-webkit-details-marker]:hidden">
                        <p className="leading-relaxed text-[#5d6169] group-open:hidden">
                          {getPreview(section.text)}
                        </p>
                        <p className="hidden leading-relaxed text-[#5d6169] group-open:block">
                          {section.text}
                        </p>

                        <span className="mt-4 inline-flex items-center text-sm font-medium text-[#4b8e9a] transition hover:text-[#926ab9] group-open:hidden">
                          Read more
                        </span>
                        <span className="mt-4 hidden items-center text-sm font-medium text-[#4b8e9a] transition hover:text-[#926ab9] group-open:inline-flex">
                          Show less
                        </span>
                      </summary>
                    </details>
                  ) : (
                    <p className="leading-relaxed text-[#5d6169]">
                      {section.text}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/*Section from homepage */}
      <section className="bg-[#42454c] px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to Take the First Step?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
            Schedule your consultation today and begin your journey toward
            healing and growth.
          </p>

          <div className="mt-10">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-xl bg-[#926ab9] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#7d58a3]"
            >
              Book Your Session Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
