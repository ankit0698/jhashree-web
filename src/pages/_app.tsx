import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

import Layout from "@/components/layout";
import "@/styles/globals.css";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page: ReactElement) => <Layout>{page}</Layout>);

  return (
    <div className={`${manrope.variable} ${cormorantGaramond.variable}`}>
      {getLayout(<Component {...pageProps} />)}
    </div>
  );
}
