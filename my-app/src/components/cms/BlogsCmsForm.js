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

function createEmptyHighlightItem() {
  return "";
}

function BlogsHeaderPreview({
  content,
  isEditing,
  isVisible,
  onFieldChange,
  onHighlightItemChange,
  onAddHighlightItem,
  onRemoveHighlightItem,
  onSelect,
}) {
  const highlightItems = content.highlight_items || [];

  return (
    <section
      onClick={onSelect}
      className={`rounded-[1.8rem] p-4 transition ${
        isVisible ? "" : "opacity-45"
      } ${
        isEditing
          ? "border border-[#4b8e9a] ring-2 ring-[#4b8e9a]/15"
          : "cursor-text hover:border hover:border-[#926ab9]"
      }`}
    >
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.85fr)] xl:items-start">
        <div className="max-w-3xl">
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
            className="mt-4 text-3xl font-semibold tracking-tight text-[#42454c] sm:text-4xl lg:text-[3.15rem] lg:leading-[1.04]"
          />

          <div className="mt-8 space-y-5 text-base leading-7 text-[#5d6169]">
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

        <aside className="self-start rounded-[2rem] border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,239,248,0.74))] p-7 shadow-[0_18px_40px_rgba(66,69,76,0.06)]">
          <EditableText
            value={content.highlights_label}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("highlights_label", value)}
            validationKey="highlights_label"
            className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#926ab9]"
          />

          <EditableText
            value={content.highlights_body}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("highlights_body", value)}
            validationKey="highlights_body"
            className="mt-3 text-[0.95rem] leading-6 text-[#5d6169]"
          />

          <div className="mt-6 space-y-3">
            {highlightItems.map((item, index) => (
              <div
                key={`highlight-item-${index + 1}`}
                className="flex items-start gap-3 rounded-2xl bg-white/72 px-4 py-3"
              >
                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef1f6] text-xs font-semibold text-[#6d7bbb]">
                  {index + 1}
                </span>
                <EditableText
                  value={item}
                  isEditing={isEditing}
                  onChange={(value) => onHighlightItemChange(index, value)}
                  validationKey="highlight_item"
                  className="w-full text-[0.92rem] leading-5 text-[#5d6169]"
                />
                {isEditing ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemoveHighlightItem(index);
                    }}
                    className="rounded-full border border-[#d8dfeb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7b8088] transition hover:border-[#b94a48] hover:text-[#b94a48]"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          {isEditing ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onAddHighlightItem();
              }}
              className="mt-4 rounded-full border border-dashed border-[#926ab9]/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6d7bbb] transition hover:border-[#926ab9] hover:bg-white/80"
            >
              Add highlight
            </button>
          ) : null}
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

  const statusBanner = status.message ? (
    <div
      className={`max-w-[26rem] rounded-2xl border px-4 py-3 text-center ${
        status.type === "error"
          ? "border-[#e7c9c8] bg-[#fff6f5] text-[#8b3d3a]"
          : "border-[#cfe5df] bg-[#f4fbf8] text-[#2f7a68]"
      }`}
    >
      <p className="text-sm font-medium leading-6">{status.message}</p>
    </div>
  ) : null;

  useEffect(() => {
    const nextContent = normaliseBlogsContent(initialBlogsContent);
    setBlogsContent(nextContent);
    setDraftContent(nextContent);
    setIsVisible(nextContent.show_header_section);
    setIsEditing(false);
  }, [initialBlogsContent]);

  function updateField(field, value) {
    setDraftContent((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateHighlightItem(index, value) {
    setDraftContent((current) => ({
      ...current,
      highlight_items: current.highlight_items.map((item, itemIndex) =>
        itemIndex === index ? value : item
      ),
    }));
  }

  function addHighlightItem() {
    setDraftContent((current) => ({
      ...current,
      highlight_items: [
        ...(current.highlight_items || []),
        createEmptyHighlightItem(),
      ],
    }));
  }

  function removeHighlightItem(index) {
    setDraftContent((current) => {
      const nextItems = (current.highlight_items || []).filter(
        (_, itemIndex) => itemIndex !== index
      );

      return {
        ...current,
        highlight_items: nextItems.length
          ? nextItems
          : [createEmptyHighlightItem()],
      };
    });
  }

  function getValidationErrors(content) {
    return validateCmsFields([
      { field: "eyebrow", value: content.eyebrow, label: "Blogs eyebrow" },
      { field: "heading", value: content.heading, label: "Blogs heading" },
      {
        field: "intro_body_1",
        value: content.intro_body_1,
        label: "Intro paragraph 1",
      },
      {
        field: "intro_body_2",
        value: content.intro_body_2,
        label: "Intro paragraph 2",
      },
      {
        field: "highlights_label",
        value: content.highlights_label,
        label: "Highlights label",
      },
      {
        field: "highlights_body",
        value: content.highlights_body,
        label: "Highlights body",
      },
      ...(content.highlight_items || []).map((item, index) => ({
        field: "highlight_item",
        value: item,
        label: `Highlight item ${index + 1}`,
      })),
    ]);
  }

  async function persistBlogsContent(
    nextContent,
    successMessage,
    { closeEditor = false } = {}
  ) {
    setIsSaving(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/cms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogs: nextContent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save blogs page content.");
      }

      const nextSavedContent = normaliseBlogsContent(
        result.content?.blogs || nextContent
      );
      setBlogsContent(nextSavedContent);
      setDraftContent(nextSavedContent);
      setIsVisible(nextSavedContent.show_header_section);
      if (closeEditor) {
        setIsEditing(false);
      }
      setStatus({
        type: "success",
        message: successMessage,
      });
      return true;
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save blogs page content.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleEditing() {
    if (isEditing) {
      const errors = getValidationErrors(draftContent);

      if (errors.length) {
        setStatus({
          type: "error",
          message: buildCmsValidationMessage(errors),
        });
        return;
      }

      await persistBlogsContent(draftContent, "Blogs header saved successfully.", {
        closeEditor: true,
      });
      return;
    }

    setStatus({ type: "idle", message: "" });
    setIsEditing(true);
  }

  return (
    <div className="mt-10 space-y-8">
      {loadError ? (
        <div className="rounded-3xl border border-[#e7c9c8] bg-[#fff6f5] px-6 py-5 text-[#8b3d3a]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">
            Load issue
          </p>
          <p className="mt-2 text-base leading-7">{loadError}</p>
        </div>
      ) : null}

      <CmsEditableSection
        title="Blogs Header"
        description=""
        helperText=""
        isEditing={isEditing}
        isVisible={isVisible}
        onToggleEditing={toggleEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          const errors = getValidationErrors(draftContent);

          if (errors.length) {
            setStatus({
              type: "error",
              message: buildCmsValidationMessage(errors),
            });
            return;
          }

          const nextVisible = !isVisible;
          const previousContent = blogsContent;
          const nextContent = {
            ...draftContent,
            show_header_section: nextVisible,
          };

          setIsVisible(nextVisible);
          setBlogsContent(nextContent);
          setDraftContent(nextContent);
          const didSave = await persistBlogsContent(
            nextContent,
            nextVisible
              ? "Blogs header is now visible on the Blogs page."
              : "Blogs header is now hidden on the Blogs page."
          );

          if (!didSave) {
            setIsVisible(!nextVisible);
            setBlogsContent(previousContent);
            setDraftContent(previousContent);
          }
        }}
      >
        <CmsPreviewLayout
          preview={
            <BlogsHeaderPreview
              content={draftContent}
              isEditing={isEditing}
              onFieldChange={updateField}
              onHighlightItemChange={updateHighlightItem}
              onAddHighlightItem={addHighlightItem}
              onRemoveHighlightItem={removeHighlightItem}
              isVisible={isVisible}
              onSelect={() => {
                setStatus({ type: "idle", message: "" });
                setIsEditing(true);
              }}
            />
          }
        />
      </CmsEditableSection>
    </div>
  );
}
