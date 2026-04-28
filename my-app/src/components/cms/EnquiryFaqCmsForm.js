"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import CmsEditableSection from "./CmsEditableSection";
import CmsPreviewLayout from "./CmsPreviewLayout";
import { fallbackEnquiryContent, normaliseEnquiryContent } from "@/lib/cms-homepage";

function EditableText({
  as: Tag = "p",
  value,
  isEditing,
  onChange,
  className = "",
}) {
  return (
    <Tag
      contentEditable={isEditing}
      suppressContentEditableWarning
      onInput={(event) => onChange(event.currentTarget.textContent || "")}
      className={`${className} ${
        isEditing
          ? "rounded-xl border border-dashed border-[#926ab9]/45 bg-[#faf7fd] px-3 py-2 outline-none focus:border-[#926ab9] focus:bg-white"
          : ""
      }`}
    >
      {value}
    </Tag>
  );
}

function FaqPreview({ faqItems, editingId, onChangeItem, onDeleteItem }) {
  return (
    <section id="faq" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
            FAQ
          </p>

          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[#42454c] sm:text-4xl">
            Common questions before reaching out
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]">
            Here are a few quick answers that may help you better understand
            the counselling process.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {faqItems.map((faq) => {
            const isEditing = editingId === faq.id;

            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-[#d8dfeb] bg-white/90 p-6 shadow-[0_16px_40px_rgba(66,69,76,0.06)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <EditableText
                    as="h4"
                    value={faq.question}
                    isEditing={isEditing}
                    onChange={(value) => onChangeItem(faq.id, "question", value)}
                    className="text-lg font-semibold text-[#42454c]"
                  />

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1eef6] text-[#926ab9]">
                    +
                  </span>
                </div>

                <EditableText
                  value={faq.answer}
                  isEditing={isEditing}
                  onChange={(value) => onChangeItem(faq.id, "answer", value)}
                  className="pt-4 whitespace-pre-wrap leading-7 text-[#5d6169]"
                />

                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => onDeleteItem(faq.id)}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#b94a48]"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete FAQ item
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function createFaqItem(index) {
  return {
    id: `faq-${Date.now()}-${index}`,
    question: "New FAQ question",
    answer: "Add the answer here.",
  };
}

export default function EnquiryFaqCmsForm({
  initialEnquiryContent = fallbackEnquiryContent,
  loadError = "",
}) {
  const [enquiry, setEnquiry] = useState(
    normaliseEnquiryContent(initialEnquiryContent)
  );
  const [draftFaqItems, setDraftFaqItems] = useState(
    normaliseEnquiryContent(initialEnquiryContent).faq_items.map((item, index) => ({
      ...item,
      id: `faq-${index}`,
    }))
  );
  const [editingId, setEditingId] = useState("");
  const [isFaqVisible, setIsFaqVisible] = useState(true);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const nextEnquiry = normaliseEnquiryContent(initialEnquiryContent);
    setEnquiry(nextEnquiry);
    setDraftFaqItems(
      nextEnquiry.faq_items.map((item, index) => ({
        ...item,
        id: `faq-${index}`,
      }))
    );
    setEditingId("");
  }, [initialEnquiryContent]);

  function updateFaqItem(id, field, value) {
    setDraftFaqItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function addFaqItem() {
    const nextItem = createFaqItem(draftFaqItems.length);
    setDraftFaqItems((current) => [...current, nextItem]);
    setEditingId(nextItem.id);
    setStatus({
      type: "success",
      message:
        "New FAQ item added. Update it in the preview, then save the page to store it in Supabase.",
    });
  }

  function deleteFaqItem(id) {
    setDraftFaqItems((current) => current.filter((item) => item.id !== id));
    setEditingId((current) => (current === id ? "" : current));
    setStatus({
      type: "success",
      message:
        "FAQ item removed from the current CMS state. Save the page to apply the change in Supabase.",
    });
  }

  function toggleEditing() {
    if (editingId) {
      setEnquiry((current) => ({
        ...current,
        faq_items: draftFaqItems.map(({ question, answer }) => ({
          question,
          answer,
        })),
      }));
      setEditingId("");
      setStatus({
        type: "success",
        message:
          "FAQ preview updated. Use the main save button below to store it in Supabase.",
      });
      return;
    }

    if (draftFaqItems.length) {
      setEditingId(draftFaqItems[0].id);
    }
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
          enquiry: {
            faq_items: enquiry.faq_items,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save enquiry FAQ content.");
      }

      const nextEnquiry = normaliseEnquiryContent(
        result.content?.enquiry || enquiry
      );
      setEnquiry(nextEnquiry);
      setDraftFaqItems(
        nextEnquiry.faq_items.map((item, index) => ({
          ...item,
          id: `faq-${index}`,
        }))
      );
      setStatus({
        type: "success",
        message: "Enquiry FAQ content saved to Supabase.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save enquiry FAQ content.",
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
          Enquiry FAQ Editor
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#42454c]">
          Edit the real FAQ section
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5d6169]">
          This editor only covers the FAQ section on the Enquiry page. The rest
          of the Enquiry page layout stays hardcoded for now.
        </p>
      </div>

      <CmsEditableSection
        title="FAQ Section"
        description="Common questions shown on the public Enquiry page."
        helperText="Use Edit on an item to update it, Add FAQ to create a new one, and Save Page below to store all FAQ changes."
        isEditing={Boolean(editingId)}
        isVisible={isFaqVisible}
        onToggleEditing={toggleEditing}
        onToggleVisible={() => setIsFaqVisible((current) => !current)}
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={addFaqItem}
            className="inline-flex items-center gap-2 rounded-full bg-[#926ab9] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#7d58a3]"
          >
            <Plus className="h-4 w-4" />
            Add FAQ
          </button>
        </div>

        <CmsPreviewLayout
          preview={
            <FaqPreview
              faqItems={draftFaqItems}
              editingId={editingId}
              onChangeItem={updateFaqItem}
              onDeleteItem={deleteFaqItem}
            />
          }
        />

        <div className="mt-4 flex flex-wrap gap-3">
          {draftFaqItems.map((faq) => (
            <button
              key={faq.id}
              type="button"
              onClick={() =>
                editingId === faq.id ? toggleEditing() : setEditingId(faq.id)
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                editingId === faq.id
                  ? "bg-[#4b8e9a] text-white hover:bg-[#3e7882]"
                  : "border border-[#d8dfeb] bg-white text-[#42454c] hover:border-[#926ab9] hover:text-[#926ab9]"
              }`}
            >
              {editingId === faq.id ? "Save FAQ item" : "Edit FAQ item"}
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
            "Update the FAQ section here, then save when you are ready."}
        </p>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-2xl bg-[#4b8e9a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3e7882] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save Enquiry FAQ"}
        </button>
      </div>
    </form>
  );
}
