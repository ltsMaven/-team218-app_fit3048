const CALENDLY_API_BASE = "https://api.calendly.com";
const PAGE_SIZE = 100;

function getHeaders() {
  const token = process.env.CALENDLY_API_TOKEN?.trim();

  if (!token) {
    throw new Error("Missing CALENDLY_API_TOKEN environment variable.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function calendlyFetch(path, params = {}) {
  const url = new URL(`${CALENDLY_API_BASE}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, {
    headers: getHeaders(),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload.title ||
        payload.message ||
        `Calendly API request failed with status ${response.status}.`
    );
  }

  return payload;
}

async function fetchCollection(path, params = {}) {
  let nextPageToken = null;
  const collection = [];

  do {
    const payload = await calendlyFetch(path, {
      ...params,
      count: String(PAGE_SIZE),
      page_token: nextPageToken || undefined,
    });

    collection.push(...(payload.collection || []));
    nextPageToken = payload.pagination?.next_page_token || null;
  } while (nextPageToken);

  return collection;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getDateInputValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseDateInput(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
    return null;
  }

  const [year, monthIndex, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthIndex - 1, day, 0, 0, 0));

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== monthIndex - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatReportDate(date) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

function getDefaultReportPeriod() {
  const now = new Date();
  const start = addDays(now, -29);

  return {
    start,
    end: now,
    label: "Last 30 days",
    selectedStartDate: getDateInputValue(start),
    selectedEndDate: getDateInputValue(now),
  };
}

function getRangeReportPeriod({ startDate, endDate } = {}) {
  const start = parseDateInput(startDate);
  const selectedEnd = parseDateInput(endDate);

  if (!start || !selectedEnd || start > selectedEnd) {
    return getDefaultReportPeriod();
  }

  const end = addDays(selectedEnd, 1);

  return {
    start,
    end,
    label: `${formatReportDate(start)} to ${formatReportDate(selectedEnd)}`,
    selectedStartDate: startDate,
    selectedEndDate: endDate,
  };
}

function getEventName(event) {
  return event.name || event.event_type_name || "Unnamed event";
}

function countBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

async function fetchEventInvitee(event) {
  if (!event?.uri) {
    return null;
  }

  try {
    const eventPath = new URL(event.uri).pathname;
    const invitees = await fetchCollection(`${eventPath}/invitees`);
    const primaryInvitee = invitees[0];

    if (!primaryInvitee) {
      return null;
    }

    return {
      inviteeName: primaryInvitee.name || "",
      inviteeEmail: primaryInvitee.email || "",
    };
  } catch {
    return null;
  }
}

async function enrichRecentHistory(events) {
  return Promise.all(
    events.map(async (event) => {
      const invitee = await fetchEventInvitee(event);

      return {
        ...event,
        inviteeName: invitee?.inviteeName || "",
        inviteeEmail: invitee?.inviteeEmail || "",
      };
    }),
  );
}

async function fetchScopedScheduledEvents({ scopeKey, scopeValue, start, end }) {
  const commonParams = {
    [scopeKey]: scopeValue,
    min_start_time: start.toISOString(),
    max_start_time: end.toISOString(),
    sort: "start_time:asc",
  };

  const [activeEvents, canceledEvents] = await Promise.all([
    fetchCollection("/scheduled_events", {
      ...commonParams,
      status: "active",
    }),
    fetchCollection("/scheduled_events", {
      ...commonParams,
      status: "canceled",
    }),
  ]);

  return [...activeEvents, ...canceledEvents];
}

async function fetchReportEvents(user, period) {
  const now = new Date();
  const nextThirtyDays = addDays(now, 30);

  try {
    return {
      history: await fetchScopedScheduledEvents({
        scopeKey: "organization",
        scopeValue: user.current_organization,
        start: period.start,
        end: period.end,
      }),
      upcoming: await fetchScopedScheduledEvents({
        scopeKey: "organization",
        scopeValue: user.current_organization,
        start: now,
        end: nextThirtyDays,
      }),
      scope: "organization",
    };
  } catch {
    return {
      history: await fetchScopedScheduledEvents({
        scopeKey: "user",
        scopeValue: user.uri,
        start: period.start,
        end: period.end,
      }),
      upcoming: await fetchScopedScheduledEvents({
        scopeKey: "user",
        scopeValue: user.uri,
        start: now,
        end: nextThirtyDays,
      }),
      scope: "user",
    };
  }
}

export async function getCalendlyReport({ startDate, endDate } = {}) {
  const mePayload = await calendlyFetch("/users/me");
  const user = mePayload.resource;
  const now = new Date();
  const period = getRangeReportPeriod({ startDate, endDate });
  const { history, upcoming, scope } = await fetchReportEvents(user, period);
  const recentHistory = await enrichRecentHistory(
    [...history]
      .sort(
        (a, b) =>
          new Date(b.start_time || b.created_at || 0) -
          new Date(a.start_time || a.created_at || 0)
      )
      .slice(0, 10),
  );

  const completedEvents = history.filter(
    (event) =>
      event.status === "active" &&
      event.start_time &&
      new Date(event.start_time) <= now
  );
  const canceledEvents = history.filter((event) => event.status === "canceled");
  const createdEvents = history.length;
  const popularEvents = Object.entries(countBy(history, getEventName))
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 5);
  const durationBreakdown = Object.entries(
    countBy(history, (event) => {
      if (!event.start_time || !event.end_time) {
        return "Unknown";
      }

      const minutes = Math.round(
        (new Date(event.end_time) - new Date(event.start_time)) / 60000
      );
      return `${minutes} min`;
    })
  )
    .map(([duration, count]) => ({ duration, count }))
    .sort((a, b) => b.count - a.count || a.duration.localeCompare(b.duration));

  return {
    generatedAt: new Date().toISOString(),
    ownerName: user.name,
    ownerSlug: user.slug,
    schedulingUrl: user.scheduling_url,
    userUri: user.uri,
    organizationUri: user.current_organization,
    scope,
    period,
    summary: {
      createdEvents,
      completedEvents: completedEvents.length,
      canceledEvents: canceledEvents.length,
    },
    popularEvents,
    durationBreakdown,
    recentHistory,
    upcomingEvents: upcoming
      .filter((event) => event.status === "active")
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
      .slice(0, 10),
  };
}
