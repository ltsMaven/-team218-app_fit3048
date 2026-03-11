export default function Home() {
  return (
    <section
      id="home"
      className="mx-auto flex min-h-[calc(100vh-145px)] w-full max-w-5xl flex-col justify-center gap-8 px-6 py-16"
    >
      <div className="max-w-2xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">
          Next.js structure
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          A cleaner starting point for your app.
        </h1>
        <p className="text-lg leading-8 text-neutral-600">
          Your app is using the App Router correctly. Shared UI like the
          navigation bar and footer belongs in the root layout, while page
          content stays here.
        </p>
      </div>

      <div
        id="about"
        className="grid gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        <article>
          <h2 className="text-xl font-semibold">Current structure</h2>
          <p className="mt-2 text-neutral-600">
            Good for a starter app. As the project grows, add reusable
            components under <code>src/components</code> and keep page-specific
            sections inside each route.
          </p>
        </article>
        <article id="contact">
          <h2 className="text-xl font-semibold">What was added</h2>
          <p className="mt-2 text-neutral-600">
            A shared navbar, a shared footer, and a simple homepage section so
            the layout has visible structure.
          </p>
        </article>
      </div>
    </section>
  );
}
