import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  fallbackServiceItems,
  fallbackServicesContent,
} from "@/lib/cms-homepage";

export default function ServiceClient({
  content = fallbackServicesContent,
  services = fallbackServiceItems,
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f6] pb-24">
      <section className="px-6 pb-20 pt-8">
        <div className="mx-auto max-w-7xl">
          {/* HERO IMAGE */}
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src="/assets/services/hero-services.png"
              alt="Services hero"
              className="h-[220px] w-full object-cover sm:h-[280px] lg:h-[320px]"
            />
          </div>

          {/* HEADING */}
          <div className="mx-auto mt-10 max-w-4xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-[#42454c] sm:text-5xl lg:text-6xl">
              {content.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[#5c6069]">
              {content.intro}
            </p>
          </div>

          {/* TOP 3 CARDS */}
          <div className="mt-14 grid grid-cols-1 gap-8 xl:grid-cols-3">
            {services.slice(0, 3).map((service, index) => (
              <article
                key={service.id || service.title}
                className="overflow-hidden rounded-[2rem] border border-[#dde3ea] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
              >
                <div className="p-4 pb-0">
                  <div className="overflow-hidden rounded-[1.4rem]">
                    <img
                      src={
                        service.image_url ||
                        `/assets/services/service-${index + 1}.png`
                      }
                      alt={service.title}
                      className="h-44 w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                </div>

                <div className="p-8 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a85c4]">
                    {service.label}
                  </p>

                  <h3 className="mt-3 text-[2rem] font-semibold leading-tight text-[#42454c]">
                    {service.title}
                  </h3>

                  <p className="mt-5 text-base leading-8 text-[#5d6169]">
                    {service.description}
                  </p>

                  <div className="mt-6 h-px w-full bg-[#e2e7ee]" />

                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-4xl font-semibold tracking-tight text-[#42454c]">
                        {service.price}
                      </p>
                      <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-[#8f72bb]">
                        {service.price_detail}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {(service.features || []).map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 text-sm leading-6 text-[#58606b]"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#decdf0] bg-[#faf7fd]">
                          <Check className="h-3.5 w-3.5 text-[#8f72bb]" />
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* BOTTOM 2 CARDS */}
          {services.length > 3 && (
            <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
              {services.slice(3).map((service, index) => (
                <article
                  key={service.id || service.title}
                  className="overflow-hidden rounded-[2rem] border border-[#dde3ea] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
                >
                  <div className="p-4 pb-0">
                    <div className="overflow-hidden rounded-[1.4rem]">
                      <img
                        src={
                          service.image_url ||
                          `/assets/services/service-${index + 4}.png`
                        }
                        alt={service.title}
                        className="h-36 w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 p-8 pt-5 md:grid-cols-[1.25fr_auto_0.9fr]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a85c4]">
                        {service.label}
                      </p>

                      <h3 className="mt-3 text-[2rem] font-semibold leading-tight text-[#42454c]">
                        {service.title}
                      </h3>

                      <p className="mt-5 text-base leading-8 text-[#5d6169]">
                        {service.description}
                      </p>
                    </div>

                    {/* VERTICAL DIVIDER */}
                    <div className="hidden md:block w-px bg-[#e2e7ee]" />

                    <div className="flex flex-col justify-between">
                      <div>
                      
                        <div className="h-px w-full bg-[#e2e7ee] md:hidden" />
                        <div className="mt-1 md:mt-0">
                          <p className="text-4xl font-semibold tracking-tight text-[#42454c]">
                            {service.price}
                          </p>
                          <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-[#8f72bb]">
                            {service.price_detail}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        {(service.features || []).map((feature) => (
                          <div
                            key={feature}
                            className="flex items-start gap-3 text-sm leading-6 text-[#58606b]"
                          >
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#decdf0] bg-[#faf7fd]">
                              <Check className="h-3.5 w-3.5 text-[#8f72bb]" />
                            </span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/booking"
              className="inline-flex min-w-[240px] items-center justify-center gap-2 rounded-full bg-[#9a72c5] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#865fb0]"
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
