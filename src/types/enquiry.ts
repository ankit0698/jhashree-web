export const ENQUIRIES_COLLECTION = "enquiries";

export type EnquiryInput = {
  title: string;
  description: string;
  phone: string | null;
  email: string | null;
};

export type Enquiry = EnquiryInput & {
  id: string;
  isRead: boolean;
  createdAt: string | null;
};
