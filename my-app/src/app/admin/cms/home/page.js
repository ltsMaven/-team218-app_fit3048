import Link from "next/link";
import { hasAuth0Config } from "@/lib/auth0";
import { requireAdminSession } from "@/lib/admin-access";
import { getServerSupabaseClient } from "@/lib/supabase-server";
import HomepageCmsForm from "@/components/cms/HomepageCmsForm";
import {
  emptyHomepageContent,
  HOMEPAGE_CMS_FIELDS,
  HOMEPAGE_CMS_SLUG,
  HOMEPAGE_CMS_TABLE,
  normaliseHomepageContent,
} from "@/lib/cms-homepage";

export const metadata = {
  title: "Homepage CMS",
  description: "Homepage content editor for Ability to Thrive.",
};

async function getHomepageCmsContent() {
  try {
    const supabase = getServerSupabaseClient();
    const { data, error } = await supabase
      .from(HOMEPAGE_CMS_TABLE)
      .select(["slug", ...HOMEPAGE_CMS_FIELDS].join(", "))
      .eq("slug", HOMEPAGE_CMS_SLUG)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return {
      homepage: normaliseHomepageContent({
        ...emptyHomepageContent,
        ...data,
      }),
      loadError: "",
    };
  } catch (error) {
    return {
      homepage: emptyHomepageContent,
      loadError:
        error.message ||
        "Unable to load homepage CMS content. Check Supabase configuration.",
    };
  }
}

export default async function AdminCmsHomepagePage() {
  if (!hasAuth0Config) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-10 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
            Homepage CMS
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
            Auth0 setup required
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#5d6169]">
            Add your Auth0 environment variables before using the homepage CMS.
          </p>
        </div>
      </section>
    );
  }

  const session = await requireAdminSession("/admin/cms/home");
  const { homepage, loadError } = await getHomepageCmsContent();

  return (
    <section className="rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-8 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur sm:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
              CMS
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
              Homepage Content
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]">
              Signed in as {session.user.name || session.user.email}. This page
              focuses only on the homepage so the content is easier to manage.
            </p>
          </div>

          <Link
            href="/admin/cms"
            className="inline-flex rounded-full border border-[#d8dfeb] bg-white px-5 py-3 text-sm font-medium text-[#42454c] transition hover:bg-[#f4f6fa]"
          >
            Back to CMS dashboard
          </Link>
        </div>

        <HomepageCmsForm
          initialHomepageContent={homepage}
          loadError={loadError}
        />
      </div>
    </section>
  );
}
