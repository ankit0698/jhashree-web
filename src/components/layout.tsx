import Head from "next/head";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const defaultTitle = "Jhashree Productions";
const defaultDescription =
  "Creative storytelling, branding, and video production from Madhubani, Bihar.";

export default function Layout({
  children,
  title = defaultTitle,
  description = defaultDescription,
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/brand-logo.png" />
        <link rel="apple-touch-icon" href="/assets/brand-logo.png" />
      </Head>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </div>
    </>
  );
}
