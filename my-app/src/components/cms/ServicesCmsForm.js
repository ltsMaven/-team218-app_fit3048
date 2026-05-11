"use client";

import { useEffect, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import CmsEditableSection from "./CmsEditableSection";
import CmsPreviewLayout from "./CmsPreviewLayout";
import EditableText from "./EditableText";
import {
  fallbackServiceItems,
  fallbackServicesContent,
  normaliseServiceItems,
  normaliseServicesContent,
} from "@/lib/cms-homepage";
import {
  buildCmsValidationMessage,
  validateCmsFields,
  validateServiceItems,
} from "@/lib/cms-validation";

function EditableImage({ src, alt, isEditing, onSelectFile, heightClass }) {
  return (
    <label
      className={`block overflow-hidden rounded-[1.4rem] ${
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

function ServicesHeroPreview({
  content,
  isEditing,
  isVisible,
  onFieldChange,
  onSelectImage,
  onSelect,
}) {
  return (
    <div
      className={`bg-[#f7f7f6] px-6 pb-20 pt-8 transition ${
        isVisible ? "" : "opacity-45"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <EditableImage
          src={content.hero_image_url || "/assets/services/hero-services.png"}
          alt="Services hero"
          isEditing={isEditing}
          onSelectFile={onSelectImage}
          heightClass="h-[220px] sm:h-[280px] lg:h-[320px]"
        />

        <div
          onClick={onSelect}
          className={`mx-auto mt-10 max-w-4xl text-center transition ${
            isEditing
              ? "rounded-[1.6rem] border border-[#4b8e9a] p-4 ring-2 ring-[#4b8e9a]/15"
              : "cursor-text rounded-[1.6rem] hover:border hover:border-[#926ab9] hover:p-4"
          }`}
        >
          <EditableText
            as="h2"
            value={content.heading}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("heading", value)}
            validationKey="heading"
            className="text-4xl font-semibold tracking-tight text-[#42454c] sm:text-5xl lg:text-6xl"
          />
          <EditableText
            value={content.intro}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("intro", value)}
            validationKey="intro"
            className="mx-auto mt-5 max-w-3xl whitespace-pre-wrap text-lg leading-relaxed text-[#5c6069]"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureEditor({
  features,
  isEditing,
  onChange,
  onAddFeature,
  onRemoveFeature,
}) {
  return (
    <div className="mt-6 space-y-3">
      {features.map((feature, index) => (
        <div
          key={`${feature}-${index}`}
          className="flex items-start gap-3 text-sm leading-6 text-[#58606b]"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#decdf0] bg-[#faf7fd]">
            <Check className="h-3.5 w-3.5 text-[#8f72bb]" />
          </span>
          <EditableText
            as="span"
            value={feature}
            isEditing={isEditing}
            onChange={(value) => onChange(index, value)}
            validationKey="feature"
            className="block"
          />
          {isEditing ? (
            <button
              type="button"
              onClick={
                onRemoveFeature
                  ? (event) => {
                      event.stopPropagation();
                      onRemoveFeature(index);
                    }
                  : undefined
              }
              className="rounded-full border border-[#d8dfeb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7b8088] transition hover:border-[#b94a48] hover:text-[#b94a48]"
            >
              Delete
            </button>
          ) : null}
        </div>
      ))}
      {isEditing ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAddFeature();
          }}
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-[#926ab9]/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6d7bbb] transition hover:border-[#926ab9] hover:bg-white/80"
        >
          <Plus className="h-3.5 w-3.5" />
          Add feature
        </button>
      ) : null}
    </div>
  );
}

function ServiceCardPreview({
  service,
  index,
  isEditing,
  onFieldChange,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
  onSelectImage,
  imageUrl,
  onDelete,
  onSelect,
  compact = false,
}) {
  return (
    <article
      onClick={onSelect}
      className={`overflow-hidden rounded-[2rem] border bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition ${
        isEditing
          ? "border-[#4b8e9a] ring-2 ring-[#4b8e9a]/15"
          : "cursor-text border-[#dde3ea] hover:border-[#926ab9]"
      }`}
    >
      <div className="p-4 pb-0">
        <EditableImage
          src={imageUrl || `/assets/services/service-${compact ? index + 4 : index + 1}.png`}
          alt={service.title}
          isEditing={isEditing}
          onSelectFile={onSelectImage}
          heightClass={compact ? "h-36" : "h-44"}
        />
      </div>

      {compact ? (
        <div className="grid gap-6 p-8 pt-5 md:grid-cols-[1.25fr_auto_0.9fr]">
          <div>
            <EditableText
              as="p"
              value={service.label}
              isEditing={isEditing}
              onChange={(value) => onFieldChange("label", value)}
              validationKey="label"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a85c4]"
            />
            <EditableText
              as="h3"
              value={service.title}
              isEditing={isEditing}
              onChange={(value) => onFieldChange("title", value)}
              validationKey="title"
              className="mt-3 text-[2rem] font-semibold leading-tight text-[#42454c]"
            />
            <EditableText
              value={service.description}
              isEditing={isEditing}
              onChange={(value) => onFieldChange("description", value)}
              validationKey="description"
              className="mt-5 whitespace-pre-wrap text-base leading-8 text-[#5d6169]"
            />
          </div>

          <div className="hidden w-px bg-[#e2e7ee] md:block" />

          <div className="flex flex-col justify-between">
            <div>
              <div className="h-px w-full bg-[#e2e7ee] md:hidden" />
              <div className="mt-1 md:mt-0">
                <EditableText
                  as="p"
                  value={service.price}
                  isEditing={isEditing}
                  onChange={(value) => onFieldChange("price", value)}
                  validationKey="price"
                  className="text-4xl font-semibold tracking-tight text-[#42454c]"
                />
                <EditableText
                  as="p"
                  value={service.price_detail}
                  isEditing={isEditing}
                  onChange={(value) => onFieldChange("price_detail", value)}
                  validationKey="price_detail"
                  className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-[#8f72bb]"
                />
              </div>
            </div>

            <FeatureEditor
              features={service.features || []}
              isEditing={isEditing}
              onChange={onFeatureChange}
              onAddFeature={() => onAddFeature(service.id)}
              onRemoveFeature={(featureIndex) =>
                onRemoveFeature(service.id, featureIndex)
              }
            />

            {isEditing ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete();
                }}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#b94a48]"
              >
                <Trash2 className="h-4 w-4" />
                Delete service
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="p-8 pt-5">
          <EditableText
            as="p"
            value={service.label}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("label", value)}
            validationKey="label"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a85c4]"
          />
          <EditableText
            as="h3"
            value={service.title}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("title", value)}
            validationKey="title"
            className="mt-3 text-[2rem] font-semibold leading-tight text-[#42454c]"
          />
          <EditableText
            value={service.description}
            isEditing={isEditing}
            onChange={(value) => onFieldChange("description", value)}
            validationKey="description"
            className="mt-5 whitespace-pre-wrap text-base leading-8 text-[#5d6169]"
          />

          <div className="mt-6 h-px w-full bg-[#e2e7ee]" />

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <EditableText
                as="p"
                value={service.price}
                isEditing={isEditing}
                onChange={(value) => onFieldChange("price", value)}
                validationKey="price"
                className="text-4xl font-semibold tracking-tight text-[#42454c]"
              />
              <EditableText
                as="p"
                value={service.price_detail}
                isEditing={isEditing}
                onChange={(value) => onFieldChange("price_detail", value)}
                validationKey="price_detail"
                className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-[#8f72bb]"
              />
            </div>
          </div>

          <FeatureEditor
            features={service.features || []}
            isEditing={isEditing}
            onChange={onFeatureChange}
            onAddFeature={() => onAddFeature(service.id)}
            onRemoveFeature={(featureIndex) =>
              onRemoveFeature(service.id, featureIndex)
            }
          />

          {isEditing ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#b94a48]"
            >
              <Trash2 className="h-4 w-4" />
              Delete service
            </button>
          ) : null}
        </div>
      )}
    </article>
  );
}

