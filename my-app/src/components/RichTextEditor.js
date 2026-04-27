"use client";

import { useEffect, useRef } from "react";

export default function RichTextEditor({
  value,
  onChange,
  label = "Content",
  error = "",
}) {
  const shellRef = useRef(null);
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const latestOnChangeRef = useRef(onChange);
  const latestValueRef = useRef(value);

  useEffect(() => {
    latestOnChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    let isMounted = true;

    async function setupEditor() {
      if (!editorRef.current || quillRef.current) {
        return;
      }

      const Quill = (await import("quill")).default;

      if (!isMounted || !editorRef.current) {
        return;
      }

      const quill = new Quill(editorRef.current, {
        bounds: shellRef.current || undefined,
        theme: "snow",
        placeholder: "Compose an epic...",
        modules: {
          toolbar: {
            container: [
              [{ header: [false, 2, 3] }],
              ["bold", "italic", "underline"],
              ["blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
              ["clean"],
            ],
            handlers: {
              image() {
                const range = this.quill.getSelection(true) || {
                  index: this.quill.getLength(),
                  length: 0,
                };
                const imageUrl = window.prompt("Enter the image URL");

                if (!imageUrl) {
                  return;
                }

                this.quill.insertEmbed(range.index, "image", imageUrl, "user");
                this.quill.setSelection(range.index + 1, 0);
              },
            },
          },
        },
      });

      quill.root.innerHTML = latestValueRef.current || "<p><br></p>";
      quill.on("text-change", () => {
        latestOnChangeRef.current(quill.root.innerHTML);
      });
      quillRef.current = quill;
    }

    setupEditor();

    return () => {
      isMounted = false;
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    const quill = quillRef.current;

    if (!quill) {
      return;
    }

    const nextValue = value || "<p><br></p>";

    if (quill.root.innerHTML !== nextValue) {
      const selection = quill.getSelection();
      quill.root.innerHTML = nextValue;

      if (selection) {
        quill.setSelection(selection.index, selection.length);
      }
    }
  }, [value]);

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-[#42454c]">
        {label}
      </span>

      <div
        ref={shellRef}
        className={`blog-quill-shell rounded-[1.7rem] border bg-white shadow-sm ${
          error ? "border-[#d96c6c]" : "border-[#cfd6e2]"
        }`}
      >
        <div
          className="blog-quill-editor"
          ref={editorRef}
        />
      </div>

      <p className="mt-2 text-sm text-[#6a6e77]">
        This uses Quill&apos;s Snow toolbar and saves HTML content. Images are
        inserted by URL.
      </p>

      {error ? <p className="mt-2 text-sm text-[#b94a48]">{error}</p> : null}
    </div>
  );
}
