export const SAMA_CREATOR_APPLICATIONS_TABLE = "sama_creator_applications";

export type SamaApplicationStatus =
  | "submitted"
  | "reviewed"
  | "shortlisted"
  | "rejected";

export type SamaCreatorApplicationInput = {
  fullName: string;
  contactNumber: string;
  email: string;
  address: string;
  contentType: string;
  instagramUsername: string;
  instagramFollowers: number;
  facebookLink: string;
  facebookFollowers: number;
  youtubeLink: string | null;
  youtubeSubscribers: number | null;
  wantsToPromoteCulture: boolean;
  promoteCultureHow: string | null;
  promoteCultureWhy: string | null;
  knowsSamaChakewa: boolean;
  wantsToJoinEvent: boolean;
  interestedInCampaign: boolean;
};

export type SamaCreatorApplicationRow = {
  full_name: string;
  contact_number: string;
  email: string;
  address: string;
  content_type: string;
  instagram_username: string;
  instagram_followers: number;
  facebook_link: string;
  facebook_followers: number;
  youtube_link: string | null;
  youtube_subscribers: number | null;
  wants_to_promote_culture: boolean;
  promote_culture_how: string | null;
  promote_culture_why: string | null;
  knows_sama_chakewa: boolean;
  wants_to_join_event: boolean;
  interested_in_campaign: boolean;
  status: SamaApplicationStatus;
  source: string;
};

export type SamaCreatorApplication = SamaCreatorApplicationInput & {
  id: string;
  status: SamaApplicationStatus;
  source: string;
  createdAt: string | null;
  updatedAt: string | null;
};
