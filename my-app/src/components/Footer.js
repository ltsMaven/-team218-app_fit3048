export default function Footer() {
  return (
    <footer className="bg-[#f7f7f5] text-[#4b4b4b]">
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-5">
            <h3 className="text-2xl font-semibold text-[#2f3a2f]">
              Dr. Sarah Mitchell
            </h3>
            <p className="max-w-md text-lg leading-9 text-[#5c5c5c]">
              Licensed Clinical Psychologist specializing in anxiety,
              depression, and relationship therapy.
            </p>
          </div>

          <div className="space-y-5">
            <h3 className="text-2xl font-semibold text-[#2f3a2f]">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-4 text-lg text-[#5c5c5c]">
              <a href="#about" className="transition hover:text-[#2f3a2f]">
                About
              </a>
              <a href="#services" className="transition hover:text-[#2f3a2f]">
                My Work
              </a>
              <a href="#book" className="transition hover:text-[#2f3a2f]">
                Book Session
              </a>
            </nav>
          </div>

          <div className="space-y-5">
            <h3 className="text-2xl font-semibold text-[#2f3a2f]">Contact</h3>
            <div className="space-y-4 text-lg text-[#5c5c5c]">
              <p>Email: sarah@counseling.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[#e5e5e0] pt-8 text-center">
          <p className="text-lg text-[#6a6a6a]">
            © 2026 Dr. Sarah Mitchell. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
