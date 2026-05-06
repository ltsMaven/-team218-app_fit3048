const CMS_TEXT_RULES = {
  label: { maxWords: 8, maxChars: 50, label: "label" },
  heading: { maxWords: 16, maxChars: 110, label: "heading" },
  title: { maxWords: 12, maxChars: 80, label: "title" },
  subheading: { maxWords: 28, maxChars: 180, label: "subheading" },
  paragraph: { maxWords: 110, maxChars: 800, label: "paragraph" },
  shortParagraph: { maxWords: 60, maxChars: 420, label: "paragraph" },
  tagList: { maxWords: 18, maxChars: 120, label: "tag list" },
  tag: { maxWords: 4, maxChars: 32, label: "tag" },
  feature: { maxWords: 18, maxChars: 140, label: "feature" },
  question: { maxWords: 18, maxChars: 120, label: "question" },
  answer: { maxWords: 90, maxChars: 700, label: "answer" },
  button: { maxWords: 6, maxChars: 40, label: "button label" },
  price: { maxWords: 4, maxChars: 20, label: "price" },
  metric: { maxWords: 3, maxChars: 16, label: "value" },
};

function countWords(value = "") {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function countCharacters(value = "") {
  return String(value).trim().length;
}

function prettifyFieldName(fieldName = "") {
  return String(fieldName)
    .replace(/_/g, " ")
    .replace(/\bfaq\b/gi, "FAQ")
    .replace(/\bcta\b/gi, "CTA")
    .replace(/\bndis\b/gi, "NDIS")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getCmsValidationRule(fieldName = "") {
  if (!fieldName) {
    return null;
  }

  if (fieldName === "price") {
    return CMS_TEXT_RULES.price;
  }

  if (/^stat_[12]_value$/.test(fieldName)) {
    return CMS_TEXT_RULES.metric;
  }

  if (fieldName === "cta_button_label" || fieldName.endsWith("button_label")) {
    return CMS_TEXT_RULES.button;
  }

  if (fieldName === "faq_question" || fieldName.endsWith("_question")) {
    return CMS_TEXT_RULES.question;
  }

  if (fieldName === "faq_answer" || fieldName.endsWith("_answer")) {
    return CMS_TEXT_RULES.answer;
  }

  if (fieldName === "focus_tag") {
    return CMS_TEXT_RULES.tag;
  }

  if (fieldName.endsWith("_tags")) {
    return CMS_TEXT_RULES.tagList;
  }

  if (fieldName === "feature") {
    return CMS_TEXT_RULES.feature;
  }

  if (fieldName.endsWith("_label") || fieldName === "eyebrow" || fieldName === "about_badge") {
    return CMS_TEXT_RULES.label;
  }

  if (fieldName.endsWith("_title")) {
    return CMS_TEXT_RULES.title;
  }

  if (fieldName.includes("heading")) {
    return CMS_TEXT_RULES.heading;
  }

  if (fieldName.includes("subheading")) {
    return CMS_TEXT_RULES.subheading;
  }

  if (
    fieldName.includes("description") ||
    fieldName.includes("intro") ||
    fieldName.includes("body") ||
    fieldName.includes("highlight") ||
    fieldName.includes("closing") ||
    fieldName === "highlights_body" ||
    fieldName === "price_detail"
  ) {
    return fieldName === "price_detail"
      ? CMS_TEXT_RULES.shortParagraph
      : CMS_TEXT_RULES.paragraph;
  }

  return null;
}

export function getCmsValidationFeedback(fieldName = "", value = "") {
  const rule = getCmsValidationRule(fieldName);

  if (!rule) {
    return null;
  }

  const wordCount = countWords(value);
  const charCount = countCharacters(value);
  const wordOverflow = wordCount > rule.maxWords;
  const charOverflow = charCount > rule.maxChars;
  const isInvalid = wordOverflow || charOverflow;

  return {
    rule,
    wordCount,
    charCount,
    isInvalid,
    helperText: isInvalid
      ? `Keep this ${rule.label} under ${rule.maxWords} words and ${rule.maxChars} characters.`
      : `${wordCount}/${rule.maxWords} words, ${charCount}/${rule.maxChars} characters`,
  };
}

export function validateCmsField(fieldName, value, fieldLabel) {
  const feedback = getCmsValidationFeedback(fieldName, value);

  if (!feedback?.isInvalid) {
    return null;
  }

  return {
    field: fieldName,
    label: fieldLabel || prettifyFieldName(fieldName),
    message: `${fieldLabel || prettifyFieldName(fieldName)} is too long. Keep it under ${feedback.rule.maxWords} words and ${feedback.rule.maxChars} characters.`,
  };
}

export function validateCmsFields(fields = []) {
  return fields
    .map(({ field, value, label }) => validateCmsField(field, value, label))
    .filter(Boolean);
}

export function validateServiceItems(items = []) {
  return items.flatMap((item, index) => {
    const baseLabel = item.title?.trim() || `Service ${index + 1}`;

    return [
      validateCmsField("label", item.label, `${baseLabel} label`),
      validateCmsField("title", item.title, `${baseLabel} title`),
      validateCmsField("price", item.price, `${baseLabel} price`),
      validateCmsField(
        "price_detail",
        item.price_detail,
        `${baseLabel} price detail`
      ),
      validateCmsField(
        "description",
        item.description,
        `${baseLabel} description`
      ),
      ...(Array.isArray(item.features)
        ? item.features.map((feature, featureIndex) =>
            validateCmsField(
              "feature",
              feature,
              `${baseLabel} feature ${featureIndex + 1}`
            )
          )
        : []),
    ].filter(Boolean);
  });
}

export function buildCmsValidationMessage(errors = []) {
  if (!errors.length) {
    return "";
  }

  if (errors.length === 1) {
    return errors[0].message;
  }

  return `${errors[0].message} ${errors.length - 1} more field${
    errors.length - 1 === 1 ? " is" : "s are"
  } also over the limit.`;
}
