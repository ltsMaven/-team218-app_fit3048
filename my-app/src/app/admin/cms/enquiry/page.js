import Link from "next/link";
import { hasAuth0Config } from "@/lib/auth0";
import { requireAdminSession } from "@/lib/admin-access";
import { getServerSupabaseClient } from "@/lib/supabase-server";
import EnquiryFaqCmsForm from "@/components/cms/EnquiryFaqCmsForm";
import {
  ENQUIRY_CMS_FIELDS,
  ENQUIRY_CMS_SLUG,
  ENQUIRY_CMS_TABLE,
  fallbackEnquiryContent,
  normaliseEnquiryContent,
} from "@/lib/cms-homepage";

export const metadata = {
  title: "Enquiry CMS",
  description: "Enquiry FAQ editor for Ability to Thrive.",
};

async function getEnquiryCmsContent() {
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

    return {
      enquiry: normaliseEnquiryContent({
        ...fallbackEnquiryContent,
        ...data,
      }),
      loadError: "",
    };
  } catch (error) {
    return {
      enquiry: fallbackEnquiryContent,
      loadError:
        error.message ||
        "Unable to load Enquiry CMS content. Check Supabase configuration.",
    };
  }
}

export default async function AdminCmsEnquiryPage() {
  if (!hasAuth0Config) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-10 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
            Enquiry CMS
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
            Auth0 setup required
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#5d6169]">
            Add your Auth0 environment variables before using the Enquiry CMS.
          </p>
        </div>
      </section>
    );
  }

  const session = await requireAdminSession("/admin/cms/enquiry");
  const { enquiry, loadError } = await getEnquiryCmsContent();

  return (
    <section className="rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-8 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur sm:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
              CMS
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
              Enquiry FAQ
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]">
              Signed in as {session.user.name || session.user.email}. This page
              only edits the FAQ section on the Enquiry page, while the rest of
              the page layout stays unchanged.
            </p>
          </div>

          <Link
            href="/admin/cms"
            className="inline-flex rounded-full border border-[#d8dfeb] bg-white px-5 py-3 text-sm font-medium text-[#42454c] transition hover:bg-[#f4f6fa]"
          >
            Back to CMS dashboard
          </Link>
        </div>

        <EnquiryFaqCmsForm
          initialEnquiryContent={enquiry}
          loadError={loadError}
        />
      </div>
    </section>
  );
}
