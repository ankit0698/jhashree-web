import Head from "next/head";
import Link from "next/link";
import type { ReactElement } from "react";

import AdminShell from "@/components/admin/admin-shell";
import EnquiriesPanel from "@/components/admin/enquiries-panel";
import { useAdminSession } from "@/hooks/use-admin-session";

export default function AdminMessagesPage() {
  const { user, isCheckingSession } = useAdminSession();

  return (
    <>
      <Head>
        <title>Messages | Jhashree Productions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminShell user={user} isCheckingSession={isCheckingSession}>
        <div className="py-7 md:py-10">
          <Link
            href="/admin"
            className="admin-button admin-button-ghost -ml-3"
          >
            <span aria-hidden="true">←</span>
            Back to works
          </Link>

          <EnquiriesPanel user={user} />
        </div>
      </AdminShell>
    </>
  );
}

AdminMessagesPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};
