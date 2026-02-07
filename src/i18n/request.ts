import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// Static imports for bundler compatibility (Edge middleware can't use dynamic imports)
import en from "../../messages/en.json";
import es from "../../messages/es.json";

const messagesByLocale: Record<string, typeof en> = { en, es };

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as "en" | "es")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messagesByLocale[locale] ?? messagesByLocale.en,
  };
});
