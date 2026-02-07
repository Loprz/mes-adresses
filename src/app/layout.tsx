import type { Metadata } from "next";
import { extractStyles } from "evergreen-ui";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { MatomoTrackingContextProvider } from "@/contexts/matomo-tracking";
import { LayoutContextProvider } from "@/contexts/layout";
import { BALWidgetProvider } from "@/contexts/bal-widget";
import { LocalStorageContextProvider } from "@/contexts/local-storage";
import { HelpContextProvider } from "@/contexts/help";
import Help from "@/components/help";
import { initialOpenAPIBaseURL } from "@/lib/open-api";
import Main from "@/layouts/main";
import { BALRecoveryProvider } from "@/contexts/bal-recovery";
import { OpenAPIContextProvider } from "@/contexts/open-api";

import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

initialOpenAPIBaseURL();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { css, hydrationScript } = extractStyles();
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} data-color-scheme="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light" />
        <style id="evergreen-css" dangerouslySetInnerHTML={{ __html: css }} />
        {hydrationScript}
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <OpenAPIContextProvider>
            {/* TODO */}
            <MatomoTrackingContextProvider pageProps={{}}>
              <LayoutContextProvider>
                <BALWidgetProvider>
                  <LocalStorageContextProvider>
                    <HelpContextProvider>
                      <BALRecoveryProvider>
                        <Help />
                        <Main>{children}</Main>
                      </BALRecoveryProvider>
                    </HelpContextProvider>
                  </LocalStorageContextProvider>
                </BALWidgetProvider>
              </LayoutContextProvider>
            </MatomoTrackingContextProvider>
          </OpenAPIContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
