import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  HeartHandshake,
  Check,
  Heart,
  HandHeart,
  Users,
  Briefcase,
  Rainbow,
} from "lucide-react";

const services = [
  {
    title: "Individual Counselling",
    label: "Personal Support",
    price: "$85",
    priceDetail: "per 60 min session",
    description:
      "A safe, compassionate, and confidential space to explore personal challenges, build emotional resilience, and work towards meaningful change. Support is tailored to your needs, whether you are navigating stress, trauma, grief, or other life difficulties.",
    icon: Heart,
    tint: "bg-[#eaf3f5]",
    accent: "text-[#4b8e9a]",
    features: [
      "One-on-one support tailored to your needs",
      "A safe space to explore emotions and challenges",
      "Support for trauma, grief, stress, and life changes",
    ],
  },
  {
    title: "Couples Counselling",
    label: "Relationship Support",
    price: "$150",
    priceDetail: "per 60 min session",
    description:
      "A supportive space for couples to strengthen communication, work through conflict, and rebuild connection. Sessions focus on helping both individuals feel heard, understood, and better equipped to move forward together in a healthier way.",
    icon: Users,
    tint: "bg-[#f4eff8]",
    accent: "text-[#926ab9]",
    features: [
      "Improve communication and understanding",
      "Work through conflict in a respectful space",
      "Rebuild trust and strengthen connection",
    ],
  },
  {
    title: "General Counselling",
    label: "Emotional Wellbeing",
    price: "$80",
    priceDetail: "per 60 min session",
    description:
      "Compassionate counselling support for a wide range of life experiences, including trauma, grief, domestic and family violence, stress, and emotional overwhelm. The focus is on creating a safe and grounded space where you feel heard, supported, and empowered.",
    icon: HandHeart,
    tint: "bg-[#edf0f7]",
    accent: "text-[#6d7bbb]",
    features: [
      "Support for trauma, grief, and emotional distress",
      "A grounded and compassionate space to talk",
      "Help to build coping strategies and confidence",
    ],
  },
  {
    title: "Clinical Supervision",
    label: "Professional Support",
    price: "$82.50",
    priceDetail: "per 60 min session",
    description:
      "Clinical supervision in a safe, supportive, and collaborative space that encourages reflection, professional growth, and stronger clinical practice. Designed to help practitioners explore their work, build confidence, gain new perspectives, and develop ethical and effective practice.",
    icon: HeartHandshake,
    tint: "bg-[#dce9f8]",
    accent: "text-[#4b8e9a]",
    features: [
      "Reflect on client work and clinical decision-making",
      "Enhance your skills and therapeutic approach",
      "Navigate ethical dilemmas and professional boundaries",
      "Manage workplace stress and reduce burnout",
      "Build confidence and maintain professional wellbeing",
    ],
  },
  {
    title: "Psychosocial Recovery Coaching",
    label: "Recovery Support",
    price: "$99",
    priceDetail: "per 60 min session",
    description:
      "Compassionate, person-centred support to help build confidence, strengthen daily living skills, and work towards personal recovery goals. Focused on improving wellbeing, increasing independence, and reconnecting with community in a safe, respectful, and empowering way.",
    icon: Briefcase,
    tint: "bg-[#f5efe6]",
    accent: "text-[#8b6c4f]",
    features: [
      "Goal setting and recovery planning",
      "Building capacity for daily living and independency",
      "Strengthening social and community connections",
      "Coordinating and working collaboratively with your support network",
      "Developing strategies to manage challenges and maintain wellbeing",
    ],
  },
];

