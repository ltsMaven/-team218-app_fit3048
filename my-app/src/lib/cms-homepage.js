export const HOMEPAGE_CMS_TABLE = "cms_homepage";
export const HOMEPAGE_CMS_SLUG = "main";

export const HOMEPAGE_CMS_FIELDS = [
  "about_image_url",
  "about_badge",
  "about_heading",
  "about_intro",
  "about_highlight",
  "about_closing",
  "services_label",
  "services_heading",
  "services_subheading",
  "services_support_body",
  "service_1_title",
  "service_1_description",
  "service_1_tags",
  "service_2_title",
  "service_2_description",
  "service_2_tags",
  "service_3_title",
  "service_3_description",
  "service_3_tags",
  "services_card_1_title",
  "services_card_1_body",
  "services_card_2_title",
  "services_card_2_body",
  "about_section_label",
  "about_section_heading_line_1",
  "about_section_heading_line_2",
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
  about_image_url: "",
  about_badge: "",
  about_heading: "",
  about_intro: "",
  about_highlight: "",
  about_closing: "",
  services_label: "",
  services_heading: "",
  services_subheading: "",
  services_support_body: "",
  service_1_title: "",
  service_1_description: "",
  service_1_tags: "",
  service_2_title: "",
  service_2_description: "",
  service_2_tags: "",
  service_3_title: "",
  service_3_description: "",
  service_3_tags: "",
  services_card_1_title: "",
  services_card_1_body: "",
  services_card_2_title: "",
  services_card_2_body: "",
  about_section_label: "",
  about_section_heading_line_1: "",
  about_section_heading_line_2: "",
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

export const fallbackHomepageContent = {
  slug: HOMEPAGE_CMS_SLUG,
  about_image_url: "/assets/attLogoNB.png",
  about_badge: "ABOUT MY PRACTICE",
  about_heading: "Empowering Clients to Thrive",
  about_intro:
    "As an NDIS registered Counsellor, Psychosocial Recovery Coach and Clinical Supervisor, I offer a compassionate and empathic approach to help clients navigate life's challenges.",
  about_highlight:
    "Through a safe and non-judgmental space, I work collaboratively to empower people to achieve their goals and improve their mental, emotional, physical, and social well-being in line with their personal goals and values.",
  about_closing: 'I believe we all have within us the "Ability to Thrive."',
  services_label: "Services",
  services_heading: "How I Can Support You",
  services_subheading:
    "A summary of the support available through Ability to Thrive.",
  services_support_body:
    "Support is tailored to your needs, goals, and circumstances, with options for personal counselling, recovery-focused support, and professional supervision.",
  service_1_title: "Counselling & Personal Support",
  service_1_description:
    "One-on-one and relationship counselling for stress, trauma, substance misuse, domestic and family violence, emotional challenges, and personal growth.",
  service_1_tags: "Individual, Couples, Trauma",
  service_2_title: "Recovery Coaching & NDIS Support",
  service_2_description:
    "Person-centred support for NDIS participants, people with disabilities, families, and carers, with a focus on recovery, confidence, independence, and everyday wellbeing.",
  service_2_tags: "NDIS, Recovery, Disability Support",
  service_3_title: "Clinical Supervision",
  service_3_description:
    "Reflective supervision for professionals, supporting confidence, ethical practice, professional development, boundaries, and work-related challenges.",
  service_3_tags: "Supervision, Practice, Development",
  services_card_1_title: "NDIS Registered Provider",
  services_card_1_body:
    "Ability to Thrive provides person-centred support for NDIS participants, families, and carers in a safe, respectful, and non-judgemental environment.",
  services_card_2_title: "Appointments & Access",
  services_card_2_body:
    "Appointments are available via telehealth. Face-to-face support may be considered depending on location, needs, and availability.",
  about_section_label: "Goals, Values, Vision",
  about_section_heading_line_1: "About",
  about_section_heading_line_2: "Ability to Thrive",
  goals_label: "Goals",
  goals_heading: "Your Journey to Freedom Starts Here.",
  goals_body:
    "At Ability To Thrive Counselling and Recovery Coaching, we provide safe, respectful, and supportive care that helps people feel heard, valued, and empowered. Guided by kindness, encouragement, optimism, patience, and inclusion, we support each person to build confidence, strengthen skills, and move toward a life where they can truly thrive.",
  vision_label: "Vision",
  vision_heading: "From Overwhelmed to Empowered.",
  vision_body:
    "Our vision is a world where every person feels supported, empowered, and able to reach their full potential. We believe support should be compassionate, accessible, and meaningful helping people build confidence, resilience, and truly thrive.",
  values_label: "Values",
  values_heading: "Optimism That Inspires Change.",
  values_body:
    "At Ability To Thrive Counselling and Recovery Coaching, everything we do is guided by five core values: Kindness, Encouragement, Optimism, Patience, and Inclusion. These values shape a safe, welcoming, and supportive space where every person feels heard, respected, and empowered to grow at their own pace.",
  testimonials_heading: "What Clients Say",
  cta_heading: "Ready to Take the First Step?",
  cta_body:
    "Schedule your consultation today and begin your journey toward healing and growth.",
  cta_button_label: "Book Your Session Now",
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
  "hero_image_url",
  "hero_heading",
  "hero_subheading",
  "philosophy_image_url",
  "philosophy_heading",
  "philosophy_body_1",
  "philosophy_body_2",
  "background_image_url",
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
  hero_image_url: "/assets/about/about-hero.jpeg",
  hero_heading: "From Struggle to Success",
  hero_subheading: '"Optimism That Inspires Change."',
  philosophy_image_url: "/assets/about/about-philosophy.png",
  philosophy_heading: "My Philosophy",
  philosophy_body_1:
    "I believe that everyone has the potential to live a fulfilling and meaningful life. My mission is to empower you to live authentically, aligned with your values. By identifying and working towards your goals, we unlock your full potential using a holistic approach to counselling and stress management.",
  philosophy_body_2:
    "I provide a safe, non-judgmental space where you can explore challenges through substance abuse counselling, relationship support, and dedicated LGBTQIA+ advocacy.",
  background_image_url: "/assets/about/about-background.png",
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

export const ENQUIRY_CMS_TABLE = "cms_enquiry_page";
export const ENQUIRY_CMS_SLUG = "main";
export const ENQUIRY_CMS_FIELDS = ["faq_items"];

export const fallbackEnquiryContent = {
  slug: ENQUIRY_CMS_SLUG,
  faq_items: [
    {
      question: "What happens after I submit an enquiry?",
      answer:
        "After you submit the form, we will review your message and respond with the most appropriate next step based on your situation.",
    },
    {
      question: "Do I need to know which service I need before contacting you?",
      answer:
        "No. You can briefly explain what support you are looking for, and we can help guide you toward counselling, coaching, supervision, or NDIS-related support.",
    },
    {
      question: "Is my enquiry confidential?",
      answer:
        "Your enquiry will be treated with care and respect. Please avoid including highly sensitive or urgent information in the form.",
    },
    {
      question: "Can I ask about NDIS support through this form?",
      answer:
        "Yes. You can use the enquiry form to ask about NDIS-related counselling, recovery coaching, or support options.",
    },
  ],
};

export function normaliseEnquiryContent(input = {}) {
  const faqSource = Array.isArray(input.faq_items)
    ? input.faq_items
    : fallbackEnquiryContent.faq_items;

  return {
    slug:
      typeof input.slug === "string" && input.slug.trim()
        ? input.slug.trim()
        : ENQUIRY_CMS_SLUG,
    faq_items: faqSource
      .map((item) => ({
        question:
          typeof item?.question === "string" ? item.question.trim() : "",
        answer: typeof item?.answer === "string" ? item.answer.trim() : "",
      }))
      .filter((item) => item.question && item.answer),
  };
}

export const BLOGS_CMS_TABLE = "cms_blogs_page";
export const BLOGS_CMS_SLUG = "main";
export const BLOGS_CMS_FIELDS = [
  "eyebrow",
  "heading",
  "intro_body_1",
  "intro_body_2",
  "highlights_label",
  "highlights_body",
];

export const fallbackBlogsContent = {
  slug: BLOGS_CMS_SLUG,
  eyebrow: "Blogs",
  heading: "Articles, reflections, and practical support",
  intro_body_1:
    "This space is dedicated to sharing insights, strategies, and stories that inspire growth and resilience. Here, you'll find practical guidance on overcoming addictions, navigating life with disabilities, and fostering personal development.",
  intro_body_2:
    "The goal is to offer a supportive, judgment-free place where you can learn, reflect, and take steady steps toward a healthier and more empowered life, whether you're seeking tools for change, understanding for a loved one, or encouragement for your own journey.",
  highlights_label: "What You'll Find",
  highlights_body:
    "A thoughtful mix of reflections and practical reading designed to feel supportive, clear, and easy to return to.",
};

export function normaliseBlogsContent(input = {}) {
  return {
    slug:
      typeof input.slug === "string" && input.slug.trim()
        ? input.slug.trim()
        : BLOGS_CMS_SLUG,
    ...Object.fromEntries(
      BLOGS_CMS_FIELDS.map((field) => [
        field,
        typeof input[field] === "string" ? input[field] : "",
      ])
    ),
  };
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
  "image_url",
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
    image_url: "",
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
    image_url: "",
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
    image_url: "",
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
    image_url: "",
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
    image_url: "",
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
    image_url: typeof input.image_url === "string" ? input.image_url : "",
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
