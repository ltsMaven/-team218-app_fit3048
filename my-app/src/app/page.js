import { Heart, Users, MessageCircle, ArrowRight } from "lucide-react";

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

export default function Home() {
  return (
    <>
      <section
        id="home"
        className="relative isolate flex min-h-[calc(100vh-145px)] items-center overflow-hidden"
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
              <button className="rounded-full border border-white/70 px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f8f6] px-6 py-24">
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
            <button className="inline-flex items-center gap-2 rounded-xl bg-[#657357] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#556248]">
              Book Your Session Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
