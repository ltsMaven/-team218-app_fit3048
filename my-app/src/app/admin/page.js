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

function getDateInputValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function getCurrentMonthDateRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: getDateInputValue(start),
    endDate: getDateInputValue(end),
  };
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
  let historyReport = null;
  let reportError = "";
  const currentMonthRange = getCurrentMonthDateRange();

  try {
    [report, historyReport] = await Promise.all([
      getCalendlyReport({
        startDate: selectedStartDate || currentMonthRange.startDate,
        endDate: selectedEndDate || currentMonthRange.endDate,
      }),
      getCalendlyReport({
        includeAllHistory: true,
      }),
    ]);
  } catch (error) {
    reportError =
      error instanceof Error
        ? error.message
        : "Unable to load live Calendly data.";
  }

  const nextBooking = report?.upcomingEvents?.[0] || null;
  const allHistoryEvents = historyReport?.recentHistory || [];
  return (
    <section className="rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-8 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur sm:p-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
          Admin Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
          Hello {session.user.name || session.user.email}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]">
          Session counts below are for {report?.period?.label || "This month"}.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,239,248,0.82))] p-6">
            <h2 className="text-xl font-semibold text-[#42454c]">
              Created Sessions
            </h2>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-[#926ab9]">
              {report?.summary?.createdEvents ?? 0}
            </p>
          </div>

          <div className="rounded-3xl border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(234,243,245,0.82))] p-6">
            <h2 className="text-xl font-semibold text-[#42454c]">
              Completed Sessions
            </h2>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-[#926ab9]">
              {report?.summary?.completedEvents ?? 0}
            </p>
          </div>

          <div className="rounded-3xl border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(238,239,242,0.82))] p-6">
            <h2 className="text-xl font-semibold text-[#42454c]">
              Cancelled Sessions
            </h2>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-[#926ab9]">
              {report?.summary?.canceledEvents ?? 0}
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

          {report || historyReport ? (
            <>
              <div className="mt-6">
                <div className="rounded-2xl border border-[#d8dfeb] bg-white/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d7bbb]">
                    Next Booking
                  </p>
                  {nextBooking ? (
                    <div className="mt-3">
                      <AdminRecentEvents events={[nextBooking]} compact />
                    </div>
                  ) : (
                    <>
                      <p className="mt-3 text-sm font-medium text-[#42454c]">
                        No upcoming booking
                      </p>
                      <p className="mt-2 text-sm text-[#5d6169]">
                        No active upcoming event was returned by Calendly.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-[#d8dfeb] bg-white/80 p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-[#42454c]">
                    Previous Session History
                  </h3>
                  <p className="text-sm text-[#5d6169]">
                    {historyReport?.period?.label || "All available events"}
                  </p>
                </div>
                <div className="mt-5">
                  <AdminRecentEvents events={allHistoryEvents} />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
