import { NextResponse } from "next/server";
import { auth0, hasAuth0Config } from "@/lib/auth0";
import { isAdminUser } from "@/lib/admin";
import { uploadCmsImage } from "@/lib/cms-images";

async function requireApiAdminSession() {
  if (!hasAuth0Config || !auth0) {
    return NextResponse.json(
      { error: "Auth0 is not configured for CMS image uploads." },
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

export async function POST(request) {
  const session = await requireApiAdminSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "general");
    const uploadedImage = await uploadCmsImage(file, folder);

    return NextResponse.json(
      {
        success: true,
        imageUrl: uploadedImage.publicUrl,
        path: uploadedImage.path,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unable to upload CMS image." },
      { status: 400 }
    );
  }
}
