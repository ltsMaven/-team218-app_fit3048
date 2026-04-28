import { hasAuth0Config } from "@/lib/auth0";
import { requireAdminSession } from "@/lib/admin-access";
import { getServerSupabaseClient } from "@/lib/supabase-server";
import HomepageCmsForm from "./HomepageCmsForm";
import {
  ABOUT_CMS_FIELDS,
  ABOUT_CMS_SLUG,
  ABOUT_CMS_TABLE,
  emptyHomepageContent,
  fallbackAboutContent,
  fallbackServiceItems,
  fallbackServicesContent,
  HOMEPAGE_CMS_FIELDS,
  HOMEPAGE_CMS_SLUG,
  HOMEPAGE_CMS_TABLE,
  normaliseAboutContent,
  normaliseHomepageContent,
  normaliseServiceItems,
  normaliseServicesContent,
  SERVICE_ITEMS_TABLE,
  SERVICE_ITEM_FIELDS,
  SERVICES_CMS_FIELDS,
  SERVICES_CMS_SLUG,
  SERVICES_CMS_TABLE,
} from "@/lib/cms-homepage";

export const metadata = {
  title: "Admin CMS",
  description: "Admin content management area for Ability to Thrive.",
};

async function getCmsContent() {
  try {
    const supabase = getServerSupabaseClient();
    const [
      homepageResult,
      aboutResult,
      servicesResult,
      serviceItemsResult,
    ] = await Promise.all([
      supabase
        .from(HOMEPAGE_CMS_TABLE)
        .select(["slug", ...HOMEPAGE_CMS_FIELDS].join(", "))
        .eq("slug", HOMEPAGE_CMS_SLUG)
        .maybeSingle(),
      supabase
        .from(ABOUT_CMS_TABLE)
        .select(["slug", ...ABOUT_CMS_FIELDS].join(", "))
        .eq("slug", ABOUT_CMS_SLUG)
        .maybeSingle(),
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

    const error =
      homepageResult.error ||
      aboutResult.error ||
      servicesResult.error ||
      serviceItemsResult.error;

    if (error) {
      throw new Error(error.message);
    }

    return {
      homepage: normaliseHomepageContent({
        ...emptyHomepageContent,
        ...homepageResult.data,
      }),
      about: normaliseAboutContent({
        ...fallbackAboutContent,
        ...aboutResult.data,
      }),
      services: normaliseServicesContent({
        ...fallbackServicesContent,
        ...servicesResult.data,
      }),
      serviceItems: normaliseServiceItems(
        serviceItemsResult.data?.length
          ? serviceItemsResult.data
          : fallbackServiceItems
      ),
      loadError: "",
    };
  } catch (error) {
    return {
      homepage: emptyHomepageContent,
      about: fallbackAboutContent,
      services: fallbackServicesContent,
      serviceItems: fallbackServiceItems,
      loadError:
        error.message ||
        "Unable to load CMS content. Check that the CMS tables exist and Supabase is configured.",
    };
  }
}

export default async function AdminCmsPage() {
  if (!hasAuth0Config) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-10 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
            CMS
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
            Auth0 setup required
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#5d6169]">
            Add your Auth0 environment variables before using the admin CMS.
          </p>
        </div>
      </section>
    );
  }

  const session = await requireAdminSession("/admin/cms");
  const { homepage, about, services, serviceItems, loadError } =
    await getCmsContent();

  return (
    <section className="rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-8 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur sm:p-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
          CMS
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
          Homepage Content
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]">
          Signed in as {session.user.name || session.user.email}. This editor
          controls the text-only content for the homepage, About Me page, and
          Services page.
        </p>

        <HomepageCmsForm
          initialHomepageContent={homepage}
          initialAboutContent={about}
          initialServicesContent={services}
          initialServiceItems={serviceItems}
          loadError={loadError}
        />
      </div>
    </section>
  );
}
