import MyWorkClient from "@/components/MyWorkClient";

export const metadata = {
  title: "My Work | Ability to Thrive",
  description: "Discover my expertise and professional approach, including over 15 years of experience in substance abuse counselling, relationship counselling, NDIS support, and LGBTQIA+ counselling.",
};

export default function MyWorkPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <MyWorkClient />
    </div>
  );
}