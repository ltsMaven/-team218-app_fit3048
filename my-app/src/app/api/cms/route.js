import { NextResponse } from "next/server";
import { auth0, hasAuth0Config } from "@/lib/auth0";
import { isAdminUser } from "@/lib/admin";
import { getServerSupabaseClient } from "@/lib/supabase-server";
import {
  ABOUT_CMS_FIELDS,
  ABOUT_CMS_SLUG,
  ABOUT_CMS_TABLE,
  emptyHomepageContent,
  fallbackAboutContent,
  fallbackServiceItems,
  fallbackServicesContent,
  HOMEPAGE_CMS_FIELDS,
  HOMEPAGE_CMS_SLUG,
  HOMEPAGE_CMS_TABLE,
  normaliseAboutContent,
  normaliseHomepageContent,
  normaliseServiceItems,
  normaliseServicesContent,
  SERVICE_ITEMS_TABLE,
  SERVICE_ITEM_FIELDS,
  SERVICES_CMS_FIELDS,
  SERVICES_CMS_SLUG,
  SERVICES_CMS_TABLE,
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

async function fetchHomepageContent(supabase = getServerSupabaseClient()) {
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

async function fetchAboutContent(supabase) {
  const { data, error } = await supabase
    .from(ABOUT_CMS_TABLE)
    .select(["slug", ...ABOUT_CMS_FIELDS].join(", "))
    .eq("slug", ABOUT_CMS_SLUG)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase about lookup failed: ${error.message}`);
  }

  return normaliseAboutContent({
    ...fallbackAboutContent,
    ...data,
  });
}

async function fetchServicesContent(supabase) {
  const { data, error } = await supabase
    .from(SERVICES_CMS_TABLE)
    .select(["slug", ...SERVICES_CMS_FIELDS].join(", "))
    .eq("slug", SERVICES_CMS_SLUG)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase services lookup failed: ${error.message}`);
  }

  return normaliseServicesContent({
    ...fallbackServicesContent,
    ...data,
  });
}

async function fetchServiceItems(supabase) {
  const { data, error } = await supabase
    .from(SERVICE_ITEMS_TABLE)
    .select(["id", "homepage_slug", ...SERVICE_ITEM_FIELDS].join(", "))
    .eq("homepage_slug", SERVICES_CMS_SLUG)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Supabase service item lookup failed: ${error.message}`);
  }

  return normaliseServiceItems(data?.length ? data : fallbackServiceItems);
}

async function fetchAllCmsContent() {
  const supabase = getServerSupabaseClient();
  const [homepage, about, services, serviceItems] = await Promise.all([
    fetchHomepageContent(),
    fetchAboutContent(supabase),
    fetchServicesContent(supabase),
    fetchServiceItems(supabase),
  ]);

  return {
    homepage,
    about,
    services,
    serviceItems,
  };
}

export async function GET() {
  const session = await requireApiAdminSession();

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const content = await fetchAllCmsContent();

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
    const supabase = getServerSupabaseClient();
    const hasHomepageSection =
      "homepage" in body ||
      "homepageContent" in body ||
      HOMEPAGE_CMS_FIELDS.some((field) => field in body);
    const hasAboutSection = "about" in body || "aboutContent" in body;
    const hasServicesSection = "services" in body || "servicesContent" in body;
    const hasServiceItemsSection =
      "serviceItems" in body || "servicesItems" in body;

    const homepage = hasHomepageSection
      ? normaliseHomepageContent(body.homepage || body.homepageContent || body)
      : await fetchHomepageContent(supabase);
    const about = hasAboutSection
      ? normaliseAboutContent({
          ...fallbackAboutContent,
          ...(body.about || body.aboutContent || {}),
        })
      : await fetchAboutContent(supabase);
    const services = hasServicesSection
      ? normaliseServicesContent({
          ...fallbackServicesContent,
          ...(body.services || body.servicesContent || {}),
        })
      : await fetchServicesContent(supabase);
    const serviceItems = hasServiceItemsSection
      ? normaliseServiceItems(
          body.serviceItems || body.servicesItems || fallbackServiceItems
        )
      : await fetchServiceItems(supabase);

    const homepagePayload = {
      slug: HOMEPAGE_CMS_SLUG,
      ...Object.fromEntries(
        HOMEPAGE_CMS_FIELDS.map((field) => [field, homepage[field]])
      ),
      updated_at: new Date().toISOString(),
    };
    const aboutPayload = hasAboutSection
      ? {
          slug: ABOUT_CMS_SLUG,
          ...Object.fromEntries(
            ABOUT_CMS_FIELDS.map((field) => [field, about[field]])
          ),
          updated_at: new Date().toISOString(),
        }
      : null;
    const servicesPayload = hasServicesSection
      ? {
          slug: SERVICES_CMS_SLUG,
          ...Object.fromEntries(
            SERVICES_CMS_FIELDS.map((field) => [field, services[field]])
          ),
          updated_at: new Date().toISOString(),
        }
      : null;

    let homepageData = homepage;
    let aboutData = about;
    let servicesData = services;
    let serviceItemData = serviceItems;

    if (hasHomepageSection) {
      const { data, error } = await supabase
        .from(HOMEPAGE_CMS_TABLE)
        .upsert(homepagePayload, { onConflict: "slug" })
        .select(["slug", ...HOMEPAGE_CMS_FIELDS].join(", "))
        .single();

      if (error) {
        throw new Error(`Supabase homepage save failed: ${error.message}`);
      }

      homepageData = data;
    }

    if (hasAboutSection && aboutPayload) {
      const { data, error } = await supabase
        .from(ABOUT_CMS_TABLE)
        .upsert(aboutPayload, { onConflict: "slug" })
        .select(["slug", ...ABOUT_CMS_FIELDS].join(", "))
        .single();

      if (error) {
        throw new Error(`Supabase about save failed: ${error.message}`);
      }

      aboutData = data;
    }

    if (hasServicesSection && servicesPayload) {
      const { data, error } = await supabase
        .from(SERVICES_CMS_TABLE)
        .upsert(servicesPayload, { onConflict: "slug" })
        .select(["slug", ...SERVICES_CMS_FIELDS].join(", "))
        .single();

      if (error) {
        throw new Error(`Supabase services save failed: ${error.message}`);
      }

      servicesData = data;
    }

    if (hasServiceItemsSection) {
      const serviceItemPayload = serviceItems.map((item, index) => {
        const payload = {
          homepage_slug: SERVICES_CMS_SLUG,
          title: item.title,
          label: item.label,
          price: item.price,
          price_detail: item.price_detail,
          description: item.description,
          features: item.features,
          icon_key: item.icon_key,
          tint: item.tint,
          accent: item.accent,
          sort_order: index,
          is_featured: item.is_featured,
          is_published: item.is_published,
          updated_at: new Date().toISOString(),
        };

        if (item.id) {
          payload.id = item.id;
        }

        return payload;
      });

      const { data, error } = await supabase
        .from(SERVICE_ITEMS_TABLE)
        .upsert(serviceItemPayload, { onConflict: "id" })
        .select(["id", "homepage_slug", ...SERVICE_ITEM_FIELDS].join(", "))
        .order("sort_order", { ascending: true });

      if (error) {
        throw new Error(`Supabase service item save failed: ${error.message}`);
      }

      serviceItemData = data;
    }

    return NextResponse.json(
      {
        success: true,
        content: {
          homepage: normaliseHomepageContent(homepageData),
          about: normaliseAboutContent(aboutData),
          services: normaliseServicesContent(servicesData),
          serviceItems: normaliseServiceItems(serviceItemData),
        },
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
