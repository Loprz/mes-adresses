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
  return (
    <Pane>
      <VideoContainer
        title="Publishing your Local Address Base:"
        link={`${PEERTUBE_LINK}/w/oMKnhiVycDTjddCBXZuYMB`}
      />
      <Tuto title="Publish your Local Address Base">
        <OrderedList margin={8}>
          <ListItem>
            <Paragraph>
              Click the button
              <Button marginX={4} height={24} appearance="primary">
                Publish
              </Button>
            </Paragraph>
          </ListItem>

          <ListItem>
            <Paragraph>
              Authenticate via your local government's official email or your
              Proconnect account
            </Paragraph>
          </ListItem>

          <ListItem>
            Once authorization is obtained, you will be automatically invited to
            publish your Local Address Base by clicking
            <Button
              marginX={4}
              height={24}
              appearance="primary"
              intent="success"
            >
              Publier
            </Button>
          </ListItem>
        </OrderedList>
        <Alert title="In case of conflict">
          <Text display="block" color="muted">
            It may happen that another Local Address Base is already
            synchronized with the National Address Platform. In this case, your Local
            Address Base will conflict with it.
          </Text>
          <Text display="block" marginTop={8} color="muted">
            By clicking
            <Button
              appearance="primary"
              intent="danger"
              height={24}
              marginX={4}
            >
              Force publish
            </Button>
            your Local Address Base will be published and will replace the one
            currently in place.
          </Text>
        </Alert>
      </Tuto>

      <Tuto title="Synchronization statuses">
        <Pane display="flex" flexDirection="column" gap={16} marginTop={8}>
          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{ isPaused: false, status: BaseLocaleSync.status.SYNCED }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>
              Your Local Address Base is up to date with the National Address
              Platform. All its addresses are accounted for.
            </Text>
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
            <Text>
              Changes have been detected and will be automatically
              reflected in the National Address Platform within the next
              few hours.
            </Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{ isPaused: true, status: BaseLocaleSync.status.SYNCED }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>
              You have paused updates for your Local Address Base.
              No changes will be sent to the National Address Platform.
              You can resume updates at any time.
            </Text>
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
            <Text>
              Another Local Address Base has replaced yours. Automatic address
              updates are not possible. You can force an update to replace
              the Local Address Base currently
              in place.
            </Text>
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
            <Text>
              The Local Address Base authorization is not
              valid. You need to renew it so that new
              changes are reflected in the National Address Platform.
            </Text>
          </Pane>
        </Pane>
      </Tuto>

      <Problems>
        <Unauthorized title="I can't edit my LAB" />
      </Problems>
    </Pane>
  );
}

export default Publication;
