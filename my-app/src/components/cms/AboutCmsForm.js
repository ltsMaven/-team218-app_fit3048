"use client";

import { useEffect, useState } from "react";
import CmsEditableSection from "./CmsEditableSection";
import CmsPreviewLayout from "./CmsPreviewLayout";
import EditableText from "./EditableText";
import { fallbackAboutContent, normaliseAboutContent } from "@/lib/cms-homepage";
import {
  buildCmsValidationMessage,
  validateCmsFields,
} from "@/lib/cms-validation";

function parseTagList(value = "") {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function EditableImage({ src, alt, isEditing, onSelectFile, heightClass }) {
  return (
    <label
      className={`block overflow-hidden rounded-[2.5rem] ${
        isEditing ? "cursor-pointer ring-2 ring-dashed ring-[#926ab9]/45" : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={`${heightClass} w-full object-cover`} />
      {isEditing ? (
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={onSelectFile}
        />
      ) : null}
    </label>
  );
}

function FocusTagsEditor({ tags, isEditing, onChange }) {
  return (
    <div>
      <EditableText
        value={tags.join(", ")}
        isEditing={isEditing}
        onChange={(value) => onChange(parseTagList(value))}
        validationKey="focus_tags"
        className="text-sm leading-7 text-[#5c6069]"
      />
      <p className="mt-2 text-xs leading-5 text-[#6d7280]">
        Type a comma to add a new tag.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-[#42454c] shadow-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function PreviewFrame({ isEditing, isVisible, onSelect, children }) {
  return (
    <div
      onClick={onSelect}
      className={`rounded-[2rem] p-4 transition ${
        isVisible ? "" : "opacity-45"
      } ${
        isEditing
          ? "border border-[#4b8e9a] ring-2 ring-[#4b8e9a]/15"
          : "cursor-text hover:border hover:border-[#926ab9]"
      }`}
    >
      {children}
    </div>
  );
}

function AboutHeroPreview({
  content,
  isEditing,
  isVisible,
  onFieldChange,
  heroImageUrl,
  onSelectImage,
  onSelect,
}) {
  return (
    <PreviewFrame isEditing={isEditing} isVisible={isVisible} onSelect={onSelect}>
      <div className="bg-[#f7f7f6] pb-8">
        <section className="px-6 pt-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem]">
            <EditableImage
              src={
                heroImageUrl ||
                content.hero_image_url ||
                "/assets/about/about-hero.jpeg"
              }
              alt="About hero preview"
              isEditing={isEditing}
              onSelectFile={onSelectImage}
              heightClass="h-[260px] sm:h-[340px] lg:h-[420px]"
            />
          </div>
        </section>

        <section className="px-6 pb-4 pt-10">
          <div className="mx-auto max-w-5xl text-center">
            <EditableText
              as="h1"
              value={content.hero_heading}
              isEditing={isEditing}
              onChange={(value) => onFieldChange("hero_heading", value)}
              validationKey="hero_heading"
              className="mb-6 text-4xl font-semibold leading-tight text-[#42454c] sm:text-5xl lg:text-6xl"
            />
            <EditableText
              value={content.hero_subheading}
              isEditing={isEditing}
              onChange={(value) => onFieldChange("hero_subheading", value)}
              validationKey="hero_subheading"
              className="text-xl font-medium text-[#5c6069]"
            />
          </div>
        </section>
      </div>
    </PreviewFrame>
  );
}

function AboutStoryPreview({ content, isEditing, isVisible, onFieldChange, onSelect }) {
  return (
    <PreviewFrame isEditing={isEditing} isVisible={isVisible} onSelect={onSelect}>
      <section className="bg-[#f7f7f6] px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2.5rem] border border-[#d9deeb] bg-white px-10 py-12 shadow-[0_10px_25px_rgba(0,0,0,0.08)] lg:px-16 lg:py-14">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <EditableText
                  as="h2"
                  value={content.story_heading}
                  isEditing={isEditing}
                  onChange={(value) => onFieldChange("story_heading", value)}
                  validationKey="story_heading"
                  className="text-3xl font-semibold leading-tight text-[#42454c]"
                />
                <EditableText
                  value={content.story_subheading}
                  isEditing={isEditing}
                  onChange={(value) => onFieldChange("story_subheading", value)}
                  validationKey="story_subheading"
                  className="mt-4 text-lg text-[#5c6069]"
                />
              </div>

              <div className="space-y-6 text-base leading-8 text-[#5d6169]">
                <EditableText
                  value={content.story_body_1}
                  isEditing={isEditing}
                  onChange={(value) => onFieldChange("story_body_1", value)}
                  validationKey="story_body_1"
                  className="whitespace-pre-wrap"
                />
                <div className="h-px w-16 bg-[#d9deeb]" />
                <EditableText
                  value={content.story_body_2}
                  isEditing={isEditing}
                  onChange={(value) => onFieldChange("story_body_2", value)}
                  validationKey="story_body_2"
                  className="whitespace-pre-wrap"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PreviewFrame>
  );
}

function AboutSplitPreview({
  content,
  isEditing,
  isVisible,
  onFieldChange,
  imageUrl,
  onSelectImage,
  onSelect,
  imageFirst = true,
  headingKey,
  bodyKeys,
}) {
  const imageBlock = (
    <EditableImage
      src={imageUrl}
      alt={content[headingKey]}
      isEditing={isEditing}
      onSelectFile={onSelectImage}
      heightClass="h-[320px] lg:h-[520px]"
    />
  );

  const textBlock = (
    <div>
      <EditableText
        as="p"
        value={content[headingKey]}
        isEditing={isEditing}
        onChange={(value) => onFieldChange(headingKey, value)}
        validationKey={headingKey}
        className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]"
      />
      <EditableText
        as="h2"
        value={content[headingKey]}
        isEditing={isEditing}
        onChange={(value) => onFieldChange(headingKey, value)}
        validationKey={headingKey}
        className="mt-4 text-3xl font-semibold leading-tight text-[#42454c] sm:text-4xl"
      />

      {bodyKeys.map((key, index) => (
        <div key={key}>
          {index > 0 ? <div className="mt-6 h-px w-16 bg-[#926ab9]/30" /> : null}
          <EditableText
            value={content[key]}
            isEditing={isEditing}
            onChange={(value) => onFieldChange(key, value)}
            validationKey={key}
            className={`${
              index === 0 ? "mt-8" : "mt-6"
            } whitespace-pre-wrap text-base leading-9 text-[#5d6169]`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <PreviewFrame isEditing={isEditing} isVisible={isVisible} onSelect={onSelect}>
      <section className="bg-[#f7f7f6] px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div
            className={`grid grid-cols-1 items-center gap-12 ${
              imageFirst
                ? "lg:grid-cols-[0.95fr_1.05fr]"
                : "lg:grid-cols-[1.05fr_0.95fr]"
            }`}
          >
            {imageFirst ? (
              <>
                {imageBlock}
                {textBlock}
              </>
            ) : (
              <>
                <div className="order-2 lg:order-1">{textBlock}</div>
                <div className="order-1 lg:order-2">{imageBlock}</div>
              </>
            )}
          </div>
        </div>
      </section>
    </PreviewFrame>
  );
}

function AboutFocusPreview({
  content,
  isEditing,
  isVisible,
  onFieldChange,
  onTagsChange,
  onSelect,
}) {
  return (
    <PreviewFrame isEditing={isEditing} isVisible={isVisible} onSelect={onSelect}>
      <section className="bg-[#f7f7f6] px-6 py-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#edf0f7] px-8 py-10 lg:px-12 lg:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <EditableText
                as="p"
                value={content.focus_label}
                isEditing={isEditing}
                onChange={(value) => onFieldChange("focus_label", value)}
                validationKey="focus_label"
                className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]"
              />
            </div>

            <FocusTagsEditor
              tags={content.focus_tags || []}
              isEditing={isEditing}
              onChange={onTagsChange}
            />
          </div>
        </div>
      </section>
    </PreviewFrame>
  );
}

function StatBlock({ value, label, body, isEditing, onFieldChange, tone }) {
  return (
    <div>
      <EditableText
        as="p"
        value={value}
        isEditing={isEditing}
        onChange={(nextValue) => onFieldChange(tone.valueKey, nextValue)}
        validationKey={tone.valueKey}
        className={`text-5xl font-light lg:text-6xl ${tone.valueClass}`}
      />
      <EditableText
        as="h3"
        value={label}
        isEditing={isEditing}
        onChange={(nextValue) => onFieldChange(tone.labelKey, nextValue)}
        validationKey={tone.labelKey}
        className="mt-4 text-2xl font-medium text-[#42454c]"
      />
      <EditableText
        value={body}
        isEditing={isEditing}
        onChange={(nextValue) => onFieldChange(tone.bodyKey, nextValue)}
        validationKey={tone.bodyKey}
        className="mt-4 whitespace-pre-wrap text-base leading-8 text-[#5d6169]"
      />
    </div>
  );
}

function AboutStatsPreview({ content, isEditing, isVisible, onFieldChange, onSelect }) {
  return (
    <PreviewFrame isEditing={isEditing} isVisible={isVisible} onSelect={onSelect}>
      <section className="bg-[#f7f7f6] px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_0.9fr_1.2fr]">
            <StatBlock
              value={content.stat_1_value}
              label={content.stat_1_label}
              body={content.stat_1_body}
              isEditing={isEditing}
              onFieldChange={onFieldChange}
              tone={{
                valueKey: "stat_1_value",
                labelKey: "stat_1_label",
                bodyKey: "stat_1_body",
                valueClass: "text-[#7ea6d8]",
              }}
            />

            <StatBlock
              value={content.stat_2_value}
              label={content.stat_2_label}
              body={content.stat_2_body}
              isEditing={isEditing}
              onFieldChange={onFieldChange}
              tone={{
                valueKey: "stat_2_value",
                labelKey: "stat_2_label",
                bodyKey: "stat_2_body",
                valueClass: "text-[#926ab9]",
              }}
            />

            <div className="rounded-[2rem] bg-white px-8 py-10 shadow-sm">
              <div className="h-[35px]" />
              <EditableText
                as="h3"
                value={content.stat_3_label}
                isEditing={isEditing}
                onChange={(value) => onFieldChange("stat_3_label", value)}
                validationKey="stat_3_label"
                className="text-2xl font-medium text-[#42454c]"
              />
              <EditableText
                value={content.stat_3_body}
                isEditing={isEditing}
                onChange={(value) => onFieldChange("stat_3_body", value)}
                validationKey="stat_3_body"
                className="mt-4 whitespace-pre-wrap text-base leading-8 text-[#5d6169]"
              />
            </div>
          </div>
        </div>
      </section>
    </PreviewFrame>
  );
}

export default function AboutCmsForm({
  initialAboutContent = fallbackAboutContent,
  loadError = "",
}) {
  const [about, setAbout] = useState(normaliseAboutContent(initialAboutContent));
  const [draftHero, setDraftHero] = useState(normaliseAboutContent(initialAboutContent));
  const [draftStory, setDraftStory] = useState(normaliseAboutContent(initialAboutContent));
  const [draftPhilosophy, setDraftPhilosophy] = useState(normaliseAboutContent(initialAboutContent));
  const [draftBackground, setDraftBackground] = useState(normaliseAboutContent(initialAboutContent));
  const [draftFocus, setDraftFocus] = useState(normaliseAboutContent(initialAboutContent));
  const [draftStats, setDraftStats] = useState(normaliseAboutContent(initialAboutContent));
  const [isHeroEditing, setIsHeroEditing] = useState(false);
  const [isStoryEditing, setIsStoryEditing] = useState(false);
  const [isPhilosophyEditing, setIsPhilosophyEditing] = useState(false);
  const [isBackgroundEditing, setIsBackgroundEditing] = useState(false);
  const [isFocusEditing, setIsFocusEditing] = useState(false);
  const [isStatsEditing, setIsStatsEditing] = useState(false);
  const [sectionVisibility, setSectionVisibility] = useState({
    hero: true,
    story: true,
    philosophy: true,
    background: true,
    focus: true,
    stats: true,
  });
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [philosophyImageUrl, setPhilosophyImageUrl] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const statusBanner = status.message ? (
    <div
      className={`max-w-[28rem] rounded-2xl border px-4 py-3 text-center ${
        status.type === "error"
          ? "border-[#e7c9c8] bg-[#fff6f5] text-[#8b3d3a]"
          : "border-[#cfe5df] bg-[#f4fbf8] text-[#2f7a68]"
      }`}
    >
      <p className="text-sm font-medium leading-6">{status.message}</p>
    </div>
  ) : null;

  useEffect(() => {
    const nextAbout = normaliseAboutContent(initialAboutContent);
    setAbout(nextAbout);
    setDraftHero(nextAbout);
    setDraftStory(nextAbout);
    setDraftPhilosophy(nextAbout);
    setDraftBackground(nextAbout);
    setDraftFocus(nextAbout);
    setDraftStats(nextAbout);
    setIsHeroEditing(false);
    setIsStoryEditing(false);
    setIsPhilosophyEditing(false);
    setIsBackgroundEditing(false);
    setIsFocusEditing(false);
    setIsStatsEditing(false);
    setSectionVisibility({
      hero: nextAbout.show_hero_section,
      story: nextAbout.show_story_section,
      philosophy: nextAbout.show_philosophy_section,
      background: nextAbout.show_background_section,
      focus: nextAbout.show_focus_section,
      stats: nextAbout.show_stats_section,
    });
  }, [initialAboutContent]);

  useEffect(() => {
    return () => {
      [heroImageUrl, philosophyImageUrl, backgroundImageUrl].forEach((url) => {
        if (url?.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [backgroundImageUrl, heroImageUrl, philosophyImageUrl]);

  function updateDraft(setter, name, value) {
    setter((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateFocusTags(tags) {
    setDraftFocus((current) => ({
      ...current,
      focus_tags: tags,
    }));
  }

  function ensureValid(fields) {
    const errors = validateCmsFields(fields);

    if (!errors.length) {
      return true;
    }

    setStatus({
      type: "error",
      message: buildCmsValidationMessage(errors),
    });
    return false;
  }

  async function persistAboutContent(nextAbout, successMessage, options = {}) {
    const { closeEditors = [] } = options;

    setIsSaving(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/cms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          about: nextAbout,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save About content.");
      }

      const savedAbout = normaliseAboutContent(result.content?.about || nextAbout);
      setAbout(savedAbout);
      setDraftHero(savedAbout);
      setDraftStory(savedAbout);
      setDraftPhilosophy(savedAbout);
      setDraftBackground(savedAbout);
      setDraftFocus(savedAbout);
      setDraftStats(savedAbout);
      setSectionVisibility({
        hero: savedAbout.show_hero_section,
        story: savedAbout.show_story_section,
        philosophy: savedAbout.show_philosophy_section,
        background: savedAbout.show_background_section,
        focus: savedAbout.show_focus_section,
        stats: savedAbout.show_stats_section,
      });

      if (closeEditors.includes("hero")) setIsHeroEditing(false);
      if (closeEditors.includes("story")) setIsStoryEditing(false);
      if (closeEditors.includes("philosophy")) setIsPhilosophyEditing(false);
      if (closeEditors.includes("background")) setIsBackgroundEditing(false);
      if (closeEditors.includes("focus")) setIsFocusEditing(false);
      if (closeEditors.includes("stats")) setIsStatsEditing(false);

      setStatus({
        type: "success",
        message: successMessage,
      });
      return true;
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save About content.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadImage(event, folder, setter, fieldName) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    setStatus({ type: "idle", message: "" });

    try {
      const uploadPayload = new FormData();
      uploadPayload.append("file", file);
      uploadPayload.append("folder", folder);

      const response = await fetch("/api/cms-images", {
        method: "POST",
        body: uploadPayload,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to upload About page image.");
      }

      setter(result.imageUrl);

      if (fieldName === "hero_image_url") {
        setDraftHero((current) => ({ ...current, hero_image_url: result.imageUrl }));
      } else if (fieldName === "philosophy_image_url") {
        setDraftPhilosophy((current) => ({
          ...current,
          philosophy_image_url: result.imageUrl,
        }));
      } else if (fieldName === "background_image_url") {
        setDraftBackground((current) => ({
          ...current,
          background_image_url: result.imageUrl,
        }));
      }

      setStatus({
        type: "success",
        message: "About page image uploaded. Save the section to keep it.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to upload About page image.",
      });
    } finally {
      event.target.value = "";
      setIsUploadingImage(false);
    }
  }

  async function toggleSectionVisible(sectionKey, fieldName, sourceAbout, successCopy) {
    const nextVisible = !sectionVisibility[sectionKey];
    const previousAbout = about;
    const nextAbout = {
      ...sourceAbout,
      [fieldName]: nextVisible,
    };

    setSectionVisibility((current) => ({
      ...current,
      [sectionKey]: nextVisible,
    }));
    setAbout(nextAbout);
    const didSave = await persistAboutContent(nextAbout, successCopy(nextVisible));

    if (!didSave) {
      setSectionVisibility((current) => ({
        ...current,
        [sectionKey]: !nextVisible,
      }));
      setAbout(previousAbout);
    }
  }

  function getFocusValidationFields(source) {
    return [
      { field: "focus_label", value: source.focus_label, label: "Focus label" },
      ...source.focus_tags.map((tag, index) => ({
        field: "focus_tag",
        value: tag,
        label: `Focus tag ${index + 1}`,
      })),
    ];
  }

  async function handleToggleHeroEditing() {
    if (isHeroEditing) {
      const fields = [
        { field: "hero_heading", value: draftHero.hero_heading, label: "Hero heading" },
        { field: "hero_subheading", value: draftHero.hero_subheading, label: "Hero subheading" },
      ];

      if (!ensureValid(fields)) {
        return;
      }

      await persistAboutContent(
        {
          ...about,
          hero_image_url: draftHero.hero_image_url,
          hero_heading: draftHero.hero_heading,
          hero_subheading: draftHero.hero_subheading,
        },
        "Hero section saved successfully.",
        { closeEditors: ["hero"] }
      );
      return;
    }

    setStatus({ type: "idle", message: "" });
    setIsHeroEditing(true);
  }

  async function handleToggleStoryEditing() {
    if (isStoryEditing) {
      const fields = [
        { field: "story_heading", value: draftStory.story_heading, label: "Story heading" },
        { field: "story_subheading", value: draftStory.story_subheading, label: "Story subheading" },
        { field: "story_body_1", value: draftStory.story_body_1, label: "Story body 1" },
        { field: "story_body_2", value: draftStory.story_body_2, label: "Story body 2" },
      ];

      if (!ensureValid(fields)) {
        return;
      }

      await persistAboutContent(
        {
          ...about,
          story_heading: draftStory.story_heading,
          story_subheading: draftStory.story_subheading,
          story_body_1: draftStory.story_body_1,
          story_body_2: draftStory.story_body_2,
        },
        "Story introduction saved successfully.",
        { closeEditors: ["story"] }
      );
      return;
    }

    setStatus({ type: "idle", message: "" });
    setIsStoryEditing(true);
  }

  async function handleTogglePhilosophyEditing() {
    if (isPhilosophyEditing) {
      const fields = [
        { field: "philosophy_heading", value: draftPhilosophy.philosophy_heading, label: "Philosophy heading" },
        { field: "philosophy_body_1", value: draftPhilosophy.philosophy_body_1, label: "Philosophy body 1" },
        { field: "philosophy_body_2", value: draftPhilosophy.philosophy_body_2, label: "Philosophy body 2" },
      ];

      if (!ensureValid(fields)) {
        return;
      }

      await persistAboutContent(
        {
          ...about,
          philosophy_image_url: draftPhilosophy.philosophy_image_url,
          philosophy_heading: draftPhilosophy.philosophy_heading,
          philosophy_body_1: draftPhilosophy.philosophy_body_1,
          philosophy_body_2: draftPhilosophy.philosophy_body_2,
        },
        "Philosophy section saved successfully.",
        { closeEditors: ["philosophy"] }
      );
      return;
    }

    setStatus({ type: "idle", message: "" });
    setIsPhilosophyEditing(true);
  }

  async function handleToggleBackgroundEditing() {
    if (isBackgroundEditing) {
      const fields = [
        { field: "background_heading", value: draftBackground.background_heading, label: "Background heading" },
        { field: "background_body", value: draftBackground.background_body, label: "Background body" },
      ];

      if (!ensureValid(fields)) {
        return;
      }

      await persistAboutContent(
        {
          ...about,
          background_image_url: draftBackground.background_image_url,
          background_heading: draftBackground.background_heading,
          background_body: draftBackground.background_body,
        },
        "Professional background section saved successfully.",
        { closeEditors: ["background"] }
      );
      return;
    }

    setStatus({ type: "idle", message: "" });
    setIsBackgroundEditing(true);
  }

  async function handleToggleFocusEditing() {
    if (isFocusEditing) {
      const fields = getFocusValidationFields(draftFocus);

      if (!ensureValid(fields)) {
        return;
      }

      await persistAboutContent(
        {
          ...about,
          focus_label: draftFocus.focus_label,
          focus_tags: draftFocus.focus_tags,
        },
        "Focus areas section saved successfully.",
        { closeEditors: ["focus"] }
      );
      return;
    }

    setStatus({ type: "idle", message: "" });
    setIsFocusEditing(true);
  }

  async function handleToggleStatsEditing() {
    if (isStatsEditing) {
      const fields = [
        { field: "stat_1_value", value: draftStats.stat_1_value, label: "Stat 1 value" },
        { field: "stat_1_label", value: draftStats.stat_1_label, label: "Stat 1 label" },
        { field: "stat_1_body", value: draftStats.stat_1_body, label: "Stat 1 body" },
        { field: "stat_2_value", value: draftStats.stat_2_value, label: "Stat 2 value" },
        { field: "stat_2_label", value: draftStats.stat_2_label, label: "Stat 2 label" },
        { field: "stat_2_body", value: draftStats.stat_2_body, label: "Stat 2 body" },
        { field: "stat_3_label", value: draftStats.stat_3_label, label: "Stat 3 label" },
        { field: "stat_3_body", value: draftStats.stat_3_body, label: "Stat 3 body" },
      ];

      if (!ensureValid(fields)) {
        return;
      }

      await persistAboutContent(
        {
          ...about,
          stat_1_value: draftStats.stat_1_value,
          stat_1_label: draftStats.stat_1_label,
          stat_1_body: draftStats.stat_1_body,
          stat_2_value: draftStats.stat_2_value,
          stat_2_label: draftStats.stat_2_label,
          stat_2_body: draftStats.stat_2_body,
          stat_3_label: draftStats.stat_3_label,
          stat_3_body: draftStats.stat_3_body,
        },
        "Support stats section saved successfully.",
        { closeEditors: ["stats"] }
      );
      return;
    }

    setStatus({ type: "idle", message: "" });
    setIsStatsEditing(true);
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
        title="Hero"
        description=""
        helperText=""
        isEditing={isHeroEditing}
        isVisible={sectionVisibility.hero}
        onToggleEditing={handleToggleHeroEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          const fields = [
            { field: "hero_heading", value: draftHero.hero_heading, label: "Hero heading" },
            { field: "hero_subheading", value: draftHero.hero_subheading, label: "Hero subheading" },
          ];

          if (!ensureValid(fields)) {
            return;
          }

          await toggleSectionVisible(
            "hero",
            "show_hero_section",
            {
              ...about,
              hero_image_url: draftHero.hero_image_url,
              hero_heading: draftHero.hero_heading,
              hero_subheading: draftHero.hero_subheading,
            },
            (isVisible) =>
              isVisible
                ? "Hero section is now visible on the About page."
                : "Hero section is now hidden on the About page."
          );
        }}
      >
        <CmsPreviewLayout
          preview={
            <AboutHeroPreview
              content={draftHero}
              isEditing={isHeroEditing}
              isVisible={sectionVisibility.hero}
              onFieldChange={(name, value) => updateDraft(setDraftHero, name, value)}
              heroImageUrl={heroImageUrl}
              onSelectImage={(event) =>
                uploadImage(event, "about", setHeroImageUrl, "hero_image_url")
              }
              onSelect={() => {
                setStatus({ type: "idle", message: "" });
                setIsHeroEditing(true);
              }}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Story Introduction"
        description=""
        helperText=""
        isEditing={isStoryEditing}
        isVisible={sectionVisibility.story}
        onToggleEditing={handleToggleStoryEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          const fields = [
            { field: "story_heading", value: draftStory.story_heading, label: "Story heading" },
            { field: "story_subheading", value: draftStory.story_subheading, label: "Story subheading" },
            { field: "story_body_1", value: draftStory.story_body_1, label: "Story body 1" },
            { field: "story_body_2", value: draftStory.story_body_2, label: "Story body 2" },
          ];

          if (!ensureValid(fields)) {
            return;
          }

          await toggleSectionVisible(
            "story",
            "show_story_section",
            {
              ...about,
              story_heading: draftStory.story_heading,
              story_subheading: draftStory.story_subheading,
              story_body_1: draftStory.story_body_1,
              story_body_2: draftStory.story_body_2,
            },
            (isVisible) =>
              isVisible
                ? "Story introduction is now visible on the About page."
                : "Story introduction is now hidden on the About page."
          );
        }}
      >
        <CmsPreviewLayout
          preview={
            <AboutStoryPreview
              content={draftStory}
              isEditing={isStoryEditing}
              isVisible={sectionVisibility.story}
              onFieldChange={(name, value) => updateDraft(setDraftStory, name, value)}
              onSelect={() => {
                setStatus({ type: "idle", message: "" });
                setIsStoryEditing(true);
              }}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Philosophy"
        description=""
        helperText=""
        isEditing={isPhilosophyEditing}
        isVisible={sectionVisibility.philosophy}
        onToggleEditing={handleTogglePhilosophyEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          const fields = [
            { field: "philosophy_heading", value: draftPhilosophy.philosophy_heading, label: "Philosophy heading" },
            { field: "philosophy_body_1", value: draftPhilosophy.philosophy_body_1, label: "Philosophy body 1" },
            { field: "philosophy_body_2", value: draftPhilosophy.philosophy_body_2, label: "Philosophy body 2" },
          ];

          if (!ensureValid(fields)) {
            return;
          }

          await toggleSectionVisible(
            "philosophy",
            "show_philosophy_section",
            {
              ...about,
              philosophy_image_url: draftPhilosophy.philosophy_image_url,
              philosophy_heading: draftPhilosophy.philosophy_heading,
              philosophy_body_1: draftPhilosophy.philosophy_body_1,
              philosophy_body_2: draftPhilosophy.philosophy_body_2,
            },
            (isVisible) =>
              isVisible
                ? "Philosophy section is now visible on the About page."
                : "Philosophy section is now hidden on the About page."
          );
        }}
      >
        <CmsPreviewLayout
          preview={
            <AboutSplitPreview
              content={draftPhilosophy}
              isEditing={isPhilosophyEditing}
              isVisible={sectionVisibility.philosophy}
              onFieldChange={(name, value) =>
                updateDraft(setDraftPhilosophy, name, value)
              }
              imageUrl={
                philosophyImageUrl ||
                draftPhilosophy.philosophy_image_url ||
                "/assets/about/about-philosophy.png"
              }
              onSelectImage={(event) =>
                uploadImage(
                  event,
                  "about",
                  setPhilosophyImageUrl,
                  "philosophy_image_url"
                )
              }
              imageFirst
              headingKey="philosophy_heading"
              bodyKeys={["philosophy_body_1", "philosophy_body_2"]}
              onSelect={() => {
                setStatus({ type: "idle", message: "" });
                setIsPhilosophyEditing(true);
              }}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Professional Background"
        description=""
        helperText=""
        isEditing={isBackgroundEditing}
        isVisible={sectionVisibility.background}
        onToggleEditing={handleToggleBackgroundEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          const fields = [
            { field: "background_heading", value: draftBackground.background_heading, label: "Background heading" },
            { field: "background_body", value: draftBackground.background_body, label: "Background body" },
          ];

          if (!ensureValid(fields)) {
            return;
          }

          await toggleSectionVisible(
            "background",
            "show_background_section",
            {
              ...about,
              background_image_url: draftBackground.background_image_url,
              background_heading: draftBackground.background_heading,
              background_body: draftBackground.background_body,
            },
            (isVisible) =>
              isVisible
                ? "Professional background section is now visible on the About page."
                : "Professional background section is now hidden on the About page."
          );
        }}
      >
        <CmsPreviewLayout
          preview={
            <AboutSplitPreview
              content={draftBackground}
              isEditing={isBackgroundEditing}
              isVisible={sectionVisibility.background}
              onFieldChange={(name, value) =>
                updateDraft(setDraftBackground, name, value)
              }
              imageUrl={
                backgroundImageUrl ||
                draftBackground.background_image_url ||
                "/assets/about/about-background.png"
              }
              onSelectImage={(event) =>
                uploadImage(
                  event,
                  "about",
                  setBackgroundImageUrl,
                  "background_image_url"
                )
              }
              imageFirst={false}
              headingKey="background_heading"
              bodyKeys={["background_body"]}
              onSelect={() => {
                setStatus({ type: "idle", message: "" });
                setIsBackgroundEditing(true);
              }}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Focus Areas"
        description=""
        helperText=""
        isEditing={isFocusEditing}
        isVisible={sectionVisibility.focus}
        onToggleEditing={handleToggleFocusEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          const fields = getFocusValidationFields(draftFocus);

          if (!ensureValid(fields)) {
            return;
          }

          await toggleSectionVisible(
            "focus",
            "show_focus_section",
            {
              ...about,
              focus_label: draftFocus.focus_label,
              focus_tags: draftFocus.focus_tags,
            },
            (isVisible) =>
              isVisible
                ? "Focus areas section is now visible on the About page."
                : "Focus areas section is now hidden on the About page."
          );
        }}
      >
        <CmsPreviewLayout
          preview={
            <AboutFocusPreview
              content={draftFocus}
              isEditing={isFocusEditing}
              isVisible={sectionVisibility.focus}
              onFieldChange={(name, value) => updateDraft(setDraftFocus, name, value)}
              onTagsChange={updateFocusTags}
              onSelect={() => {
                setStatus({ type: "idle", message: "" });
                setIsFocusEditing(true);
              }}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Support Stats"
        description=""
        helperText=""
        isEditing={isStatsEditing}
        isVisible={sectionVisibility.stats}
        onToggleEditing={handleToggleStatsEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          const fields = [
            { field: "stat_1_value", value: draftStats.stat_1_value, label: "Stat 1 value" },
            { field: "stat_1_label", value: draftStats.stat_1_label, label: "Stat 1 label" },
            { field: "stat_1_body", value: draftStats.stat_1_body, label: "Stat 1 body" },
            { field: "stat_2_value", value: draftStats.stat_2_value, label: "Stat 2 value" },
            { field: "stat_2_label", value: draftStats.stat_2_label, label: "Stat 2 label" },
            { field: "stat_2_body", value: draftStats.stat_2_body, label: "Stat 2 body" },
            { field: "stat_3_label", value: draftStats.stat_3_label, label: "Stat 3 label" },
            { field: "stat_3_body", value: draftStats.stat_3_body, label: "Stat 3 body" },
          ];

          if (!ensureValid(fields)) {
            return;
          }

          await toggleSectionVisible(
            "stats",
            "show_stats_section",
            {
              ...about,
              stat_1_value: draftStats.stat_1_value,
              stat_1_label: draftStats.stat_1_label,
              stat_1_body: draftStats.stat_1_body,
              stat_2_value: draftStats.stat_2_value,
              stat_2_label: draftStats.stat_2_label,
              stat_2_body: draftStats.stat_2_body,
              stat_3_label: draftStats.stat_3_label,
              stat_3_body: draftStats.stat_3_body,
            },
            (isVisible) =>
              isVisible
                ? "Support stats section is now visible on the About page."
                : "Support stats section is now hidden on the About page."
          );
        }}
      >
        <CmsPreviewLayout
          preview={
            <AboutStatsPreview
              content={draftStats}
              isEditing={isStatsEditing}
              isVisible={sectionVisibility.stats}
              onFieldChange={(name, value) => updateDraft(setDraftStats, name, value)}
              onSelect={() => {
                setStatus({ type: "idle", message: "" });
                setIsStatsEditing(true);
              }}
            />
          }
        />
      </CmsEditableSection>
    </div>
  );
}
