"use client";

import { useEffect, useState } from "react";
import CmsEditableSection from "./CmsEditableSection";
import CmsPreviewLayout from "./CmsPreviewLayout";
import EditableText from "./EditableText";
import { fallbackAboutContent, normaliseAboutContent } from "@/lib/cms-homepage";

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
    <div className="flex flex-wrap gap-3">
      {tags.map((tag, index) => (
        <EditableText
          key={`${tag}-${index}`}
          as="span"
          value={tag}
          isEditing={isEditing}
          onChange={(value) => onChange(index, value)}
          className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-[#42454c] shadow-sm"
        />
      ))}
    </div>
  );
}

function AboutHeroPreview({
  content,
  isEditing,
  onFieldChange,
  heroImageUrl,
  onSelectImage,
}) {
  return (
    <div className="bg-[#f7f7f6] pb-8">
      <section className="px-6 pt-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem]">
          <EditableImage
            src={heroImageUrl || "/assets/about/about-hero.jpeg"}
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
            className="mb-6 text-4xl font-semibold leading-tight text-[#42454c] sm:text-5xl lg:text-6xl"
          />
          <EditableText
            value={content.hero_subheading}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("hero_subheading", value)}
            className="text-xl font-medium text-[#5c6069]"
          />
        </div>
      </section>
    </div>
  );
}

