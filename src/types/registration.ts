export const EVENT_REGISTRATIONS_TABLE = "event_registrations";

export const PASS_PRICE_PAISE = 29900;
export const PASS_CURRENCY = "INR";
export const BOGO_LIMIT = 50;
export const REGISTRATION_CODE_PREFIX = "RR2";

export const AGE_GROUPS = [
  { value: "under_18", label: "Under 18" },
  { value: "18_24", label: "18–24" },
  { value: "25_34", label: "25–34" },
  { value: "35_44", label: "35–44" },
  { value: "45_plus", label: "45+" },
] as const;

export const ATTENDEE_TYPES = [
  { value: "creator", label: "Creator / Influencer" },
  { value: "photographer", label: "Photographer / Videographer" },
  { value: "artist", label: "Artist / Performer" },
  { value: "student", label: "Student" },
  { value: "entrepreneur", label: "Entrepreneur / Business Owner" },
  { value: "brand_rep", label: "Brand Representative" },
  { value: "freelancer", label: "Freelancer" },
  { value: "marketing", label: "Marketing Professional" },
  { value: "general_audience", label: "General Audience" },
  { value: "other", label: "Other" },
] as const;

export const COMING_WITH_OPTIONS = [
  { value: "solo", label: "Coming Solo" },
  { value: "friends", label: "Friend(s)" },
  { value: "partner", label: "Partner" },
  { value: "family", label: "Family" },
  { value: "creator_group", label: "Creator / Work Group" },
  { value: "brand_team", label: "Brand / Business Team" },
] as const;

export const INTEREST_OPTIONS = [
  { value: "creators_brands_meetup", label: "Creators × Brands Meetup" },
  { value: "content_creation", label: "Content Creation" },
  { value: "live_performances", label: "Live Performances" },
  { value: "live_challenges", label: "Live Challenges" },
  { value: "talent_discovery", label: "Talent Discovery" },
  { value: "networking", label: "Networking" },
  { value: "food_fun", label: "Food & Fun" },
  { value: "photography_reels", label: "Photography & Reels" },
  { value: "meeting_new_people", label: "Meeting New People" },
  { value: "just_experience", label: "Just here for the experience!" },
] as const;

export const HEARD_FROM_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "youtube", label: "YouTube" },
  { value: "friend_family", label: "Friend / Family" },
  { value: "creator", label: "Creator / Influencer" },
  { value: "brand", label: "Brand / Business" },
  { value: "poster", label: "Poster / Hoarding" },
  { value: "college", label: "College / Institution" },
  { value: "other", label: "Other" },
] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number]["value"];
export type AttendeeType = (typeof ATTENDEE_TYPES)[number]["value"];
export type ComingWith = (typeof COMING_WITH_OPTIONS)[number]["value"];
export type Interest = (typeof INTEREST_OPTIONS)[number]["value"];
export type HeardFrom = (typeof HEARD_FROM_OPTIONS)[number]["value"];
export type RegistrationPromo = "bogo_first_50" | "none";
export type RegistrationStatus = "pending" | "paid" | "failed" | "refunded";

export type RegistrationInput = {
  fullName: string;
  contactNumber: string;
  email: string;
  ageGroup: AgeGroup;
  city: string;
  district: string;
  state: string;
  attendeeType: AttendeeType;
  attendeeTypeOther: string | null;
  comingWith: ComingWith;
  interests: Interest[];
  heardFrom: HeardFrom;
  heardFromOther: string | null;
};

export type RegistrationRow = {
  full_name: string;
  contact_number: string;
  email: string;
  age_group: AgeGroup;
  city: string;
  district: string;
  state: string;
  attendee_type: AttendeeType;
  attendee_type_other: string | null;
  coming_with: ComingWith;
  interests: Interest[];
  heard_from: HeardFrom;
  heard_from_other: string | null;
  amount_paise: number;
  currency: string;
  passes_count: number;
  promo: RegistrationPromo;
  bogo_slot: number | null;
  status: RegistrationStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  paid_at: string | null;
  registration_code: string | null;
  registration_code_guest: string | null;
  ticket_token: string;
  source: string;
};

export type RegistrationConfirmation = {
  id: string;
  registrationCode: string;
  registrationCodeGuest: string | null;
  ticketToken: string;
  passesCount: number;
  promo: RegistrationPromo;
  amountPaise: number;
  fullName: string;
  email: string;
  contactNumber: string;
};

export type AdminRegistration = RegistrationInput & {
  id: string;
  amountPaise: number;
  currency: string;
  passesCount: number;
  promo: RegistrationPromo;
  bogoSlot: number | null;
  status: RegistrationStatus;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  paidAt: string | null;
  registrationCode: string | null;
  registrationCodeGuest: string | null;
  ticketToken: string;
  source: string;
  createdAt: string | null;
  updatedAt: string | null;
};
