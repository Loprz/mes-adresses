import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";

// date-fns Locale object type (the `Locale` type isn't re-exported from
// "date-fns/locale" in v4, so derive it from a known locale object).
type DateFnsLocale = typeof enUS;

// Map a next-intl locale code ("en" | "es") to its date-fns Locale object.
// Falls back to English for any unknown locale.
const dateFnsLocales: Record<string, DateFnsLocale> = { en: enUS, es };

export const getDateFnsLocale = (locale: string): DateFnsLocale =>
  dateFnsLocales[locale] ?? enUS;

export const getDuration = (start: Date, end: Date = new Date()) => {
  const duration = end.getTime() - start.getTime();
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} jour${days > 1 ? "s" : ""}`;
  }
  if (hours > 0) {
    return `${hours} heure${hours > 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  return `${seconds} seconde${seconds > 1 ? "s" : ""}`;
};

export const getLongFormattedDate = (date: Date) => {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Ex: "Wednesday, January 1, 2023" (locale-aware; defaults to English)
export const getFullDate = (date: Date, locale: DateFnsLocale = enUS) => {
  return format(date, "PPPP", {
    locale,
  });
};

export const hasBeenSentRecently = (sentAt: Date) => {
  const now = new Date();

  const floodLimitTime = new Date(sentAt);
  floodLimitTime.setMinutes(floodLimitTime.getMinutes() + 5);
  return now < floodLimitTime;
};
