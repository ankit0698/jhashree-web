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

export type FeaturedWorkItem = {
  title: string;
  image: string;
  alt: string;
  blurb: string;
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

export const featuredWork: FeaturedWorkItem[] = [
  {
    title: "Social Media Management Packages",
    image: "/assets/social-media-packages.png",
    alt: "Jhashree Productions social media management packages poster",
    blurb:
      "Layered service plans built for local businesses, growth-stage brands, and premium digital campaigns.",
  },
  {
    title: "Video Production Pricing",
    image: "/assets/video-production-pricing.png",
    alt: "Jhashree Productions video production pricing poster",
    blurb:
      "Clear production options for reels, documentaries, podcasts, camera-based shoots, and drone support.",
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
    href: "https://www.instagram.com/jhashree_/profilecard/?igsh=MXRkZ2xvNjRiOGhiYg%3D%3D",
  },
];
