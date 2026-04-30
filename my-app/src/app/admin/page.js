import { hasAuth0Config } from "@/lib/auth0";
import { requireAdminSession } from "@/lib/admin-access";
import { getCalendlyReport } from "@/lib/calendly";
import AdminRecentEvents from "@/components/AdminRecentEvents";

export const metadata = {
  title: "Admin Dashboard",
  description: "Protected admin dashboard for Ability to Thrive.",
};

export const dynamic = "force-dynamic";

function formatDateTime(value) {
  if (!value) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSearchParamValue(searchParams, key) {
  const value = searchParams?.[key];

  return Array.isArray(value) ? value[0] : value || "";
}

export default async function AdminPage({ searchParams }) {
  if (!hasAuth0Config) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-10 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
            Admin Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
            Auth0 setup required
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#5d6169]">
            Add your Auth0 environment variables before using the admin
            dashboard.
          </p>
        </div>
      </section>
    );
  }

  const session = await requireAdminSession("/admin");
  const resolvedSearchParams = await searchParams;
  const selectedStartDate = getSearchParamValue(
    resolvedSearchParams,
    "startDate",
  );
  const selectedEndDate = getSearchParamValue(resolvedSearchParams, "endDate");

  let report = null;
  let reportError = "";

  try {
    report = await getCalendlyReport({
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      includeAllHistory: true,
    });
  } catch (error) {
    reportError =
      error instanceof Error
        ? error.message
        : "Unable to load live Calendly data.";
  }

  const todaysEvents = report?.todaysEvents || [];
  return (
    <section className="rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-8 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur sm:p-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
          Admin Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
          Hello admin
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]">
          You are signed in as {session.user.name || session.user.email}.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,239,248,0.82))] p-6">
            <h2 className="text-xl font-semibold text-[#42454c]">
              Created Events
            </h2>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-[#926ab9]">
              {report?.summary?.createdEvents ?? 0}
            </p>
            <p className="mt-2 text-sm leading-7 text-[#5d6169]">
              Scheduled events in{" "}
              {report?.period?.label || "the selected period"}.
            </p>
          </div>

          <div className="rounded-3xl border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(234,243,245,0.82))] p-6">
            <h2 className="text-xl font-semibold text-[#42454c]">
              Completed Events
            </h2>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-[#926ab9]">
              {report?.summary?.completedEvents ?? 0}
            </p>
            <p className="mt-2 text-sm leading-7 text-[#5d6169]">
              Active events whose start times have already passed.
            </p>
          </div>

          <div className="rounded-3xl border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(238,239,242,0.82))] p-6">
            <h2 className="text-xl font-semibold text-[#42454c]">
              Cancelled Events
            </h2>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-[#926ab9]">
              {report?.summary?.canceledEvents ?? 0}
            </p>
            <p className="mt-2 text-sm leading-7 text-[#5d6169]">
              Cancelled events in{" "}
              {report?.period?.label || "the selected period"}.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(234,243,245,0.72))] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-[#42454c]">
                Live Calendly Report
              </h2>
            </div>
            {report ? (
              <div className="text-right text-sm text-[#5d6169]">
                <p>Last fetched: {formatDateTime(report.generatedAt)}</p>
              </div>
            ) : null}
          </div>

          {reportError ? (
            <div className="mt-6 rounded-2xl border border-[#f0d0d0] bg-[#fff5f5] px-5 py-4 text-sm text-[#9a3f3f]">
              {reportError}
            </div>
          ) : null}

          {report ? (
            <>
              <div className="mt-6">
                <div className="rounded-2xl border border-[#d8dfeb] bg-white/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d7bbb]">
                    Today&apos;s Bookings
                  </p>
                  {todaysEvents.length ? (
                    <div className="mt-3">
                      <AdminRecentEvents events={todaysEvents} compact />
                    </div>
                  ) : (
                    <>
                      <p className="mt-3 text-sm font-medium text-[#42454c]">
                        No bookings today
                      </p>
                      <p className="mt-2 text-sm text-[#5d6169]">
                        No active event returned for today.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-[#d8dfeb] bg-white/80 p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-[#42454c]">
                    Previous Event History
                  </h3>
                  <p className="text-sm text-[#5d6169]">
                    {report.period.label}
                  </p>
                </div>
                <div className="mt-5">
                  <AdminRecentEvents events={report.recentHistory} />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
