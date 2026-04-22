import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Check,
  HandHeart,
  Heart,
  HeartHandshake,
  Users,
} from "lucide-react";
import {
  fallbackServiceItems,
  fallbackServicesContent,
} from "@/lib/cms-homepage";

const iconMap = {
  briefcase: Briefcase,
  "hand-heart": HandHeart,
  heart: Heart,
  "heart-handshake": HeartHandshake,
  users: Users,
};

export default function ServiceClient({
  content = fallbackServicesContent,
  services = fallbackServiceItems,
}) {
  return (
    <div className="min-h-screen bg-transparent pb-24">
      <section className="px-6 pb-20 mt-5">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-semibold leading-tight text-[#42454c] sm:text-5xl lg:text-6xl">
              {content.heading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#5c6069]">
              {content.intro}
            </p>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-6">
            {services.map((service) => {
              const Icon = iconMap[service.icon_key] || Heart;

              return (
                <article
                  key={service.id || service.title}
                  className={`relative flex w-full md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)] xl:max-w-[24rem] flex-col rounded-[2rem] border p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                    service.is_featured
                      ? "border-[#926ab9]/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,239,248,0.94))]"
                      : "border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(238,239,242,0.82))]"
                  }`}
                >
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
                      {service.price_detail}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    {(service.features || []).map((feature) => (
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
              {content.cta_button_label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
