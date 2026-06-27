"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Button,
  Menu,
  Popover,
  Position,
  TranslateIcon,
  TickIcon,
  CaretDownIcon,
} from "evergreen-ui";

import { setUserLocale } from "@/i18n/locale";
import { routing, type Locale } from "@/i18n/routing";

// Maps each locale code to the i18n key holding its display name.
const LOCALE_LABEL_KEY: Record<Locale, "english" | "spanish"> = {
  en: "english",
  es: "spanish",
};

function useSwitchLocale() {
  const router = useRouter();
  const activeLocale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const switchLocale = (locale: Locale) => {
    if (locale === activeLocale) {
      return;
    }
    startTransition(async () => {
      await setUserLocale(locale);
      // Server components (root layout reads the catalog) re-render with the
      // new cookie value after a refresh.
      router.refresh();
    });
  };

  return { activeLocale, switchLocale, isPending };
}

/**
 * Desktop header language switcher: a minimal button that opens a popover
 * listing the supported locales, with the active one checked.
 */
export function LanguageSwitcher() {
  const t = useTranslations("language");
  const { activeLocale, switchLocale, isPending } = useSwitchLocale();

  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      content={({ close }) => (
        <Menu>
          <Menu.Group title={t("label")}>
            {routing.locales.map((locale) => (
              <Menu.Item
                key={locale}
                icon={locale === activeLocale ? TickIcon : undefined}
                onSelect={() => {
                  switchLocale(locale);
                  close();
                }}
              >
                {t(LOCALE_LABEL_KEY[locale])}
              </Menu.Item>
            ))}
          </Menu.Group>
        </Menu>
      )}
    >
      <Button
        appearance="minimal"
        marginRight="12px"
        minHeight="55px"
        isLoading={isPending}
        iconBefore={TranslateIcon}
        iconAfter={CaretDownIcon}
        aria-label={t("label")}
      >
        {t(LOCALE_LABEL_KEY[activeLocale])}
      </Button>
    </Popover>
  );
}

/**
 * Locale options as a Menu.Group, for embedding inside an existing menu
 * (e.g. the mobile help menu).
 */
export function LanguageMenuItems() {
  const t = useTranslations("language");
  const { activeLocale, switchLocale } = useSwitchLocale();

  return (
    <Menu.Group title={t("label")}>
      {routing.locales.map((locale) => (
        <Menu.Item
          key={locale}
          icon={locale === activeLocale ? TickIcon : TranslateIcon}
          onSelect={() => switchLocale(locale)}
        >
          {t(LOCALE_LABEL_KEY[locale])}
        </Menu.Item>
      ))}
    </Menu.Group>
  );
}

export default LanguageSwitcher;
