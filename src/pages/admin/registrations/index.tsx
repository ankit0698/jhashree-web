import Head from "next/head";
import Link from "next/link";
import type { ReactElement } from "react";

import AdminShell from "@/components/admin/admin-shell";
import RegistrationsPanel from "@/components/admin/registrations-panel";
import { useAdminSession } from "@/hooks/use-admin-session";

export default function AdminRegistrationsPage() {
  const { user, isCheckingSession } = useAdminSession();

  return (
    <>
      <Head>
        <title>Registrations | Jhashree Productions</title>
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

          <RegistrationsPanel user={user} />
        </div>
      </AdminShell>
    </>
  );
}

AdminRegistrationsPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};
