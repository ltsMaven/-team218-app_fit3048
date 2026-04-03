import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#eeeff2] text-[#4b4b4b]">
      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        
        <div className="grid grid-cols-1 gap-y-12 gap-x-8 md:grid-cols-2 lg:grid-cols-4">

          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-[#42454c]">
              Ability to Thrive
            </h3>
            <p className="text-base leading-7 text-[#5d6169]">
              Guiding you towards a fulfilling life through professional counselling,
              coaching, and NDIS support.
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
            <h3 className="text-xl font-semibold text-[#42454c]">Quick Links</h3>
            <nav className="flex flex-col gap-3 text-base text-[#5d6169]">
              <Link href="/about-me" className="transition hover:text-[#926ab9]">About Me</Link>
              <Link href="/service" className="transition hover:text-[#6d7bbb]">Services</Link>
              <Link href="/enquiry" className="transition hover:text-[#4b8e9a]">Enquiry</Link>
              <Link href="/booking" className="transition hover:text-[#926ab9]">Book a Session</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-semibold text-[#42454c]">Contact</h3>
            <div className="flex flex-col gap-4 text-base text-[#5d6169]">
              <a href="mailto:SamanthaShepherd@abilitytothrive.com.au" className="flex items-start gap-3 hover:text-[#926ab9] group">
                <Mail className="mt-1 h-4 w-4 shrink-0" />
                <span className="break-all leading-relaxed">
                  SamanthaShepherd@<br className="hidden lg:block" />abilitytothrive.com.au
                </span>
              </a>
              <a href="tel:0400000000" className="flex items-center gap-3 hover:text-[#926ab9]">
                <Phone className="h-4 w-4 shrink-0" />
                <span>(555) 123-4567</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-semibold text-[#42454c]">Accreditation</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-white p-2 shadow-sm border border-[#cfd6e2]">
                <Image
                  src="/assets/badges/ndis-logo.png"
                  alt="NDIS Logo"
                  width={96}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-white p-2 shadow-sm border border-[#cfd6e2]">
                <Image
                  src="/assets/badges/aca-logo.png"
                  alt="ACA Logo"
                  width={96}
                  height={64}
                  className="object-contain"
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
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}