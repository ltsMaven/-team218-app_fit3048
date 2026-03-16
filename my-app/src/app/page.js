import Link from "next/link";
import Image from "next/image";
import { Heart, Users, MessageCircle, ArrowRight, Sun } from "lucide-react";

const services = [
  {
    title: "Individual Therapy",
    description:
      "One-on-one sessions focused on anxiety, depression, stress management, and personal growth.",
    icon: Heart,
  },
  {
    title: "Couples Counseling",
    description:
      "Build stronger relationships through improved communication, conflict resolution, and understanding.",
    icon: Users,
  },
  {
    title: "Family Therapy",
    description:
      "Strengthen family bonds and develop healthier patterns of interaction and communication.",
    icon: MessageCircle,
  },
];

const testimonials = [
  {
    quote:
      "Sam was my Counsellor during my stay at Fairhaven in Mt Tambourine.  Going to rehab for the first time in my life was extremely daunting, the thought of being alone and not knowing what to expect I was filled with anxiety!  I was introduced to Sam on my first day and she instantly made me feel safe and at ease.  Not once did I feel ashamed or judged, I was met on a level of understanding and care and throughout my 3 month program Sam was able to help me to open up and release some major trauma that I had buried deep down and I learnt so much more about my addiction and more importantly about myself.  She armed me with the tools I needed to continue my healing journey in the real world. The knowledge and kindness Sam has and her ability to share her own life experience has helped me so much in my recovery journey! This enabled me to have such a positive experience and for that Sam I thank you ❤️",
    author: "Jodie",
    bgClass: "bg-[#eeeff2]",
  },
  {
    quote:
      "I’m a previous client of Samantha’s, I can't praise her enough and highly recommend her as a counsellor. She went above and beyond to help me through several mental health and addiction issues I was experiencing at this time.  She was kind, understanding and very easy to talk to about anything.  Her ability to empathise and guide me through my darkest days will always be in my gratitude and thoughts.  The best ever ❤️",
    author: "Jade",
    bgClass: "bg-white/75",
  },
  {
    quote:
      "I have had the wonderful pleasure of having Samantha as my counselor for a considerable period now. During my time working with Samantha she's been able to guide me through alcoholism and addiction to methamphetamine, broken relationship with my wife and children. She's amazingly empathetic, courteous and professional. Samantha had a far greater idea of my working mind than I did. And it was my absolute pleasure to have her guide me while I was unable to guide myself down the path of the verities of my life.",
    author: "Barry",
    bgClass: "bg-[#dce9f8]",
  },
];

const TESTIMONIAL_PREVIEW_LENGTH = 180;

function getTestimonialPreview(quote) {
  if (quote.length <= TESTIMONIAL_PREVIEW_LENGTH) {
    return quote;
  }

  const trimmed = quote.slice(0, TESTIMONIAL_PREVIEW_LENGTH);
  const lastSpace = trimmed.lastIndexOf(" ");

  return `${trimmed.slice(0, lastSpace > 0 ? lastSpace : trimmed.length)}...`;
}

