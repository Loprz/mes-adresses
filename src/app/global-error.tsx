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

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

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
          An error has occurred.
        </Heading>
        <Button iconBefore={ArrowLeftIcon} onClick={reload}>
          Try again
        </Button>
      </Pane>
    </Main>
  );
}
