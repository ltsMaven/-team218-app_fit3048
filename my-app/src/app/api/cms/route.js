import { NextResponse } from "next/server";
import { auth0, hasAuth0Config } from "@/lib/auth0";
import { isAdminUser } from "@/lib/admin";
import { getServerSupabaseClient } from "@/lib/supabase-server";
import {
  emptyHomepageContent,
  HOMEPAGE_CMS_FIELDS,
  HOMEPAGE_CMS_SLUG,
  HOMEPAGE_CMS_TABLE,
  normaliseHomepageContent,
} from "@/lib/cms-homepage";

async function requireApiAdminSession() {
  if (!hasAuth0Config || !auth0) {
    return NextResponse.json(
      { error: "Auth0 is not configured for the admin CMS." },
      { status: 500 }
    );
  }

  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isAdminUser(session.user)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  return session;
}

async function fetchHomepageContent() {
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase
    .from(HOMEPAGE_CMS_TABLE)
    .select(["slug", ...HOMEPAGE_CMS_FIELDS].join(", "))
    .eq("slug", HOMEPAGE_CMS_SLUG)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase lookup failed: ${error.message}`);
  }

  return normaliseHomepageContent({
    ...emptyHomepageContent,
    ...data,
  });
}

export async function GET() {
  const session = await requireApiAdminSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const content = await fetchHomepageContent();

    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to load homepage content." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const session = await requireApiAdminSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = await request.json();
    const content = normaliseHomepageContent(body);
    const supabase = getServerSupabaseClient();
    const payload = {
      slug: HOMEPAGE_CMS_SLUG,
      ...Object.fromEntries(
        HOMEPAGE_CMS_FIELDS.map((field) => [field, content[field]])
      ),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(HOMEPAGE_CMS_TABLE)
      .upsert(payload, { onConflict: "slug" })
      .select(["slug", ...HOMEPAGE_CMS_FIELDS].join(", "))
      .single();

    if (error) {
      throw new Error(`Supabase save failed: ${error.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        content: normaliseHomepageContent(data),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to save homepage content." },
      { status: 500 }
    );
  }
}
