"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about-me", label: "About Me" },
  { href: "/services", label: "Services" },
  { href: "/enquiry", label: "Enquiry" },
];

export default function Navbar({ authEnabled = false }) {
  const { user, isLoading } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeMenu = () => setIsMobileMenuOpen(false);
    window.addEventListener("resize", closeMenu);

    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-4 py-4 sm:px-6">
      <div
        className={`mx-auto w-full max-w-6xl transition-all duration-300 ${
          isScrolled ? "max-w-5xl" : "max-w-6xl"
        }`}
      >
        <div
          className={`rounded-full border backdrop-blur-xl transition-all duration-300 ${
            isScrolled
              ? "border-white/70 bg-[#eeeff2]/92 px-4 py-3 shadow-[0_18px_40px_rgba(66,69,76,0.12)]"
              : "border-white/50 bg-white/68 px-5 py-4 shadow-[0_10px_30px_rgba(66,69,76,0.08)]"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 text-[#42454c] transition hover:text-[#926ab9]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#926ab9,#6d7bbb,#4b8e9a)] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(109,123,187,0.28)]">
                AT
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-medium uppercase tracking-[0.25em] text-[#6d7bbb]">
                  Ability
                </span>
                <span className="block text-base font-semibold tracking-tight sm:text-lg">
                  To Thrive
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-[#5f6470] transition hover:bg-white/75 hover:text-[#926ab9]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/booking"
                className="rounded-full bg-[#926ab9] px-5 py-2.5 text-sm font-medium text-white shadow-[0_14px_30px_rgba(146,106,185,0.25)] transition hover:bg-[#7d58a3]"
              >
                Book a Session
              </Link>
              {!authEnabled || isLoading ? null : user ? (
                <>
                  <Link
                    href="/admin"
                    className="rounded-full border border-[#d8dfeb] bg-white/70 px-5 py-2.5 text-sm font-medium text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
                  >
                    Admin
                  </Link>
                  <a
                    href="/auth/logout"
                    className="rounded-full border border-[#d8dfeb] bg-white/70 px-5 py-2.5 text-sm font-medium text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
                  >
                    Logout
                  </a>
                </>
              ) : (
                <a
                  href="/auth/login?returnTo=/admin"
                  className="rounded-full border border-[#d8dfeb] bg-white/70 px-5 py-2.5 text-sm font-medium text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
                >
                  Login
                </a>
              )}
            </div>

            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dfeb] bg-white/70 text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9] md:hidden"
            >
              <span className="relative flex h-4 w-5 flex-col justify-between">
                <span
                  className={`block h-0.5 w-full rounded-full bg-current transition ${
                    isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-full rounded-full bg-current transition ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-full rounded-full bg-current transition ${
                    isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 md:hidden ${
              isMobileMenuOpen ? "max-h-96 pt-4" : "max-h-0"
            }`}
          >
            <div className="space-y-2 border-t border-[#d8dfeb] pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-[#5f6470] transition hover:bg-white/80 hover:text-[#926ab9]"
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full bg-[#926ab9] px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-[#7d58a3]"
                >
                  Book a Session
                </Link>
                {!authEnabled || isLoading ? null : user ? (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-full border border-[#d8dfeb] bg-white/70 px-4 py-3 text-center text-sm font-medium text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
                    >
                      Admin
                    </Link>
                    <a
                      href="/auth/logout"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-full border border-[#d8dfeb] bg-white/70 px-4 py-3 text-center text-sm font-medium text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
                    >
                      Logout
                    </a>
                  </>
                ) : (
                  <a
                    href="/auth/login?returnTo=/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-full border border-[#d8dfeb] bg-white/70 px-4 py-3 text-center text-sm font-medium text-[#42454c] transition hover:border-[#926ab9] hover:text-[#926ab9]"
                  >
                    Login
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
