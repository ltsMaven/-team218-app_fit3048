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

function ServicesHeroPreview({ content, isEditing, onFieldChange }) {
  return (
    <div className="bg-[#f7f7f6] px-6 pb-20 pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/services/hero-services.png"
            alt="Services hero"
            className="h-[220px] w-full object-cover sm:h-[280px] lg:h-[320px]"
          />
        </div>

        <div className="mx-auto mt-10 max-w-4xl text-center">
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

function FeatureEditor({ features, isEditing, onChange }) {
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
        </div>
      ))}
    </div>
  );
}

function ServiceCardPreview({
  service,
  index,
  isEditing,
  onFieldChange,
  onFeatureChange,
  onSelectImage,
  imageUrl,
  onDelete,
  compact = false,
}) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#dde3ea] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.04)]">
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
            />

            {isEditing ? (
              <button
                type="button"
                onClick={onDelete}
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
          />

          {isEditing ? (
            <button
              type="button"
              onClick={onDelete}
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
  onFieldChange,
  onFeatureChange,
  onSelectImage,
  imagePreviews,
  onDelete,
}) {
  return (
    <div className="bg-[#f7f7f6] px-6 pb-20 pt-8">
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
              onSelectImage={(event) => onSelectImage(service.id, event)}
              imageUrl={imagePreviews[service.id] || service.image_url}
              onDelete={() => onDelete(service.id)}
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
                onSelectImage={(event) => onSelectImage(service.id, event)}
                imageUrl={imagePreviews[service.id] || service.image_url}
                onDelete={() => onDelete(service.id)}
              />
            ))}
          </div>
        ) : null}
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
    normaliseServiceItems(initialServiceItems)
  );
  const [draftServiceItems, setDraftServiceItems] = useState(
    normaliseServiceItems(initialServiceItems).map((item, index) => ({
      ...item,
      id: item.id || `draft-${index}`,
    }))
  );
  const [isIntroEditing, setIsIntroEditing] = useState(false);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [editingCardId, setEditingCardId] = useState("");
  const [isCardsVisible, setIsCardsVisible] = useState(true);
  const [imagePreviews, setImagePreviews] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  function handleToggleIntroEditing() {
    if (isIntroEditing) {
      if (
        !ensureValid(
          validateCmsFields([
            { field: "heading", value: draftServicesContent.heading, label: "Services heading" },
            { field: "intro", value: draftServicesContent.intro, label: "Services intro" },
          ])
        )
      ) {
        return;
      }

      setServicesContent((current) => ({
        ...current,
        heading: draftServicesContent.heading,
        intro: draftServicesContent.intro,
      }));
      setStatus({
        type: "success",
        message:
          "Services page intro updated. Use the main save button below to store it in Supabase.",
      });
      setIsIntroEditing(false);
      return;
    }

    setDraftServicesContent((current) => ({
      ...current,
      heading: servicesContent.heading,
      intro: servicesContent.intro,
    }));
    setStatus({ type: "idle", message: "" });
    setIsIntroEditing(true);
  }

  function startEditingCard(id) {
    setEditingCardId(id);
    setStatus({ type: "idle", message: "" });
  }

  function saveEditingCard(id) {
    const currentDraft =
      draftServiceItems.find((draft) => draft.id === id) || null;

    if (!currentDraft) {
      return;
    }

    if (!ensureValid(validateServiceItems([currentDraft]))) {
      return;
    }

    setServiceItems((current) =>
      current.map((item) =>
        item.id === id
          ? draftServiceItems.find((draft) => draft.id === id) || item
          : item
      )
    );
    setEditingCardId("");
    setStatus({
      type: "success",
      message:
        "Service card updated. Use the main save button below to store all services in Supabase.",
    });
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
      setServiceItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, image_url: result.imageUrl } : item
        )
      );
      setStatus({
        type: "success",
        message:
          "Service image uploaded. Save the page to store it in Supabase.",
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

  function addServiceCard() {
    const newCard = createNewServiceCard(draftServiceItems.length);
    setDraftServiceItems((current) => [...current, newCard]);
    setServiceItems((current) => [...current, newCard]);
    setEditingCardId(newCard.id);
    setStatus({
      type: "success",
      message:
        "New service card added. Update it in the preview, then save the page to store it in Supabase.",
    });
  }

  function deleteServiceCard(id) {
    setDraftServiceItems((current) => current.filter((item) => item.id !== id));
    setServiceItems((current) => current.filter((item) => item.id !== id));
    setEditingCardId((current) => (current === id ? "" : current));
    setStatus({
      type: "success",
      message:
        "Service card removed from the current CMS state. Save the page to apply the change in Supabase.",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = [
      ...validateCmsFields([
        { field: "heading", value: servicesContent.heading, label: "Services heading" },
        { field: "intro", value: servicesContent.intro, label: "Services intro" },
      ]),
      ...validateServiceItems(serviceItems),
    ];

    if (!ensureValid(validationErrors)) {
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
          services: servicesContent,
          serviceItems: prepareServiceItemsForSave(serviceItems),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save Services content.");
      }

      const nextContent = normaliseServicesContent(
        result.content?.services || servicesContent
      );
      const nextItems = normaliseServiceItems(
        result.content?.serviceItems || serviceItems
      );

      setServicesContent(nextContent);
      setDraftServicesContent(nextContent);
      setServiceItems(nextItems);
      setDraftServiceItems(
        nextItems.map((item, index) => ({
          ...item,
          id: item.id || `draft-${index}`,
        }))
      );
      setStatus({
        type: "success",
        message: "Services CMS content saved to Supabase.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save Services content.",
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
          Services Editor
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#42454c]">
          Edit the real page layout
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5d6169]">
          This editor follows the current Services page design. The page layout
          stays fixed while the intro and service cards remain easy to update.
        </p>
      </div>

      <CmsEditableSection
        title="Services Intro"
        description="Hero image, page heading, and intro text."
        helperText="Click Edit, then update the services heading and introduction directly in the preview."
        isEditing={isIntroEditing}
        isVisible={isIntroVisible}
        onToggleEditing={handleToggleIntroEditing}
        onToggleVisible={() => setIsIntroVisible((current) => !current)}
      >
        <CmsPreviewLayout
          preview={
            <ServicesHeroPreview
              content={draftServicesContent}
              isEditing={isIntroEditing}
              onFieldChange={updateDraftServicesContent}
            />
          }
        />
      </CmsEditableSection>

      <CmsEditableSection
        title="Service Cards"
        description="Editable cards for the current services page layout."
        helperText="Use Edit on a card to update it, Add Service to create a new one, and Save Page below to store all card changes."
        isEditing={Boolean(editingCardId)}
        isVisible={isCardsVisible}
        onToggleEditing={() => {
          if (!editingCardId && draftServiceItems.length) {
            setEditingCardId(draftServiceItems[0].id);
            return;
          }

          if (editingCardId) {
            saveEditingCard(editingCardId);
          }
        }}
        onToggleVisible={() => setIsCardsVisible((current) => !current)}
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={addServiceCard}
            className="inline-flex items-center gap-2 rounded-full bg-[#926ab9] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#7d58a3]"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>

        <CmsPreviewLayout
          preview={
            <ServicesCardsPreview
              services={draftServiceItems}
              editingCardId={editingCardId}
              onFieldChange={updateDraftCard}
              onFeatureChange={updateDraftFeature}
              onSelectImage={handleSelectImage}
              imagePreviews={imagePreviews}
              onDelete={deleteServiceCard}
            />
          }
        />

        <div className="mt-4 flex flex-wrap gap-3">
          {draftServiceItems.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() =>
                editingCardId === service.id
                  ? saveEditingCard(service.id)
                  : startEditingCard(service.id)
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                editingCardId === service.id
                  ? "bg-[#4b8e9a] text-white hover:bg-[#3e7882]"
                  : "border border-[#d8dfeb] bg-white text-[#42454c] hover:border-[#926ab9] hover:text-[#926ab9]"
              }`}
            >
              {editingCardId === service.id
                ? `Save ${service.title || "Service"}`
                : `Edit ${service.title || "Service"}`}
            </button>
          ))}
        </div>
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
            "Update the Services page here, then save when you are ready."}
        </p>

        <button
          type="submit"
          disabled={isSaving || isUploadingImage}
          className="inline-flex items-center justify-center rounded-2xl bg-[#4b8e9a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3e7882] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isUploadingImage
            ? "Uploading image..."
            : isSaving
              ? "Saving..."
              : "Save Services Content"}
        </button>
      </div>
    </form>
  );
}
