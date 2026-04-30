"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  fallbackServiceItems,
  fallbackServicesContent,
} from "@/lib/cms-homepage";

const SWIPE_THRESHOLD = 50;

function getVisibleCards(width) {
  if (width < 640) {
    return 1;
  }

  if (width < 1024) {
    return 2;
  }

  return 3;
}

function ServiceCard({ service, index }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#dde3ea] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]">
      <div className="p-4 pb-0">
        <div className="overflow-hidden rounded-[1.4rem]">
          <img
            src={service.image_url || `/assets/services/service-${index + 1}.png`}
            alt={service.title}
            className="h-44 w-full object-cover transition duration-500 hover:scale-105"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-8 pt-5">
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

        <div className="mt-6">
          <p className="text-4xl font-semibold tracking-tight text-[#42454c]">
            {service.price}
          </p>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-[#8f72bb]">
            {service.price_detail}
          </p>
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
  );
}

export default function ServiceClient({
  content = fallbackServicesContent,
  services = fallbackServiceItems,
}) {
  const [visibleCards, setVisibleCards] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  useEffect(() => {
    function updateVisibleCards() {
      setVisibleCards(getVisibleCards(window.innerWidth));
    }

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);

    return () => {
      window.removeEventListener("resize", updateVisibleCards);
    };
  }, []);

  const cardsPerView = Math.min(visibleCards, Math.max(services.length, 1));
  const maxIndex = Math.max(0, services.length - cardsPerView);
  const totalSlides = maxIndex + 1;
  const cardWidth = 100 / cardsPerView;
  const safeCurrentIndex = Math.min(currentIndex, maxIndex);

  function goToSlide(index) {
    if (!totalSlides) {
      return;
    }

    if (index < 0) {
      setCurrentIndex(maxIndex);
      return;
    }

    if (index > maxIndex) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex(index);
  }

  function handleTouchStart(event) {
    touchStartXRef.current = event.changedTouches[0]?.clientX || 0;
    touchEndXRef.current = touchStartXRef.current;
  }

  function handleTouchMove(event) {
    touchEndXRef.current = event.changedTouches[0]?.clientX || 0;
  }

  function handleTouchEnd() {
    const delta = touchStartXRef.current - touchEndXRef.current;

    if (Math.abs(delta) < SWIPE_THRESHOLD) {
      return;
    }

    if (delta > 0) {
      goToSlide(safeCurrentIndex + 1);
      return;
    }

    goToSlide(safeCurrentIndex - 1);
  }

  return (
    <div className="min-h-screen bg-[#f7f7f6] pb-24">
      <section className="px-6 pb-20 pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src="/assets/services/hero-services.png"
              alt="Services hero"
              className="h-[220px] w-full object-cover sm:h-[280px] lg:h-[320px]"
            />
          </div>

          <div className="mx-auto mt-10 max-w-4xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-[#42454c] sm:text-5xl lg:text-6xl">
              {content.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-[#5c6069]">
              {content.intro}
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-6xl">
            {totalSlides > 1 ? (
              <div className="mb-6 flex justify-end">
                <div className="hidden items-center gap-2 md:flex">
                  <button
                    type="button"
                    onClick={() => goToSlide(safeCurrentIndex - 1)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dfeb] bg-white/85 text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
                    aria-label="Previous service slides"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSlide(safeCurrentIndex + 1)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dfeb] bg-white/85 text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
                    aria-label="Next service slides"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}

            <div
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${safeCurrentIndex * cardWidth}%)`,
                }}
              >
                {services.map((service, index) => (
                  <div
                    key={service.id || service.title}
                    className="shrink-0 px-3 pb-4"
                    style={{ flexBasis: `${cardWidth}%` }}
                  >
                    <ServiceCard service={service} index={index} />
                  </div>
                ))}
              </div>
            </div>

            {totalSlides > 1 ? (
              <div className="mt-6 flex items-center justify-center gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`h-2.5 rounded-full transition ${
                      index === safeCurrentIndex
                        ? "w-8 bg-[#926ab9]"
                        : "w-2.5 bg-[#c7d4e7] hover:bg-[#7ea6d8]"
                    }`}
                    aria-label={`Go to service slide ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>

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
