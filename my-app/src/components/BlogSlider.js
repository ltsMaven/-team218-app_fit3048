"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

function getCardAccent(index) {
  return index % 3 === 1
    ? {
        shell:
          "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(220,233,248,0.82))]",
        overlay: "bg-[linear-gradient(135deg,#7ea6d8,#4b8e9a)]",
      }
    : index % 3 === 2
      ? {
          shell:
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(238,239,242,0.92))]",
          overlay: "bg-[linear-gradient(135deg,#4b8e9a,#6d7bbb)]",
        }
      : {
          shell:
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,239,248,0.76))]",
          overlay: "bg-[linear-gradient(135deg,#926ab9,#6d7bbb)]",
        };
}

export default function BlogSlider({ blogs = [], showHeader = true }) {
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

  const cardsPerView = Math.min(visibleCards, Math.max(blogs.length, 1));
  const maxIndex = Math.max(0, blogs.length - cardsPerView);
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

  if (!blogs.length) {
    return (
      <p className="rounded-2xl border border-[#d8dfeb] bg-white/70 px-6 py-5 text-center text-sm text-[#5d6169]">
        No published blogs are available yet.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {showHeader ? (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6d7bbb]">
              Latest Articles
            </p>
            <p className="mt-2 text-sm text-[#5d6169]">
              Swipe or tap through recent writing without leaving the page.
            </p>
          </div>

          {totalSlides > 1 ? (
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => goToSlide(safeCurrentIndex - 1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dfeb] bg-white/85 text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
                aria-label="Previous blog slides"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goToSlide(safeCurrentIndex + 1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dfeb] bg-white/85 text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
                aria-label="Next blog slides"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      ) : totalSlides > 1 ? (
        <div className="flex justify-end">
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => goToSlide(safeCurrentIndex - 1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dfeb] bg-white/85 text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
              aria-label="Previous blog slides"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goToSlide(safeCurrentIndex + 1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dfeb] bg-white/85 text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
              aria-label="Next blog slides"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={`${showHeader ? "mt-8" : "mt-6"} overflow-hidden`}
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
          {blogs.map((blog, index) => {
            const accent = getCardAccent(index);

            return (
              <div
                key={blog.id}
                className="shrink-0 px-3 pb-4"
                style={{ flexBasis: `${cardWidth}%` }}
              >
                <Link
                  href={`/blogs/${blog.slug}`}
                  className={`block h-full overflow-hidden rounded-[2rem] border border-[#d8dfeb] shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(66,69,76,0.1)] ${accent.shell}`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <div className={`absolute inset-0 ${accent.overlay}`} />
                    <div className="absolute inset-x-0 bottom-0 h-14 rounded-tl-[2rem] bg-white/96" />
                    <div className="absolute inset-x-6 top-6 bottom-7 overflow-hidden rounded-[1.6rem] border border-white/40 shadow-[0_16px_36px_rgba(66,69,76,0.16)]">
                      {blog.imageUrl ? (
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.32),rgba(255,255,255,0.08))] px-8 text-center">
                          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/90">
                            {blog.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex min-h-[19rem] flex-col px-7 pb-8 pt-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="rounded-full bg-white/80 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
                        {blog.category}
                      </span>
                      <span className="text-sm text-[#6a6e77]">{blog.readTime}</span>
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold leading-tight text-[#42454c]">
                      {blog.title}
                    </h3>

                    <p className="mt-4 line-clamp-4 text-[0.98rem] leading-8 text-[#5d6169]">
                      {blog.excerpt}
                    </p>

                    <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-[#4b8e9a] transition hover:text-[#926ab9]">
                      View article
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
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
              aria-label={`Go to blog slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
