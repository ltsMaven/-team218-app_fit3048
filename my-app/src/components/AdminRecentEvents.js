"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function formatDateTime(value) {
  if (!value) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDuration(startTime, endTime) {
  if (!startTime || !endTime) {
    return "Unavailable";
  }

  const durationMs = new Date(endTime) - new Date(startTime);

  if (Number.isNaN(durationMs) || durationMs <= 0) {
    return "Unavailable";
  }

  const minutes = Math.round(durationMs / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) {
    return `${minutes} min`;
  }

  if (!remainingMinutes) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

function getStatusClasses(status) {
  return status === "canceled"
    ? "bg-[#fff2f2] text-[#b04c4c]"
    : "bg-[#eef6f2] text-[#3c7b5b]";
}

function getInviteeCount(event) {
  if (typeof event.invitees_counter?.active === "number") {
    return String(event.invitees_counter.active);
  }

  if (Array.isArray(event.event_guests) && event.event_guests.length) {
    return String(event.event_guests.length);
  }

  return "Unavailable";
}

function getClientName(event) {
  return event?.inviteeName || event?.inviteeEmail || "Unavailable";
}

function getLocationLabel(location) {
  if (!location) {
    return "Unavailable";
  }

  if (typeof location === "string") {
    return location;
  }

  return (
    location.join_url ||
    location.location ||
    location.display_location ||
    location.additional_info ||
    location.type ||
    "Unavailable"
  );
}

function DetailItem({ label, value, isLink = false }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b869f]">
        {label}
      </p>
      <div className="min-w-0 flex-1 text-right">
        {isLink && value !== "Unavailable" ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="block break-all text-sm font-semibold text-[#926ab9] hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm font-semibold text-[#42454c]">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function AdminRecentEvents({ events }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!selectedEvent) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedEvent(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEvent]);

  if (!events.length) {
    return (
      <p className="text-sm text-[#5d6169]">
        No recent event history was returned.
      </p>
    );
  }

  const locationLabel = selectedEvent
    ? getLocationLabel(selectedEvent.location)
    : "Unavailable";
  const locationIsLink =
    selectedEvent &&
    typeof locationLabel === "string" &&
    /^https?:\/\//.test(locationLabel);

  return (
    <>
      <div className="space-y-3">
        {events.map((event) => (
          <button
            key={event.uri}
            type="button"
            onClick={() => setSelectedEvent(event)}
            className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d8dfeb] px-4 py-3 text-left transition hover:border-[#926ab9] hover:bg-[#fcfbfe]"
          >
            <div>
              <p className="font-medium text-[#42454c]">{event.name}</p>
              <p className="text-sm text-[#5d6169]">
                {formatDateTime(event.start_time)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getStatusClasses(event.status)}`}
              >
                {event.status}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d7bbb]">
                View details
              </span>
            </div>
          </button>
        ))}
      </div>

      {typeof document !== "undefined" && selectedEvent
        ? createPortal(
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-[#42454c]/45 px-4 py-8"
              role="dialog"
              aria-modal="true"
              aria-labelledby="meeting-detail-title"
              onClick={() => setSelectedEvent(null)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 2147483647,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 1rem",
                backgroundColor: "rgba(66, 69, 76, 0.45)",
              }}
            >
              <div
                className="max-h-full w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-[#d8dfeb] bg-white p-6 shadow-[0_24px_60px_rgba(66,69,76,0.18)] sm:p-8"
                onClick={(event) => event.stopPropagation()}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "48rem",
                  maxHeight: "calc(100vh - 4rem)",
                  overflowY: "auto",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
                      Meeting Detail
                    </p>
                    <h4
                      id="meeting-detail-title"
                      className="mt-3 text-2xl font-semibold tracking-tight text-[#42454c]"
                    >
                      {selectedEvent.name || "Unnamed event"}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="rounded-full border border-[#d8dfeb] px-4 py-2 text-sm font-medium text-[#42454c] transition hover:bg-[#f4f6fa]"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getStatusClasses(selectedEvent.status)}`}
                  >
                    {selectedEvent.status}
                  </span>
                  <span className="text-sm text-[#5d6169]">
                    Created {formatDateTime(selectedEvent.created_at)}
                  </span>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="border-b border-[#d8dfeb] pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b869f]">
                      Meeting Overview
                    </p>
                    <p className="mt-3 text-xl font-semibold text-[#6d7bbb]">
                      {selectedEvent.name || "Unnamed event"}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#42454c]">
                      {getClientName(selectedEvent)}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[#5d6169]">
                      {formatDateTime(selectedEvent.start_time)}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-[#5d6169]">
                      {formatDuration(
                        selectedEvent.start_time,
                        selectedEvent.end_time,
                      )}
                    </p>
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b869f]">
                        Event Reference
                      </p>
                      <p className="mt-2 break-all text-sm font-medium text-[#42454c]">
                        {selectedEvent.uri || "Unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-[#d8dfeb]">
                    <DetailItem
                      label="Client"
                      value={getClientName(selectedEvent)}
                    />
                    <DetailItem
                      label="Start Time"
                      value={formatDateTime(selectedEvent.start_time)}
                    />
                    <DetailItem
                      label="End Time"
                      value={formatDateTime(selectedEvent.end_time)}
                    />
                    <DetailItem
                      label="Duration"
                      value={formatDuration(
                        selectedEvent.start_time,
                        selectedEvent.end_time,
                      )}
                    />
                    <DetailItem
                      label="Invitees"
                      value={getInviteeCount(selectedEvent)}
                    />
                    <DetailItem
                      label="Location"
                      value={locationLabel}
                      isLink={locationIsLink}
                    />
                    <DetailItem
                      label="Updated"
                      value={formatDateTime(selectedEvent.updated_at)}
                    />
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
