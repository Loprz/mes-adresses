"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import {
  Pane,
  Button,
  Icon,
  RouteIcon,
  Heading,
  ArrowLeftIcon,
} from "evergreen-ui";
import Main from "@/layouts/main";
import enMessages from "../../messages/en.json";
import esMessages from "../../messages/es.json";

// global-error renders outside the NextIntlClientProvider (it replaces the root
// layout on a render error), so useTranslations is unavailable here. We resolve
// strings straight from the catalogs, keyed by the <html lang> set by the root
// layout, falling back to English.
const messages = { en: enMessages, es: esMessages } as const;

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  const locale =
    typeof document !== "undefined" && document.documentElement.lang === "es"
      ? "es"
      : "en";
  const t = messages[locale].globalError;

  const reload = () => {
    window.location.reload();
  };

  return (
    <Main>
      <Pane
        display="flex"
        flex={1}
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        height="50%"
      >
        <Icon
          icon={RouteIcon}
          size={100}
          marginX="auto"
          marginY={16}
          color="#101840"
        />
        <Heading size={800} marginBottom="2em">
          {t.title}
        </Heading>
        <Button iconBefore={ArrowLeftIcon} onClick={reload}>
          {t.retry}
        </Button>
      </Pane>
    </Main>
  );
}
