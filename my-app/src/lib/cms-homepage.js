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

export const ABOUT_CMS_TABLE = "cms_about_page";
export const ABOUT_CMS_SLUG = "main";

export const ABOUT_CMS_FIELDS = [
  "hero_heading",
  "hero_subheading",
  "philosophy_heading",
  "philosophy_body_1",
  "philosophy_body_2",
  "background_heading",
  "background_body",
  "focus_label",
  "focus_tags",
  "story_heading",
  "story_subheading",
  "story_body_1",
  "story_body_2",
  "stat_1_value",
  "stat_1_label",
  "stat_1_body",
  "stat_2_value",
  "stat_2_label",
  "stat_2_body",
  "stat_3_label",
  "stat_3_body",
  "stat_3_button_label",
];

export const fallbackAboutContent = {
  slug: ABOUT_CMS_SLUG,
  hero_heading: "From Struggle to Success",
  hero_subheading: '"Optimism That Inspires Change."',
  philosophy_heading: "My Philosophy",
  philosophy_body_1:
    "I believe that everyone has the potential to live a fulfilling and meaningful life. My mission is to empower you to live authentically, aligned with your values. By identifying and working towards your goals, we unlock your full potential using a holistic approach to counselling and stress management.",
  philosophy_body_2:
    "I provide a safe, non-judgmental space where you can explore challenges through substance abuse counselling, relationship support, and dedicated LGBTQIA+ advocacy.",
  background_heading: "Professional Background",
  background_body:
    "I have over 15 years of experience as a counsellor and life coach. My expertise spans substance abuse, trauma, and relationship counselling, as well as navigating criminal and legal challenges. I am deeply committed to supporting people with disabilities, their carers, and members of the LGBTQIA+ community to improve overall well-being.",
  focus_label: "Core Focus Areas",
  focus_tags: [
    "Substance Abuse",
    "LGBTQIA+ Support",
    "Trauma",
    "Relationships",
    "NDIS / Disabilities",
    "Legal & Criminal Challenges",
  ],
  story_heading: "Survivor - Now Living my Best Life",
  story_subheading:
    "Child Abuse, Domestic and Family Violence, Substance Misuse",
  story_body_1:
    '"Guided by Kindness, Driven by Hope." I have lived experience in all of these areas and more. I do not believe in regret; without the challenges of my past, I would not be where I am today.',
  story_body_2:
    'For the past 2 years in private practice, I have had the privilege to journey alongside individuals overcoming challenges that held them back. I know through my own journey that with the right support, we all have the "Ability To Thrive."',
  stat_1_value: "13yrs",
  stat_1_label: "Residential Rehab",
  stat_1_body:
    "Wealth of skills working with substance misuse, coexisting mental health diagnoses, and related traumas.",
  stat_2_value: "2yrs",
  stat_2_label: "NDIS & Advocacy",
  stat_2_body:
    "Supporting people with disabilities and families, addressing carer burnout and unique systemic challenges.",
  stat_3_label: "Wrap-Around Support",
  stat_3_body:
    "A holistic approach to free yourself from the challenges that keep you stuck. Reach out today.",
  stat_3_button_label: "Book a session",
};

export function normaliseAboutContent(input = {}) {
  const content = {
    slug:
      typeof input.slug === "string" && input.slug.trim()
        ? input.slug.trim()
        : ABOUT_CMS_SLUG,
  };

  for (const field of ABOUT_CMS_FIELDS) {
    if (field === "focus_tags") {
      content[field] = Array.isArray(input[field])
        ? input[field].filter((item) => typeof item === "string" && item.trim())
        : fallbackAboutContent.focus_tags;
    } else {
      content[field] = typeof input[field] === "string" ? input[field] : "";
    }
  }

  return content;
}

export const SERVICES_CMS_TABLE = "cms_services_page";
export const SERVICE_ITEMS_TABLE = "cms_service_items";
export const SERVICES_CMS_SLUG = "main";

export const SERVICES_CMS_FIELDS = [
  "heading",
  "intro",
  "cta_button_label",
];

export const SERVICE_ITEM_FIELDS = [
  "title",
  "label",
  "price",
  "price_detail",
  "description",
  "features",
  "icon_key",
  "tint",
  "accent",
  "sort_order",
  "is_featured",
  "is_published",
];

export const fallbackServicesContent = {
  slug: SERVICES_CMS_SLUG,
  heading: "Services",
  intro:
    "Support options tailored to where you are now, with session pricing and a direct path to book.",
  cta_button_label: "Book a Session",
};

