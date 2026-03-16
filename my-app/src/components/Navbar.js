import Link from "next/link";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about-me", label: "About Me" },
  { href: "#my-work", label: "My Work" },
  { href: "#blogs", label: "Blogs" },
];

export default function Navbar() {
  return (
    <header className="border-b border-white/30 bg-[#eeeff2]/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[#42454c]">
          Ability To Thrive
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#5f6470] transition hover:text-[#926ab9]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
