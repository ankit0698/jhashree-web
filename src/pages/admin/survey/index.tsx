import Head from "next/head";
import Link from "next/link";
import type { ReactElement } from "react";

import AdminShell from "@/components/admin/admin-shell";
import SurveyResponsesPanel from "@/components/admin/survey-responses-panel";
import { useAdminSession } from "@/hooks/use-admin-session";

export default function AdminSurveyPage() {
  const { user, isCheckingSession } = useAdminSession();

  return (
    <>
      <Head>
        <title>Survey Responses | Jhashree Productions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminShell user={user} isCheckingSession={isCheckingSession}>
        <div className="py-7 md:py-10">
          <Link href="/admin" className="admin-button admin-button-ghost -ml-3">
            <span aria-hidden="true">←</span>
            Back to works
          </Link>

          <SurveyResponsesPanel user={user} />
        </div>
      </AdminShell>
    </>
  );
}

AdminSurveyPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};