export const fallbackServiceItems = [
  {
    title: "Individual Counselling",
    label: "Personal Support",
    price: "$85",
    price_detail: "per 60 min session",
    description:
      "A safe, compassionate, and confidential space to explore personal challenges, build emotional resilience, and work towards meaningful change. Support is tailored to your needs, whether you are navigating stress, trauma, grief, or other life difficulties.",
    icon_key: "heart",
    tint: "bg-[#eaf3f5]",
    accent: "text-[#4b8e9a]",
    features: [
      "One-on-one support tailored to your needs",
      "A safe space to explore emotions and challenges",
      "Support for trauma, grief, stress, and life changes",
    ],
    sort_order: 0,
    is_featured: false,
    is_published: true,
  },
  {
    title: "Couples Counselling",
    label: "Relationship Support",
    price: "$150",
    price_detail: "per 60 min session",
    description:
      "A supportive space for couples to strengthen communication, work through conflict, and rebuild connection. Sessions focus on helping both individuals feel heard, understood, and better equipped to move forward together in a healthier way.",
    icon_key: "users",
    tint: "bg-[#f4eff8]",
    accent: "text-[#926ab9]",
    features: [
      "Improve communication and understanding",
      "Work through conflict in a respectful space",
      "Rebuild trust and strengthen connection",
    ],
    sort_order: 1,
    is_featured: true,
    is_published: true,
  },
  {
    title: "Free Discovery Call",
    label: "Initial Conversation",
    price: "Free",
    price_detail: "15 min call",
    description:
      "A short, no-cost conversation to talk through what support you are looking for, ask questions, and see whether Ability to Thrive is the right fit for your needs before booking a full session.",
    icon_key: "hand-heart",
    tint: "bg-[#edf0f7]",
    accent: "text-[#6d7bbb]",
    features: [
      "Discuss your goals and current support needs",
      "Ask questions about services and next steps",
      "Decide whether a full session feels right for you",
    ],
    sort_order: 2,
    is_featured: false,
    is_published: true,
  },
  {
    title: "Clinical Supervision",
    label: "Professional Support",
    price: "$82.50",
    price_detail: "per 60 min session",
    description:
      "Clinical supervision in a safe, supportive, and collaborative space that encourages reflection, professional growth, and stronger clinical practice. Designed to help practitioners explore their work, build confidence, gain new perspectives, and develop ethical and effective practice.",
    icon_key: "heart-handshake",
    tint: "bg-[#dce9f8]",
    accent: "text-[#4b8e9a]",
    features: [
      "Reflect on client work and clinical decision-making",
      "Enhance your skills and therapeutic approach",
      "Navigate ethical dilemmas and professional boundaries",
      "Manage workplace stress and reduce burnout",
      "Build confidence and maintain professional wellbeing",
    ],
    sort_order: 3,
    is_featured: true,
    is_published: true,
  },
  {
    title: "Psychosocial Recovery Coaching",
    label: "Recovery Support",
    price: "$99",
    price_detail: "per 60 min session",
    description:
      "Compassionate, person-centred support to help build confidence, strengthen daily living skills, and work towards personal recovery goals. Focused on improving wellbeing, increasing independence, and reconnecting with community in a safe, respectful, and empowering way.",
    icon_key: "briefcase",
    tint: "bg-[#f5efe6]",
    accent: "text-[#8b6c4f]",
    features: [
      "Goal setting and recovery planning",
      "Building capacity for daily living and independence",
      "Strengthening social and community connections",
      "Coordinating and working collaboratively with your support network",
      "Developing strategies to manage challenges and maintain wellbeing",
    ],
    sort_order: 4,
    is_featured: false,
    is_published: true,
  },
];

export function normaliseServicesContent(input = {}) {
  return {
    slug:
      typeof input.slug === "string" && input.slug.trim()
        ? input.slug.trim()
        : SERVICES_CMS_SLUG,
    ...Object.fromEntries(
      SERVICES_CMS_FIELDS.map((field) => [
        field,
        typeof input[field] === "string" ? input[field] : "",
      ])
    ),
  };
}

export function normaliseServiceItem(input = {}, index = 0) {
  const features = Array.isArray(input.features)
    ? input.features.filter((item) => typeof item === "string" && item.trim())
    : [];

  return {
    id: typeof input.id === "string" && input.id ? input.id : undefined,
    homepage_slug:
      typeof input.homepage_slug === "string" && input.homepage_slug.trim()
        ? input.homepage_slug.trim()
        : SERVICES_CMS_SLUG,
    title: typeof input.title === "string" ? input.title : "",
    label: typeof input.label === "string" ? input.label : "",
    price: typeof input.price === "string" ? input.price : "",
    price_detail:
      typeof input.price_detail === "string" ? input.price_detail : "",
    description:
      typeof input.description === "string" ? input.description : "",
    features,
    icon_key: typeof input.icon_key === "string" ? input.icon_key : "heart",
    tint: typeof input.tint === "string" ? input.tint : "bg-[#eaf3f5]",
    accent: typeof input.accent === "string" ? input.accent : "text-[#4b8e9a]",
    sort_order:
      Number.isInteger(input.sort_order) && input.sort_order >= 0
        ? input.sort_order
        : index,
    is_featured: Boolean(input.is_featured),
    is_published: input.is_published !== false,
  };
}

export function normaliseServiceItems(items = fallbackServiceItems) {
  const source = Array.isArray(items) && items.length ? items : fallbackServiceItems;

  return source.map((item, index) => normaliseServiceItem(item, index));
}
