export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-neutral-950 text-neutral-200">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Fit3048 App</p>
        <p className="text-neutral-400">Built with Next.js App Router</p>
      </div>
    </footer>
  );
}
