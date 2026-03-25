import EnquiryForm from "@/components/EnquiryForm";

export const metadata = {
  title: "Enquiry | Ability to Thrive",
  description: "Reach out for support that fits your situation.",
};

export default function EnquiryPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-12">
      <EnquiryForm />
    </div>
  );
}
