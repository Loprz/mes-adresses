"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Pane,
  Button,
  Icon,
  RouteIcon,
  Heading,
  ArrowLeftIcon,
} from "evergreen-ui";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <>
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
          {t("title")}
        </Heading>
        <Button iconBefore={ArrowLeftIcon} is={Link} href="/">
          {t("backHome")}
        </Button>
      </Pane>
    </>
  );
}
