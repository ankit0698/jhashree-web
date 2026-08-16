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
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#works", label: "Works" },
  { href: "#contact", label: "Contact" },
];

export const stats: StatItem[] = [
  {
    value: "3+",
    label: "Core production services spanning content, visuals, and events.",
  },
  {
    value: "4",
    label: "Structured process steps from concept through polished delivery.",
  },
  {
    value: "100%",
    label:
      "Brand-first focus with local relevance and platform-ready execution.",
  },
];

export const services: ServiceItem[] = [
  {
    title: "Content Creation",
    description:
      "Scripts, reels, branded storytelling, and local-first campaigns designed to connect with real audiences.",
  },
  {
    title: "Visual Arts Creation",
    description:
      "Creative direction, on-brand graphics, and striking visuals that give every campaign a stronger identity.",
  },
  {
    title: "Event Production",
    description:
      "On-ground coverage, live event execution, and polished edits that turn moments into memorable media.",
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
    title: "Culturally Rooted",
    description:
      "Rooted in Madhubani with a strong local lens instead of generic trend-led branding.",
  },
  {
    title: "Commercially Sharp",
    description:
      "Branding, media, marketing, and promotional video work built to look polished and perform.",
  },
  {
    title: "Flexible Packages",
    description:
      "Social media support for local businesses, creators, and brands ready to scale their presence.",
  },
  {
    title: "Story-First Output",
    description:
      "Short-form reels, ad creatives, and event storytelling centered on clarity and recall.",
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
