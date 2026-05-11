import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import Image from "next/image";

const publicFooterLinks = [
  { href: "/about-me", label: "About Me", hoverClass: "hover:text-[#926ab9]" },
  { href: "/services", label: "Services", hoverClass: "hover:text-[#6d7bbb]" },
  { href: "/enquiry", label: "Enquiry", hoverClass: "hover:text-[#4b8e9a]" },
  { href: "/blogs", label: "Blogs", hoverClass: "hover:text-[#4b8e9a]" },
  {
    href: "/booking",
    label: "Book a Session",
    hoverClass: "hover:text-[#926ab9]",
  },
];

const adminFooterLinks = [
  { href: "/admin", label: "Dashboard", hoverClass: "hover:text-[#926ab9]" },
  {
    href: "/admin/business-statistics",
    label: "Business Statistics",
    hoverClass: "hover:text-[#6d7bbb]",
  },
  {
    href: "/admin/enquiry",
    label: "Enquiries",
    hoverClass: "hover:text-[#4b8e9a]",
  },
  { href: "/admin/cms", label: "CMS", hoverClass: "hover:text-[#926ab9]" },
  {
    href: "/admin/testimonial",
    label: "Testimonial",
    hoverClass: "hover:text-[#6d7bbb]",
  },
  {
    href: "/admin/blogs",
    label: "Blogs",
    hoverClass: "hover:text-[#4b8e9a]",
  },
];

export default function Footer({ isAdmin = false }) {
  const footerLinks = isAdmin ? adminFooterLinks : publicFooterLinks;

  return (
    <footer className="bg-[#eeeff2] text-[#4b4b4b]">
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-y-12 gap-x-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-[#42454c]">
              Ability to Thrive
            </h3>
            <p className="text-base leading-7 text-[#5d6169]">
              Guiding you towards a fulfilling life through professional
              counselling, coaching, and NDIS support.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/ability.to.thrive.2025/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white p-2 shadow-sm transition hover:text-[#926ab9] border border-[#cfd6e2]"
              >
                <Facebook className="h-5 w-5" />
              </a>
              {/* REPLACE INS LINK */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white p-2 shadow-sm transition hover:text-[#926ab9] border border-[#cfd6e2]"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:pl-8">
            <h3 className="text-xl font-semibold text-[#42454c]">
              {isAdmin ? "Admin Links" : "Quick Links"}
            </h3>
            <nav className="flex flex-col gap-3 text-base text-[#5d6169]">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition ${link.hoverClass}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-semibold text-[#42454c]">Contact</h3>
            <div className="flex flex-col gap-4 text-base text-[#5d6169]">
              <a
                href="mailto:SamanthaShepherd@abilitytothrive.com.au"
                className="flex items-start gap-3 hover:text-[#926ab9] group"
              >
                <Mail className="mt-1 h-4 w-4 shrink-0" />
                <span className="break-all leading-relaxed">
                  hello@abilitytothrive.com.au
                </span>
              </a>
              <a
                href="tel:0400000000"
                className="flex items-center gap-3 hover:text-[#926ab9]"
              >
                <Phone className="h-4 w-4 shrink-0" />
                <span>0478 925 373</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-semibold text-[#42454c]">
              Accreditation
            </h3>
            <div className="flex w-full max-w-[22rem] flex-col gap-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="flex h-16 min-w-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm border border-[#cfd6e2]">
                  <Image
                    src="/assets/badges/ndis-logo.png"
                    alt="NDIS Logo"
                    width={96}
                    height={64}
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <div className="flex h-16 min-w-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm border border-[#cfd6e2]">
                  <Image
                    src="/assets/badges/aca-logo.png"
                    alt="ACA Logo"
                    width={96}
                    height={64}
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <div className="flex h-16 min-w-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm border border-[#cfd6e2]">
                  <Image
                    src="/assets/badges/College%20of%20Supervisors.png"
                    alt="College of Supervisors Logo"
                    width={64}
                    height={64}
                    className="max-h-full w-auto object-contain"
                  />
                </div>
              </div>
              <div className="flex h-14 w-full items-center justify-center rounded-xl bg-white px-3 py-2 shadow-sm border border-[#cfd6e2]">
                <Image
                  src="/assets/badges/Inclusion%20Logos.jpg"
                  alt="Inclusion logos"
                  width={157}
                  height={29}
                  className="h-auto max-h-full max-w-full object-contain"
                />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#666b75] max-w-[220px]">
              Proud member of the Australian Counselling Association.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-[#cfd6e2] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#666b75]">
            © {new Date().getFullYear()} Ability to Thrive. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-[#666b75]">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
