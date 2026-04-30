import { hasAuth0Config } from "@/lib/auth0";
import { requireAdminSession } from "@/lib/admin-access";
import { getCalendlyReport } from "@/lib/calendly";
import PopularServicesChart from "@/components/PopularServicesChart";
import BusinessStatisticsDateFilter from "@/components/BusinessStatisticsDateFilter";

export const metadata = {
  title: "Business Statistics",
  description: "Business statistics for Ability to Thrive administrators.",
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

function WebsiteTrafficPanel() {
  return (
    <div className="rounded-3xl border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,239,248,0.72))] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d7bbb]">
            Website Traffic
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[#42454c]">
            Traffic reporting
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5d6169]">
            No website analytics data source is connected in this project yet.
            This section is ready for page views, visitors, and conversion
            metrics once an analytics provider is added.
          </p>
        </div>
        <span className="rounded-full bg-[#f1eef6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#926ab9]">
          Not connected
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {["Page views", "Visitors", "Enquiry conversions"].map((label) => (
          <div
            key={label}
            className="rounded-2xl border border-[#d8dfeb] bg-white/80 p-5"
          >
            <p className="text-sm font-medium text-[#5d6169]">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-[#926ab9]">
              --
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function BusinessStatisticsPage({ searchParams }) {
  if (!hasAuth0Config) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-10 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
            Business Statistics
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
            Auth0 setup required
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#5d6169]">
            Add your Auth0 environment variables before using business
            statistics.
          </p>
        </div>
      </section>
    );
  }

  const session = await requireAdminSession("/admin/business-statistics");
  const resolvedSearchParams = await searchParams;
  const selectedStartDate = getSearchParamValue(
    resolvedSearchParams,
    "startDate"
  );
  const selectedEndDate = getSearchParamValue(resolvedSearchParams, "endDate");

  let report = null;
  let reportError = "";

  try {
    report = await getCalendlyReport({
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    });
  } catch (error) {
    reportError =
      error instanceof Error
        ? error.message
        : "Unable to load live Calendly data.";
  }

  const popularEvents = report?.popularEvents || [];

  return (
    <section className="rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-8 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur sm:p-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
          Business Statistics
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
          Website and service performance
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]">
          You are signed in as {session.user.name || session.user.email}.
        </p>

        <div className="mt-10 space-y-8">
          <WebsiteTrafficPanel />

          <div className="rounded-3xl border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(234,243,245,0.72))] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d7bbb]">
                  Booking Statistics
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#42454c]">
                  Popular Services
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#5d6169]">
                  Booking volume by service type for{" "}
                  {report?.period?.label?.toLowerCase() || "the selected period"}.
                </p>
                {report ? (
                  <p className="mt-1 text-sm text-[#5d6169]">
                    Last fetched: {formatDateTime(report.generatedAt)}
                  </p>
                ) : null}
              </div>

              <BusinessStatisticsDateFilter
                selectedStartDate={report?.period?.selectedStartDate || ""}
                selectedEndDate={report?.period?.selectedEndDate || ""}
              />
            </div>

            {reportError ? (
              <div className="mt-6 rounded-2xl border border-[#f0d0d0] bg-[#fff5f5] px-5 py-4 text-sm text-[#9a3f3f]">
                {reportError}
              </div>
            ) : null}

            {popularEvents.length ? (
              <PopularServicesChart events={popularEvents} />
            ) : (
              <p className="mt-8 text-sm text-[#5d6169]">
                No service bookings were returned for{" "}
                {report?.period?.label?.toLowerCase() || "the selected period"}.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
