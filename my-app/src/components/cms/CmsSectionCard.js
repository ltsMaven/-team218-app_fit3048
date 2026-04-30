"use client";

export default function CmsSectionCard({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-[2rem] border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,246,250,0.92))] p-6 shadow-sm sm:p-8">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6d7bbb]">
          {eyebrow}
        </p>
      ) : null}

      <div className={eyebrow ? "mt-3" : ""}>
        <h2 className="text-2xl font-semibold text-[#42454c]">{title}</h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5d6169]">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}
