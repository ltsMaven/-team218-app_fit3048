"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import CmsEditableSection from "./CmsEditableSection";
import CmsPreviewLayout from "./CmsPreviewLayout";
import EditableText from "./EditableText";
import { fallbackEnquiryContent, normaliseEnquiryContent } from "@/lib/cms-homepage";
import {
  buildCmsValidationMessage,
  validateCmsFields,
} from "@/lib/cms-validation";

function FaqPreview({
  content,
  faqItems,
  editingId,
  onChangeItem,
  onDeleteItem,
  isVisible,
  onSelectItem,
  onChangeHeader,
  onAddFaq,
}) {
  const isHeaderEditing = editingId === "faq-header";

  return (
    <section
      id="faq"
      className={`bg-white px-6 py-24 transition ${
        isVisible ? "" : "opacity-45"
      }`}
    >
      <div className="mx-auto max-w-4xl">
        <div
          onClick={() => onSelectItem("faq-header")}
          className={`text-center transition ${
            isHeaderEditing
              ? "rounded-2xl border border-[#4b8e9a] p-4 ring-2 ring-[#4b8e9a]/15"
              : "cursor-text rounded-2xl hover:border hover:border-[#926ab9] hover:p-4"
          }`}
        >
          <EditableText
            as="p"
            value={content.faq_eyebrow}
            isEditing={isHeaderEditing}
            onChange={(value) => onChangeHeader("faq_eyebrow", value)}
            validationKey="faq_eyebrow"
            className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]"
          />

          <EditableText
            as="h3"
            value={content.faq_heading}
            isEditing={isHeaderEditing}
            onChange={(value) => onChangeHeader("faq_heading", value)}
            validationKey="faq_heading"
            className="mt-4 text-3xl font-semibold tracking-tight text-[#42454c] sm:text-4xl"
          />

          <EditableText
            value={content.faq_intro}
            isEditing={isHeaderEditing}
            onChange={(value) => onChangeHeader("faq_intro", value)}
            validationKey="faq_intro"
            className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]"
          />
        </div>

        <div className="mt-10 space-y-4">
          {faqItems.map((faq) => {
            const isEditing = editingId === faq.id;

            return (
              <div
                key={faq.id}
                onClick={() => onSelectItem(faq.id)}
                className={`rounded-2xl border bg-white/90 p-6 shadow-[0_16px_40px_rgba(66,69,76,0.06)] transition ${
                  isEditing
                    ? "border-[#4b8e9a] ring-2 ring-[#4b8e9a]/15"
                    : "border-[#d8dfeb] hover:border-[#926ab9]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <EditableText
                    as="h4"
                    value={faq.question}
                    isEditing={isEditing}
                    onChange={(value) => onChangeItem(faq.id, "question", value)}
                    validationKey="faq_question"
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
                  validationKey="faq_answer"
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

          <div className="pt-2">
            <button
              type="button"
              onClick={onAddFaq}
              className="inline-flex items-center gap-2 rounded-full bg-[#926ab9] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#7d58a3]"
            >
              <Plus className="h-4 w-4" />
              Add FAQ
            </button>
          </div>
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
    const nextEnquiry = normaliseEnquiryContent(initialEnquiryContent);
    setEnquiry(nextEnquiry);
    setDraftFaqItems(
      nextEnquiry.faq_items.map((item, index) => ({
        ...item,
        id: `faq-${index}`,
      }))
    );
    setIsFaqVisible(nextEnquiry.show_faq_section);
    setEditingId("");
  }, [initialEnquiryContent]);

  async function persistEnquiryContent(
    nextEnquiry,
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
          enquiry: {
            faq_eyebrow: nextEnquiry.faq_eyebrow,
            faq_heading: nextEnquiry.faq_heading,
            faq_intro: nextEnquiry.faq_intro,
            faq_items: nextEnquiry.faq_items,
            show_faq_section: nextEnquiry.show_faq_section,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save enquiry FAQ content.");
      }

      const savedEnquiry = normaliseEnquiryContent(
        result.content?.enquiry || nextEnquiry
      );

      setEnquiry(savedEnquiry);
      setDraftFaqItems(
        savedEnquiry.faq_items.map((item, index) => ({
          ...item,
          id: `faq-${index}`,
        }))
      );
      setIsFaqVisible(savedEnquiry.show_faq_section);
      if (closeEditor) {
        setEditingId("");
      }
      setStatus({
        type: "success",
        message: successMessage,
      });
      return true;
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Unable to save enquiry FAQ content.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  function updateFaqItem(id, field, value) {
    setDraftFaqItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function updateHeaderField(field, value) {
    setEnquiry((current) => ({
      ...current,
      [field]: value,
    }));
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

  function getFaqValidationErrors(items) {
    return validateCmsFields(
      [
        { field: "faq_eyebrow", value: enquiry.faq_eyebrow, label: "FAQ eyebrow" },
        { field: "faq_heading", value: enquiry.faq_heading, label: "FAQ heading" },
        { field: "faq_intro", value: enquiry.faq_intro, label: "FAQ intro" },
        ...items.flatMap((faq, index) => [
        {
          field: "faq_question",
          value: faq.question,
          label: `FAQ ${index + 1} question`,
        },
        {
          field: "faq_answer",
          value: faq.answer,
          label: `FAQ ${index + 1} answer`,
        },
      ]),
      ]
    );
  }

  async function toggleEditing() {
    if (editingId) {
      const errors = getFaqValidationErrors(draftFaqItems);

      if (errors.length) {
        setStatus({
          type: "error",
          message: buildCmsValidationMessage(errors),
        });
        return;
      }

      const nextEnquiry = {
        ...enquiry,
        faq_eyebrow: enquiry.faq_eyebrow,
        faq_heading: enquiry.faq_heading,
        faq_intro: enquiry.faq_intro,
        faq_items: draftFaqItems.map(({ question, answer }) => ({
          question,
          answer,
        })),
      };

      setEnquiry(nextEnquiry);
      await persistEnquiryContent(
        nextEnquiry,
        "FAQ section saved successfully.",
        { closeEditor: true }
      );
      return;
    }

    if (draftFaqItems.length) {
      setEditingId("faq-header");
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
        title="FAQ Section"
        description=""
        helperText=""
        isEditing={Boolean(editingId)}
        isVisible={isFaqVisible}
        onToggleEditing={toggleEditing}
        stickyHeader
        centerContent={statusBanner}
        onToggleVisible={async () => {
          const sourceItems = editingId
            ? draftFaqItems.map(({ question, answer }) => ({
                question,
                answer,
              }))
            : enquiry.faq_items;
          const errors = getFaqValidationErrors(sourceItems);

          if (errors.length) {
            setStatus({
              type: "error",
              message: buildCmsValidationMessage(errors),
            });
            return;
          }

          const nextVisible = !isFaqVisible;
          const previousEnquiry = enquiry;
          const nextEnquiry = {
            ...enquiry,
            faq_items: sourceItems,
            show_faq_section: nextVisible,
          };

          setIsFaqVisible(nextVisible);
          setEnquiry(nextEnquiry);
          const didSave = await persistEnquiryContent(
            nextEnquiry,
            nextVisible
              ? "FAQ section is now visible on the Enquiry page."
              : "FAQ section is now hidden on the Enquiry page."
          );

          if (!didSave) {
            setIsFaqVisible(!nextVisible);
            setEnquiry(previousEnquiry);
          }
        }}
      >
        <CmsPreviewLayout
          preview={
            <FaqPreview
              content={enquiry}
              faqItems={draftFaqItems}
              editingId={editingId}
              onChangeItem={updateFaqItem}
              onDeleteItem={deleteFaqItem}
              isVisible={isFaqVisible}
              onSelectItem={setEditingId}
              onChangeHeader={updateHeaderField}
              onAddFaq={addFaqItem}
            />
          }
        />
      </CmsEditableSection>
    </div>
  );
}
