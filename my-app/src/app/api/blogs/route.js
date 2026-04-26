import { NextResponse } from "next/server";
import { auth0, hasAuth0Config } from "@/lib/auth0";
import { isAdminUser } from "@/lib/admin";
import { createBlog, getAdminBlogs } from "@/lib/blogs";

async function requireApiAdminSession() {
  if (!hasAuth0Config || !auth0) {
    return NextResponse.json(
      { error: "Auth0 is not configured for blog management." },
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

export async function GET() {
  const session = await requireApiAdminSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const blogs = await getAdminBlogs();
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to load blogs." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await requireApiAdminSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const payload = await request.json();
    const result = await createBlog(payload);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        blog: result.data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to create blog." },
      { status: 500 }
    );
  }
}
