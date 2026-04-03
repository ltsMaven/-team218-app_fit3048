import AboutMeClient from "@/components/AboutMeClient";

export const metadata = {
  title: "About Me | Ability to Thrive",
  description: "Learn about the lived experience and professional approach behind Ability to Thrive Counselling and Life Coaching.",
};

export default function AboutMePage() {
  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <AboutMeClient />
    </div>
  );
}