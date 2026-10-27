import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type {
  SurveyApplication,
  SurveyApplicationInput,
  SurveyApplicationRow,
  SurveyNiche,
  SurveyPlatform,
  SurveyStatus,
} from "@/types/survey";
import { SURVEY_APPLICATIONS_TABLE } from "@/types/survey";

type SurveyApplicationDbRow = SurveyApplicationRow & {
  id: string;
  created_at: string | null;
  updated_at: string | null;
};

function toSurveyApplicationRow(
  input: SurveyApplicationInput,
): SurveyApplicationRow {
  return {
    full_name: input.fullName,
    contact_number: input.contactNumber,
    email: input.email,
    primary_niche: input.primaryNiche,
    primary_niche_other: input.primaryNicheOther,
    primary_platform: input.primaryPlatform,
    instagram_handle: input.instagramHandle,
    instagram_followers: input.instagramFollowers,
    youtube_channel: input.youtubeChannel,
    youtube_subscribers: input.youtubeSubscribers,
    facebook_page: input.facebookPage,
    content_unique: input.contentUnique,
    brand_benefit: input.brandBenefit,
    brand_integration_style: input.brandIntegrationStyle,
    has_sponsored_work: input.hasSponsoredWork,
    sample_promo_links: input.samplePromoLinks,
    why_participate: input.whyParticipate,
    status: "submitted",
    source: "web",
  };
}

export function serializeSurveyApplication(
  row: SurveyApplicationDbRow,
): SurveyApplication {
  return {
    id: row.id,
    fullName: row.full_name,
    contactNumber: row.contact_number,
    email: row.email,
    primaryNiche: row.primary_niche as SurveyNiche,
    primaryNicheOther: row.primary_niche_other,
    primaryPlatform: row.primary_platform as SurveyPlatform,
    instagramHandle: row.instagram_handle,
    instagramFollowers: row.instagram_followers,
    youtubeChannel: row.youtube_channel,
    youtubeSubscribers: row.youtube_subscribers,
    facebookPage: row.facebook_page,
    contentUnique: row.content_unique,
    brandBenefit: row.brand_benefit,
    brandIntegrationStyle: row.brand_integration_style,
    hasSponsoredWork: row.has_sponsored_work,
    samplePromoLinks: row.sample_promo_links,
    whyParticipate: row.why_participate,
    status: row.status as SurveyStatus,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createSurveyApplication(input: SurveyApplicationInput) {
  const supabase = getSupabaseAdminClient();
  const row = toSurveyApplicationRow(input);

  const { data, error } = await supabase
    .from(SURVEY_APPLICATIONS_TABLE)
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create survey application", error);
    throw new Error("Your application could not be submitted.");
  }

  return { id: data.id as string };
}

export async function listSurveyApplications(): Promise<SurveyApplication[]> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from(SURVEY_APPLICATIONS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to list survey applications", error);
    throw new Error("Survey responses could not be loaded.");
  }

  return (data as SurveyApplicationDbRow[]).map(serializeSurveyApplication);
}
