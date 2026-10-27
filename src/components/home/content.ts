export type NavItem = {
  href: string;
  label: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type ServiceItem = {
  title: string;
  description: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type HighlightItem = {
  title: string;
  description: string;
};

export type BrandCardItem = {
  image: string;
  alt: string;
};

export type SocialLinkItem = {
  href: string;
  label: string;
};

export const navItems: NavItem[] = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#works", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export const stats: StatItem[] = [
  {
    value: "6+",
    label: "Years of Experience",
  },
  {
    value: "120+",
    label: "Projects Completed",
  },
  {
    value: "50+",
    label: "Happy Clients",
  },
];

export const services: ServiceItem[] = [
  {
    title: "Video Production",
    description:
      "From concept to creation, we produce compelling films that tell your story beautifully.",
  },
  {
    title: "Social Media Management",
    description:
      "We design strategies and content that build your brand and engage your audience.",
  },
  {
    title: "Content Creation",
    description:
      "Creative content that connects, inspires, and converts across platforms.",
  },
  {
    title: "Branding",
    description:
      "Building identities that reflect your vision and leave a lasting impression.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Concept Development",
    description:
      "We shape the story first, aligning message, audience, and visual tone before production begins.",
  },
  {
    number: "02",
    title: "Visual Storytelling",
    description:
      "Frames, branding, and motion are built to feel culturally grounded and commercially effective.",
  },
  {
    number: "03",
    title: "Production & Editing",
    description:
      "From shoot day to post-production, we focus on clarity, pace, and content that performs across platforms.",
  },
  {
    number: "04",
    title: "Delivery & Growth",
    description:
      "Final assets arrive ready for campaigns, launches, promotions, and everyday brand building.",
  },
];

export const highlights: HighlightItem[] = [
  {
    title: "Creative Storytelling",
    description:
      "Every frame begins with a clear, human story.",
  },
  {
    title: "Cultural Connection",
    description:
      "Mithila's visual language grounds our perspective.",
  },
  {
    title: "Modern Approach",
    description:
      "Contemporary craft shaped for today's platforms.",
  },
  {
    title: "Result Driven",
    description:
      "Beautiful work designed to create real impact.",
  },
];

export const brandCards: BrandCardItem[] = [
  {
    image: "/assets/camera.jpg",
    alt: "Jhashree expertise card covering branding, media, and marketing",
  },
  {
    image: "/assets/memorable-brand-card.png",
    alt: "Jhashree brand identity card with memorable slogan",
  },
];

export const socialLinks: SocialLinkItem[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/jhashree.vibe.vision/",
  },
];

export type HeroAtmosphereItem = {
  src: string;
  alt: string;
};

/** Home hero fading backgrounds — photographic, Jhashree-relevant. */
export const heroAtmosphereImages: HeroAtmosphereItem[] = [
  {
    src: "/assets/redesign/jhashree-video-production.jpg",
    alt: "Video production crew filming on location",
  },
  {
    src: "/assets/redesign/jhashree-social-content.jpg",
    alt: "Social media content creators filming reels",
  },
  {
    src: "/assets/redesign/jhashree-branding-workspace.jpg",
    alt: "Brand identity and design workspace",
  },
  {
    src: "/assets/redesign/jhashree-editing-suite.jpg",
    alt: "Video editing suite in a creative studio",
  },
  {
    src: "/assets/redesign/jhashree-mithila-story.jpg",
    alt: "Filmmaker capturing Mithila cultural art",
  },
];
