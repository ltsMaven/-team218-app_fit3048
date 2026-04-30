"use client";

import { useState } from "react";

const MAX_PUBLIC_TESTIMONIALS = 3;
const TESTIMONIALS_PAGE_SIZE = 5;

function formatDateTime(value) {
  if (!value) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusClasses(status) {
  if (status === "approved") {
    return "bg-[#eef6f2] text-[#3c7b5b]";
  }

  if (status === "rejected") {
    return "bg-[#fff2f2] text-[#b04c4c]";
  }

  return "bg-[#f4eff8] text-[#7d58a3]";
}

function getStatusCount(testimonials, status) {
  return testimonials.filter((testimonial) => testimonial.status === status)
    .length;
}

function getButtonClasses(isActive, tone) {
  if (isActive) {
    if (tone === "approve") {
      return "border-[#4b8e9a] bg-[#4b8e9a] text-white";
    }

    if (tone === "reject") {
      return "border-[#b04c4c] bg-[#b04c4c] text-white";
    }

    return "border-[#926ab9] bg-[#926ab9] text-white";
  }

  return "border-[#d8dfeb] bg-white text-[#42454c] hover:border-[#926ab9] hover:text-[#926ab9]";
}

function getTestimonialSearchText(testimonial) {
  return [
    testimonial.name,
    testimonial.email,
    testimonial.display_name,
    testimonial.service,
    testimonial.testimonial,
    testimonial.status,
    testimonial.created_at,
    testimonial.updated_at,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function AdminTestimonialsManager({
  initialTestimonials = [],
  loadError = "",
}) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const normalisedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredTestimonials = normalisedSearchQuery
    ? testimonials.filter((testimonial) =>
        getTestimonialSearchText(testimonial).includes(normalisedSearchQuery)
      )
    : testimonials;
  const totalPages = Math.ceil(
    filteredTestimonials.length / TESTIMONIALS_PAGE_SIZE
  );
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));
  const pageStart = (safeCurrentPage - 1) * TESTIMONIALS_PAGE_SIZE;
  const pageTestimonials = filteredTestimonials.slice(
    pageStart,
    pageStart + TESTIMONIALS_PAGE_SIZE
  );

  async function handleStatusChange(id, nextStatus) {
    const publicCount = getStatusCount(testimonials, "approved");
    const targetTestimonial = testimonials.find(
      (testimonial) => testimonial.id === id
    );

    if (
      nextStatus === "approved" &&
      targetTestimonial?.status !== "approved" &&
      publicCount >= MAX_PUBLIC_TESTIMONIALS
    ) {
      setStatus({
        type: "error",
        message: `Only ${MAX_PUBLIC_TESTIMONIALS} testimonials can be shown on the homepage. Hide one before approving another.`,
      });
      return;
    }

    setUpdatingId(id);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update testimonial.");
      }

      setTestimonials((current) =>
        current.map((testimonial) =>
          testimonial.id === id
            ? {
                ...testimonial,
                status: result.testimonial.status,
                updated_at: result.testimonial.updated_at,
              }
            : testimonial
        )
      );
      setStatus({
        type: "success",
        message:
          nextStatus === "approved"
            ? "Testimonial approved and visible on the homepage."
            : "Testimonial visibility updated.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to update testimonial.",
      });
    } finally {
      setUpdatingId("");
    }
  }

  async function handleDelete(id) {
    const targetTestimonial = testimonials.find(
      (testimonial) => testimonial.id === id
    );
    const confirmed = window.confirm(
      `Delete testimonial from ${
        targetTestimonial?.display_name ||
        targetTestimonial?.name ||
        "this client"
      }? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete testimonial.");
      }

      setTestimonials((current) =>
        current.filter((testimonial) => testimonial.id !== id)
      );
      setCurrentPage(1);
      setStatus({
        type: "success",
        message: "Testimonial deleted.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to delete testimonial.",
      });
    } finally {
      setDeletingId("");
    }
  }

  return (
    <>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-[#d8dfeb] bg-white/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
            Total
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#926ab9]">
            {testimonials.length}
          </p>
        </div>
        <div className="rounded-3xl border border-[#d8dfeb] bg-white/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
            Pending
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#926ab9]">
            {getStatusCount(testimonials, "pending")}
          </p>
        </div>
        <div className="rounded-3xl border border-[#d8dfeb] bg-white/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
            Public
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#4b8e9a]">
            {getStatusCount(testimonials, "approved")}
          </p>
        </div>
        <div className="rounded-3xl border border-[#d8dfeb] bg-white/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]">
            Hidden
          </p>
          <p className="mt-3 text-3xl font-semibold text-[#b04c4c]">
            {getStatusCount(testimonials, "rejected")}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-[#d8dfeb] bg-white/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-[#42454c]">
              Homepage Testimonials
            </h2>
            <p className="mt-2 text-sm text-[#5d6169]">
              Approve testimonials to publish them on the public homepage. Hide
              testimonials to remove them from the homepage. Up to{" "}
              {MAX_PUBLIC_TESTIMONIALS} testimonials can be public at once.
            </p>
          </div>
        </div>

        {status.message ? (
          <div
            className={`mt-6 rounded-2xl border px-5 py-4 text-sm ${
              status.type === "error"
                ? "border-[#f0d0d0] bg-[#fff5f5] text-[#9a3f3f]"
                : "border-[#cfe6da] bg-[#f4fbf7] text-[#3c7b5b]"
            }`}
          >
            {status.message}
          </div>
        ) : null}

        {loadError ? (
          <div className="mt-6 rounded-2xl border border-[#f0d0d0] bg-[#fff5f5] px-5 py-4 text-sm text-[#9a3f3f]">
            {loadError}
          </div>
        ) : null}

        {!loadError && !testimonials.length ? (
          <p className="mt-6 rounded-2xl border border-[#d8dfeb] bg-[#f8f8fb] px-5 py-4 text-sm text-[#5d6169]">
            No testimonial submissions found yet.
          </p>
        ) : null}

        {!loadError && testimonials.length ? (
          <>
            <div className="mt-6">
              <label htmlFor="testimonial-search" className="sr-only">
                Search testimonials
              </label>
              <input
                id="testimonial-search"
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, email, service, status, or testimonial"
                className="w-full rounded-2xl border border-[#d8dfeb] bg-white px-4 py-3 text-sm font-medium text-[#42454c] outline-none transition placeholder:text-[#8a90a0] focus:border-[#926ab9]"
              />
              <p className="mt-2 text-sm text-[#5d6169]">
                Showing {filteredTestimonials.length} of {testimonials.length}{" "}
                testimonials.
              </p>
            </div>

            {filteredTestimonials.length ? (
              <div className="mt-6 space-y-4">
                {pageTestimonials.map((testimonial) => (
                  <article
                    key={testimonial.id}
                    className="rounded-3xl border border-[#d8dfeb] bg-[#fbfcfe] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[#42454c]">
                          {testimonial.display_name || testimonial.name}
                        </h3>
                        <p className="mt-1 text-sm text-[#5d6169]">
                          {testimonial.name} - {testimonial.email}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getStatusClasses(
                          testimonial.status
                        )}`}
                      >
                        {testimonial.status === "approved"
                          ? "public"
                          : testimonial.status}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[#42454c]">
                      {testimonial.testimonial}
                    </p>

                    <div className="mt-5 grid gap-3 text-sm text-[#5d6169] md:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b869f]">
                          Service
                        </p>
                        <p className="mt-1 font-medium text-[#42454c]">
                          {testimonial.service || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b869f]">
                          Submitted
                        </p>
                        <p className="mt-1 font-medium text-[#42454c]">
                          {formatDateTime(testimonial.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={
                          updatingId === testimonial.id ||
                          deletingId === testimonial.id ||
                          (testimonial.status !== "approved" &&
                            getStatusCount(testimonials, "approved") >=
                              MAX_PUBLIC_TESTIMONIALS)
                        }
                        onClick={() =>
                          handleStatusChange(testimonial.id, "approved")
                        }
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${getButtonClasses(
                          testimonial.status === "approved",
                          "approve"
                        )}`}
                      >
                        Show on homepage
                      </button>
                      <button
                        type="button"
                        disabled={
                          updatingId === testimonial.id ||
                          deletingId === testimonial.id
                        }
                        onClick={() =>
                          handleStatusChange(testimonial.id, "rejected")
                        }
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${getButtonClasses(
                          testimonial.status === "rejected",
                          "reject"
                        )}`}
                      >
                        Hide
                      </button>
                      <button
                        type="button"
                        disabled={
                          updatingId === testimonial.id ||
                          deletingId === testimonial.id
                        }
                        onClick={() =>
                          handleStatusChange(testimonial.id, "pending")
                        }
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${getButtonClasses(
                          testimonial.status === "pending",
                          "pending"
                        )}`}
                      >
                        Keep pending
                      </button>
                      <button
                        type="button"
                        disabled={
                          updatingId === testimonial.id ||
                          deletingId === testimonial.id
                        }
                        onClick={() => handleDelete(testimonial.id)}
                        className="rounded-full border border-[#e7c9c8] bg-white px-4 py-2 text-sm font-medium text-[#b04c4c] transition hover:border-[#b04c4c] hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === testimonial.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl border border-[#d8dfeb] bg-[#f8f8fb] px-5 py-4 text-sm text-[#5d6169]">
                No testimonials match your search.
              </p>
            )}

            {totalPages > 1 ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#d8dfeb] pt-4">
                <p className="text-sm text-[#5d6169]">
                  Showing {pageStart + 1}-
                  {Math.min(
                    pageStart + pageTestimonials.length,
                    filteredTestimonials.length
                  )}{" "}
                  of {filteredTestimonials.length} testimonials
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
                      setCurrentPage(
                        Math.min(safeCurrentPage + 1, totalPages)
                      )
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
    </>
  );
}
