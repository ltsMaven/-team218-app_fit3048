"use client";

import { useEffect, useState } from "react";
import CmsEditableSection from "./CmsEditableSection";
import CmsPreviewLayout from "./CmsPreviewLayout";
import EditableText from "./EditableText";
import {
  fallbackBlogsContent,
  normaliseBlogsContent,
} from "@/lib/cms-homepage";
import {
  buildCmsValidationMessage,
  validateCmsFields,
} from "@/lib/cms-validation";

const blogHighlights = [
  "Practical guidance for recovery, resilience, and everyday wellbeing.",
  "Compassionate reflections on disability, addiction, and personal growth.",
  "Grounded support you can read at your own pace and return to when needed.",
];


function BlogsHeaderPreview({ content, isEditing, onFieldChange, isVisible }) {
  return (
    <section className={isVisible ? "" : "opacity-45"}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] lg:items-start">
        <div className="max-w-3xl">
          {!isVisible ? (
            <p className="mb-4 inline-flex rounded-full bg-[#42454c] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Hidden on website
            </p>
          ) : null}

          <EditableText
            value={content.eyebrow}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("eyebrow", value)}
            validationKey="eyebrow"
            className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]"
          />

          <EditableText
            as="h1"
            value={content.heading}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("heading", value)}
            validationKey="heading"
            className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c] sm:text-5xl lg:text-[3.7rem] lg:leading-[1.02]"
          />

          <div className="mt-8 space-y-5 text-lg leading-8 text-[#5d6169]">
            <EditableText
              value={content.intro_body_1}
              isEditing={isEditing}
              onChange={(value) => onFieldChange("intro_body_1", value)}
              validationKey="intro_body_1"
            />
            <EditableText
              value={content.intro_body_2}
              isEditing={isEditing}
              onChange={(value) => onFieldChange("intro_body_2", value)}
              validationKey="intro_body_2"
            />
          </div>
        </div>

        <aside className="rounded-[2rem] border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,239,248,0.74))] p-7 shadow-[0_18px_40px_rgba(66,69,76,0.06)]">
          <EditableText
            value={content.highlights_label}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("highlights_label", value)}
            validationKey="highlights_label"
            className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#926ab9]"
          />

          <EditableText
            value={content.highlights_body}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("highlights_body", value)}
            validationKey="highlights_body"
            className="mt-3 text-base leading-7 text-[#5d6169]"
          />

          <div className="mt-6 space-y-3">
            {blogHighlights.map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white/72 px-4 py-3"
              >
                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef1f6] text-xs font-semibold text-[#6d7bbb]">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-[#5d6169]">{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default function BlogsCmsForm({
  initialBlogsContent = fallbackBlogsContent,
  loadError = "",
}) {
  const [blogsContent, setBlogsContent] = useState(
    normaliseBlogsContent(initialBlogsContent)
  );
  const [draftContent, setDraftContent] = useState(
    normaliseBlogsContent(initialBlogsContent)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const nextContent = normaliseBlogsContent(initialBlogsContent);
    setBlogsContent(nextContent);
    setDraftContent(nextContent);
    setIsEditing(false);
  }, [initialBlogsContent]);

  function updateField(field, value) {
    setDraftContent((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function getValidationErrors(content) {
    return validateCmsFields([
      { field: "eyebrow", value: content.eyebrow, label: "Blogs eyebrow" },
      { field: "heading", value: content.heading, label: "Blogs heading" },
      { field: "intro_body_1", value: content.intro_body_1, label: "Intro paragraph 1" },
      { field: "intro_body_2", value: content.intro_body_2, label: "Intro paragraph 2" },
      { field: "highlights_label", value: content.highlights_label, label: "Highlights label" },
      { field: "highlights_body", value: content.highlights_body, label: "Highlights body" },
    ]);
  }

  function toggleEditing() {
    if (isEditing) {
      const errors = getValidationErrors(draftContent);

      if (errors.length) {
        setStatus({
          type: "error",
          message: buildCmsValidationMessage(errors),
        });
        return;
      }

      setBlogsContent(draftContent);
      setStatus({
        type: "success",
        message:
          "Blogs header preview updated. Use Save Blogs Header below to store it in Supabase.",
      });
    } else {
      setDraftContent(blogsContent);
      setStatus({
        type: "idle",
        message: "",
      });
    }

    setIsEditing((current) => !current);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = getValidationErrors(blogsContent);

    if (errors.length) {
      setStatus({
        type: "error",
        message: buildCmsValidationMessage(errors),
      });
      return;
    }

    setIsSaving(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/cms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogs: blogsContent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save blogs page content.");
      }

      const nextContent = normaliseBlogsContent(
        result.content?.blogs || blogsContent
      );
      setBlogsContent(nextContent);
      setDraftContent(nextContent);
      setIsEditing(false);
      setStatus({
        type: "success",
        message: "Blogs page header content saved to Supabase.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save blogs page content.",
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

      <div className="rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6d7bbb]">
          Blogs Header Editor
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#42454c]">
          Edit the real blog listing header
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5d6169]">
          This editor only controls the heading and intro area on the public
          Blogs page. Blog post creation and publishing stay in the existing
          blog admin.
        </p>
      </div>

      <CmsEditableSection
        title="Blogs Header"
        description="Top heading and intro section shown above the public blog listing."
        helperText="Click Edit, then click text areas in the preview to update this section."
        isEditing={isEditing}
        isVisible={isVisible}
        onToggleEditing={toggleEditing}
        onToggleVisible={() => setIsVisible((current) => !current)}
      >
        <CmsPreviewLayout
          preview={
            <BlogsHeaderPreview
              content={isEditing ? draftContent : blogsContent}
              isEditing={isEditing}
              onFieldChange={updateField}
              isVisible={isVisible}
            />
          }
        />
      </CmsEditableSection>

      <div className="sticky bottom-4 z-10 flex flex-col gap-4 rounded-[2rem] border border-[#d8dfeb] bg-white/95 px-6 py-5 shadow-[0_24px_60px_rgba(66,69,76,0.12)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-base font-medium ${
            status.type === "error"
              ? "text-[#b94a48]"
              : status.type === "success"
                ? "text-[#4b8e9a]"
                : "text-[#5d6169]"
          }`}
        >
          {status.message ||
            "Update the blogs header here, then save when you are ready."}
        </p>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-2xl bg-[#4b8e9a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3e7882] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save Blogs Header"}
        </button>
      </div>
    </form>
  );
}
