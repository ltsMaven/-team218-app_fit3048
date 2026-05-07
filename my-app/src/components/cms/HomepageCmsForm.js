"use client";

import { useEffect, useState } from "react";
import CmsPreviewLayout from "./CmsPreviewLayout";
import CmsEditableSection from "./CmsEditableSection";
import EditableText from "./EditableText";
import {
  emptyHomepageContent,
  fallbackHomepageContent,
  normaliseHomepageContent,
} from "@/lib/cms-homepage";
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

function EditableImage({
  src,
  alt,
  isEditing,
  onSelectFile,
}) {
  return (
    <label
      className={`flex h-full min-h-[220px] w-full max-w-[260px] items-center justify-center overflow-hidden rounded-[2rem] border text-center text-sm font-medium transition ${
        isEditing
          ? "cursor-pointer border-dashed border-[#926ab9] bg-white hover:bg-[#faf7fd]"
          : "border-[#b8c5da] bg-white/70 text-[#6a7280]"
      }`}
    >
      {src ? (
        // Local preview may use a blob URL, so a plain img is the simplest fit here.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-contain" />
      ) : (
        <div className="px-6 text-[#6a7280]">
          {isEditing
            ? "Click to upload or replace image"
            : "Homepage image / logo area"}
        </div>
      )}

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

function HomepageAboutPreview({
  content,
  isEditing = false,
  onFieldChange = () => {},
  imagePreviewUrl = "",
  onSelectImage = () => {},
  isVisible = true,
  onSelect = () => {},
}) {
  return (
    <PreviewFrame isEditing={isEditing} isVisible={isVisible} onSelect={onSelect}>
      <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex min-h-[320px] items-center justify-center bg-[linear-gradient(160deg,rgba(238,239,242,0.9),rgba(220,233,248,0.9))] p-8">
          <EditableImage
            src={
              imagePreviewUrl ||
              content.about_image_url ||
              fallbackHomepageContent.about_image_url
            }
            alt="Homepage section image preview"
            isEditing={isEditing}
            onSelectFile={onSelectImage}
          />
        </div>

        <div className="p-8">
          <EditableText
            as="p"
            value={content.about_badge || fallbackHomepageContent.about_badge}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("about_badge", value)}
            validationKey="about_badge"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6d7bbb]"
          />
          <EditableText
            as="h4"
            value={content.about_heading || "Homepage heading preview"}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("about_heading", value)}
            validationKey="about_heading"
            className="mt-4 text-3xl font-semibold leading-tight text-[#42454c]"
          />
          <div className="mt-6 space-y-4 text-sm leading-7 text-[#5d6169]">
            <EditableText
              value={content.about_intro || "Introductory copy will appear here."}
              isEditing={isEditing}
              onChange={(value) => onFieldChange("about_intro", value)}
              validationKey="about_intro"
              className="whitespace-pre-wrap"
            />
            <EditableText
              value={
                content.about_highlight ||
                "A second supporting paragraph will appear here."
              }
              isEditing={isEditing}
              onChange={(value) => onFieldChange("about_highlight", value)}
              validationKey="about_highlight"
              className="whitespace-pre-wrap"
            />
            <EditableText
              value={
                content.about_closing || "A short closing line will appear here."
              }
              isEditing={isEditing}
              onChange={(value) => onFieldChange("about_closing", value)}
              validationKey="about_closing"
              className="whitespace-pre-wrap font-medium text-[#42454c]"
            />
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

function HomepageServicesPreview({ content, isVisible = true, onSelect = () => {} }) {
  const cards = [
    {
      number: "01",
      title: content.service_1_title || fallbackHomepageContent.service_1_title,
      description:
        content.service_1_description ||
        fallbackHomepageContent.service_1_description,
      tags: parseTagList(
        content.service_1_tags || fallbackHomepageContent.service_1_tags
      ),
      titleKey: "service_1_title",
      descriptionKey: "service_1_description",
      tagsKey: "service_1_tags",
    },
    {
      number: "02",
      title: content.service_2_title || fallbackHomepageContent.service_2_title,
      description:
        content.service_2_description ||
        fallbackHomepageContent.service_2_description,
      tags: parseTagList(
        content.service_2_tags || fallbackHomepageContent.service_2_tags
      ),
      titleKey: "service_2_title",
      descriptionKey: "service_2_description",
      tagsKey: "service_2_tags",
    },
    {
      number: "03",
      title: content.service_3_title || fallbackHomepageContent.service_3_title,
      description:
        content.service_3_description ||
        fallbackHomepageContent.service_3_description,
      tags: parseTagList(
        content.service_3_tags || fallbackHomepageContent.service_3_tags
      ),
      titleKey: "service_3_title",
      descriptionKey: "service_3_description",
      tagsKey: "service_3_tags",
    },
  ];
  const secondaryCards = [
    {
      title:
        content.services_card_1_title ||
        fallbackHomepageContent.services_card_1_title,
      description:
        content.services_card_1_body ||
        fallbackHomepageContent.services_card_1_body,
      titleKey: "services_card_1_title",
      bodyKey: "services_card_1_body",
    },
    {
      title:
        content.services_card_2_title ||
        fallbackHomepageContent.services_card_2_title,
      description:
        content.services_card_2_body ||
        fallbackHomepageContent.services_card_2_body,
      titleKey: "services_card_2_title",
      bodyKey: "services_card_2_body",
    },
  ];

  return (
    <PreviewFrame isEditing={content.isEditing} isVisible={isVisible} onSelect={onSelect}>
    <div className="bg-white/75 px-6 py-10 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <EditableText
              as="p"
              value={content.services_label || "Services"}
              isEditing={content.isEditing}
              onChange={(value) => content.onFieldChange("services_label", value)}
              validationKey="services_label"
              className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#6d7bbb]"
            />
            <EditableText
              as="h4"
              value={content.services_heading || "How I Can Support You"}
              isEditing={content.isEditing}
              onChange={(value) =>
                content.onFieldChange("services_heading", value)
              }
              validationKey="services_heading"
              className="mt-4 text-[1.8rem] font-semibold leading-tight text-[#42454c] sm:text-[2rem] lg:text-[2.35rem]"
            />
            <EditableText
              value={
                content.services_subheading ||
                "A summary of the support available through Ability to Thrive."
              }
              isEditing={content.isEditing}
              onChange={(value) =>
                content.onFieldChange("services_subheading", value)
              }
              validationKey="services_subheading"
              className="mt-5 max-w-md whitespace-pre-wrap text-[0.95rem] leading-7 text-[#5c6069] lg:text-base"
            />
            <EditableText
              value={
                content.services_support_body ||
                fallbackHomepageContent.services_support_body
              }
              isEditing={content.isEditing}
              onChange={(value) =>
                content.onFieldChange("services_support_body", value)
              }
              validationKey="services_support_body"
              className="mt-5 max-w-md whitespace-pre-wrap text-[0.92rem] leading-7 text-[#6a6e77] lg:text-[0.98rem]"
            />
          </div>

          <div>
            <div className="space-y-8">
              {cards.map((card, index) => (
                <article key={card.title}>
                  <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-6">
                    <div className="flex items-baseline gap-3 sm:block">
                      <p className="text-[1.25rem] font-light tracking-[0.08em] text-[#8f72bb] sm:text-[1.5rem]">
                        {card.number}
                      </p>
                      <div className="h-px w-10 bg-[#d7ddea] sm:mt-4 sm:w-12" />
                    </div>

                    <div>
                        <EditableText
                          as="h5"
                          value={card.title}
                          isEditing={content.isEditing}
                          onChange={(value) =>
                            content.onFieldChange(card.titleKey, value)
                          }
                          validationKey={card.titleKey}
                          className="text-[1.28rem] font-semibold leading-tight text-[#42454c] sm:text-[1.42rem] lg:text-[1.5rem]"
                        />
                        <EditableText
                          value={card.description}
                          isEditing={content.isEditing}
                          onChange={(value) =>
                            content.onFieldChange(card.descriptionKey, value)
                          }
                          validationKey={card.descriptionKey}
                          className="mt-3 max-w-3xl whitespace-pre-wrap text-[0.95rem] leading-7 text-[#5d6169] lg:text-base lg:leading-8"
                        />
                        <EditableText
                          value={card.tags.join(", ")}
                          isEditing={content.isEditing}
                          onChange={(value) =>
                            content.onFieldChange(card.tagsKey, value)
                          }
                          validationKey={card.tagsKey}
                          className="mt-4 text-[0.78rem] leading-6 text-[#5c6069]"
                        />
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          {card.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-[#eef1f6] px-3 py-1.5 text-[0.78rem] font-medium text-[#5c6069]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {index < cards.length - 1 ? (
                    <div className="mt-8 h-px bg-[linear-gradient(90deg,rgba(146,106,185,0.18),rgba(109,123,187,0.14),rgba(75,142,154,0.12),transparent)]" />
                  ) : null}
                </article>
              ))}
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {secondaryCards.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.6rem] border border-[#d9deeb] bg-[#f7f8fa] px-6 py-6"
                >
                  <EditableText
                    as="p"
                    value={item.title}
                    isEditing={content.isEditing}
                    onChange={(value) =>
                      content.onFieldChange(item.titleKey, value)
                    }
                    validationKey={item.titleKey}
                    className="text-[1.05rem] font-semibold text-[#42454c] sm:text-[1.12rem]"
                  />
                  <EditableText
                    value={item.description}
                    isEditing={content.isEditing}
                    onChange={(value) => content.onFieldChange(item.bodyKey, value)}
                    validationKey={item.bodyKey}
                    className="mt-3 whitespace-pre-wrap text-[0.92rem] leading-7 text-[#61656d]"
                  />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </PreviewFrame>
  );
}

function TimelineItem({ label, heading, body, toneClass }) {
  const isEditing = toneClass.isEditing;
  const onFieldChange = toneClass.onFieldChange;

  return (
    <article className={`rounded-[1.5rem] p-6 ${toneClass.className}`}>
      <EditableText
        as="p"
        value={label}
        isEditing={isEditing}
        onChange={(value) => onFieldChange(toneClass.labelKey, value)}
        validationKey={toneClass.labelKey}
        className={`text-xs font-semibold uppercase tracking-[0.22em] ${
          toneClass.labelClass || ""
        }`}
        editingClassName={toneClass.editingTextClass || ""}
        editingStyle={toneClass.editingStyle}
      />
      <EditableText
        as="h4"
        value={heading}
        isEditing={isEditing}
        onChange={(value) => onFieldChange(toneClass.headingKey, value)}
        validationKey={toneClass.headingKey}
        className={`mt-3 text-xl font-semibold ${toneClass.headingClass || ""}`}
        editingClassName={toneClass.editingTextClass || ""}
        editingStyle={toneClass.editingStyle}
      />
      <EditableText
        value={body}
        isEditing={isEditing}
        onChange={(value) => onFieldChange(toneClass.bodyKey, value)}
        validationKey={toneClass.bodyKey}
        className={`mt-4 whitespace-pre-wrap text-sm leading-7 ${
          toneClass.bodyClass || "opacity-80"
        }`}
        editingClassName={toneClass.editingTextClass || ""}
        editingStyle={toneClass.editingStyle}
      />
    </article>
  );
}

function HomepageValuesPreview({ content, isVisible = true, onSelect = () => {} }) {
  return (
    <PreviewFrame isEditing={content.isEditing} isVisible={isVisible} onSelect={onSelect}>
    <div className="bg-transparent px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <EditableText
              as="p"
              value={
                content.about_section_label ||
                fallbackHomepageContent.about_section_label
              }
              isEditing={content.isEditing}
              onChange={(value) =>
                content.onFieldChange("about_section_label", value)
              }
              validationKey="about_section_label"
              className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]"
            />
            <h4 className="mt-4 max-w-lg text-3xl font-semibold tracking-tight text-[#42454c] sm:text-5xl">
              <EditableText
                as="span"
                value={
                  content.about_section_heading_line_1 ||
                  fallbackHomepageContent.about_section_heading_line_1
                }
                isEditing={content.isEditing}
                onChange={(value) =>
                  content.onFieldChange("about_section_heading_line_1", value)
                }
                validationKey="about_section_heading_line_1"
                className="block"
              />
              <br />
              <EditableText
                as="span"
                value={
                  content.about_section_heading_line_2 ||
                  fallbackHomepageContent.about_section_heading_line_2
                }
                isEditing={content.isEditing}
                onChange={(value) =>
                  content.onFieldChange("about_section_heading_line_2", value)
                }
                validationKey="about_section_heading_line_2"
                className="block text-[#926ab9]"
              />
            </h4>

            <div className="mt-10 flex items-center gap-4">
              <div className="h-px w-16 bg-[#926ab9]" />
              <div className="h-px w-24 bg-[#7ea6d8]" />
              <div className="h-px w-10 bg-[#4b8e9a]" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[22px] top-0 hidden h-full w-px bg-[linear-gradient(180deg,rgba(146,106,185,0.35),rgba(126,166,216,0.35),rgba(75,142,154,0.35))] md:block" />

            <div className="space-y-8">
              <div className="md:ml-12">
                <TimelineItem
                  label={content.goals_label || "Goals"}
                  heading={content.goals_heading || "Your goals heading"}
                  body={content.goals_body || "Goals content will appear here."}
                  toneClass={{
                    className: "relative bg-white/60 text-[#42454c]",
                    isEditing: content.isEditing,
                    onFieldChange: content.onFieldChange,
                    labelKey: "goals_label",
                    headingKey: "goals_heading",
                    bodyKey: "goals_body",
                    labelClass: "text-[#926ab9]",
                    headingClass: "text-[#42454c]",
                    bodyClass: "text-[#5d6169]",
                    editingTextClass: "text-[#42454c]",
                  }}
                />
              </div>

              <div className="md:mr-8 md:ml-24">
                <TimelineItem
                  label={content.vision_label || "Vision"}
                  heading={content.vision_heading || "Your vision heading"}
                  body={
                    content.vision_body || "Vision content will appear here."
                  }
                  toneClass={{
                    className:
                      "relative bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(220,233,248,0.75))] text-[#42454c]",
                    isEditing: content.isEditing,
                    onFieldChange: content.onFieldChange,
                    labelKey: "vision_label",
                    headingKey: "vision_heading",
                    bodyKey: "vision_body",
                    labelClass: "text-[#4b8e9a]",
                    headingClass: "text-[#42454c]",
                    bodyClass: "text-[#5d6169]",
                    editingTextClass: "text-[#42454c]",
                  }}
                />
              </div>

              <div className="md:ml-12">
                <TimelineItem
                  label={content.values_label || "Values"}
                  heading={content.values_heading || "Your values heading"}
                  body={
                    content.values_body || "Values content will appear here."
                  }
                  toneClass={{
                    className: "relative bg-[#42454c] text-white",
                    isEditing: content.isEditing,
                    onFieldChange: content.onFieldChange,
                    labelKey: "values_label",
                    headingKey: "values_heading",
                    bodyKey: "values_body",
                    labelClass: "text-[#d6e5ff]",
                    headingClass: "text-white",
                    bodyClass: "text-white/88",
                    editingTextClass: "text-[#42454c]",
                    editingStyle: { color: "#42454c" },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PreviewFrame>
  );
}

function HomepageCtaPreview({ content, isVisible = true, onSelect = () => {} }) {
  return (
    <PreviewFrame isEditing={content.isEditing} isVisible={isVisible} onSelect={onSelect}>
    <div className="bg-[#42454c] px-6 py-14 text-center text-white">
      <div className="mx-auto max-w-4xl text-center">
        <EditableText
          as="h4"
          value={content.cta_heading || "Ready to Take the First Step?"}
          isEditing={content.isEditing}
          onChange={(value) => content.onFieldChange("cta_heading", value)}
          validationKey="cta_heading"
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
          editingClassName="text-[#42454c]"
          editingStyle={{ color: "#42454c" }}
        />

        <EditableText
          value={content.cta_body || "Your call-to-action text will appear here."}
          isEditing={content.isEditing}
          onChange={(value) => content.onFieldChange("cta_body", value)}
          validationKey="cta_body"
          className="mx-auto mt-5 max-w-2xl whitespace-pre-wrap text-lg text-white/75"
          editingClassName="text-[#42454c]"
          editingStyle={{ color: "#42454c" }}
        />

        <div className="mt-10">
          <EditableText
            as="div"
            value={content.cta_button_label || "Book Your Session Now"}
            isEditing={content.isEditing}
            onChange={(value) =>
              content.onFieldChange("cta_button_label", value)
            }
            validationKey="cta_button_label"
            className="inline-flex items-center gap-2 rounded-xl bg-[#926ab9] px-6 py-3 text-sm font-medium text-white"
            editingClassName="text-[#42454c]"
            editingStyle={{ color: "#42454c" }}
          />
        </div>
      </div>
    </div>
    </PreviewFrame>
  );
}

export default function HomepageCmsForm({
  initialHomepageContent = emptyHomepageContent,
  loadError = "",
}) {
  const [homepage, setHomepage] = useState(
    normaliseHomepageContent(initialHomepageContent)
  );
  const [draftAbout, setDraftAbout] = useState(
    normaliseHomepageContent(initialHomepageContent)
  );
  const [isAboutEditing, setIsAboutEditing] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(true);
  const [aboutImagePreviewUrl, setAboutImagePreviewUrl] = useState("");
  const [draftServices, setDraftServices] = useState(
    normaliseHomepageContent(initialHomepageContent)
  );
  const [isServicesEditing, setIsServicesEditing] = useState(false);
  const [isServicesVisible, setIsServicesVisible] = useState(true);
  const [draftValues, setDraftValues] = useState(
    normaliseHomepageContent(initialHomepageContent)
  );
  const [isValuesEditing, setIsValuesEditing] = useState(false);
  const [isValuesVisible, setIsValuesVisible] = useState(true);
  const [draftCta, setDraftCta] = useState(
    normaliseHomepageContent(initialHomepageContent)
  );
  const [isCtaEditing, setIsCtaEditing] = useState(false);
  const [isCtaVisible, setIsCtaVisible] = useState(true);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [, setIsSaving] = useState(false);
  const [, setIsUploadingImage] = useState(false);

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
    const nextHomepage = normaliseHomepageContent(initialHomepageContent);
    setHomepage(nextHomepage);
    setDraftAbout(nextHomepage);
    setDraftServices(nextHomepage);
    setDraftValues(nextHomepage);
    setDraftCta(nextHomepage);
    setIsAboutVisible(nextHomepage.show_about_section);
    setIsServicesVisible(nextHomepage.show_services_section);
    setIsValuesVisible(nextHomepage.show_values_section);
    setIsCtaVisible(nextHomepage.show_cta_section);
    setIsAboutEditing(false);
    setIsServicesEditing(false);
    setIsValuesEditing(false);
    setIsCtaEditing(false);
  }, [initialHomepageContent]);

  useEffect(() => {
    return () => {
      if (aboutImagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(aboutImagePreviewUrl);
      }
    };
  }, [aboutImagePreviewUrl]);

  function updateDraftAboutField(name, value) {
    setDraftAbout((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateDraftServicesField(name, value) {
    setDraftServices((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateDraftValuesField(name, value) {
    setDraftValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateDraftCtaField(name, value) {
    setDraftCta((current) => ({
      ...current,
      [name]: value,
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

  async function persistHomepageContent(nextHomepage, successMessage, options = {}) {
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
          homepage: nextHomepage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save homepage content.");
      }

      const savedHomepage = normaliseHomepageContent(
        result.content?.homepage || nextHomepage
      );
      setHomepage(savedHomepage);
      setDraftAbout(savedHomepage);
      setDraftServices(savedHomepage);
      setDraftValues(savedHomepage);
      setDraftCta(savedHomepage);
      setIsAboutVisible(savedHomepage.show_about_section);
      setIsServicesVisible(savedHomepage.show_services_section);
      setIsValuesVisible(savedHomepage.show_values_section);
      setIsCtaVisible(savedHomepage.show_cta_section);

      if (closeEditors.includes("about")) setIsAboutEditing(false);
      if (closeEditors.includes("services")) setIsServicesEditing(false);
      if (closeEditors.includes("values")) setIsValuesEditing(false);
      if (closeEditors.includes("cta")) setIsCtaEditing(false);

      setStatus({
        type: "success",
        message: successMessage,
      });
      return true;
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save homepage content.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleHomepageSection(fieldName, setter, nextHomepage, successCopy) {
    const nextVisible = !nextHomepage[fieldName];
    const previousHomepage = homepage;
    const payload = {
      ...nextHomepage,
      [fieldName]: nextVisible,
    };

    setter(nextVisible);
    setHomepage(payload);
    const didSave = await persistHomepageContent(payload, successCopy(nextVisible));

    if (!didSave) {
      setter(!nextVisible);
      setHomepage(previousHomepage);
    }
  }

  function handleToggleAboutEditing() {
    if (isAboutEditing) {
      if (
        !ensureValid([
          { field: "about_badge", value: draftAbout.about_badge, label: "About badge" },
          { field: "about_heading", value: draftAbout.about_heading, label: "About heading" },
          { field: "about_intro", value: draftAbout.about_intro, label: "About intro" },
          { field: "about_highlight", value: draftAbout.about_highlight, label: "About highlight" },
          { field: "about_closing", value: draftAbout.about_closing, label: "About closing line" },
        ])
      ) {
        return;
      }

      persistHomepageContent(
        {
          ...homepage,
          about_image_url: draftAbout.about_image_url,
          about_badge: draftAbout.about_badge,
          about_heading: draftAbout.about_heading,
          about_intro: draftAbout.about_intro,
          about_highlight: draftAbout.about_highlight,
          about_closing: draftAbout.about_closing,
        },
        "About Practice section saved successfully.",
        { closeEditors: ["about"] }
      );
      return;
    }

    setDraftAbout((current) => ({
      ...current,
      about_image_url: homepage.about_image_url,
      about_badge: homepage.about_badge,
      about_heading: homepage.about_heading,
      about_intro: homepage.about_intro,
      about_highlight: homepage.about_highlight,
      about_closing: homepage.about_closing,
    }));
    setStatus({ type: "idle", message: "" });
    setIsAboutEditing(true);
  }

  function handleToggleServicesEditing() {
    if (isServicesEditing) {
      if (
        !ensureValid([
          { field: "services_label", value: draftServices.services_label, label: "Services label" },
          { field: "services_heading", value: draftServices.services_heading, label: "Services heading" },
          { field: "services_subheading", value: draftServices.services_subheading, label: "Services subheading" },
          { field: "services_support_body", value: draftServices.services_support_body, label: "Services support body" },
          { field: "service_1_title", value: draftServices.service_1_title, label: "Service 1 title" },
          { field: "service_1_description", value: draftServices.service_1_description, label: "Service 1 description" },
          { field: "service_1_tags", value: draftServices.service_1_tags, label: "Service 1 tags" },
          { field: "service_2_title", value: draftServices.service_2_title, label: "Service 2 title" },
          { field: "service_2_description", value: draftServices.service_2_description, label: "Service 2 description" },
          { field: "service_2_tags", value: draftServices.service_2_tags, label: "Service 2 tags" },
          { field: "service_3_title", value: draftServices.service_3_title, label: "Service 3 title" },
          { field: "service_3_description", value: draftServices.service_3_description, label: "Service 3 description" },
          { field: "service_3_tags", value: draftServices.service_3_tags, label: "Service 3 tags" },
          { field: "services_card_1_title", value: draftServices.services_card_1_title, label: "Services card 1 title" },
          { field: "services_card_1_body", value: draftServices.services_card_1_body, label: "Services card 1 body" },
          { field: "services_card_2_title", value: draftServices.services_card_2_title, label: "Services card 2 title" },
          { field: "services_card_2_body", value: draftServices.services_card_2_body, label: "Services card 2 body" },
        ])
      ) {
        return;
      }

      persistHomepageContent(
        {
          ...homepage,
          services_label: draftServices.services_label,
          services_heading: draftServices.services_heading,
          services_subheading: draftServices.services_subheading,
          services_support_body: draftServices.services_support_body,
          service_1_title: draftServices.service_1_title,
          service_1_description: draftServices.service_1_description,
          service_1_tags: draftServices.service_1_tags,
          service_2_title: draftServices.service_2_title,
          service_2_description: draftServices.service_2_description,
          service_2_tags: draftServices.service_2_tags,
          service_3_title: draftServices.service_3_title,
          service_3_description: draftServices.service_3_description,
          service_3_tags: draftServices.service_3_tags,
          services_card_1_title: draftServices.services_card_1_title,
          services_card_1_body: draftServices.services_card_1_body,
          services_card_2_title: draftServices.services_card_2_title,
          services_card_2_body: draftServices.services_card_2_body,
        },
        "How I Can Help section saved successfully.",
        { closeEditors: ["services"] }
      );
      return;
    }

    setDraftServices((current) => ({
      ...current,
      services_label: homepage.services_label,
      services_heading: homepage.services_heading,
      services_subheading: homepage.services_subheading,
      services_support_body: homepage.services_support_body,
      service_1_title: homepage.service_1_title,
      service_1_description: homepage.service_1_description,
      service_1_tags: homepage.service_1_tags,
      service_2_title: homepage.service_2_title,
      service_2_description: homepage.service_2_description,
      service_2_tags: homepage.service_2_tags,
      service_3_title: homepage.service_3_title,
      service_3_description: homepage.service_3_description,
      service_3_tags: homepage.service_3_tags,
      services_card_1_title: homepage.services_card_1_title,
      services_card_1_body: homepage.services_card_1_body,
      services_card_2_title: homepage.services_card_2_title,
      services_card_2_body: homepage.services_card_2_body,
    }));
    setStatus({ type: "idle", message: "" });
    setIsServicesEditing(true);
  }

  function handleToggleValuesEditing() {
    if (isValuesEditing) {
      if (
        !ensureValid([
          { field: "about_section_label", value: draftValues.about_section_label, label: "About section label" },
          { field: "about_section_heading_line_1", value: draftValues.about_section_heading_line_1, label: "About section heading line 1" },
          { field: "about_section_heading_line_2", value: draftValues.about_section_heading_line_2, label: "About section heading line 2" },
          { field: "goals_label", value: draftValues.goals_label, label: "Goals label" },
          { field: "goals_heading", value: draftValues.goals_heading, label: "Goals heading" },
          { field: "goals_body", value: draftValues.goals_body, label: "Goals body" },
          { field: "vision_label", value: draftValues.vision_label, label: "Vision label" },
          { field: "vision_heading", value: draftValues.vision_heading, label: "Vision heading" },
          { field: "vision_body", value: draftValues.vision_body, label: "Vision body" },
          { field: "values_label", value: draftValues.values_label, label: "Values label" },
          { field: "values_heading", value: draftValues.values_heading, label: "Values heading" },
          { field: "values_body", value: draftValues.values_body, label: "Values body" },
        ])
      ) {
        return;
      }

      persistHomepageContent(
        {
          ...homepage,
          about_section_label: draftValues.about_section_label,
          about_section_heading_line_1: draftValues.about_section_heading_line_1,
          about_section_heading_line_2: draftValues.about_section_heading_line_2,
          goals_label: draftValues.goals_label,
          goals_heading: draftValues.goals_heading,
          goals_body: draftValues.goals_body,
          vision_label: draftValues.vision_label,
          vision_heading: draftValues.vision_heading,
          vision_body: draftValues.vision_body,
          values_label: draftValues.values_label,
          values_heading: draftValues.values_heading,
          values_body: draftValues.values_body,
        },
        "Goals, Vision, and Values section saved successfully.",
        { closeEditors: ["values"] }
      );
      return;
    }

    setDraftValues((current) => ({
      ...current,
      about_section_label: homepage.about_section_label,
      about_section_heading_line_1: homepage.about_section_heading_line_1,
      about_section_heading_line_2: homepage.about_section_heading_line_2,
      goals_label: homepage.goals_label,
      goals_heading: homepage.goals_heading,
      goals_body: homepage.goals_body,
      vision_label: homepage.vision_label,
      vision_heading: homepage.vision_heading,
      vision_body: homepage.vision_body,
      values_label: homepage.values_label,
      values_heading: homepage.values_heading,
      values_body: homepage.values_body,
    }));
    setStatus({ type: "idle", message: "" });
    setIsValuesEditing(true);
  }

  function handleToggleCtaEditing() {
    if (isCtaEditing) {
      if (
        !ensureValid([
          { field: "cta_heading", value: draftCta.cta_heading, label: "CTA heading" },
          { field: "cta_body", value: draftCta.cta_body, label: "CTA body" },
          { field: "cta_button_label", value: draftCta.cta_button_label, label: "CTA button label" },
        ])
      ) {
        return;
      }

      persistHomepageContent(
        {
          ...homepage,
          cta_heading: draftCta.cta_heading,
          cta_body: draftCta.cta_body,
          cta_button_label: draftCta.cta_button_label,
        },
        "Call to action section saved successfully.",
        { closeEditors: ["cta"] }
      );
      return;
    }

    setDraftCta((current) => ({
      ...current,
      cta_heading: homepage.cta_heading,
      cta_body: homepage.cta_body,
      cta_button_label: homepage.cta_button_label,
    }));
    setStatus({ type: "idle", message: "" });
    setIsCtaEditing(true);
  }

  async function handleAboutImageSelect(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    setStatus({ type: "idle", message: "" });

    try {
      const uploadPayload = new FormData();
      uploadPayload.append("file", file);
      uploadPayload.append("folder", "homepage");

      const response = await fetch("/api/cms-images", {
        method: "POST",
        body: uploadPayload,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to upload homepage image.");
      }

      setDraftAbout((current) => ({
        ...current,
        about_image_url: result.imageUrl,
      }));
      setAboutImagePreviewUrl(result.imageUrl);
      setStatus({
        type: "success",
        message: "Homepage image uploaded. Save the section to keep it.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to upload homepage image.",
      });
    } finally {
      event.target.value = "";
      setIsUploadingImage(false);
    }
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
        title="About Practice"
        description=""
        helperText=""
        isEditing={isAboutEditing}
        isVisible={isAboutVisible}
        onToggleEditing={handleToggleAboutEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          if (
            !ensureValid([
              { field: "about_badge", value: draftAbout.about_badge, label: "About badge" },
              { field: "about_heading", value: draftAbout.about_heading, label: "About heading" },
              { field: "about_intro", value: draftAbout.about_intro, label: "About intro" },
              { field: "about_highlight", value: draftAbout.about_highlight, label: "About highlight" },
              { field: "about_closing", value: draftAbout.about_closing, label: "About closing line" },
            ])
          ) {
            return;
          }

          await toggleHomepageSection(
            "show_about_section",
            setIsAboutVisible,
            {
              ...homepage,
              about_image_url: draftAbout.about_image_url,
              about_badge: draftAbout.about_badge,
              about_heading: draftAbout.about_heading,
              about_intro: draftAbout.about_intro,
              about_highlight: draftAbout.about_highlight,
              about_closing: draftAbout.about_closing,
            },
            (isVisible) =>
              isVisible
                ? "About Practice section is now visible on the homepage."
                : "About Practice section is now hidden on the homepage."
          );
        }}
      >
        <CmsPreviewLayout
          preview={
            <HomepageAboutPreview
              content={draftAbout}
              isEditing={isAboutEditing}
              isVisible={isAboutVisible}
              imagePreviewUrl={aboutImagePreviewUrl}
              onFieldChange={updateDraftAboutField}
              onSelectImage={handleAboutImageSelect}
              onSelect={() => {
                setStatus({ type: "idle", message: "" });
                setIsAboutEditing(true);
              }}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="How I Can Help"
        description=""
        helperText=""
        isEditing={isServicesEditing}
        isVisible={isServicesVisible}
        onToggleEditing={handleToggleServicesEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          if (
            !ensureValid([
              { field: "services_label", value: draftServices.services_label, label: "Services label" },
              { field: "services_heading", value: draftServices.services_heading, label: "Services heading" },
              { field: "services_subheading", value: draftServices.services_subheading, label: "Services subheading" },
              { field: "services_support_body", value: draftServices.services_support_body, label: "Services support body" },
              { field: "service_1_title", value: draftServices.service_1_title, label: "Service 1 title" },
              { field: "service_1_description", value: draftServices.service_1_description, label: "Service 1 description" },
              { field: "service_1_tags", value: draftServices.service_1_tags, label: "Service 1 tags" },
              { field: "service_2_title", value: draftServices.service_2_title, label: "Service 2 title" },
              { field: "service_2_description", value: draftServices.service_2_description, label: "Service 2 description" },
              { field: "service_2_tags", value: draftServices.service_2_tags, label: "Service 2 tags" },
              { field: "service_3_title", value: draftServices.service_3_title, label: "Service 3 title" },
              { field: "service_3_description", value: draftServices.service_3_description, label: "Service 3 description" },
              { field: "service_3_tags", value: draftServices.service_3_tags, label: "Service 3 tags" },
              { field: "services_card_1_title", value: draftServices.services_card_1_title, label: "Services card 1 title" },
              { field: "services_card_1_body", value: draftServices.services_card_1_body, label: "Services card 1 body" },
              { field: "services_card_2_title", value: draftServices.services_card_2_title, label: "Services card 2 title" },
              { field: "services_card_2_body", value: draftServices.services_card_2_body, label: "Services card 2 body" },
            ])
          ) {
            return;
          }

          await toggleHomepageSection(
            "show_services_section",
            setIsServicesVisible,
            {
              ...homepage,
              services_label: draftServices.services_label,
              services_heading: draftServices.services_heading,
              services_subheading: draftServices.services_subheading,
              services_support_body: draftServices.services_support_body,
              service_1_title: draftServices.service_1_title,
              service_1_description: draftServices.service_1_description,
              service_1_tags: draftServices.service_1_tags,
              service_2_title: draftServices.service_2_title,
              service_2_description: draftServices.service_2_description,
              service_2_tags: draftServices.service_2_tags,
              service_3_title: draftServices.service_3_title,
              service_3_description: draftServices.service_3_description,
              service_3_tags: draftServices.service_3_tags,
              services_card_1_title: draftServices.services_card_1_title,
              services_card_1_body: draftServices.services_card_1_body,
              services_card_2_title: draftServices.services_card_2_title,
              services_card_2_body: draftServices.services_card_2_body,
            },
            (isVisible) =>
              isVisible
                ? "How I Can Help section is now visible on the homepage."
                : "How I Can Help section is now hidden on the homepage."
          );
        }}
      >
        <CmsPreviewLayout
          preview={
            <HomepageServicesPreview
              content={{
                ...draftServices,
                isEditing: isServicesEditing,
                onFieldChange: updateDraftServicesField,
              }}
              isVisible={isServicesVisible}
              onSelect={() => {
                setStatus({ type: "idle", message: "" });
                setIsServicesEditing(true);
              }}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Goals, Vision, and Values"
        description=""
        helperText=""
        isEditing={isValuesEditing}
        isVisible={isValuesVisible}
        onToggleEditing={handleToggleValuesEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          if (
            !ensureValid([
              { field: "about_section_label", value: draftValues.about_section_label, label: "About section label" },
              { field: "about_section_heading_line_1", value: draftValues.about_section_heading_line_1, label: "About section heading line 1" },
              { field: "about_section_heading_line_2", value: draftValues.about_section_heading_line_2, label: "About section heading line 2" },
              { field: "goals_label", value: draftValues.goals_label, label: "Goals label" },
              { field: "goals_heading", value: draftValues.goals_heading, label: "Goals heading" },
              { field: "goals_body", value: draftValues.goals_body, label: "Goals body" },
              { field: "vision_label", value: draftValues.vision_label, label: "Vision label" },
              { field: "vision_heading", value: draftValues.vision_heading, label: "Vision heading" },
              { field: "vision_body", value: draftValues.vision_body, label: "Vision body" },
              { field: "values_label", value: draftValues.values_label, label: "Values label" },
              { field: "values_heading", value: draftValues.values_heading, label: "Values heading" },
              { field: "values_body", value: draftValues.values_body, label: "Values body" },
            ])
          ) {
            return;
          }

          await toggleHomepageSection(
            "show_values_section",
            setIsValuesVisible,
            {
              ...homepage,
              about_section_label: draftValues.about_section_label,
              about_section_heading_line_1: draftValues.about_section_heading_line_1,
              about_section_heading_line_2: draftValues.about_section_heading_line_2,
              goals_label: draftValues.goals_label,
              goals_heading: draftValues.goals_heading,
              goals_body: draftValues.goals_body,
              vision_label: draftValues.vision_label,
              vision_heading: draftValues.vision_heading,
              vision_body: draftValues.vision_body,
              values_label: draftValues.values_label,
              values_heading: draftValues.values_heading,
              values_body: draftValues.values_body,
            },
            (isVisible) =>
              isVisible
                ? "Goals, Vision, and Values section is now visible on the homepage."
                : "Goals, Vision, and Values section is now hidden on the homepage."
          );
        }}
      >
        <CmsPreviewLayout
          preview={
            <HomepageValuesPreview
              content={{
                ...draftValues,
                isEditing: isValuesEditing,
                onFieldChange: updateDraftValuesField,
              }}
              isVisible={isValuesVisible}
              onSelect={() => {
                setStatus({ type: "idle", message: "" });
                setIsValuesEditing(true);
              }}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Call To Action"
        description=""
        helperText=""
        isEditing={isCtaEditing}
        isVisible={isCtaVisible}
        onToggleEditing={handleToggleCtaEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          if (
            !ensureValid([
              { field: "cta_heading", value: draftCta.cta_heading, label: "CTA heading" },
              { field: "cta_body", value: draftCta.cta_body, label: "CTA body" },
              { field: "cta_button_label", value: draftCta.cta_button_label, label: "CTA button label" },
            ])
          ) {
            return;
          }

          await toggleHomepageSection(
            "show_cta_section",
            setIsCtaVisible,
            {
              ...homepage,
              cta_heading: draftCta.cta_heading,
              cta_body: draftCta.cta_body,
              cta_button_label: draftCta.cta_button_label,
            },
            (isVisible) =>
              isVisible
                ? "Call To Action section is now visible on the homepage."
                : "Call To Action section is now hidden on the homepage."
          );
        }}
      >
        <CmsPreviewLayout
          preview={
            <HomepageCtaPreview
              content={{
                ...draftCta,
                isEditing: isCtaEditing,
                onFieldChange: updateDraftCtaField,
              }}
              isVisible={isCtaVisible}
              onSelect={() => {
                setStatus({ type: "idle", message: "" });
                setIsCtaEditing(true);
              }}
            />
          }
        />
      </CmsEditableSection>
    </div>
  );
}
