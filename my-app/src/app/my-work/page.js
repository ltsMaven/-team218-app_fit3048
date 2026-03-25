import MyWorkClient from "@/components/MyWorkClient";

export const metadata = {
  title: "My Work | Ability to Thrive",
  description: "Learn about the lived experience and professional approach behind Ability to Thrive Counselling and Life Coaching.",
};

export default function MyWorkPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <MyWorkClient />
    </div>
  );
}