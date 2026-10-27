import Head from "next/head";
import Link from "next/link";
import type { ReactElement } from "react";

import AdminShell from "@/components/admin/admin-shell";
import SamaResponsesPanel from "@/components/admin/sama-responses-panel";
import { useAdminSession } from "@/hooks/use-admin-session";

export default function AdminSamaPage() {
  const { user, isCheckingSession } = useAdminSession();

  return (
    <>
      <Head>
        <title>Let&apos;s Play Sama | Jhashree Productions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminShell user={user} isCheckingSession={isCheckingSession}>
        <div className="py-7 md:py-10">
          <Link
            href="/admin/surveys-and-registrations"
            className="admin-button admin-button-ghost -ml-3"
          >
            <span aria-hidden="true">←</span>
            Back to surveys and registrations
          </Link>

          <SamaResponsesPanel user={user} />
        </div>
      </AdminShell>
    </>
  );
}

AdminSamaPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};
