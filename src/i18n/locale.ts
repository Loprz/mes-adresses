"use server";

import { cookies } from "next/headers";
import { routing, type Locale } from "./routing";

// Cookie that next-intl reads to determine the active locale.
// We use the conventional NEXT_LOCALE name so the value is portable.
const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale(): Promise<Locale> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (value && routing.locales.includes(value as Locale)) {
    return value as Locale;
  }
  return routing.defaultLocale;
}

export async function setUserLocale(locale: Locale): Promise<void> {
  if (!routing.locales.includes(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  (await cookies()).set(COOKIE_NAME, locale, {
    path: "/",
    sameSite: "lax",
    // 1 year
    maxAge: 60 * 60 * 24 * 365,
  });
}
