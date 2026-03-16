export default function Footer() {
  return (
    <footer className="bg-[#eeeff2] text-[#4b4b4b]">
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-5">
            <h3 className="text-2xl font-semibold text-[#42454c]">
              Dr. Samantha
            </h3>
            <p className="max-w-md text-lg leading-9 text-[#5d6169]">
              Licensed Clinical Psychologist specializing in anxiety,
              depression, and relationship therapy.
            </p>
          </div>

          <div className="space-y-5">
            <h3 className="text-2xl font-semibold text-[#42454c]">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-4 text-lg text-[#5d6169]">
              <a href="#about-me" className="transition hover:text-[#926ab9]">
                About
              </a>
              <a href="#my-work" className="transition hover:text-[#6d7bbb]">
                My Work
              </a>
              <a href="/book" className="transition hover:text-[#4b8e9a]">
                Book Session
              </a>
            </nav>
          </div>

          <div className="space-y-5">
            <h3 className="text-2xl font-semibold text-[#42454c]">Contact</h3>
            <div className="space-y-4 text-lg text-[#5d6169]">
              <p>Email: sarah@counseling.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[#cfd6e2] pt-8 text-center">
          <p className="text-lg text-[#666b75]">
            © 2026 Dr. Sarah Mitchell. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
