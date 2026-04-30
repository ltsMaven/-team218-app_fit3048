import ServiceClient from "@/components/ServiceClient";
import { getServerSupabaseClient } from "@/lib/supabase-server";
import {
  fallbackServiceItems,
  fallbackServicesContent,
  normaliseServiceItems,
  normaliseServicesContent,
  SERVICE_ITEMS_TABLE,
  SERVICE_ITEM_FIELDS,
  SERVICES_CMS_FIELDS,
  SERVICES_CMS_SLUG,
  SERVICES_CMS_TABLE,
} from "@/lib/cms-homepage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Work | Ability to Thrive",
  description: "Discover my expertise and professional approach, including over 15 years of experience in substance abuse counselling, relationship counselling, NDIS support, and LGBTQIA+ counselling.",
};

async function getServicesCmsContent() {
  try {
    const supabase = getServerSupabaseClient();
    const [pageResult, itemsResult] = await Promise.all([
      supabase
        .from(SERVICES_CMS_TABLE)
        .select(["slug", ...SERVICES_CMS_FIELDS].join(", "))
        .eq("slug", SERVICES_CMS_SLUG)
        .maybeSingle(),
      supabase
        .from(SERVICE_ITEMS_TABLE)
        .select(["id", "homepage_slug", ...SERVICE_ITEM_FIELDS].join(", "))
        .eq("homepage_slug", SERVICES_CMS_SLUG)
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (pageResult.error || itemsResult.error) {
      throw new Error(pageResult.error?.message || itemsResult.error?.message);
    }

    return {
      content: normaliseServicesContent({
        ...fallbackServicesContent,
        ...pageResult.data,
      }),
      services: normaliseServiceItems(
        itemsResult.data?.length ? itemsResult.data : fallbackServiceItems
      ),
    };
  } catch {
    return {
      content: fallbackServicesContent,
      services: fallbackServiceItems,
    };
  }
}

export default async function ServicePage() {
  const { content, services } = await getServicesCmsContent();

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <ServiceClient content={content} services={services} />
    </div>
  );
}
