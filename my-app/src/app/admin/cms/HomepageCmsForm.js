"use client";

import { useEffect, useState } from "react";
import {
  emptyHomepageContent,
  fallbackAboutContent,
  fallbackServiceItems,
  fallbackServicesContent,
} from "@/lib/cms-homepage";

const homepageGroups = [
  {
    title: "Homepage - About Practice",
    fields: [
      ["about_badge", "Badge", 2],
      ["about_heading", "Heading", 3],
      ["about_intro", "Intro paragraph", 5],
      ["about_highlight", "Highlight paragraph", 5],
      ["about_closing", "Closing line", 3],
    ],
  },
  {
    title: "Homepage - Services Intro",
    fields: [
      ["services_heading", "Heading", 2],
      ["services_subheading", "Subheading", 3],
    ],
  },
  {
    title: "Homepage - Goals, Vision, Values",
    fields: [
      ["goals_label", "Goals label", 2],
      ["goals_heading", "Goals heading", 3],
      ["goals_body", "Goals body", 5],
      ["vision_label", "Vision label", 2],
      ["vision_heading", "Vision heading", 3],
      ["vision_body", "Vision body", 5],
      ["values_label", "Values label", 2],
      ["values_heading", "Values heading", 3],
      ["values_body", "Values body", 5],
    ],
  },
  {
    title: "Homepage - CTA",
    fields: [
      ["testimonials_heading", "Testimonials heading", 2],
      ["cta_heading", "CTA heading", 3],
      ["cta_body", "CTA body", 4],
      ["cta_button_label", "CTA button label", 2],
    ],
  },
];

const aboutGroups = [
  {
    title: "About Me - Hero",
    fields: [
      ["hero_heading", "Heading", 3],
      ["hero_subheading", "Subheading", 2],
    ],
  },
  {
    title: "About Me - Philosophy & Background",
    fields: [
      ["philosophy_heading", "Philosophy heading", 2],
      ["philosophy_body_1", "Philosophy body 1", 5],
      ["philosophy_body_2", "Philosophy body 2", 5],
      ["background_heading", "Background heading", 2],
      ["background_body", "Background body", 6],
    ],
  },
  {
    title: "About Me - Story",
    fields: [
      ["story_heading", "Story heading", 2],
      ["story_subheading", "Story subheading", 2],
      ["story_body_1", "Story body 1", 5],
      ["story_body_2", "Story body 2", 5],
    ],
  },
  {
    title: "About Me - Stats",
    fields: [
      ["stat_1_value", "Stat 1 value", 2],
      ["stat_1_label", "Stat 1 label", 2],
      ["stat_1_body", "Stat 1 body", 4],
      ["stat_2_value", "Stat 2 value", 2],
      ["stat_2_label", "Stat 2 label", 2],
      ["stat_2_body", "Stat 2 body", 4],
      ["stat_3_label", "Stat 3 label", 2],
      ["stat_3_body", "Stat 3 body", 4],
      ["stat_3_button_label", "Stat 3 button label", 2],
    ],
  },
];

const servicesPageFields = [
  ["heading", "Services heading", 2],
  ["intro", "Services intro", 4],
  ["cta_button_label", "CTA button label", 2],
];

function TextareaField({ label, name, value, rows, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#42454c]">
        {label}
      </span>
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        rows={rows}
        className="w-full rounded-2xl border border-[#cfd6e2] bg-white px-4 py-3 text-[#42454c] outline-none transition focus:border-[#926ab9]"
      />
    </label>
  );
}

function CmsSection({ title, children }) {
  return (
    <section className="rounded-[2rem] border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(238,239,242,0.9))] p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-semibold text-[#42454c]">{title}</h2>
      <div className="mt-6 grid gap-6">{children}</div>
    </section>
  );
}

