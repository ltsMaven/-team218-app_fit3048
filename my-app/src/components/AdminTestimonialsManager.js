"use client";

import { useState } from "react";

const MAX_PUBLIC_TESTIMONIALS = 3;

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

export default function AdminTestimonialsManager({
  initialTestimonials = [],
  loadError = "",
}) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [updatingId, setUpdatingId] = useState("");

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
          <div className="mt-6 space-y-4">
            {testimonials.map((testimonial) => (
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
                    disabled={updatingId === testimonial.id}
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
                    disabled={updatingId === testimonial.id}
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
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
