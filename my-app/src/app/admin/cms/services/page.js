import Link from "next/link";
import { hasAuth0Config } from "@/lib/auth0";
import { requireAdminSession } from "@/lib/admin-access";
import { getServerSupabaseClient } from "@/lib/supabase-server";
import ServicesCmsForm from "@/components/cms/ServicesCmsForm";
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

export const metadata = {
  title: "Services CMS",
  description: "Services page content editor for Ability to Thrive.",
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
      servicesContent: normaliseServicesContent({
        ...fallbackServicesContent,
        ...pageResult.data,
      }),
      serviceItems: normaliseServiceItems(
        itemsResult.data?.length ? itemsResult.data : fallbackServiceItems
      ),
      loadError: "",
    };
  } catch (error) {
    return {
      servicesContent: fallbackServicesContent,
      serviceItems: fallbackServiceItems,
      loadError:
        error.message ||
        "Unable to load Services CMS content. Check Supabase configuration.",
    };
  }
}

export default async function AdminCmsServicesPage() {
  if (!hasAuth0Config) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-10 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
            Services CMS
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
            Auth0 setup required
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#5d6169]">
            Add your Auth0 environment variables before using the Services CMS.
          </p>
        </div>
      </section>
    );
  }

  const session = await requireAdminSession("/admin/cms/services");
  const { servicesContent, serviceItems, loadError } =
    await getServicesCmsContent();

  return (
    <section className="rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-8 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur sm:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
              CMS
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
              Services Content
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]">
              Signed in as {session.user.name || session.user.email}. This page
              follows the real Services page layout so you can update the intro
              and cards without changing the public design structure.
            </p>
          </div>

          <Link
            href="/admin/cms"
            className="inline-flex rounded-full border border-[#d8dfeb] bg-white px-5 py-3 text-sm font-medium text-[#42454c] transition hover:bg-[#f4f6fa]"
          >
            Back to CMS dashboard
          </Link>
        </div>

        <ServicesCmsForm
          initialServicesContent={servicesContent}
          initialServiceItems={serviceItems}
          loadError={loadError}
        />
      </div>
    </section>
  );
}
