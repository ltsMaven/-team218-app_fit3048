import EnquiryForm from "@/components/EnquiryForm";
import { getServerSupabaseClient } from "@/lib/supabase-server";
import {
  ENQUIRY_CMS_FIELDS,
  ENQUIRY_CMS_SLUG,
  ENQUIRY_CMS_TABLE,
  fallbackEnquiryContent,
  normaliseEnquiryContent,
} from "@/lib/cms-homepage";

export const metadata = {
  title: "Enquiry | Ability to Thrive",
  description: "Reach out for support that fits your situation.",
};

async function getEnquiryContent() {
  try {
    const supabase = getServerSupabaseClient();
    const { data, error } = await supabase
      .from(ENQUIRY_CMS_TABLE)
      .select(["slug", ...ENQUIRY_CMS_FIELDS].join(", "))
      .eq("slug", ENQUIRY_CMS_SLUG)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return normaliseEnquiryContent({
      ...fallbackEnquiryContent,
      ...data,
    });
  } catch {
    return fallbackEnquiryContent;
  }
}

export default async function EnquiryPage() {
  const enquiryContent = await getEnquiryContent();

  return (
    <div className="min-h-screen bg-[#f8f8f6] pt-12">
      <EnquiryForm faqItems={enquiryContent.faq_items} />
    </div>
  );
}
