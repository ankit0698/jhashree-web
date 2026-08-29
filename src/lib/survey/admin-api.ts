import type { User } from "firebase/auth";

import type { SurveyApplication } from "@/types/survey";

type ErrorResponse = {
  error?: string;
};

export async function getAdminSurveyApplications(user: User) {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/admin/survey", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  const result = (await response.json().catch(() => ({}))) as {
    applications?: SurveyApplication[];
    total?: number;
  } & ErrorResponse;

  if (!response.ok) {
    throw new Error(result.error || "Survey responses could not be loaded.");
  }

  return {
    applications: result.applications ?? [],
    total: result.total ?? result.applications?.length ?? 0,
  };
}
