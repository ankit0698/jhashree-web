export const SURVEY_APPLICATIONS_TABLE = "survey_applications";

export const SURVEY_NICHES = [
  { value: "travel_culture", label: "Travel & Culture" },
  { value: "comedy_entertainment", label: "Comedy / Entertainment" },
  { value: "fashion_beauty", label: "Fashion & Beauty" },
  { value: "food_lifestyle", label: "Food & Lifestyle" },
  { value: "education_tech", label: "Education & Tech" },
  { value: "other", label: "Other (Please specify)" },
] as const;

export const SURVEY_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "other", label: "Other" },
] as const;

export type SurveyNiche = (typeof SURVEY_NICHES)[number]["value"];
export type SurveyPlatform = (typeof SURVEY_PLATFORMS)[number]["value"];
export type SurveyStatus =
  | "submitted"
  | "reviewed"
  | "accepted"
  | "rejected";

export type SurveyApplicationInput = {
  fullName: string;
  contactNumber: string;
  email: string;
  primaryNiche: SurveyNiche;
  primaryNicheOther: string | null;
  primaryPlatform: SurveyPlatform;
  instagramHandle: string | null;
  instagramFollowers: number | null;
  youtubeChannel: string | null;
  youtubeSubscribers: number | null;
  facebookPage: string | null;
  contentUnique: string;
  brandBenefit: string;
  brandIntegrationStyle: string;
  hasSponsoredWork: boolean;
  samplePromoLinks: string | null;
  whyParticipate: string;
};

export type SurveyApplicationRow = {
  full_name: string;
  contact_number: string;
  email: string;
  primary_niche: SurveyNiche;
  primary_niche_other: string | null;
  primary_platform: SurveyPlatform;
  instagram_handle: string | null;
  instagram_followers: number | null;
  youtube_channel: string | null;
  youtube_subscribers: number | null;
  facebook_page: string | null;
  content_unique: string;
  brand_benefit: string;
  brand_integration_style: string;
  has_sponsored_work: boolean;
  sample_promo_links: string | null;
  why_participate: string;
  status: SurveyStatus;
  source: string;
};

export type SurveyApplication = SurveyApplicationInput & {
  id: string;
  status: SurveyStatus;
  source: string;
  createdAt: string | null;
  updatedAt: string | null;
};