function ServicesCardsPreview({
  services,
  editingCardId,
  isVisible,
  onFieldChange,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
  onSelectImage,
  imagePreviews,
  onDelete,
  onSelectCard,
  onAddService,
}) {
  return (
    <div
      className={`bg-[#f7f7f6] px-6 pb-20 pt-8 transition ${
        isVisible ? "" : "opacity-45"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mt-14 grid grid-cols-1 gap-8 xl:grid-cols-3">
          {services.slice(0, 3).map((service, index) => (
            <ServiceCardPreview
              key={service.id || service.title}
              service={service}
              index={index}
              isEditing={editingCardId === service.id}
              onFieldChange={(name, value) => onFieldChange(service.id, name, value)}
              onFeatureChange={(featureIndex, value) =>
                onFeatureChange(service.id, featureIndex, value)
              }
              onAddFeature={onAddFeature}
              onRemoveFeature={onRemoveFeature}
              onSelectImage={(event) => onSelectImage(service.id, event)}
              imageUrl={imagePreviews[service.id] || service.image_url}
              onDelete={() => onDelete(service.id)}
              onSelect={() => onSelectCard(service.id)}
            />
          ))}
        </div>

        {services.length > 3 ? (
          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
            {services.slice(3).map((service, index) => (
              <ServiceCardPreview
                key={service.id || service.title}
                service={service}
                index={index}
                compact
                isEditing={editingCardId === service.id}
                onFieldChange={(name, value) =>
                  onFieldChange(service.id, name, value)
                }
                onFeatureChange={(featureIndex, value) =>
                  onFeatureChange(service.id, featureIndex, value)
                }
                onAddFeature={onAddFeature}
                onRemoveFeature={onRemoveFeature}
                onSelectImage={(event) => onSelectImage(service.id, event)}
                imageUrl={imagePreviews[service.id] || service.image_url}
                onDelete={() => onDelete(service.id)}
                onSelect={() => onSelectCard(service.id)}
              />
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          <button
            type="button"
            onClick={onAddService}
            className="inline-flex items-center gap-2 rounded-full bg-[#926ab9] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#7d58a3]"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>
      </div>
    </div>
  );
}

function createNewServiceCard(index) {
  return {
    id: `draft-${Date.now()}-${index}`,
    image_url: "",
    title: "New Service",
    label: "Service Label",
    price: "$0",
    price_detail: "per session",
    description: "Add a service description here.",
    features: [
      "Add the first service feature",
      "Add the second service feature",
      "Add the third service feature",
    ],
    icon_key: "heart",
    tint: "bg-[#eaf3f5]",
    accent: "text-[#4b8e9a]",
    sort_order: index,
    is_featured: false,
    is_published: true,
  };
}

function prepareServiceItemsForSave(items) {
  return items.map((item) => ({
    ...item,
    id:
      typeof item.id === "string" && item.id.startsWith("draft-")
        ? undefined
        : item.id,
  }));
}

export default function ServicesCmsForm({
  initialServicesContent = fallbackServicesContent,
  initialServiceItems = fallbackServiceItems,
  loadError = "",
}) {
  const [servicesContent, setServicesContent] = useState(
    normaliseServicesContent(initialServicesContent)
  );
  const [draftServicesContent, setDraftServicesContent] = useState(
    normaliseServicesContent(initialServicesContent)
  );
  const [serviceItems, setServiceItems] = useState(
    normaliseServiceItems(initialServiceItems).map((item, index) => ({
      ...item,
      id: item.id || `draft-${index}`,
    }))
  );
  const [draftServiceItems, setDraftServiceItems] = useState(
    normaliseServiceItems(initialServiceItems).map((item, index) => ({
      ...item,
      id: item.id || `draft-${index}`,
    }))
  );
  const [isIntroEditing, setIsIntroEditing] = useState(false);
  const [editingCardId, setEditingCardId] = useState("");
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [isCardsVisible, setIsCardsVisible] = useState(true);
  const [imagePreviews, setImagePreviews] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const statusBanner = status.message ? (
    <div
      className={`rounded-2xl border px-4 py-3 text-center ${
        status.type === "error"
          ? "border-[#e7c9c8] bg-[#fff6f5] text-[#8b3d3a]"
          : "border-[#cfe5df] bg-[#f4fbf8] text-[#2f7a68]"
      }`}
    >
      <p className="text-sm font-medium leading-6">{status.message}</p>
    </div>
  ) : null;

  useEffect(() => {
    const nextContent = normaliseServicesContent(initialServicesContent);
    const nextItems = normaliseServiceItems(initialServiceItems).map(
      (item, index) => ({
        ...item,
        id: item.id || `draft-${index}`,
      })
    );

    setServicesContent(nextContent);
    setDraftServicesContent(nextContent);
    setServiceItems(nextItems);
    setDraftServiceItems(nextItems);
    setIsIntroVisible(nextContent.show_intro_section);
    setIsCardsVisible(nextContent.show_cards_section);
    setIsIntroEditing(false);
    setEditingCardId("");
  }, [initialServiceItems, initialServicesContent]);

  useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach((url) => {
        if (url?.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  function updateDraftServicesContent(name, value) {
    setDraftServicesContent((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function ensureValid(errors) {
    if (!errors.length) {
      return true;
    }

    setStatus({
      type: "error",
      message: buildCmsValidationMessage(errors),
    });
    return false;
  }

  async function persistServicesContent(
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
          services: nextContent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save Services content.");
      }

      const savedContent = normaliseServicesContent(
        result.content?.services || nextContent
      );

      setServicesContent(savedContent);
      setDraftServicesContent(savedContent);
      setIsIntroVisible(savedContent.show_intro_section);
      setIsCardsVisible(savedContent.show_cards_section);
      if (closeEditor) {
        setIsIntroEditing(false);
      }
      setStatus({
        type: "success",
        message: successMessage,
      });
      return true;
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save Services content.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function persistServiceCards(
    nextItems,
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
          serviceItems: prepareServiceItemsForSave(nextItems),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save service cards.");
      }

      const savedItems = normaliseServiceItems(
        result.content?.serviceItems || nextItems
      ).map((item, index) => ({
        ...item,
        id: item.id || `draft-${index}`,
      }));

      setServiceItems(savedItems);
      setDraftServiceItems(savedItems);
      if (closeEditor) {
        setEditingCardId("");
      }
      setStatus({
        type: "success",
        message: successMessage,
      });
      return true;
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save service cards.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleIntroEditing() {
    if (isIntroEditing) {
      const errors = validateCmsFields([
        {
          field: "hero_image_url",
          value: draftServicesContent.hero_image_url,
          label: "Services hero image",
        },
        {
          field: "heading",
          value: draftServicesContent.heading,
          label: "Services heading",
        },
        {
          field: "intro",
          value: draftServicesContent.intro,
          label: "Services intro",
        },
      ]);

      if (!ensureValid(errors)) {
        return;
      }

      await persistServicesContent(draftServicesContent, "Services intro saved successfully.", {
        closeEditor: true,
      });
      return;
    }

    setStatus({ type: "idle", message: "" });
    setIsIntroEditing(true);
  }

  function updateDraftCard(id, name, value) {
    setDraftServiceItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [name]: value } : item))
    );
  }

  function updateDraftFeature(id, featureIndex, value) {
    setDraftServiceItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              features: item.features.map((feature, index) =>
                index === featureIndex ? value : feature
              ),
            }
          : item
      )
    );
  }

  function addDraftFeature(id) {
    setDraftServiceItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              features: [...(item.features || []), "Add a service feature"],
            }
          : item
      )
    );
  }

  function removeDraftFeature(id, featureIndex) {
    setDraftServiceItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const nextFeatures = (item.features || []).filter(
          (_, index) => index !== featureIndex
        );

        return {
          ...item,
          features: nextFeatures.length ? nextFeatures : [""],
        };
      })
    );
  }

  async function handleSelectImage(id, event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    setStatus({ type: "idle", message: "" });

    try {
      const uploadPayload = new FormData();
      uploadPayload.append("file", file);
      uploadPayload.append("folder", "services");

      const response = await fetch("/api/cms-images", {
        method: "POST",
        body: uploadPayload,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to upload service image.");
      }

      setImagePreviews((current) => ({
        ...current,
        [id]: result.imageUrl,
      }));
      setDraftServiceItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, image_url: result.imageUrl } : item
        )
      );
      setStatus({
        type: "success",
        message: "Service image uploaded. Save the section to keep it.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to upload service image.",
      });
    } finally {
      event.target.value = "";
      setIsUploadingImage(false);
    }
  }

  async function handleSelectIntroImage(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    setStatus({ type: "idle", message: "" });

    try {
      const uploadPayload = new FormData();
      uploadPayload.append("file", file);
      uploadPayload.append("folder", "services");

      const response = await fetch("/api/cms-images", {
        method: "POST",
        body: uploadPayload,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to upload services hero image.");
      }

      setDraftServicesContent((current) => ({
        ...current,
        hero_image_url: result.imageUrl,
      }));
      setStatus({
        type: "success",
        message: "Services intro image uploaded. Save the section to keep it.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to upload services hero image.",
      });
    } finally {
      event.target.value = "";
      setIsUploadingImage(false);
    }
  }

  function addServiceCard() {
    const newCard = createNewServiceCard(draftServiceItems.length);
    setDraftServiceItems((current) => [...current, newCard]);
    setEditingCardId(newCard.id);
    setStatus({
      type: "success",
      message: "New service card added. Click into it to finish editing, then save.",
    });
  }

  function deleteServiceCard(id) {
    setDraftServiceItems((current) => current.filter((item) => item.id !== id));
    setEditingCardId((current) => (current === id ? "" : current));
    setStatus({
      type: "success",
      message: "Service card removed. Save the section to apply the change.",
    });
  }

  async function handleToggleCardsEditing() {
    if (editingCardId) {
      if (!ensureValid(validateServiceItems(draftServiceItems))) {
        return;
      }

      await persistServiceCards(draftServiceItems, "Service cards saved successfully.", {
        closeEditor: true,
      });
      return;
    }

    if (draftServiceItems.length) {
      setStatus({ type: "idle", message: "" });
      setEditingCardId(draftServiceItems[0].id);
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
        title="Services Intro"
        description=""
        helperText=""
        isEditing={isIntroEditing}
        isVisible={isIntroVisible}
        onToggleEditing={handleToggleIntroEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          const errors = validateCmsFields([
            {
              field: "hero_image_url",
              value: draftServicesContent.hero_image_url,
              label: "Services hero image",
            },
            {
              field: "heading",
              value: draftServicesContent.heading,
              label: "Services heading",
            },
            {
              field: "intro",
              value: draftServicesContent.intro,
              label: "Services intro",
            },
          ]);

          if (!ensureValid(errors)) {
            return;
          }

          const nextVisible = !isIntroVisible;
          const previousContent = servicesContent;
          const nextContent = {
            ...draftServicesContent,
            show_intro_section: nextVisible,
            show_cards_section: servicesContent.show_cards_section,
          };

          setIsIntroVisible(nextVisible);
          setDraftServicesContent(nextContent);
          setServicesContent(nextContent);
          const didSave = await persistServicesContent(
            nextContent,
            nextVisible
              ? "Services intro is now visible on the Services page."
              : "Services intro is now hidden on the Services page."
          );

          if (!didSave) {
            setIsIntroVisible(!nextVisible);
            setServicesContent(previousContent);
            setDraftServicesContent(previousContent);
          }
        }}
      >
        <CmsPreviewLayout
          preview={
            <ServicesHeroPreview
              content={draftServicesContent}
              isEditing={isIntroEditing}
              isVisible={isIntroVisible}
              onFieldChange={updateDraftServicesContent}
              onSelectImage={handleSelectIntroImage}
              onSelect={() => {
                setStatus({ type: "idle", message: "" });
                setIsIntroEditing(true);
              }}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Service Cards"
        description=""
        helperText=""
        isEditing={Boolean(editingCardId)}
        isVisible={isCardsVisible}
        onToggleEditing={handleToggleCardsEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          if (!ensureValid(validateServiceItems(draftServiceItems))) {
            return;
          }

          const nextVisible = !isCardsVisible;
          const previousContent = servicesContent;
          const nextContent = {
            ...servicesContent,
            show_intro_section: isIntroVisible,
            show_cards_section: nextVisible,
          };

          setIsCardsVisible(nextVisible);
          setServicesContent(nextContent);
          setDraftServicesContent(nextContent);
          const didSave = await persistServicesContent(
            nextContent,
            nextVisible
              ? "Service cards are now visible on the Services page."
              : "Service cards are now hidden on the Services page."
          );

          if (!didSave) {
            setIsCardsVisible(!nextVisible);
            setServicesContent(previousContent);
            setDraftServicesContent(previousContent);
          }
        }}
      >
        <CmsPreviewLayout
          preview={
            <ServicesCardsPreview
              services={draftServiceItems}
              editingCardId={editingCardId}
              isVisible={isCardsVisible}
              onFieldChange={updateDraftCard}
              onFeatureChange={updateDraftFeature}
              onAddFeature={addDraftFeature}
              onRemoveFeature={removeDraftFeature}
              onSelectImage={handleSelectImage}
              imagePreviews={imagePreviews}
              onDelete={deleteServiceCard}
              onSelectCard={(id) => {
                setStatus({ type: "idle", message: "" });
                setEditingCardId(id);
              }}
              onAddService={addServiceCard}
            />
          }
        />
      </CmsEditableSection>
    </div>
  );
}
