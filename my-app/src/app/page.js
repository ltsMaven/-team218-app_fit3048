import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sun } from "lucide-react";
import HeroSlider from "../components/HeroSlider";
import BlogSlider from "../components/BlogSlider";
import EnquiryForm from "../components/EnquiryForm";
import { getServerSupabaseClient } from "@/lib/supabase-server";
import {
  fallbackHomepageContent,
  HOMEPAGE_CMS_FIELDS,
  HOMEPAGE_CMS_SLUG,
  HOMEPAGE_CMS_TABLE,
  normaliseHomepageContent,
} from "@/lib/cms-homepage";
import { getPublishedBlogs } from "@/lib/blogs";
import { getApprovedTestimonials } from "@/lib/testimonial-submissions";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "http://localhost:3000";

export const metadata = {
  title: "Counselling, Coaching & NDIS Support",
  description:
    "Explore Ability to Thrive for counselling, life coaching, clinical supervision, and supportive care tailored to your goals and wellbeing.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Ability to Thrive | Counselling, Coaching & NDIS Support",
    description:
      "Explore Ability to Thrive for counselling, life coaching, clinical supervision, and supportive care tailored to your goals and wellbeing.",
    url: siteUrl,
  },
};

const primarySupportAreas = [
  {
    number: "01",
    title: "Counselling & Personal Support",
    description:
      "One-on-one and relationship counselling for stress, trauma, substance misuse, domestic and family violence, emotional challenges, and personal growth.",
    tags: ["Individual", "Couples", "Trauma"],
  },
  {
    number: "02",
    title: "Recovery Coaching & NDIS Support",
    description:
      "Person-centred support for NDIS participants, people with disabilities, families, and carers, with a focus on recovery, confidence, independence, and everyday wellbeing.",
    tags: ["NDIS", "Recovery", "Disability Support"],
  },
  {
    number: "03",
    title: "Clinical Supervision",
    description:
      "Reflective supervision for professionals, supporting confidence, ethical practice, professional development, boundaries, and work-related challenges.",
    tags: ["Supervision", "Practice", "Development"],
  },
];

const secondarySupportInfo = [
  {
    title: "NDIS Registered Provider",
    description:
      "Ability to Thrive provides person-centred support for NDIS participants, families, and carers in a safe, respectful, and non-judgemental environment.",
  },
  {
    title: "Appointments & Access",
    description:
      "Appointments are available via telehealth. Face-to-face support may be considered depending on location, needs, and availability.",
  },
];

const testimonialBgClasses = ["bg-[#eeeff2]", "bg-white/75", "bg-[#dce9f8]"];

const TESTIMONIAL_PREVIEW_LENGTH = 180;

async function getHomepageContent() {
  try {
    const supabase = getServerSupabaseClient();
    const { data, error } = await supabase
      .from(HOMEPAGE_CMS_TABLE)
      .select(["slug", ...HOMEPAGE_CMS_FIELDS].join(", "))
      .eq("slug", HOMEPAGE_CMS_SLUG)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return normaliseHomepageContent({
      ...fallbackHomepageContent,
      ...data,
    });
  } catch {
    return fallbackHomepageContent;
  }
}

async function getHomepageTestimonials() {
  try {
    const approvedTestimonials = await getApprovedTestimonials();

    return approvedTestimonials.map((testimonial, index) => ({
      id: testimonial.id,
      quote: testimonial.testimonial,
      author: testimonial.display_name || testimonial.name,
      bgClass: testimonialBgClasses[index % testimonialBgClasses.length],
    }));
  } catch {
    return [];
  }
}

async function getHomepageBlogs() {
  return getPublishedBlogs({ limit: 6 });
}

function getTestimonialPreview(quote) {
  if (quote.length <= TESTIMONIAL_PREVIEW_LENGTH) {
    return quote;
  }

  const trimmed = quote.slice(0, TESTIMONIAL_PREVIEW_LENGTH);
  const lastSpace = trimmed.lastIndexOf(" ");

  return `${trimmed.slice(0, lastSpace > 0 ? lastSpace : trimmed.length)}...`;
}

