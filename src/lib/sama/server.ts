import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type {
  SamaApplicationStatus,
  SamaCreatorApplication,
  SamaCreatorApplicationInput,
  SamaCreatorApplicationRow,
} from "@/types/sama";
import { SAMA_CREATOR_APPLICATIONS_TABLE } from "@/types/sama";

function toSamaCreatorApplicationRow(
  input: SamaCreatorApplicationInput,
): SamaCreatorApplicationRow {
  return {
    full_name: input.fullName,
    contact_number: input.contactNumber,
    email: input.email,
    address: input.address,
    content_type: input.contentType,
    instagram_username: input.instagramUsername,
    instagram_followers: input.instagramFollowers,
    facebook_link: input.facebookLink,
    facebook_followers: input.facebookFollowers,
    youtube_link: input.youtubeLink,
    youtube_subscribers: input.youtubeSubscribers,
    wants_to_promote_culture: input.wantsToPromoteCulture,
    promote_culture_how: input.promoteCultureHow,
    promote_culture_why: input.promoteCultureWhy,
    knows_sama_chakewa: input.knowsSamaChakewa,
    wants_to_join_event: input.wantsToJoinEvent,
    interested_in_campaign: input.interestedInCampaign,
    status: "submitted",
    source: "web",
  };
}

export async function createSamaCreatorApplication(
  input: SamaCreatorApplicationInput,
) {
  const supabase = getSupabaseAdminClient();
  const row = toSamaCreatorApplicationRow(input);

  const { data, error } = await supabase
    .from(SAMA_CREATOR_APPLICATIONS_TABLE)
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create Sama creator application", error);
    throw new Error("Your application could not be submitted.");
  }

  return { id: data.id as string };
}

type SamaCreatorApplicationDbRow = SamaCreatorApplicationRow & {
  id: string;
  created_at: string | null;
  updated_at: string | null;
};

export function serializeSamaCreatorApplication(
  row: SamaCreatorApplicationDbRow,
): SamaCreatorApplication {
  return {
    id: row.id,
    fullName: row.full_name,
    contactNumber: row.contact_number,
    email: row.email,
    address: row.address,
    contentType: row.content_type,
    instagramUsername: row.instagram_username,
    instagramFollowers: row.instagram_followers,
    facebookLink: row.facebook_link,
    facebookFollowers: row.facebook_followers,
    youtubeLink: row.youtube_link,
    youtubeSubscribers: row.youtube_subscribers,
    wantsToPromoteCulture: row.wants_to_promote_culture,
    promoteCultureHow: row.promote_culture_how,
    promoteCultureWhy: row.promote_culture_why,
    knowsSamaChakewa: row.knows_sama_chakewa,
    wantsToJoinEvent: row.wants_to_join_event,
    interestedInCampaign: row.interested_in_campaign,
    status: row.status as SamaApplicationStatus,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listSamaCreatorApplications(): Promise<
  SamaCreatorApplication[]
> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from(SAMA_CREATOR_APPLICATIONS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to list Sama creator applications", error);
    throw new Error("Let's Play Sama responses could not be loaded.");
  }

  return (data as SamaCreatorApplicationDbRow[]).map(
    serializeSamaCreatorApplication,
  );
}
