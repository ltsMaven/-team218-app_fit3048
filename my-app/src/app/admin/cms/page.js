import Link from "next/link";
import { ChevronRight, LayoutTemplate, MessageSquareQuote } from "lucide-react";
import { hasAuth0Config } from "@/lib/auth0";
import { requireAdminSession } from "@/lib/admin-access";

export const metadata = {
  title: "Admin CMS",
  description: "Admin content management area for Ability to Thrive.",
};

const cmsCards = [
  {
    title: "Edit Homepage",
    description:
      "Manage homepage sections with a live preview and section-based editing.",
    href: "/admin/cms/home",
    status: "Ready now",
    icon: LayoutTemplate,
    accent: "from-[#eef6f7] to-[#dcecf0]",
  },
  {
    title: "Edit About Page",
    description:
      "Prepare the About page content editor as a separate CMS workspace.",
    href: "/admin/cms/about",
    status: "Ready now",
    icon: LayoutTemplate,
    accent: "from-[#f4eff8] to-[#ece6f5]",
  },
  {
    title: "Edit Services Page",
    description:
      "Split services intro and service card editing into a dedicated route.",
    href: "",
    status: "Coming next",
    icon: LayoutTemplate,
    accent: "from-[#eef1f8] to-[#e0e7f5]",
  },
  {
    title: "Edit Booking Page",
    description:
      "Reserve a separate editor for booking and enquiry instructions later.",
    href: "",
    status: "Planned",
    icon: LayoutTemplate,
    accent: "from-[#f7f3ec] to-[#efe6d8]",
  },
  {
    title: "Manage Testimonials",
    description:
      "Continue using the existing testimonial moderation workspace.",
    href: "/admin/testimonial",
    status: "Ready now",
    icon: MessageSquareQuote,
    accent: "from-[#f3f6fb] to-[#e7edf7]",
  },
];

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

  return (
    <section className="rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-8 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur sm:p-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
          CMS
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
          Content Management
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]">
          Signed in as {session.user.name || session.user.email}. Choose a CMS
          workspace below so each page stays easier to find and maintain.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cmsCards.map((card) => {
            const Icon = card.icon;

            if (!card.href) {
              return (
                <article
                  key={card.title}
                  className={`rounded-[2rem] border border-[#d8dfeb] bg-gradient-to-br ${card.accent} p-6 opacity-90`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[#42454c] shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#6d7bbb]">
                      {card.status}
                    </span>
                  </div>

                  <h2 className="mt-6 text-2xl font-semibold text-[#42454c]">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#5d6169]">
                    {card.description}
                  </p>

                  <div className="mt-6 rounded-2xl border border-dashed border-[#c9d3e2] bg-white/60 px-4 py-3 text-sm text-[#5d6169]">
                    This route will be added in the next CMS refactor step.
                  </div>
                </article>
              );
            }

            return (
              <Link
                key={card.title}
                href={card.href}
                className={`group rounded-[2rem] border border-[#d8dfeb] bg-gradient-to-br ${card.accent} p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(66,69,76,0.12)]`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[#42454c] shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#6d7bbb]">
                    {card.status}
                  </span>
                </div>

                <h2 className="mt-6 text-2xl font-semibold text-[#42454c]">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#5d6169]">
                  {card.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#42454c]">
                  Open workspace
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