export default async function Home() {
  const [homepageContent, testimonials, blogs] = await Promise.all([
    getHomepageContent(),
    getHomepageTestimonials(),
    getHomepageBlogs(),
  ]);
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Ability to Thrive",
    url: siteUrl,
    image: `${siteUrl}/assets/abilityToThriveLogo.webp`,
    description:
      "Counselling, life coaching, clinical supervision, and NDIS support focused on compassionate, client-centred wellbeing.",
    areaServed: "Australia",
    serviceType: [
      "Counselling",
      "Life Coaching",
      "Clinical Supervision",
      "NDIS Support",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />

      <HeroSlider />

      <section id="about-me" className="bg-transparent px-6 py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex h-[420px] items-center justify-center rounded-[32px]">
              <Image
                src="/assets/attLogoNB.png"
                alt="Ability To Thrive logo"
                width={420}
                height={420}
                className="h-auto max-h-full w-full max-w-[340px] object-contain"
                priority
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#6d7bbb]">
              {homepageContent.about_badge}
            </p>
            <h2 className="mb-8 text-4xl font-semibold leading-tight text-[#42454c] sm:text-5xl lg:text-6xl">
              {homepageContent.about_heading}
            </h2>

            <div className="mb-10 space-y-6">
              <p className="text-xl leading-relaxed text-[#4f5560]">
                {homepageContent.about_intro}
              </p>

              <p className="text-xl leading-relaxed text-[#4f5560]">
                {homepageContent.about_highlight}
              </p>

              <p className="text-xl font-medium leading-relaxed text-[#42454c]">
                {homepageContent.about_closing}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4b8e9a] px-8 py-4 text-base font-medium text-white shadow-lg shadow-[#4b8e9a]/20 transition hover:bg-[#3e7882]">
                Discover My Approach
                <ArrowRight className="h-5 w-5" />
              </button>

              <button className="inline-flex items-center justify-center rounded-2xl border-2 border-[#6d7bbb] px-8 py-4 text-base font-medium text-[#5f6db0] shadow-sm transition hover:bg-white/60">
                Get in Touch
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-6 border-t border-[#cdd8e7] pt-10">
              <div>
                <p className="mb-1 text-3xl font-light text-[#926ab9]">15+</p>
                <p className="text-sm text-[#61656d]">Years Experience</p>
              </div>
              <div>
                <p className="mb-1 text-3xl font-light text-[#6d7bbb]">500+</p>
                <p className="text-sm text-[#61656d]">Clients Helped</p>
              </div>
              <div>
                <p className="mb-1 text-3xl font-light text-[#4b8e9a]">100%</p>
                <p className="text-sm text-[#61656d]">Confidential</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="my-work" className="bg-white/75 px-6 py-24 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
                Services
              </p>
              <h2 className="mt-4 text-[1.8rem] font-semibold leading-tight text-[#42454c] sm:text-[2rem] lg:text-[2.35rem]">
                {homepageContent.services_heading}
              </h2>
              <p className="mt-5 max-w-md text-[0.95rem] leading-7 text-[#5c6069] lg:text-base">
                {homepageContent.services_subheading}
              </p>
              <p className="mt-5 max-w-md text-[0.92rem] leading-7 text-[#6a6e77] lg:text-[0.98rem]">
                Support is tailored to your needs, goals, and circumstances,
                with options for personal counselling, recovery-focused support,
                and professional supervision.
              </p>
            </div>

            <div>
              <div className="space-y-8">
                {primarySupportAreas.map((service, index) => (
                  <article key={service.title}>
                    <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-6">
                      <div className="flex items-baseline gap-3 sm:block">
                        <p className="text-[1.25rem] font-light tracking-[0.08em] text-[#8f72bb] sm:text-[1.5rem]">
                          {service.number}
                        </p>
                        <div className="h-px w-10 bg-[#d7ddea] sm:mt-4 sm:w-12" />
                      </div>

                      <div>
                        <h3 className="text-[1.28rem] font-semibold leading-tight text-[#42454c] sm:text-[1.42rem] lg:text-[1.5rem]">
                          {service.title}
                        </h3>
                        <p className="mt-3 max-w-3xl text-[0.95rem] leading-7 text-[#5d6169] lg:text-base lg:leading-8">
                          {service.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          {service.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-[#eef1f6] px-3 py-1.5 text-[0.78rem] font-medium text-[#5c6069]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {index < primarySupportAreas.length - 1 && (
                      <div className="mt-8 h-px bg-[linear-gradient(90deg,rgba(146,106,185,0.18),rgba(109,123,187,0.14),rgba(75,142,154,0.12),transparent)]" />
                    )}
                  </article>
                ))}
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2">
                {secondarySupportInfo.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[1.6rem] border border-[#d9deeb] bg-[#f7f8fa] px-6 py-6"
                  >
                    <p className="text-[1.05rem] font-semibold text-[#42454c] sm:text-[1.12rem]">
                      {item.title}
                    </p>
                    <p className="mt-3 text-[0.92rem] leading-7 text-[#61656d]">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-transparent px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
                Goals, Values, Vision
              </p>
              <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-tight text-[#42454c] sm:text-5xl">
                About
                <br />
                <span className="text-[#926ab9]">Ability to Thrive</span>
              </h2>

              <div className="mt-10 flex items-center gap-4">
                <div className="h-px w-16 bg-[#926ab9]" />
                <div className="h-px w-24 bg-[#7ea6d8]" />
                <div className="h-px w-10 bg-[#4b8e9a]" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[22px] top-0 hidden h-full w-px bg-[linear-gradient(180deg,rgba(146,106,185,0.35),rgba(126,166,216,0.35),rgba(75,142,154,0.35))] md:block" />

              <div className="space-y-8">
                <article className="relative rounded-[2rem] bg-white/60 p-8 backdrop-blur-sm md:ml-12">
                  <div className="absolute left-[-3.65rem] top-10 hidden h-6 w-6 rounded-full border-4 border-[#eeeff2] bg-[#926ab9] md:block" />
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#926ab9]">
                    {homepageContent.goals_label}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-[#42454c]">
                    {homepageContent.goals_heading}
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-[#5d6169]">
                    {homepageContent.goals_body}
                  </p>
                </article>

                <article className="relative rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(220,233,248,0.75))] p-8 backdrop-blur-sm md:mr-8 md:ml-24">
                  <div className="absolute left-[-4.4rem] top-10 hidden h-6 w-6 rounded-full border-4 border-[#eeeff2] bg-[#4b8e9a] md:block" />
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#4b8e9a]">
                    {homepageContent.vision_label}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-[#42454c]">
                    {homepageContent.vision_heading}
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-[#5d6169]">
                    {homepageContent.vision_body}
                  </p>
                </article>

                <article className="relative rounded-[2rem] bg-[#42454c] p-8 text-white md:ml-12">
                  <div className="absolute left-[-3.65rem] top-10 hidden h-6 w-6 rounded-full border-4 border-[#eeeff2] bg-[#7ea6d8] md:block" />
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7ea6d8]">
                    {homepageContent.values_label}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">
                    {homepageContent.values_heading}
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-white/78">
                    {homepageContent.values_body}
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-transparent px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#42454c] sm:text-4xl">
              {homepageContent.testimonials_heading}
            </h2>
          </div>

          {testimonials.length ? (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.id}
                  className={`${testimonial.bgClass} rounded-2xl border border-white/60 p-10 shadow-sm backdrop-blur-sm`}
                >
                  {testimonial.quote.length > TESTIMONIAL_PREVIEW_LENGTH ? (
                    <details className="group">
                      <summary className="list-none cursor-pointer [&::-webkit-details-marker]:hidden">
                        <p className="italic leading-relaxed text-[#595d66] group-open:hidden">
                          &quot;{getTestimonialPreview(testimonial.quote)}&quot;
                        </p>
                        <p className="hidden italic leading-relaxed text-[#595d66] group-open:block">
                          &quot;{testimonial.quote}&quot;
                        </p>
                        <span className="mt-5 inline-flex text-sm font-medium text-[#4b8e9a] transition hover:text-[#926ab9] group-open:hidden">
                          Read more
                        </span>
                        <span className="mt-5 hidden text-sm font-medium text-[#4b8e9a] transition hover:text-[#926ab9] group-open:inline-flex">
                          Show less
                        </span>
                      </summary>
                    </details>
                  ) : (
                    <p className="italic leading-relaxed text-[#595d66]">
                      &quot;{testimonial.quote}&quot;
                    </p>
                  )}

                  <p className="mt-6 text-[#4b8e9a]">- {testimonial.author}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-[#d8dfeb] bg-white/70 px-6 py-5 text-center text-sm text-[#5d6169]">
              No public testimonials have been selected yet.
            </p>
          )}
        </div>
      </section>

      <section className="bg-[#42454c] px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {homepageContent.cta_heading}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
            {homepageContent.cta_body}
          </p>

          <div className="mt-10">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-xl bg-[#926ab9] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#7d58a3]"
            >
              {homepageContent.cta_button_label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
