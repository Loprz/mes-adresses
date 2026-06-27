import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./locale";

// Static imports for bundler compatibility (Edge middleware can't use dynamic imports)
import en from "../../messages/en.json";
import es from "../../messages/es.json";

const messagesByLocale: Record<string, typeof en> = { en, es };

export default getRequestConfig(async () => {
  // This app has no `[locale]` URL segment or middleware, so the active locale
  // is read from the NEXT_LOCALE cookie (set by the in-app language switcher),
  // falling back to the default locale.
  const locale = await getUserLocale();

  return {
    locale,
    messages: messagesByLocale[locale] ?? messagesByLocale.en,
  };
});
