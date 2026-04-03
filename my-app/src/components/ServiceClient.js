import Link from "next/link";
import {ArrowRight, ShieldCheck, Sparkles, GraduationCap, HeartHandshake, Check, Heart, HandHeart, Users, Briefcase, Rainbow} from "lucide-react";

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

export default function ServiceClient() {
  return (
    <div className="min-h-screen bg-transparent pb-24">
      <section className="px-6 pb-20 mt-5">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-semibold leading-tight text-[#42454c] sm:text-5xl lg:text-6xl">
              Services
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#5c6069]">
              Support options tailored to where you are now, with session
              pricing and a direct path to book.
            </p>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isFeatured = index === 1 || index === 3;

              return (
                <article
                  key={service.title}
                  className={`relative flex w-full md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)] xl:max-w-[24rem] flex-col rounded-[2rem] border p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${isFeatured
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
