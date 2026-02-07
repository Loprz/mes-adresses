import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // All supported locales
  locales: ["en", "es"],

  // Default locale when no prefix is present
  defaultLocale: "en",

  // Show locale prefix only for non-default locale
  // English: /my-page, Spanish: /es/my-page
  localePrefix: "as-needed",
});

// Lightweight wrappers around Next.js navigation APIs
// that handle locale automatically
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
