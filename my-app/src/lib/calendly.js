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

async function fetchReportEvents(user) {
  const now = new Date();
  const pastThirtyDays = addDays(now, -29);
  const nextThirtyDays = addDays(now, 30);

  try {
    return {
      history: await fetchScopedScheduledEvents({
        scopeKey: "organization",
        scopeValue: user.current_organization,
        start: pastThirtyDays,
        end: now,
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
        start: pastThirtyDays,
        end: now,
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

export async function getCalendlyReport() {
  const mePayload = await calendlyFetch("/users/me");
  const user = mePayload.resource;
  const now = new Date();
  const { history, upcoming, scope } = await fetchReportEvents(user);

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
    summary: {
      createdEvents,
      completedEvents: completedEvents.length,
      canceledEvents: canceledEvents.length,
    },
    popularEvents,
    durationBreakdown,
    recentHistory: history
      .sort(
        (a, b) =>
          new Date(b.start_time || b.created_at || 0) -
          new Date(a.start_time || a.created_at || 0)
      )
      .slice(0, 10),
    upcomingEvents: upcoming
      .filter((event) => event.status === "active")
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
      .slice(0, 10),
  };
}
