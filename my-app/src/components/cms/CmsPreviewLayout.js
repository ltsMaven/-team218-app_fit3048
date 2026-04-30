"use client";

export default function CmsPreviewLayout({ preview }) {
  return (
    <div className="rounded-[1.8rem] border border-[#d8dfeb] bg-[#f8f8fb] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-[#42454c]">Live Preview</h3>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#6d7bbb]">
          Preview
        </span>
      </div>
      <div className="overflow-hidden rounded-[1.5rem] border border-white/80 bg-white shadow-[0_18px_40px_rgba(66,69,76,0.08)]">
        {preview}
      </div>
    </div>
  );
}
