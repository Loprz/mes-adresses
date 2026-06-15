import {
  Pane,
  Paragraph,
  OrderedList,
  ListItem,
  Strong,
  Menu,
  Button,
  AddIcon,
  ColumnLayoutIcon,
  MapIcon,
  MoreIcon,
  SendToMapIcon,
  TrashIcon,
  KeyTabIcon,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import Tuto from "@/components/help/tuto";
import SubTuto from "@/components/help/tuto/sub-tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Sidebar from "@/components/help/tuto/sidebar";
import Problems from "@/components/help/help-tabs/problems";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";

function Voies() {
  const t = useTranslations("helpVoies");
  const strong = (chunks: React.ReactNode) => (
    <Strong size={500} fontStyle="italic">
      {chunks}
    </Strong>
  );
  const before = (
    <Paragraph marginTop="default">{t("beforeIntro")}</Paragraph>
  );

  return (
    <Pane>
      <VideoContainer
        title={t("videoTitle")}
        link={`${PEERTUBE_LINK}/w/v2caTXtfYkvg6wUELBvLs2`}
      />
      <Tuto title={t("addTuto")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>
            {t("addStep1Pre")}
            <Button
              iconBefore={AddIcon}
              marginX={4}
              appearance="primary"
              intent="success"
            >
              {t("addStreetButton")}
            </Button>
          </ListItem>
          <ListItem>{t.rich("addStep2", { s: strong })}</ListItem>
          <ListItem>
            {t("addStep3Pre")}{" "}
            <Button marginX={4} appearance="primary" intent="success">
              {t("addButton")}
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("renameTuto")}>
        {before}

        <OrderedList margin={8}>
          <ListItem>{t("renameStep1")}</ListItem>
          <ListItem>{t("renameStep2")}</ListItem>
          <ListItem>
            {t("renameStep3Pre")}{" "}
            <Button marginX={4} appearance="primary" intent="success">
              {t("saveButton")}
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("viewTuto")}>
        {before}

        <SubTuto title={t("fromSidebar")} icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>
              {t("viewSidebarStep1Pre")}{" "}
              <Button
                background="tint1"
                iconBefore={MoreIcon}
                appearance="minimal"
              />{" "}
              {t("viewSidebarStep1Post")}
            </ListItem>
            <ListItem>
              <Pane display="flex" alignItems="center">
                {t("viewSidebarStep2Pre")}
                <Menu.Item
                  background="tint1"
                  marginLeft={8}
                  icon={SendToMapIcon}
                >
                  {t("viewMenuItem")}
                </Menu.Item>
              </Pane>
            </ListItem>
          </OrderedList>
        </SubTuto>

        <SubTuto title={t("fromMap")} icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>{t("viewMapStep1")}</ListItem>
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title={t("deleteTuto")}>
        {before}

        <OrderedList margin={8}>
          <ListItem>
            {t("deleteStep1Pre")}{" "}
            <Button
              background="tint1"
              iconBefore={MoreIcon}
              appearance="minimal"
            />{" "}
            {t("deleteStep1Post")}
          </ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              {t("deleteStep2Pre")}
              <Menu.Item
                background="tint1"
                marginLeft={8}
                icon={TrashIcon}
                intent="danger"
              >
                {t("deleteMenuItem")}
              </Menu.Item>
            </Pane>
          </ListItem>
          <ListItem>
            {t("deleteStep3Pre")}{" "}
            <Button marginX={4} intent="danger" appearance="primary">
              {t("deleteButton")}
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("convertTuto")}>
        {before}
        <Paragraph marginTop="default">{t("convertIntro")}</Paragraph>
        <OrderedList margin={8}>
          <ListItem>
            {t("convertStep1Pre")}
            <Button
              background="tint1"
              iconBefore={MoreIcon}
              appearance="minimal"
            />
            {t("convertStep1Post")}
          </ListItem>
          <ListItem>
            {t("convertStep2Pre")}
            <Button iconBefore={KeyTabIcon} marginX={4}>
              {t("convertButton")}
            </Button>
          </ListItem>
          <ListItem>
            {t("convertStep3Pre")}
            <Button marginX={4} appearance="primary">
              {t("confirmButton")}
            </Button>
          </ListItem>
          <ListItem>{t("convertStep4")}</ListItem>
        </OrderedList>
      </Tuto>

      <Problems>
        <Unauthorized title={t("unauthorizedTitle")} />
        <Sidebar />
      </Problems>
    </Pane>
  );
}

export default Voies;
