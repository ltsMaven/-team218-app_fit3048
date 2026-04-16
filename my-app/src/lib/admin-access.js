import { redirect } from "next/navigation";
import { auth0, hasAuth0Config } from "@/lib/auth0";
import { isAdminUser } from "@/lib/admin";

export async function requireAdminSession(returnTo = "/admin") {
  if (!hasAuth0Config || !auth0) {
    return null;
  }

  const session = await auth0.getSession();

  if (!session) {
    redirect(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  if (!isAdminUser(session.user)) {
    redirect("/");
  }

  return session;
}
