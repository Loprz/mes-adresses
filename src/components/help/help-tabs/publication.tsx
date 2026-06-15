import {
  Alert,
  Button,
  ListItem,
  OrderedList,
  UnorderedList,
  Pane,
  Paragraph,
  Text,
  Strong,
  CaretDownIcon,
  UploadIcon,
  EditIcon,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import StatusBadge from "@/components/status-badge";
import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Problems from "@/components/help/help-tabs/problems";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";
import { BaseLocale, BaseLocaleSync } from "@/lib/openapi-api-bal";

function Publication() {
  const t = useTranslations("helpPublication");
  const tc = useTranslations("helpCommon");
  return (
    <Pane>
      <VideoContainer
        title={t("videoTitle")}
        link={`${PEERTUBE_LINK}/w/oMKnhiVycDTjddCBXZuYMB`}
      />
      <Tuto title={t("publishTuto")}>
        <OrderedList margin={8}>
          <ListItem>
            <Paragraph>
              {t("publishStep1Pre")}
              <Button marginX={4} height={24} appearance="primary">
                {t("publishButton")}
              </Button>
            </Paragraph>
          </ListItem>

          <ListItem>
            <Paragraph>{t("publishStep2")}</Paragraph>
          </ListItem>

          <ListItem>
            {t("publishStep3Pre")}
            <Button
              marginX={4}
              height={24}
              appearance="primary"
              intent="success"
            >
              {t("publishButton")}
            </Button>
          </ListItem>
        </OrderedList>
        <Alert title={t("conflictTitle")}>
          <Text display="block" color="muted">
            {t("conflictText1")}
          </Text>
          <Text display="block" marginTop={8} color="muted">
            {t("conflictText2")}
          </Text>
          <Text display="block" marginTop={8} color="muted">
            {t("conflictText3Pre")}
            <Button
              appearance="primary"
              intent="danger"
              height={24}
              marginX={4}
            >
              {t("forcePublishButton")}
            </Button>
            {t("conflictText3Post")}
          </Text>
        </Alert>
      </Tuto>

      <Tuto title={t("syncTuto")}>
        <Pane display="flex" flexDirection="column" gap={16} marginTop={8}>
          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{ isPaused: false, status: BaseLocaleSync.status.SYNCED }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>{t("syncSynced")}</Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{
                  isPaused: false,
                  status: BaseLocaleSync.status.OUTDATED,
                }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>{t("syncOutdated")}</Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{ isPaused: true, status: BaseLocaleSync.status.SYNCED }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>{t("syncPaused")}</Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.REPLACED}
                sync={{
                  isPaused: true,
                  status: BaseLocaleSync.status.CONFLICT,
                }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>{t("syncConflict")}</Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={38}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{
                  isPaused: false,
                  status: BaseLocaleSync.status.OUTDATED,
                }}
                isHabilitationValid={false}
              />
            </Pane>
            <Text>{t("syncInvalidAuth")}</Text>
          </Pane>
        </Pane>
      </Tuto>

      <Problems>
        <Unauthorized title={tc("cantEditTitle")} />
      </Problems>
    </Pane>
  );
}

export default Publication;
