import {
  OrderedList,
  Pane,
  ListItem,
  Button,
  AddIcon,
  MapMarkerIcon,
  Menu,
  MoreIcon,
  Paragraph,
  Tab,
  Heading,
  Badge,
  Strong,
  EditIcon,
  Text,
  TrashIcon,
  Select,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Sidebar from "@/components/help/tuto/sidebar";
import Problems from "@/components/help/help-tabs/problems";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";

function Toponymes() {
  const t = useTranslations("helpToponymes");
  const before = (
    <Paragraph marginTop="default">{t("beforeIntro")}</Paragraph>
  );

  return (
    <Pane>
      <VideoContainer
        title={t("videoTitle")}
        link={`${PEERTUBE_LINK}/w/7AeS1b84kmwjbL3A19Wphw`}
      />
      <Tuto title={t("addTuto")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>
            {t("addStep1Pre")}{" "}
            <Tab>
              <Heading size={300}>{t("tabPlaceNameList")}</Heading>
            </Tab>
            {t("addStep1Mid")}{" "}
            <Button
              iconBefore={AddIcon}
              marginX={4}
              appearance="primary"
              intent="success"
            >
              {t("addPlaceNameButton")}
            </Button>
          </ListItem>
          <ListItem>
            {t("addStep2Pre")}{" "}
            <Text color="muted">
              <i>{t("placeNameField")}</i>
            </Text>
          </ListItem>
          <ListItem>
            {t("addStep3Part1Pre")}{" "}
            <MapMarkerIcon color="info" /> {t("addStep3Part1Post")}
            <br />
            {t("addStep3Part2Pre")}{" "}
            <Select>
              <option>{t("segmentOption")}</option>
            </Select>
            {t("addStep3Part3")}{" "}
            <TrashIcon marginX={6} color="danger" verticalAlign="middle" />
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("assignTuto")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>
            {t("assignStep1Pre")}
            <Button
              iconBefore={AddIcon}
              marginX={4}
              appearance="primary"
              intent="success"
            >
              {t("addNumberButton")}
            </Button>
          </ListItem>
          <ListItem>{t("assignStep2")}</ListItem>
          <ListItem>{t("assignStep3")}</ListItem>
          <ListItem>
            {t("assignStep4Pre")}{" "}
            <Button marginX={4} appearance="primary" intent="success">
              {t("saveButton")}
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("editTuto")}>
        {before}
        <OrderedList margin={8}>
          <ListItem>{t("editStep1")}</ListItem>
          <ListItem>{t("editStep2")}</ListItem>
          <ListItem>
            {t("editStep3Pre")} <MapMarkerIcon color="info" />{" "}
            {t("editStep3Post")}
          </ListItem>
          <ListItem>
            {t("editStep4Pre")}{" "}
            <Button
              iconBefore={AddIcon}
              marginX={4}
              appearance="primary"
              intent="success"
            >
              {t("addPositionButton")}
            </Button>
            {t("editStep4Mid")}{" "}
            <TrashIcon marginX={6} color="danger" verticalAlign="middle" />
          </ListItem>
          <ListItem>
            {t("editStep5Pre")}{" "}
            <Button marginX={4} appearance="primary" intent="success">
              {t("saveButton")}
            </Button>
          </ListItem>
        </OrderedList>
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

      <Tuto title={t("parcelsTuto")}>
        {before}

        <OrderedList margin={8}>
          <ListItem>
            {t("parcelsStep1Pre")}{" "}
            <Button
              background="tint1"
              iconBefore={MoreIcon}
              appearance="minimal"
            />{" "}
            {t("parcelsStep1Post")}
          </ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              {t("parcelsStep2Pre")}
              <Menu.Item background="tint1" marginLeft={8} icon={EditIcon}>
                {t("editMenuItem")}
              </Menu.Item>
            </Pane>
          </ListItem>
          <ListItem>{t("parcelsStep3")}</ListItem>
          <ListItem>
            {t("parcelsStep4Pre")}{" "}
            <Button marginX={4} appearance="primary" intent="success">
              {t("saveButton")}
            </Button>
          </ListItem>
        </OrderedList>

        <Pane>
          <Strong>{t("parcelColorTitle")}</Strong>
          <Paragraph display="flex">
            <Badge margin={4} height="100%" color="green">
              {t("parcelAssociated")}
            </Badge>
            <Badge margin={4} height="100%" color="yellow">
              {t("parcelCanAssociate")}
            </Badge>
            <Badge margin={4} height="100%" color="red">
              {t("parcelCanDissociate")}
            </Badge>
          </Paragraph>
        </Pane>
      </Tuto>

      <Problems>
        <Unauthorized title={t("unauthorizedTitle")} />
        <Sidebar />
      </Problems>
    </Pane>
  );
}

export default Toponymes;
