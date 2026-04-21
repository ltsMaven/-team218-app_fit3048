export const HOMEPAGE_CMS_TABLE = "cms_homepage";
export const HOMEPAGE_CMS_SLUG = "main";

export const HOMEPAGE_CMS_FIELDS = [
  "about_badge",
  "about_heading",
  "about_intro",
  "about_highlight",
  "about_closing",
  "services_heading",
  "services_subheading",
  "goals_label",
  "goals_heading",
  "goals_body",
  "vision_label",
  "vision_heading",
  "vision_body",
  "values_label",
  "values_heading",
  "values_body",
  "testimonials_heading",
  "cta_heading",
  "cta_body",
  "cta_button_label",
];

export const emptyHomepageContent = {
  slug: HOMEPAGE_CMS_SLUG,
  about_badge: "",
  about_heading: "",
  about_intro: "",
  about_highlight: "",
  about_closing: "",
  services_heading: "",
  services_subheading: "",
  goals_label: "",
  goals_heading: "",
  goals_body: "",
  vision_label: "",
  vision_heading: "",
  vision_body: "",
  values_label: "",
  values_heading: "",
  values_body: "",
  testimonials_heading: "",
  cta_heading: "",
  cta_body: "",
  cta_button_label: "",
};

export function normaliseHomepageContent(input = {}) {
  return {
    slug:
      typeof input.slug === "string" && input.slug.trim()
        ? input.slug.trim()
        : HOMEPAGE_CMS_SLUG,
    ...Object.fromEntries(
      HOMEPAGE_CMS_FIELDS.map((field) => [
        field,
        typeof input[field] === "string" ? input[field] : "",
      ])
    ),
  };
}
