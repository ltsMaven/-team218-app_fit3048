import AboutMeClient from "@/components/AboutMeClient";
import { getServerSupabaseClient } from "@/lib/supabase-server";
import {
  ABOUT_CMS_FIELDS,
  ABOUT_CMS_SLUG,
  ABOUT_CMS_TABLE,
  fallbackAboutContent,
  normaliseAboutContent,
} from "@/lib/cms-homepage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Me | Ability to Thrive",
  description: "Learn about the lived experience and professional approach behind Ability to Thrive Counselling and Life Coaching.",
};

async function getAboutContent() {
  try {
    const supabase = getServerSupabaseClient();
    const { data, error } = await supabase
      .from(ABOUT_CMS_TABLE)
      .select(["slug", ...ABOUT_CMS_FIELDS].join(", "))
      .eq("slug", ABOUT_CMS_SLUG)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return normaliseAboutContent({
      ...fallbackAboutContent,
      ...data,
    });
  } catch {
    return fallbackAboutContent;
  }
}

export default async function AboutMePage() {
  const content = await getAboutContent();

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <AboutMeClient content={content} />
    </div>
  );
}
