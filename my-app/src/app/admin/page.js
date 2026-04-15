import Link from "next/link";
import { redirect } from "next/navigation";
import { auth0, hasAuth0Config } from "@/lib/auth0";
import { isAdminUser } from "@/lib/admin";

export const metadata = {
  title: "Admin Dashboard",
  description: "Protected admin dashboard for Ability to Thrive.",
};

export default async function AdminPage() {
  if (!hasAuth0Config || !auth0) {
    return (
      <section className="min-h-screen bg-[#f8f8f6] px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-10 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
            Admin Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
            Auth0 setup required
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#5d6169]">
            Add your Auth0 environment variables before using the admin
            dashboard.
          </p>
        </div>
      </section>
    );
  }

  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login?returnTo=/admin");
  }

  if (!isAdminUser(session.user)) {
    redirect("/");
  }

  return (
    <section className="min-h-screen bg-[#f8f8f6] px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#d8dfeb] bg-white/90 p-10 shadow-[0_24px_60px_rgba(66,69,76,0.08)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#6d7bbb]">
          Admin Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#42454c]">
          Hello admin
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5d6169]">
          You are signed in as {session.user.name || session.user.email}.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,239,248,0.82))] p-6">
            <h2 className="text-xl font-semibold text-[#42454c]">
              Authenticated Session
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6169]">
              This page is protected by Auth0 server-side session checks. Only
              authenticated admin users can access it.
            </p>
          </div>

          <div className="rounded-3xl border border-[#d8dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(234,243,245,0.82))] p-6">
            <h2 className="text-xl font-semibold text-[#42454c]">Next Step</h2>
            <p className="mt-3 text-sm leading-7 text-[#5d6169]">
              Use this route as the starting point for admin tools, appointment
              views, or enquiry management.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-full border border-[#d8dfeb] px-5 py-3 text-sm font-medium text-[#42454c] transition hover:bg-[#f4f6fa]"
          >
            Back to site
          </Link>
          <a
            href="/auth/logout"
            className="rounded-full bg-[#926ab9] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7d58a3]"
          >
            Log out
          </a>
        </div>
      </div>
    </section>
  );
}