export default function ExpertisePage() {
  return (
    <div className="min-h-screen bg-transparent pb-24">
      <section className="px-6 pt-24 pb-16 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#926ab9]/30 bg-white/60 px-5 py-2 backdrop-blur-sm">
            <ShieldCheck className="h-[18px] w-[18px] text-[#926ab9]" />
            <span className="text-sm font-medium tracking-wide text-[#42454c] uppercase">
              Specialized Care
            </span>
          </div>

          <h1 className="text-4xl font-semibold leading-tight text-[#42454c] sm:text-5xl lg:text-6xl mb-6">
            Expertise &{" "}
            <span className="italic text-[#4b8e9a]">Philosophy</span>
          </h1>
          <p className="text-lg leading-relaxed text-[#5c6069]">
            Comprehensive support including substance abuse counselling and
            dedicated LGBTQIA+ advocacy.
          </p>
        </div>
      </section>

      <section className="px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <article className="md:col-span-5 rounded-[2rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(238,239,242,0.6))] p-10 shadow-sm backdrop-blur-md flex flex-col justify-between transition hover:shadow-md">
              <div>
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf3f5]">
                  <Sparkles className="h-6 w-6 text-[#4b8e9a]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#42454c] mb-6">
                  My Philosophy
                </h2>
                <p className="text-base leading-8 text-[#5d6169]">
                  I believe that everyone has the potential to live a fulfilling
                  and meaningful life. By identifying and working towards their
                  goals, my clients are able to unlock their full potential and
                  create a life they love.
                </p>
                <div className="mt-6 h-px w-12 bg-[#4b8e9a]/30" />
                <p className="mt-6 text-base leading-8 text-[#5d6169]">
                  I have extensive experience in working with clients to address
                  challenges and barriers through substance abuse counselling,
                  relationship counselling and the support provided as an
                  LGBTQIA+ counsellor.
                </p>
              </div>
            </article>

            <div className="md:col-span-7 flex flex-col gap-6">
              <article className="flex-grow rounded-[2rem] border border-[#d8dfeb] bg-white/70 p-10 shadow-sm backdrop-blur-md transition hover:shadow-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4eff8]">
                    <GraduationCap className="h-6 w-6 text-[#926ab9]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#42454c]">
                    My Background
                  </h2>
                </div>
                <p className="text-base leading-8 text-[#5d6169]">
                  I have over{" "}
                  <span className="font-semibold text-[#926ab9]">
                    15 years of experience
                  </span>{" "}
                  as a counsellor and life coach providing support with
                  substance abuse counselling, trauma and relationship
                  counselling, criminal and legal issues. I have also provided
                  support to people with disabilities and their carers and
                  people in the LGBTQIA+ community. I have helped my clients
                  achieve their goals and improve their overall well-being. My
                  approach is holistic and tailored to each individual's unique
                  needs.
                </p>
              </article>

              <div className="rounded-[2rem] border border-white/40 bg-[#dce9f8]/40 p-8 backdrop-blur-sm">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#6d7bbb] mb-4">
                  Core Focus Areas
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Substance Abuse",
                    "LGBTQIA+ Support",
                    "Trauma",
                    "Relationships",
                    "NDIS / Disabilities",
                    "Legal & Criminal Challenges",
                  ].map((tag) => (
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

      <section className="px-6 pt-24 mb-2">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2.5rem] bg-[#42454c] p-10 md:p-16 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-[#6d7bbb] opacity-20 blur-3xl pointer-events-none" />

            <div className="mb-12 flex items-center gap-4">
              <HeartHandshake className="h-8 w-8 text-[#7ea6d8]" />
              <h2 className="text-3xl font-semibold text-white">
                My Experience
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <p className="text-5xl font-light text-[#7ea6d8]">
                  13<span className="text-2xl">yrs</span>
                </p>
                <h3 className="text-lg font-medium text-white">
                  Residential Rehab
                </h3>
                <p className="text-white/75 leading-relaxed text-sm">
                  Working as a counsellor, case manager and life coach in a
                  residential rehabilitation setting. This provided a wealth of
                  skills working with people experiencing substance misuse
                  issues, coexisting mental health diagnoses, and related
                  traumas including legal, personal, family and relationship
                  challenges.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-5xl font-light text-[#926ab9]">
                  2<span className="text-2xl">yrs</span>
                </p>
                <h3 className="text-lg font-medium text-white">
                  NDIS & Advocacy
                </h3>
                <p className="text-white/75 leading-relaxed text-sm">
                  Working in the NDIS space providing support to people with
                  disabilities and their families in both a counselling and
                  advocate role. This has provided me with a wealth of knowledge
                  and understanding of the unique challenges experienced within
                  the family system.
                </p>
              </div>

              <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10">
                <h3 className="text-lg font-medium text-white">
                  Wrap-Around Support
                </h3>
                <p className="text-white/75 leading-relaxed text-sm">
                  I am here to support you in your journey through providing a
                  holistic approach and wrap around support with substance abuse
                  counselling, relationship counselling and as an LGBTQIA+
                  counsellor to those in the community. Reach out today and free
                  yourself from the challenges that keep you stuck.
                </p>
                <div className="pt-4">
                  <Link
                    href="/enquiry"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#4b8e9a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3e7882]"
                  >
                    Contact Us
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-6 pb-20 mt-5">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-semibold leading-tight text-[#42454c] sm:text-5xl lg:text-6xl">
              Services
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#5c6069]">
              Support options tailored to where you are now, with session
              pricing and a direct path to book.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isFeatured = index === 1 || index === 3;

              return (
                <article
                  key={service.title}
                  className={`relative flex h-full flex-col rounded-[2rem] border p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                    isFeatured
                      ? "border-[#926ab9]/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,239,248,0.94))]"
                      : "border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(238,239,242,0.82))]"
                  }`}
                >
                  {isFeatured ? (
                    <span className="absolute right-6 top-6 rounded-full bg-[#926ab9] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                      Popular
                    </span>
                  ) : null}

                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${service.tint}`}
                  >
                    <Icon className={`h-6 w-6 ${service.accent}`} />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d7bbb]">
                    {service.label}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-[#42454c]">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-[#5d6169]">
                    {service.description}
                  </p>

                  <div className="mt-6 h-px w-full bg-[#d8dfeb]" />

                  <div className="mt-6">
                    <p className="text-4xl font-semibold tracking-tight text-[#42454c]">
                      {service.price}
                    </p>
                    <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-[#6d7bbb]">
                      {service.priceDetail}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 text-sm text-[#4f5560]"
                      >
                        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                          <Check className="h-3.5 w-3.5 text-[#4b8e9a]" />
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#926ab9] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#7d58a3]"
            >
              Book a Session
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
