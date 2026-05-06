"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ENQUIRIES_PAGE_SIZE = 6;

function formatDateTime(value) {
  if (!value) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function isToday(value) {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function getEnquirySearchText(enquiry) {
  return [
    enquiry.name,
    enquiry.first_name,
    enquiry.last_name,
    enquiry.email,
    enquiry.message,
    enquiry.created_at,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getMessagePreview(message = "") {
  const trimmedMessage = message.trim();

  if (trimmedMessage.length <= 150) {
    return trimmedMessage;
  }

  return `${trimmedMessage.slice(0, 150).trim()}...`;
}

function DetailItem({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b869f]">
        {label}
      </p>
      <div className="min-w-0 flex-1 text-right text-sm font-semibold text-[#42454c]">
        {children}
      </div>
    </div>
  );
}

export default function AdminEnquiriesManager({
  initialEnquiries = [],
  loadError = "",
}) {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const normalisedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredEnquiries = normalisedSearchQuery
    ? initialEnquiries.filter((enquiry) =>
        getEnquirySearchText(enquiry).includes(normalisedSearchQuery),
      )
    : initialEnquiries;
  const totalPages = Math.ceil(filteredEnquiries.length / ENQUIRIES_PAGE_SIZE);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));
  const pageStart = (safeCurrentPage - 1) * ENQUIRIES_PAGE_SIZE;
  const pageEnquiries = filteredEnquiries.slice(
    pageStart,
    pageStart + ENQUIRIES_PAGE_SIZE,
  );
  const todaysCount = initialEnquiries.filter((enquiry) =>
    isToday(enquiry.created_at),
  ).length;

  useEffect(() => {
    if (!selectedEnquiry) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedEnquiry(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEnquiry]);

  return (
    <>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-[#d8dfeb] bg-white/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
            Total
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#926ab9]">
            {initialEnquiries.length}
          </p>
        </div>
        <div className="rounded-3xl border border-[#d8dfeb] bg-white/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
            Today
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#4b8e9a]">
            {todaysCount}
          </p>
        </div>
        <div className="rounded-3xl border border-[#d8dfeb] bg-white/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
            Showing
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#926ab9]">
            {filteredEnquiries.length}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-[#d8dfeb] bg-white/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-[#42454c]">
              Enquiry Submissions
            </h2>
            <p className="mt-2 text-sm text-[#5d6169]">
              View enquiries submitted through the public enquiry form.
            </p>
            <p className="mt-2 text-sm font-medium text-[#42454c]">
              Replies are not sent from this dashboard. Open Gmail to reply to
              the enquiry.
            </p>
          </div>
        </div>

        {loadError ? (
          <div className="mt-6 rounded-2xl border border-[#f0d0d0] bg-[#fff5f5] px-5 py-4 text-sm text-[#9a3f3f]">
            {loadError}
          </div>
        ) : null}

        {!loadError && !initialEnquiries.length ? (
          <p className="mt-6 rounded-2xl border border-[#d8dfeb] bg-[#f8f8fb] px-5 py-4 text-sm text-[#5d6169]">
            No enquiry submissions found yet.
          </p>
        ) : null}

        {!loadError && initialEnquiries.length ? (
          <>
            <div className="mt-6">
              <label htmlFor="enquiry-search" className="sr-only">
                Search enquiries
              </label>
              <input
                id="enquiry-search"
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, email, message, or date"
                className="w-full rounded-2xl border border-[#d8dfeb] bg-white px-4 py-3 text-sm font-medium text-[#42454c] outline-none transition placeholder:text-[#8a90a0] focus:border-[#926ab9]"
              />
              <p className="mt-2 text-sm text-[#5d6169]">
                Showing {filteredEnquiries.length} of {initialEnquiries.length}{" "}
                enquiries.
              </p>
            </div>

            {filteredEnquiries.length ? (
              <div className="mt-6 space-y-3">
                {pageEnquiries.map((enquiry) => (
                  <button
                    key={enquiry.id}
                    type="button"
                    onClick={() => setSelectedEnquiry(enquiry)}
                    className="flex w-full flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#d8dfeb] bg-[#fbfcfe] px-4 py-3 text-left transition hover:border-[#926ab9] hover:bg-[#fcfbfe]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-medium text-[#42454c]">
                          {enquiry.name}
                        </h3>
                        <span className="text-sm text-[#5d6169]">
                          {enquiry.email}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#5d6169]">
                        {getMessagePreview(enquiry.message)}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                      <span className="text-sm text-[#5d6169]">
                        {formatDateTime(enquiry.created_at)}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d7bbb]">
                        View details
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl border border-[#d8dfeb] bg-[#f8f8fb] px-5 py-4 text-sm text-[#5d6169]">
                No enquiries match your search.
              </p>
            )}

            {totalPages > 1 ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#d8dfeb] pt-4">
                <p className="text-sm text-[#5d6169]">
                  Showing {pageStart + 1}-
                  {Math.min(
                    pageStart + pageEnquiries.length,
                    filteredEnquiries.length,
                  )}{" "}
                  of {filteredEnquiries.length} enquiries
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage(Math.max(safeCurrentPage - 1, 1))
                    }
                    disabled={safeCurrentPage === 1}
                    className="rounded-full border border-[#d8dfeb] px-4 py-2 text-sm font-medium text-[#42454c] transition hover:bg-[#f4f6fa] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-semibold text-[#6d7bbb]">
                    Page {safeCurrentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage(Math.min(safeCurrentPage + 1, totalPages))
                    }
                    disabled={safeCurrentPage === totalPages}
                    className="rounded-full border border-[#d8dfeb] px-4 py-2 text-sm font-medium text-[#42454c] transition hover:bg-[#f4f6fa] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      {typeof document !== "undefined" && selectedEnquiry
        ? createPortal(
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-[#42454c]/45 px-4 py-8"
              role="dialog"
              aria-modal="true"
              aria-labelledby="enquiry-detail-title"
              onClick={() => setSelectedEnquiry(null)}
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
                      Enquiry Detail
                    </p>
                    <h4
                      id="enquiry-detail-title"
                      className="mt-3 text-2xl font-semibold tracking-tight text-[#42454c]"
                    >
                      {selectedEnquiry.name}
                    </h4>
                    <p className="mt-2 text-sm text-[#5d6169]">
                      Received {formatDateTime(selectedEnquiry.created_at)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(null)}
                    className="rounded-full border border-[#d8dfeb] px-4 py-2 text-sm font-medium text-[#42454c] transition hover:bg-[#f4f6fa]"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="divide-y divide-[#d8dfeb]">
                    <DetailItem label="Name">
                      <p>{selectedEnquiry.name}</p>
                    </DetailItem>
                    <DetailItem label="Email">
                      <a
                        href={`mailto:${selectedEnquiry.email}`}
                        className="break-all text-[#926ab9] hover:underline"
                      >
                        {selectedEnquiry.email}
                      </a>
                    </DetailItem>
                    <DetailItem label="First Name">
                      <p>{selectedEnquiry.first_name || "Unavailable"}</p>
                    </DetailItem>
                    <DetailItem label="Last Name">
                      <p>{selectedEnquiry.last_name || "Not provided"}</p>
                    </DetailItem>
                    <DetailItem label="Submitted">
                      <p>{formatDateTime(selectedEnquiry.created_at)}</p>
                    </DetailItem>
                  </div>
                  <div className="border-t border-[#d8dfeb] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b869f]">
                      Message
                    </p>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#42454c]">
                      {selectedEnquiry.message}
                    </p>
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
