const assetPathPrefix = "/assets";

export const brandAssets = {
  primary: `${assetPathPrefix}/bac77.svg`,
  secondary: "/images/stack-k-secondary-transparent.webp",
  secondaryPresentation: "/images/secondary-logo-presentation.webp",
};

export const featuredVisual = {
  src: "/images/immersive-headset-studio.webp",
  alt: "A white virtual-reality headset lit with soft blue, violet, and warm studio light",
  photographer: "Remy Gieling",
  creditUrl: "https://unsplash.com/@gieling",
};

export const palette = [
  { name: "Deep Navy", hex: "#151141", light: false },
  { name: "Deep Violet", hex: "#302978", light: false },
  { name: "Royal Blue", hex: "#3157A8", light: false },
  { name: "Light Lavender", hex: "#E9EAFD", light: true },
  { name: "Muted Slate", hex: "#504D73", light: false },
  { name: "Indigo", hex: "#504E9D", light: false },
  { name: "Soft Violet", hex: "#9E89FA", light: true },
];

export const experiences = [
  {
    id: "skill-pods",
    title: "Skill Pods",
    category: "Personal growth",
    tag: "AI-POWERED LEARNING",
    description: "A learning space that gets you. A path that grows with you.",
    detail:
      "Personalized learning spaces that use AI to help you develop knowledge and skills through customized learning paths.",
    icon: "brain",
    color: "lavender",
    steps: [
      "Choose the skill you want to build.",
      "Explore a learning path shaped around your needs.",
      "Apply what you learn through guided practice.",
    ],
  },
  {
    id: "learning-chambers",
    title: "Learning Chambers",
    category: "Personal growth",
    tag: "IMMERSIVE ENVIRONMENTS",
    description: "Less distraction. Deeper focus. Step into your learning zone.",
    detail:
      "Immersive study environments designed to improve focus, understanding, and the way you experience learning.",
    icon: "box",
    color: "blue",
    steps: [
      "Select your subject and learning goal.",
      "Enter a calm, immersive study environment.",
      "Explore ideas through focused, interactive sessions.",
    ],
  },
  {
    id: "dream-state",
    title: "Dream State",
    category: "Personal growth",
    tag: "REST & REINFORCE",
    description: "Let what you learn stay with you. Even after you switch off.",
    detail:
      "A sleep-assisted learning support concept designed to help reinforce previously learned information and memory. It complements active study; it is not a replacement for learning or a medical treatment.",
    icon: "moon",
    color: "midnight",
    steps: [
      "Review information you have already studied.",
      "Wind down with a gentle reinforcement routine.",
      "Return to the material after rest and reflect.",
    ],
  },
  {
    id: "career-simulator",
    title: "Career Simulator",
    category: "Discovery",
    tag: "TRY YOUR TOMORROW",
    description: "Test-drive a future before you choose your path.",
    detail:
      "Experience different professions through realistic career simulations before choosing a career path.",
    icon: "glasses",
    color: "peach",
    steps: [
      "Explore a profession that interests you.",
      "Step into realistic, day-to-day career scenarios.",
      "Reflect on your interests before choosing your next step.",
    ],
  },
  {
    id: "bloodline-history",
    title: "Bloodline History",
    category: "Discovery",
    tag: "DISCOVER YOUR ROOTS",
    description: "Your story started long before you. Go meet it.",
    detail:
      "Explore your family history, cultural background, and heritage through interactive experiences.",
    icon: "fingerprint",
    color: "mint",
    steps: [
      "Start with a family story or cultural tradition.",
      "Explore the places and context behind your heritage.",
      "Connect what you discover to your own story.",
    ],
  },
  {
    id: "history-time-travel",
    title: "History Time Travel",
    category: "Discovery",
    tag: "THE PAST, PRESENT",
    description: "Don’t just read about history. Find yourself in it.",
    detail:
      "Immersive historical simulations that let you experience and understand important historical events in context.",
    icon: "orbit",
    color: "pink",
    steps: [
      "Choose an event or period to explore.",
      "Enter a historical simulation and discover its context.",
      "Connect perspectives to build a deeper understanding.",
    ],
  },
  {
    id: "skill-swap",
    title: "Skill Swap",
    category: "Community",
    tag: "GROW TOGETHER",
    description: "Something to teach. Something to learn. Someone to meet.",
    detail:
      "A community platform concept where people can teach, learn, and exchange skills with one another.",
    icon: "swap",
    color: "yellow",
    steps: [
      "Discover a skill you would like to learn.",
      "Connect with someone who wants to exchange knowledge.",
      "Learn together and share what you know.",
    ],
  },
] as const;

export type Experience = (typeof experiences)[number];

