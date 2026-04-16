import Link from "next/link";
import { redirect } from "next/navigation";
import { auth0, hasAuth0Config } from "@/lib/auth0";
import { isAdminUser } from "@/lib/admin";
import { getCalendlyReport } from "@/lib/calendly";

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

export default async function AdminPage() {
  if (!hasAuth0Config || !auth0) {
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

  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login?returnTo=/admin");
  }

  if (!isAdminUser(session.user)) {
    redirect("/");
  }

  let report = null;
  let reportError = "";

  try {
    report = await getCalendlyReport();
  } catch (error) {
    reportError =
      error instanceof Error
        ? error.message
        : "Unable to load live Calendly data.";
  }

  const nextEvent = report?.upcomingEvents?.[0] || null;

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
              Scheduled events with start times in the last 30 days.
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
            <h2 className="text-xl font-semibold text-[#42454c]">Canceled Events</h2>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-[#926ab9]">
              {report?.summary?.canceledEvents ?? 0}
            </p>
            <p className="mt-2 text-sm leading-7 text-[#5d6169]">
              Canceled events with start times in the last 30 days.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(234,243,245,0.72))] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-[#42454c]">
                Live Calendly Report
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#5d6169]">
                Live server-side data from your Calendly API token. This report
                uses the last 30 days of scheduled-event history plus the next
                30 days of upcoming bookings.
              </p>
            </div>
            {report ? (
              <div className="text-right text-sm text-[#5d6169]">
                <p>Last fetched: {formatDateTime(report.generatedAt)}</p>
                <p>
                  Account: {report.ownerName || report.ownerSlug || "Calendly"}
                </p>
                <p>Scope: {report.scope}</p>
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
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-[#d8dfeb] bg-white/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d7bbb]">
                    Next Booking
                  </p>
                  <p className="mt-3 text-sm font-medium text-[#42454c]">
                    {nextEvent?.name || "No upcoming booking found"}
                  </p>
                  <p className="mt-2 text-sm text-[#5d6169]">
                    {nextEvent
                      ? formatDateTime(nextEvent.start_time)
                      : "No active event returned in the next 30 days."}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#d8dfeb] bg-white/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d7bbb]">
                    Scheduling Link
                  </p>
                  <a
                    href={report.schedulingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block break-all text-sm font-medium text-[#926ab9] hover:underline"
                  >
                    {report.schedulingUrl}
                  </a>
                </div>
                <div className="rounded-2xl border border-[#d8dfeb] bg-white/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d7bbb]">
                    Access Scope
                  </p>
                  <p className="mt-3 text-sm text-[#5d6169]">
                    {report.scope === "organization"
                      ? "Organization-wide scheduled events"
                      : "User-level scheduled events"}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-[#d8dfeb] bg-white/80 p-6">
                  <h3 className="text-xl font-semibold text-[#42454c]">
                    Popular Events
                  </h3>
                  <div className="mt-5 space-y-3">
                    {report.popularEvents.length ? (
                      report.popularEvents.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between rounded-2xl border border-[#d8dfeb] px-4 py-3"
                        >
                          <span className="text-sm font-medium text-[#42454c]">
                            {item.name}
                          </span>
                          <span className="rounded-full bg-[#f4eff8] px-3 py-1 text-sm font-semibold text-[#926ab9]">
                            {item.count}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#5d6169]">
                        No event history was returned for the last 30 days.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-[#d8dfeb] bg-white/80 p-6">
                  <h3 className="text-xl font-semibold text-[#42454c]">
                    Distribution by Duration
                  </h3>
                  <div className="mt-5 space-y-3">
                    {report.durationBreakdown.length ? (
                      report.durationBreakdown.map((item) => (
                        <div key={item.duration}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-medium text-[#42454c]">
                              {item.duration}
                            </span>
                            <span className="text-[#5d6169]">{item.count}</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-[#edf0f7]">
                            <div
                              className="h-full rounded-full bg-[#6d7bbb]"
                              style={{
                                width: `${Math.max(
                                  10,
                                  (item.count /
                                    Math.max(
                                      ...report.durationBreakdown.map(
                                        (entry) => entry.count
                                      ),
                                      1
                                    )) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#5d6169]">
                        No duration data was returned.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-[#d8dfeb] bg-white/80 p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-[#42454c]">
                    Recent Event History
                  </h3>
                  <p className="text-sm text-[#5d6169]">Last 30 days</p>
                </div>
                <div className="mt-5 space-y-3">
                  {report.recentHistory.length ? (
                    report.recentHistory.map((event) => (
                      <div
                        key={event.uri}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d8dfeb] px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-[#42454c]">
                            {event.name}
                          </p>
                          <p className="text-sm text-[#5d6169]">
                            {formatDateTime(event.start_time)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                            event.status === "canceled"
                              ? "bg-[#fff2f2] text-[#b04c4c]"
                              : "bg-[#eef6f2] text-[#3c7b5b]"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#5d6169]">
                      No recent event history was returned.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#d8dfeb] bg-[#f8f8fb] px-5 py-4 text-sm leading-7 text-[#5d6169]">
                This report is derived from live scheduled-event records exposed
                by the Calendly API. Rescheduled counts are not included here,
                because Calendly documents reschedules through webhook events
                rather than a dedicated analytics endpoint.
              </div>
            </>
          ) : null}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-full border border-[#d8dfeb] px-5 py-3 text-sm font-medium text-[#42454c] transition hover:bg-[#f4f6fa]"
          >
            Back to site
          </Link>
          <a
            href="/auth/logout"
            className="rounded-full bg-[#926ab9] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7d58a3]"
          >
            Log out
          </a>
        </div>
      </div>
    </section>
  );
}
