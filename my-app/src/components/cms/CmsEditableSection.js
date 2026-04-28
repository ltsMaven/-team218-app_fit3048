"use client";

export default function CmsEditableSection({
  title,
  description,
  helperText,
  isEditing,
  isVisible,
  onToggleEditing,
  onToggleVisible,
  children,
}) {
  return (
    <section
      className={`rounded-[2rem] border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,246,250,0.92))] p-6 shadow-sm transition ${
        isVisible ? "" : "opacity-60"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-[#42454c]">{title}</h2>
            {!isVisible ? (
              <span className="rounded-full bg-[#fff1f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#b94a48]">
                Hidden on website
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5d6169]">
              {description}
            </p>
          ) : null}
          <p className="mt-3 text-sm text-[#6d7bbb]">{helperText}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-3 rounded-full border border-[#d8dfeb] bg-white px-4 py-2 text-sm font-medium text-[#42454c]">
            <span>Show section</span>
            <button
              type="button"
              role="switch"
              aria-checked={isVisible}
              onClick={onToggleVisible}
              className={`relative h-7 w-12 rounded-full transition ${
                isVisible ? "bg-[#4b8e9a]" : "bg-[#cfd6e2]"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  isVisible ? "left-6" : "left-1"
                }`}
              />
            </button>
          </label>

          <button
            type="button"
            onClick={onToggleEditing}
            className={`inline-flex rounded-full px-5 py-2.5 text-sm font-medium text-white transition ${
              isEditing
                ? "bg-[#4b8e9a] hover:bg-[#3e7882]"
                : "bg-[#42454c] hover:bg-[#2f3237]"
            }`}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}