export default function HomepageCmsForm({
  initialHomepageContent = emptyHomepageContent,
  initialAboutContent = fallbackAboutContent,
  initialServicesContent = fallbackServicesContent,
  initialServiceItems = fallbackServiceItems,
  loadError = "",
}) {
  const [homepage, setHomepage] = useState(initialHomepageContent);
  const [about, setAbout] = useState(initialAboutContent);
  const [services, setServices] = useState(initialServicesContent);
  const [serviceItems, setServiceItems] = useState(initialServiceItems);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setHomepage(initialHomepageContent);
    setAbout(initialAboutContent);
    setServices(initialServicesContent);
    setServiceItems(initialServiceItems);
  }, [
    initialAboutContent,
    initialHomepageContent,
    initialServiceItems,
    initialServicesContent,
  ]);

  function updateSection(setter, name, value) {
    setter((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateAboutTags(value) {
    setAbout((current) => ({
      ...current,
      focus_tags: value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  }

  function updateServiceItem(index, name, value) {
    setServiceItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [name]: value,
            }
          : item
      )
    );
  }

  function updateServiceFeatures(index, value) {
    setServiceItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              features: value
                .split("\n")
                .map((feature) => feature.trim())
                .filter(Boolean),
            }
          : item
      )
    );
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
        body: JSON.stringify({
          homepage,
          about,
          services,
          serviceItems,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save CMS content.");
      }

      setHomepage(result.content?.homepage || homepage);
      setAbout(result.content?.about || about);
      setServices(result.content?.services || services);
      setServiceItems(result.content?.serviceItems || serviceItems);
      setStatus({
        type: "success",
        message: "CMS content saved to Supabase.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save CMS content.",
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

      {homepageGroups.map((group) => (
        <CmsSection key={group.title} title={group.title}>
          {group.fields.map(([name, label, rows]) => (
            <TextareaField
              key={name}
              label={label}
              name={name}
              value={homepage[name]}
              rows={rows}
              onChange={(event) =>
                updateSection(setHomepage, name, event.target.value)
              }
            />
          ))}
        </CmsSection>
      ))}

      {aboutGroups.map((group) => (
        <CmsSection key={group.title} title={group.title}>
          {group.fields.map(([name, label, rows]) => (
            <TextareaField
              key={name}
              label={label}
              name={name}
              value={about[name]}
              rows={rows}
              onChange={(event) =>
                updateSection(setAbout, name, event.target.value)
              }
            />
          ))}
        </CmsSection>
      ))}

      <CmsSection title="About Me - Focus Tags">
        <TextareaField
          label="Focus tags, one per line"
          name="focus_tags"
          value={(about.focus_tags || []).join("\n")}
          rows={6}
          onChange={(event) => updateAboutTags(event.target.value)}
        />
      </CmsSection>

      <CmsSection title="Services Page Intro">
        {servicesPageFields.map(([name, label, rows]) => (
          <TextareaField
            key={name}
            label={label}
            name={name}
            value={services[name]}
            rows={rows}
            onChange={(event) =>
              updateSection(setServices, name, event.target.value)
            }
          />
        ))}
      </CmsSection>

      <CmsSection title="Services Cards">
        {serviceItems.map((service, index) => (
          <div
            key={service.id || `${service.title}-${index}`}
            className="rounded-3xl border border-[#d8dfeb] bg-white/80 p-5"
          >
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-semibold text-[#42454c]">
                Service {index + 1}: {service.title || "Untitled"}
              </h3>
              <p className="text-sm text-[#6d7bbb]">
                Icon key: {service.icon_key}
              </p>
            </div>

            <div className="grid gap-5">
              {[
                ["title", "Title", 2],
                ["label", "Label", 2],
                ["price", "Price", 2],
                ["price_detail", "Price detail", 2],
                ["description", "Description", 5],
                ["icon_key", "Icon key", 2],
                ["tint", "Tint class", 2],
                ["accent", "Accent class", 2],
              ].map(([name, label, rows]) => (
                <TextareaField
                  key={name}
                  label={label}
                  name={name}
                  value={service[name]}
                  rows={rows}
                  onChange={(event) =>
                    updateServiceItem(index, name, event.target.value)
                  }
                />
              ))}

              <TextareaField
                label="Features, one per line"
                name="features"
                value={(service.features || []).join("\n")}
                rows={6}
                onChange={(event) =>
                  updateServiceFeatures(index, event.target.value)
                }
              />
            </div>
          </div>
        ))}
      </CmsSection>

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
          {status.message || "Edit the site copy here, then save to Supabase."}
        </p>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-2xl bg-[#4b8e9a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3e7882] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save CMS content"}
        </button>
      </div>
    </form>
  );
}
