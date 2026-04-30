"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function isInvalidRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return false;
  }

  return startDate > endDate;
}

export default function BusinessStatisticsDateFilter({
  selectedStartDate = "",
  selectedEndDate = "",
}) {
  const router = useRouter();
  const [startDate, setStartDate] = useState(selectedStartDate);
  const [endDate, setEndDate] = useState(selectedEndDate);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (isInvalidRange(startDate, endDate)) {
      setError("Start date cannot be later than end date.");
      return;
    }

    setError("");

    const params = new URLSearchParams();

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    const query = params.toString();
    router.push(
      query
        ? `/admin/business-statistics?${query}`
        : "/admin/business-statistics",
      { scroll: false }
    );
  }

  function handleReset() {
    setStartDate("");
    setEndDate("");
    setError("");
    router.push("/admin/business-statistics", { scroll: false });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid w-full gap-3 rounded-3xl border border-[#d8dfeb] bg-[#f8f8fb] p-4 sm:grid-cols-2 lg:w-auto lg:grid-cols-[10rem_10rem_auto]"
    >
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6d7bbb]">
          Start Date
        </span>
        <input
          id="popular-services-start-date"
          type="date"
          name="startDate"
          value={startDate}
          onChange={(event) => {
            setStartDate(event.target.value);
            setError("");
          }}
          aria-invalid={Boolean(error)}
          className="w-full rounded-full border border-[#d8dfeb] bg-white px-4 py-2 text-sm font-medium text-[#42454c] outline-none transition focus:border-[#926ab9]"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[#6d7bbb]">
          End Date
        </span>
        <input
          id="popular-services-end-date"
          type="date"
          name="endDate"
          value={endDate}
          onChange={(event) => {
            setEndDate(event.target.value);
            setError("");
          }}
          aria-invalid={Boolean(error)}
          className="w-full rounded-full border border-[#d8dfeb] bg-white px-4 py-2 text-sm font-medium text-[#42454c] outline-none transition focus:border-[#926ab9]"
        />
      </label>
      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="rounded-full bg-[#926ab9] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#7d58a3]"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-[#d8dfeb] bg-white px-5 py-2 text-sm font-medium text-[#42454c] transition hover:bg-[#f4f6fa]"
        >
          Reset
        </button>
      </div>
      {error ? (
        <p className="text-sm font-medium text-[#b94a48] sm:col-span-2 lg:col-span-3">
          {error}
        </p>
      ) : null}
    </form>
  );
}