function AboutStoryPreview({ content, isEditing, onFieldChange }) {
  return (
    <section className="mt-8 bg-[#f7f7f6] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] border border-[#d9deeb] bg-white px-10 py-12 shadow-[0_10px_25px_rgba(0,0,0,0.08)] lg:px-16 lg:py-14">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <EditableText
                as="h2"
                value={content.story_heading}
                isEditing={isEditing}
                onChange={(value) => onFieldChange("story_heading", value)}
                className="text-3xl font-semibold leading-tight text-[#42454c]"
              />
              <EditableText
                value={content.story_subheading}
                isEditing={isEditing}
                onChange={(value) => onFieldChange("story_subheading", value)}
                className="mt-4 text-lg text-[#5c6069]"
              />
            </div>

            <div className="space-y-6 text-base leading-8 text-[#5d6169]">
              <EditableText
                value={content.story_body_1}
                isEditing={isEditing}
                onChange={(value) => onFieldChange("story_body_1", value)}
                className="whitespace-pre-wrap"
              />
              <div className="h-px w-16 bg-[#d9deeb]" />
              <EditableText
                value={content.story_body_2}
                isEditing={isEditing}
                onChange={(value) => onFieldChange("story_body_2", value)}
                className="whitespace-pre-wrap"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSplitPreview({
  content,
  isEditing,
  onFieldChange,
  imageUrl,
  onSelectImage,
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
        className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]"
      />
      <EditableText
        as="h2"
        value={content[headingKey]}
        isEditing={isEditing}
        onChange={(value) => onFieldChange(headingKey, value)}
        className="mt-4 text-3xl font-semibold leading-tight text-[#42454c] sm:text-4xl"
      />

      {bodyKeys.map((key, index) => (
        <div key={key}>
          {index > 0 ? <div className="mt-6 h-px w-16 bg-[#926ab9]/30" /> : null}
          <EditableText
            value={content[key]}
            isEditing={isEditing}
            onChange={(value) => onFieldChange(key, value)}
            className={`${
              index === 0 ? "mt-8" : "mt-6"
            } whitespace-pre-wrap text-base leading-9 text-[#5d6169]`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <section className="mt-24 bg-[#f7f7f6] px-6 py-8">
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
  );
}

function AboutFocusPreview({ content, isEditing, onFieldChange, onTagChange }) {
  return (
    <section className="mt-24 bg-[#f7f7f6] px-6 py-8">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[#edf0f7] px-8 py-10 lg:px-12 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <EditableText
              as="p"
              value={content.focus_label}
              isEditing={isEditing}
              onChange={(value) => onFieldChange("focus_label", value)}
              className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]"
            />
          </div>

          <FocusTagsEditor
            tags={content.focus_tags || []}
            isEditing={isEditing}
            onChange={onTagChange}
          />
        </div>
      </div>
    </section>
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
        className={`text-5xl font-light lg:text-6xl ${tone.valueClass}`}
      />
      <EditableText
        as="h3"
        value={label}
        isEditing={isEditing}
        onChange={(nextValue) => onFieldChange(tone.labelKey, nextValue)}
        className="mt-4 text-2xl font-medium text-[#42454c]"
      />
      <EditableText
        value={body}
        isEditing={isEditing}
        onChange={(nextValue) => onFieldChange(tone.bodyKey, nextValue)}
        className="mt-4 whitespace-pre-wrap text-base leading-8 text-[#5d6169]"
      />
    </div>
  );
}

function AboutStatsPreview({ content, isEditing, onFieldChange }) {
  return (
    <section className="mt-24 bg-[#f7f7f6] px-6 py-8">
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
              className="text-2xl font-medium text-[#42454c]"
            />
            <EditableText
              value={content.stat_3_body}
              isEditing={isEditing}
              onChange={(value) => onFieldChange("stat_3_body", value)}
              className="mt-4 whitespace-pre-wrap text-base leading-8 text-[#5d6169]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutCmsForm({
  initialAboutContent = fallbackAboutContent,
  loadError = "",
}) {
  const [about, setAbout] = useState(normaliseAboutContent(initialAboutContent));
  const [draftHero, setDraftHero] = useState(
    normaliseAboutContent(initialAboutContent)
  );
  const [draftStory, setDraftStory] = useState(
    normaliseAboutContent(initialAboutContent)
  );
  const [draftPhilosophy, setDraftPhilosophy] = useState(
    normaliseAboutContent(initialAboutContent)
  );
  const [draftBackground, setDraftBackground] = useState(
    normaliseAboutContent(initialAboutContent)
  );
  const [draftFocus, setDraftFocus] = useState(
    normaliseAboutContent(initialAboutContent)
  );
  const [draftStats, setDraftStats] = useState(
    normaliseAboutContent(initialAboutContent)
  );
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
  }, [initialAboutContent]);

  useEffect(() => {
    return () => {
      [heroImageUrl, philosophyImageUrl, backgroundImageUrl].forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [backgroundImageUrl, heroImageUrl, philosophyImageUrl]);

  function setSectionVisible(sectionKey) {
    setSectionVisibility((current) => ({
      ...current,
      [sectionKey]: !current[sectionKey],
    }));
  }

  function handleLocalImagePreview(event, setter, currentValue) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (currentValue) {
      URL.revokeObjectURL(currentValue);
    }

    setter(URL.createObjectURL(file));
    setStatus({
      type: "idle",
      message:
        "Local image preview updated. TODO: connect About page images to a CMS image field and upload flow later.",
    });
  }

  function updateDraft(setter, name, value) {
    setter((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateFocusTag(index, value) {
    setDraftFocus((current) => ({
      ...current,
      focus_tags: current.focus_tags.map((tag, tagIndex) =>
        tagIndex === index ? value : tag
      ),
    }));
  }

  function commitDraft(setterName, keys, message) {
    setAbout((current) => ({
      ...current,
      ...Object.fromEntries(keys.map((key) => [key, setterName[key]])),
    }));
    setStatus({
      type: "success",
      message: `${message} Use the main save button below to store it in Supabase.`,
    });
  }

  function handleToggleHeroEditing() {
    if (isHeroEditing) {
      commitDraft(draftHero, ["hero_heading", "hero_subheading"], "Hero preview updated.");
      setIsHeroEditing(false);
      return;
    }

    setDraftHero((current) => ({
      ...current,
      hero_heading: about.hero_heading,
      hero_subheading: about.hero_subheading,
    }));
    setStatus({ type: "idle", message: "" });
    setIsHeroEditing(true);
  }

  function handleToggleStoryEditing() {
    if (isStoryEditing) {
      commitDraft(
        draftStory,
        ["story_heading", "story_subheading", "story_body_1", "story_body_2"],
        "Story preview updated."
      );
      setIsStoryEditing(false);
      return;
    }

    setDraftStory((current) => ({
      ...current,
      story_heading: about.story_heading,
      story_subheading: about.story_subheading,
      story_body_1: about.story_body_1,
      story_body_2: about.story_body_2,
    }));
    setStatus({ type: "idle", message: "" });
    setIsStoryEditing(true);
  }

  function handleTogglePhilosophyEditing() {
    if (isPhilosophyEditing) {
      commitDraft(
        draftPhilosophy,
        ["philosophy_heading", "philosophy_body_1", "philosophy_body_2"],
        "Philosophy preview updated."
      );
      setIsPhilosophyEditing(false);
      return;
    }

    setDraftPhilosophy((current) => ({
      ...current,
      philosophy_heading: about.philosophy_heading,
      philosophy_body_1: about.philosophy_body_1,
      philosophy_body_2: about.philosophy_body_2,
    }));
    setStatus({ type: "idle", message: "" });
    setIsPhilosophyEditing(true);
  }

  function handleToggleBackgroundEditing() {
    if (isBackgroundEditing) {
      commitDraft(
        draftBackground,
        ["background_heading", "background_body"],
        "Background preview updated."
      );
      setIsBackgroundEditing(false);
      return;
    }

    setDraftBackground((current) => ({
      ...current,
      background_heading: about.background_heading,
      background_body: about.background_body,
    }));
    setStatus({ type: "idle", message: "" });
    setIsBackgroundEditing(true);
  }

  function handleToggleFocusEditing() {
    if (isFocusEditing) {
      commitDraft(draftFocus, ["focus_label", "focus_tags"], "Focus areas preview updated.");
      setIsFocusEditing(false);
      return;
    }

    setDraftFocus((current) => ({
      ...current,
      focus_label: about.focus_label,
      focus_tags: [...about.focus_tags],
    }));
    setStatus({ type: "idle", message: "" });
    setIsFocusEditing(true);
  }

  function handleToggleStatsEditing() {
    if (isStatsEditing) {
      commitDraft(
        draftStats,
        [
          "stat_1_value",
          "stat_1_label",
          "stat_1_body",
          "stat_2_value",
          "stat_2_label",
          "stat_2_body",
          "stat_3_label",
          "stat_3_body",
        ],
        "Support stats preview updated."
      );
      setIsStatsEditing(false);
      return;
    }

    setDraftStats((current) => ({
      ...current,
      stat_1_value: about.stat_1_value,
      stat_1_label: about.stat_1_label,
      stat_1_body: about.stat_1_body,
      stat_2_value: about.stat_2_value,
      stat_2_label: about.stat_2_label,
      stat_2_body: about.stat_2_body,
      stat_3_label: about.stat_3_label,
      stat_3_body: about.stat_3_body,
    }));
    setStatus({ type: "idle", message: "" });
    setIsStatsEditing(true);
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
          about,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save About content.");
      }

      const nextAbout = normaliseAboutContent(result.content?.about || about);
      setAbout(nextAbout);
      setDraftHero(nextAbout);
      setDraftStory(nextAbout);
      setDraftPhilosophy(nextAbout);
      setDraftBackground(nextAbout);
      setDraftFocus(nextAbout);
      setDraftStats(nextAbout);
      setStatus({
        type: "success",
        message: "About CMS content saved to Supabase.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save About content.",
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
          About Editor
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#42454c]">
          Edit by real page section
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5d6169]">
          These previews follow the actual About page layout. The public About
          page remains the source of truth for structure and styling.
        </p>
      </div>

      <CmsEditableSection
        title="Hero"
        description="Top image and opening headline for the About page."
        helperText="Click Edit, then update the hero text or click the image to preview a replacement."
        isEditing={isHeroEditing}
        isVisible={sectionVisibility.hero}
        onToggleEditing={handleToggleHeroEditing}
        onToggleVisible={() => setSectionVisible("hero")}
      >
        <CmsPreviewLayout
          preview={
            <AboutHeroPreview
              content={draftHero}
              isEditing={isHeroEditing}
              onFieldChange={(name, value) =>
                updateDraft(setDraftHero, name, value)
              }
              heroImageUrl={heroImageUrl}
              onSelectImage={(event) =>
                handleLocalImagePreview(event, setHeroImageUrl, heroImageUrl)
              }
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Story Introduction"
        description="Editorial story block near the top of the About page."
        helperText="Click Edit, then update the story heading, subheading, and paragraphs directly inside the preview."
        isEditing={isStoryEditing}
        isVisible={sectionVisibility.story}
        onToggleEditing={handleToggleStoryEditing}
        onToggleVisible={() => setSectionVisible("story")}
      >
        <CmsPreviewLayout
          preview={
            <AboutStoryPreview
              content={draftStory}
              isEditing={isStoryEditing}
              onFieldChange={(name, value) =>
                updateDraft(setDraftStory, name, value)
              }
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Philosophy"
        description="Image-and-text philosophy section."
        helperText="Click Edit, then update the philosophy content or preview a different image."
        isEditing={isPhilosophyEditing}
        isVisible={sectionVisibility.philosophy}
        onToggleEditing={handleTogglePhilosophyEditing}
        onToggleVisible={() => setSectionVisible("philosophy")}
      >
        <CmsPreviewLayout
          preview={
            <AboutSplitPreview
              content={draftPhilosophy}
              isEditing={isPhilosophyEditing}
              onFieldChange={(name, value) =>
                updateDraft(setDraftPhilosophy, name, value)
              }
              imageUrl={philosophyImageUrl || "/assets/about/about-philosophy.png"}
              onSelectImage={(event) =>
                handleLocalImagePreview(
                  event,
                  setPhilosophyImageUrl,
                  philosophyImageUrl
                )
              }
              imageFirst
              headingKey="philosophy_heading"
              bodyKeys={["philosophy_body_1", "philosophy_body_2"]}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Professional Background"
        description="Reverse image-and-text background section."
        helperText="Click Edit, then update the background heading and paragraph directly inside the real layout preview."
        isEditing={isBackgroundEditing}
        isVisible={sectionVisibility.background}
        onToggleEditing={handleToggleBackgroundEditing}
        onToggleVisible={() => setSectionVisible("background")}
      >
        <CmsPreviewLayout
          preview={
            <AboutSplitPreview
              content={draftBackground}
              isEditing={isBackgroundEditing}
              onFieldChange={(name, value) =>
                updateDraft(setDraftBackground, name, value)
              }
              imageUrl={backgroundImageUrl || "/assets/about/about-background.png"}
              onSelectImage={(event) =>
                handleLocalImagePreview(
                  event,
                  setBackgroundImageUrl,
                  backgroundImageUrl
                )
              }
              imageFirst={false}
              headingKey="background_heading"
              bodyKeys={["background_body"]}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Focus Areas"
        description="Tag-based focus area section."
        helperText="Click Edit, then update the section label and each focus tag directly in the preview."
        isEditing={isFocusEditing}
        isVisible={sectionVisibility.focus}
        onToggleEditing={handleToggleFocusEditing}
        onToggleVisible={() => setSectionVisible("focus")}
      >
        <CmsPreviewLayout
          preview={
            <AboutFocusPreview
              content={draftFocus}
              isEditing={isFocusEditing}
              onFieldChange={(name, value) =>
                updateDraft(setDraftFocus, name, value)
              }
              onTagChange={updateFocusTag}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Support Stats"
        description="Experience and support summary cards."
        helperText="Click Edit, then update the values, labels, and support text directly in the preview."
        isEditing={isStatsEditing}
        isVisible={sectionVisibility.stats}
        onToggleEditing={handleToggleStatsEditing}
        onToggleVisible={() => setSectionVisible("stats")}
      >
        <CmsPreviewLayout
          preview={
            <AboutStatsPreview
              content={draftStats}
              isEditing={isStatsEditing}
              onFieldChange={(name, value) =>
                updateDraft(setDraftStats, name, value)
              }
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
            "Update the About sections here, then save when you are ready."}
        </p>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-2xl bg-[#4b8e9a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3e7882] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save About Content"}
        </button>
      </div>
    </form>
  );
}
