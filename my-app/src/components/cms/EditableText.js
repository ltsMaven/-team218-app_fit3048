"use client";

import { useEffect, useRef } from "react";

export default function EditableText({
  as: Tag = "p",
  value = "",
  isEditing,
  onChange,
  className = "",
}) {
  const elementRef = useRef(null);

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
    <Tag
      ref={elementRef}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onInput={(event) => onChange(event.currentTarget.textContent || "")}
      className={`${className} ${
        isEditing
          ? "rounded-xl border border-dashed border-[#926ab9]/45 bg-[#faf7fd] px-3 py-2 outline-none focus:border-[#926ab9] focus:bg-white"
          : ""
      }`}
    />
  );
}
