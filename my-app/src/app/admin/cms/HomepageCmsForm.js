"use client";

import { useEffect, useState } from "react";
import { emptyHomepageContent } from "@/lib/cms-homepage";

const fieldGroups = [
  {
    title: "About Practice",
    fields: [
      ["about_badge", "Badge", 2],
      ["about_heading", "Heading", 3],
      ["about_intro", "Intro paragraph", 5],
      ["about_highlight", "Highlight paragraph", 5],
      ["about_closing", "Closing line", 3],
    ],
  },
  {
    title: "Services Intro",
    fields: [
      ["services_heading", "Heading", 2],
      ["services_subheading", "Subheading", 3],
    ],
  },
  {
    title: "Goals",
    fields: [
      ["goals_label", "Label", 2],
      ["goals_heading", "Heading", 3],
      ["goals_body", "Body", 5],
    ],
  },
  {
    title: "Vision",
    fields: [
      ["vision_label", "Label", 2],
      ["vision_heading", "Heading", 3],
      ["vision_body", "Body", 5],
    ],
  },
  {
    title: "Values",
    fields: [
      ["values_label", "Label", 2],
      ["values_heading", "Heading", 3],
      ["values_body", "Body", 5],
    ],
  },
  {
    title: "Testimonials Intro",
    fields: [["testimonials_heading", "Heading", 2]],
  },
  {
    title: "Call To Action",
    fields: [
      ["cta_heading", "Heading", 3],
      ["cta_body", "Body", 4],
      ["cta_button_label", "Button label", 2],
    ],
  },
];

export default function HomepageCmsForm({
  initialContent = emptyHomepageContent,
  loadError = "",
}) {
  const [formData, setFormData] = useState(initialContent);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(initialContent);
  }, [initialContent]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/cms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save homepage content.");
      }

      setFormData(result.content || formData);
      setStatus({
        type: "success",
        message: "Homepage content saved to Supabase.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save homepage content.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8" noValidate>
      {loadError ? (
        <div className="rounded-3xl border border-[#e7c9c8] bg-[#fff6f5] px-6 py-5 text-[#8b3d3a]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">
            Load issue
          </p>
          <p className="mt-2 text-base leading-7">{loadError}</p>
        </div>
      ) : null}

      {fieldGroups.map((group) => (
        <section
          key={group.title}
          className="rounded-[2rem] border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(238,239,242,0.9))] p-6 shadow-sm sm:p-8"
        >
          <h2 className="text-2xl font-semibold text-[#42454c]">
            {group.title}
          </h2>

          <div className="mt-6 grid gap-6">
            {group.fields.map(([name, label, rows]) => (
              <label key={name} className="block">
                <span className="mb-2 block text-sm font-medium text-[#42454c]">
                  {label}
                </span>
                <textarea
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  rows={rows}
                  className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
                />
              </label>
            ))}
          </div>
        </section>
      ))}

      <div className="flex flex-col gap-4 rounded-[2rem] border border-[#d8dfeb] bg-white/90 px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-base font-medium ${
            status.type === "error"
              ? "text-[#b94a48]"
              : status.type === "success"
                ? "text-[#4b8e9a]"
                : "text-[#5d6169]"
          }`}
        >
          {status.message || "Edit the homepage copy here, then save to Supabase."}
        </p>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-2xl bg-[#4b8e9a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3e7882] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save homepage content"}
        </button>
      </div>
    </form>
  );
}
