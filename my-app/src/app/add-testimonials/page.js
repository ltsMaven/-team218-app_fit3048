import AddTestimonialForm from "@/components/AddTestimonialForm";

export const metadata = {
  title: "Add Testimonial",
  description: "Private testimonial submission page for Ability to Thrive.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AddTestimonialsPage() {
  return (
    <section className="relative overflow-hidden bg-[#f8f8f6] px-6 py-20 sm:py-24">
      <div className="absolute left-[-12rem] top-16 h-80 w-80 rounded-full bg-[#dbe7ec] blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-[#eadff1] blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="rounded-[2rem] border border-white/70 bg-white/72 p-8 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
            Add Testimonial
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c] sm:text-5xl">
            Share your experience
          </h1>

          <div className="mt-8 space-y-4 text-sm leading-7 text-[#5d6169]">
            <p>
              Please avoid including sensitive health details that you would not
              want shared publicly.
            </p>
            <p>
              You can choose a public display name, such as your first name and
              last initial.
            </p>
          </div>
        </div>

        <AddTestimonialForm />
      </div>
    </section>
  );
}