export const brandCaption =
  "𝖲𝗍𝖾𝗉 𝗂𝗇𝗍𝗈 𝗍𝗁𝖾 𝗅𝖾𝗌𝗌𝗈𝗇 𝗂𝗇𝗌𝗍𝖾𝖺𝖽 𝗈𝖿 𝗋𝖾𝖺𝖽𝗂𝗇𝗀 𝖺𝖻𝗈𝗎𝗍 𝗂𝗍?\n𝗦𝗧𝗔𝗖𝗞-𝗞 𝗋𝖾𝗉𝗅𝖺𝖼𝖾𝗌 𝗉𝖺𝗌𝗌𝗂𝗏𝖾 𝗆𝖾𝗆𝗈𝗋𝗂𝗓𝖺𝗍𝗂𝗈𝗇 𝗐𝗂𝗍𝗁 𝖽𝗂𝗋𝖾𝖼𝗍 𝗂𝗆𝗆𝖾𝗋𝗌𝗂𝗏𝖾 𝖾𝗑𝗉𝖾𝗋𝗂𝖾𝗇𝖼𝖾. 𝖫𝖾𝖺𝗋𝗇 𝖼𝗈𝗆𝗉𝗅𝖾𝗑 𝗌𝗄𝗂𝗅𝗅𝗌 𝗍𝗁𝗋𝗈𝗎𝗀𝗁 𝗌𝗂𝗆𝗎𝗅𝖺𝗍𝗂𝗈𝗇𝗌, 𝖼𝗎𝗍 𝗒𝗈𝗎𝗋 𝗅𝖾𝖺𝗋𝗇𝗂𝗇𝗀 𝖼𝗎𝗋𝗏𝖾, 𝗋𝖾𝖼𝗅𝖺𝗂𝗆 𝗒𝗈𝗎𝗋 𝗍𝗂𝗆𝖾.";

// The displayed reading view uses the same words; copying always preserves the supplied styling.
export const brandCaptionText = brandCaption.normalize("NFKC");

export const team = [
  {
    name: "Sasaki, Tatsuya P.",
    surname: "Sasaki",
    image: "/images/tatsuya-sasaki.webp",
    initials: "TS",
    role: "",
    biography: "",
  },
  {
    name: "Leodones, Charles Benedict A.",
    surname: "Leodones",
    image: "/images/charles-leodones.webp",
    initials: "CL",
    role: "",
    biography: "",
  },
  {
    name: "Gallardo, Justine Dave R.",
    surname: "Gallardo",
    image: "/images/justine-gallardo.webp",
    initials: "JG",
    role: "",
    biography: "",
  },
  {
    name: "Lacanilao, Chris Karl M.",
    surname: "Lacanilao",
    image: "/images/chris-lacanilao.webp",
    initials: "CK",
    role: "",
    biography: "",
  },
];

// Leave unprovided personal details empty. Add real details here when ready.
export const contact = {
  email: "",
  socialLinks: [] as { label: string; url: string }[],
};

// Set a real local video path here to replace the clearly labelled animation prototype.
export const logoProcessVideo = "";

export const company = {
  introduction:
    "Learning goes beyond memorization. Experience knowledge through immersive technology.",
  description:
    "STACK-K is an educational technology concept combining AI, virtual reality, and interactive learning. A different way to gain knowledge, build skills, and reclaim your time.",
  history: [
    "STACK-K, which stands for Stack Knowledge, was developed from the idea that traditional learning takes considerable time before people can apply what they have learned.",
    "The company aims to change this through immersive technologies such as Artificial Intelligence, Virtual Reality, and interactive learning experiences.",
    "Its goal is to transform learning from memorization into direct experiences, allowing people to gain knowledge, develop skills, and save time.",
  ],
  mission:
    "To make knowledge more accessible through immersive technologies that help people learn faster and contribute sooner.",
  vision:
    "To create a future where people can experience and embody knowledge without being limited by time.",
};

export const projects = [
  {
    id: "identity",
    number: "01",
    title: "STACK-K Brand Identity",
    category: "STRATEGY / VISUAL IDENTITY",
    description:
      "A connected identity for a new perspective on learning. One symbol, seven colors, and a world of possibility.",
    year: "2026",
  },
  {
    id: "logo",
    number: "02",
    title: "Logo Design",
    category: "EXPLORATION / LOGO DESIGN",
    description:
      "From a pencil sketch to a distinct digital symbol. The thinking and craft behind the STACK-K mark.",
    year: "2026",
  },
  {
    id: "products",
    number: "03",
    title: "STACK-K Product Experiences",
    category: "PRODUCT CONCEPTS / IMMERSIVE LEARNING",
    description:
      "Seven ways to move from knowing to doing. A collection of AI, VR, and community-led learning concepts.",
    year: "2026",
  },
  {
    id: "post",
    number: "04",
    title: "Brand Poster",
    category: "ART DIRECTION / BRAND COMMUNICATION",
    description:
      "Our first statement to the world: stack knowledge, save time. A bold introduction to immersive learning.",
    year: "2026",
  },
  {
    id: "event",
    number: "05",
    title: "Promotional Event Poster",
    category: "CAMPAIGN / POSTER DESIGN",
    description:
      "A brighter path from learning to creating. Turning continuous curiosity into a visual invitation.",
    year: "2026",
  },
] as const;

export type Project = (typeof projects)[number];
export type ProjectId = Project["id"];

export const photoCredits = [
  {
    product: "Skill Pods",
    author: "Christian Velitchkov",
    url: "https://unsplash.com/@cvelitchkov",
  },
  { product: "Learning Chambers", author: "Fer Troulik", url: "https://unsplash.com/@fertroulik" },
  { product: "Dream State", author: "Jp Valery", url: "https://unsplash.com/@jpvalery" },
  { product: "Career Simulator", author: "XR Expo", url: "https://unsplash.com/@xrexpo" },
  {
    product: "Bloodline History",
    author: "Laura Fuhrman",
    url: "https://unsplash.com/@lauracathleen",
  },
  {
    product: "History Time Travel",
    author: "Spenser Sembrat",
    url: "https://unsplash.com/@spensersembrat",
  },
  { product: "Skill Swap", author: "Emily Webster", url: "https://unsplash.com/@emily_webster" },
];
