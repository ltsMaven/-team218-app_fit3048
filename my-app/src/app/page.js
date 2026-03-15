import Link from 'next/link';
import { Heart, Users, MessageCircle, ArrowRight, Sun } from "lucide-react";

const services = [
  {
    title: "Individual Therapy",
    description:
      "One-on-one sessions focused on anxiety, depression, stress management, and personal growth.",
    icon: Heart,
  },
  {
    title: "Couples Counseling",
    description:
      "Build stronger relationships through improved communication, conflict resolution, and understanding.",
    icon: Users,
  },
  {
    title: "Family Therapy",
    description:
      "Strengthen family bonds and develop healthier patterns of interaction and communication.",
    icon: MessageCircle,
  },
];

const testimonials = [
  {
    quote:
      "Dr. Mitchell has been instrumental in helping me work through my anxiety. Her compassionate approach made me feel safe and understood.",
    author: "Anonymous Client",
    bgClass: "bg-[#f3f6ef]",
  },
  {
    quote:
      "The couples therapy sessions saved our relationship. We learned to communicate better and understand each other's perspectives.",
    author: "Anonymous Client",
    bgClass: "bg-[#f8f6f2]",
  },
  {
    quote:
      "Professional, empathetic, and genuinely caring. I always leave sessions feeling heard and equipped with practical tools.",
    author: "Anonymous Client",
    bgClass: "bg-[#f3f6ef]",
  },
];

export default function Home() {
  return (
    <>
      <section
        id="home"
        className="relative isolate flex min-h-[calc(100vh-145px)] items-center overflow-hidden bg-white"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="/assets/videos/landing-background.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative mx-auto flex w-full max-w-5xl justify-center px-6 py-20 text-center">
          <div className="max-w-3xl space-y-5 text-white">
            <h1 className="text-3xl font-semibold tracking-[0.08em] sm:text-5xl">
              Ability to Thrive
            </h1>

            <p className="text-base sm:text-lg text-white/90">
              Guiding you towards a fulfilling life
            </p>

            <p className="mx-auto max-w-2xl text-xs leading-6 tracking-wide text-white/80 sm:text-sm">
              ACA registered Counsellor, Life Coach, Clinical Supervisor, NDIS
              registered provider
            </p>

            <div className="pt-4">
              <Link 
                href="/book"
                className="inline-block rounded-full border border-white/70 px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f8f6] px-6 py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex h-[420px] items-center justify-center rounded-[36px] border border-[#dfe3d9] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
              <div className="text-center">
                <p className="text-lg font-medium text-[#657357]">
                  Image / visual placeholder
                </p>
                <p className="mt-2 text-sm text-neutral-500">
                  You can replace this later with a photo, illustration, or
                  branded graphic.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#ecefe8] px-5 py-2">
              <Sun className="h-[18px] w-[18px] text-[#657357]" />
              <span className="text-sm font-medium tracking-wide text-[#44503d]">
                ABOUT MY PRACTICE
              </span>
            </div>

            <h2 className="mb-8 text-4xl font-semibold leading-tight text-[#2f3a2f] sm:text-5xl lg:text-6xl">
              Empowering Clients to{" "}
              <span className="italic text-[#657357]">Thrive</span>
            </h2>

            <div className="mb-10 space-y-6">
              <p className="text-xl leading-relaxed text-[#4f574a]">
                As an{" "}
                <span className="font-medium text-[#3e4a37]">
                  NDIS registered Counsellor, Psychosocial Recovery Coach and
                  Clinical Supervisor
                </span>
                , I offer a compassionate and empathic approach to help clients
                navigate life&apos;s challenges.
              </p>

              <div className="border-l-4 border-[#7b9468] pl-6 py-2">
                <p className="text-lg leading-relaxed text-neutral-600">
                  Through a safe and non-judgmental space, I work
                  collaboratively to empower people to achieve their goals and
                  improve their mental, emotional, physical, and social
                  well-being in line with their personal goals and values.
                </p>
              </div>

              <p className="text-xl font-medium leading-relaxed text-[#3e4a37]">
                I believe we all have within us the{" "}
                <span className="text-[#657357]">
                  &quot;Ability to Thrive.&quot;
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#657357] px-8 py-4 text-base font-medium text-white shadow-lg transition hover:bg-[#556248]">
                Discover My Approach
                <ArrowRight className="h-5 w-5" />
              </button>

              <button className="inline-flex items-center justify-center rounded-2xl border-2 border-[#657357] px-8 py-4 text-base font-medium text-[#556248] shadow-sm transition hover:bg-[#f2f5ef]">
                Get in Touch
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-6 border-t border-[#d9ded2] pt-10">
              <div>
                <p className="mb-1 text-3xl font-light text-[#657357]">15+</p>
                <p className="text-sm text-neutral-600">Years Experience</p>
              </div>
              <div>
                <p className="mb-1 text-3xl font-light text-[#657357]">500+</p>
                <p className="text-sm text-neutral-600">Clients Helped</p>
              </div>
              <div>
                <p className="mb-1 text-3xl font-light text-[#657357]">100%</p>
                <p className="text-sm text-neutral-600">Confidential</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#2f3a2f] sm:text-4xl">
              How I Can Help
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600">
              Specialized services tailored to support your mental health and
              well-being
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef0ea]">
                    <Icon className="h-6 w-6 text-[#657357]" />
                  </div>

                  <h3 className="text-2xl font-semibold text-[#2f3a2f]">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-base leading-8 text-neutral-600">
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f8f6] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#2f3a2f] sm:text-4xl">
              What Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <article
                key={index}
                className={`${testimonial.bgClass} rounded-2xl p-10 shadow-sm`}
              >
                <div className="mb-6">
                  <div className="mb-6 flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  <p className="italic leading-relaxed text-neutral-600">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </div>

                <p className="text-[#556248]">- {testimonial.author}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-[#2f3a2f] sm:text-4xl">
            Ready to Take the First Step?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-600">
            Schedule your consultation today and begin your journey toward
            healing and growth.
          </p>

          <div className="mt-10">
            <Link 
              href="/book"
              className="inline-flex items-center gap-2 rounded-xl bg-[#657357] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#556248]"
            >
              Book Your Session Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