export default function Home() {
  return (
    <>
      <section
        id="home"
        className="relative isolate flex min-h-[calc(100vh-145px)] items-center overflow-hidden bg-[#42454c]"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="/assets/videos/landing-background.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(66,69,76,0.78),rgba(75,142,154,0.5),rgba(109,123,187,0.42))]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(238,239,242,0.18))]" />

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
                href="/book"
                className="inline-block rounded-full bg-[#926ab9] px-6 py-3 text-sm font-medium text-white shadow-[0_18px_40px_rgba(146,106,185,0.35)] transition hover:bg-[#7d58a3]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="about-me" className="bg-transparent px-6 py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex h-[420px] items-center justify-center rounded-[32px] border border-[#d8dfeb] p-6">
              <Image
                src="/assets/abilityToThriveLogo.webp"
                alt="Ability To Thrive logo"
                width={420}
                height={420}
                className="h-auto max-h-full w-full max-w-[340px] object-contain"
                priority
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7ea6d8]/30 bg-white/70 px-5 py-2 backdrop-blur">
              <Sun className="h-[18px] w-[18px] text-[#4b8e9a]" />
              <span className="text-sm font-medium tracking-wide text-[#42454c]">
                ABOUT MY PRACTICE
              </span>
            </div>

            <h2 className="mb-8 text-4xl font-semibold leading-tight text-[#42454c] sm:text-5xl lg:text-6xl">
              Empowering Clients to{" "}
              <span className="italic text-[#926ab9]">Thrive</span>
            </h2>

            <div className="mb-10 space-y-6">
              <p className="text-xl leading-relaxed text-[#4f5560]">
                As an{" "}
                <span className="font-medium text-[#42454c]">
                  NDIS registered Counsellor, Psychosocial Recovery Coach and
                  Clinical Supervisor
                </span>
                , I offer a compassionate and empathic approach to help clients
                navigate life&apos;s challenges.
              </p>

              <div className="rounded-r-3xl border-l-4 border-[#4b8e9a] bg-white/65 py-4 pl-6 pr-6 shadow-sm">
                <p className="text-lg leading-relaxed text-[#51555e]">
                  Through a safe and non-judgmental space, I work
                  collaboratively to empower people to achieve their goals and
                  improve their mental, emotional, physical, and social
                  well-being in line with their personal goals and values.
                </p>
              </div>

              <p className="text-xl font-medium leading-relaxed text-[#42454c]">
                I believe we all have within us the{" "}
                <span className="text-[#926ab9]">
                  &quot;Ability to Thrive.&quot;
                </span>
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
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#42454c] sm:text-4xl">
              How I Can Help
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#5c6069]">
              Specialized services tailored to support your mental health and
              well-being
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="rounded-3xl border border-[#d9deeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(238,239,242,0.82))] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dce9f8]">
                    <Icon className="h-6 w-6 text-[#4b8e9a]" />
                  </div>

                  <h3 className="text-2xl font-semibold text-[#42454c]">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-base leading-8 text-[#5d6169]">
                    {service.description}
                  </p>
                </article>
              );
            })}
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
                    Goals
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-[#42454c]">
                    Your Journey to Freedom Starts Here.
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-[#5d6169]">
                    Support clients to build resilience, restore confidence, and
                    move toward goals that reflect their own needs, strengths,
                    and personal direction, one realistic step at a time.
                  </p>
                </article>

                <article className="relative rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(220,233,248,0.75))] p-8 backdrop-blur-sm md:mr-8 md:ml-24">
                  <div className="absolute left-[-4.4rem] top-10 hidden h-6 w-6 rounded-full border-4 border-[#eeeff2] bg-[#4b8e9a] md:block" />
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#4b8e9a]">
                    Vision
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-[#42454c]">
                    From Overwhelmed to Empowered.
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-[#5d6169]">
                    Create a space that is safe, non-judgmental, and
                    collaborative, where each person feels heard, supported, and
                    empowered in the work they are doing.
                  </p>
                </article>

                <article className="relative rounded-[2rem] bg-[#42454c] p-8 text-white md:ml-12">
                  <div className="absolute left-[-3.65rem] top-10 hidden h-6 w-6 rounded-full border-4 border-[#eeeff2] bg-[#7ea6d8] md:block" />
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7ea6d8]">
                    Values
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">
                    Optimism That Inspires Change.
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-white/78">
                    Help people recognise their ability to thrive and develop
                    the emotional, mental, and social foundations needed for a
                    more balanced and fulfilling life.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="blogs" className="bg-transparent px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#42454c] sm:text-4xl">
              What Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <article
                key={index}
                className={`${testimonial.bgClass} rounded-2xl border border-white/60 p-10 shadow-sm backdrop-blur-sm`}
              >
                <div className="mb-6 flex text-[#926ab9]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>

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
        </div>
      </section>

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
              href="/book"
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
