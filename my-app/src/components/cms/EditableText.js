"use client";

import { Fragment, useEffect, useRef } from "react";
import { getCmsValidationFeedback } from "@/lib/cms-validation";

export default function EditableText({
  as: Tag = "p",
  value = "",
  isEditing,
  onChange,
  validationKey = "",
  className = "",
  editingClassName = "",
  editingStyle,
}) {
  const elementRef = useRef(null);
  const validation = validationKey
    ? getCmsValidationFeedback(validationKey, value)
    : null;
  const hasValidationError = Boolean(validation?.isInvalid);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const nextValue = value ?? "";
    const isFocused = document.activeElement === element;

    if (element.textContent !== nextValue && (!isEditing || !isFocused)) {
      element.textContent = nextValue;
    }
  }, [isEditing, value]);

  return (
    <Fragment>
      <Tag
        ref={elementRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        aria-invalid={hasValidationError}
        title={isEditing && validation ? validation.helperText : undefined}
        onInput={(event) => onChange(event.currentTarget.textContent || "")}
        style={isEditing ? editingStyle : undefined}
        className={`${className} ${
          isEditing
            ? `rounded-xl border border-dashed px-3 py-2 outline-none focus:bg-white ${
                hasValidationError
                  ? "border-[#b94a48] bg-[#fff6f5] focus:border-[#b94a48]"
                  : "border-[#926ab9]/45 bg-[#faf7fd] focus:border-[#926ab9]"
              } ${editingClassName}`
            : ""
        }`}
      />
      {isEditing && validation ? (
        <p
          className={`mt-2 text-xs leading-5 ${
            hasValidationError ? "text-[#b94a48]" : "text-[#6d7280]"
          }`}
        >
          {validation.helperText}
        </p>
      ) : null}
    </Fragment>
  );
}
