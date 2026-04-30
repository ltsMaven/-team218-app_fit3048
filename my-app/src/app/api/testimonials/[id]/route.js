import { NextResponse } from "next/server";
import { auth0, hasAuth0Config } from "@/lib/auth0";
import { isAdminUser } from "@/lib/admin";
import {
  deleteTestimonialSubmission,
  updateTestimonialStatus,
} from "@/lib/testimonial-submissions";

async function requireApiAdminSession() {
  if (!hasAuth0Config || !auth0) {
    return NextResponse.json(
      { error: "Auth0 is not configured for testimonial management." },
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

export async function PATCH(request, { params }) {
  const session = await requireApiAdminSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateTestimonialStatus(id, body.status);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        testimonial: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to update testimonial." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const session = await requireApiAdminSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id } = await params;
    const result = await deleteTestimonialSubmission(id);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        testimonial: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to delete testimonial." },
      { status: 500 }
    );
  }
}
