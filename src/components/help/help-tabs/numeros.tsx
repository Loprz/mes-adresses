import {
  Pane,
  Paragraph,
  OrderedList,
  ListItem,
  Strong,
  Button,
  Menu,
  IconButton,
  MapMarkerIcon,
  CommentIcon,
  ColumnLayoutIcon,
  Badge,
  AddIcon,
  MapIcon,
  MoreIcon,
  EditIcon,
  TrashIcon,
  EndorsedIcon,
  PlusIcon,
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

function Numeros() {
  const t = useTranslations("helpNumeros");
  const strong = (chunks: React.ReactNode) => (
    <Strong size={500}>{chunks}</Strong>
  );
  const before = (
    <Paragraph marginTop="default">{t("beforeIntro")}</Paragraph>
  );
  const createStreetBtn = (
    <Button marginX={4} iconBefore={PlusIcon}>
      {t("createStreetButton")}
    </Button>
  );
  const certifyBtn = (
    <Button
      marginX={4}
      appearance="primary"
      intent="success"
      iconAfter={EndorsedIcon}
    >
      {t("certifyAndSave")}
    </Button>
  );
  const saveBtn = (
    <Button marginX={4} intent="success">
      {t("saveButton")}
    </Button>
  );
  const moreBtn = (
    <Button background="tint1" iconBefore={MoreIcon} appearance="minimal" />
  );

  return (
    <Pane>
      <VideoContainer
        title={t("videoTitle")}
        link={`${PEERTUBE_LINK}/w/ts9chg7zehHXkTrotsjpqr`}
      />
      <Tuto title={t("goodToKnowTuto")}>
        <ListItem listStyleType="none">
          {t.rich("goodToKnow", { b: (chunks) => <b>{chunks}</b> })}
        </ListItem>
      </Tuto>
      <Tuto title={t("addTuto")}>
        {before}

        <SubTuto title={t("fromSidebar")} icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>
              {t("addSidebarStep1Pre")}
              <Button
                iconBefore={AddIcon}
                marginX={4}
                appearance="primary"
                intent="success"
              >
                {t("addNumberButton")}
              </Button>
            </ListItem>
            <ListItem>
              {t("markerAppearedPre")} <MapMarkerIcon color="info" />{" "}
              {t("markerAppearedPost")}
            </ListItem>
            <ListItem>
              {t("enterNumberPre")} {strong(t("numberField"))}
            </ListItem>
            <ListItem>
              {t("enterSuffixSlashPre")} {strong(t("suffixField"))}
            </ListItem>
            <ListItem>
              {t("searchStreetSidebarPre")} {createStreetBtn}
              {t("searchStreetPost")}
            </ListItem>
            <ListItem>
              {t("selectPositionPre")} {strong(t("typeField"))}
            </ListItem>
            <ListItem>
              {t("finishCertifyPre")} {certifyBtn} {t("finishCertifyMid")}{" "}
              {saveBtn} {t("finishCertifyPost")}
            </ListItem>
          </OrderedList>
        </SubTuto>

        <SubTuto title={t("fromMap")} icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>
              <Pane display="flex" alignItems="center">
                {t("addMapStep1Pre")}{" "}
                <IconButton
                  marginLeft={8}
                  icon={AddIcon}
                  intent="success"
                  appearance="primary"
                />
              </Pane>
            </ListItem>
            <ListItem>
              {t("markerAppearedPre")} <MapMarkerIcon color="info" />{" "}
              {t("markerAppearedPost")}
            </ListItem>
            <ListItem>
              {t("enterNumberMapPre")} {strong(t("numberField"))}
            </ListItem>
            <ListItem>
              {t("enterSuffixBisPre")} {strong(t("suffixField"))}
            </ListItem>
            <ListItem>
              {t("searchStreetMapPre")} {createStreetBtn}
              {t("searchStreetPost")}
            </ListItem>
            <ListItem>
              {t("selectPositionPre")} {strong(t("typeField"))}
            </ListItem>
            <ListItem>
              {t("finishCertifyMapPre")} {certifyBtn} {t("finishCertifyMid")}{" "}
              {saveBtn} {t("finishCertifyPost")}
            </ListItem>
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title={t("editTuto")}>
        {before}

        <SubTuto title={t("fromSidebar")} icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>
              {t("editSidebarStep1Pre")} {moreBtn} {t("editSidebarStep1Post")}
            </ListItem>
            <ListItem>
              <Pane display="flex" alignItems="center">
                {t("inMenuChoose")}
                <Menu.Item background="tint1" marginLeft={8} icon={EditIcon}>
                  {t("editMenuItem")}
                </Menu.Item>
              </Pane>
            </ListItem>
            <ListItem>
              {t("editSidebarStep3Pre")} <MapMarkerIcon color="info" />{" "}
              {t("editStepPostComma")}
            </ListItem>
          </OrderedList>
        </SubTuto>

        <SubTuto title={t("fromMap")} icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>{t("editMapStep1")}</ListItem>
            <ListItem>
              {t("editMapStep2Pre")} <MapMarkerIcon color="info" />{" "}
              {t("editStepPost")}
            </ListItem>
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title={t("deleteTuto")}>
        {before}

        <SubTuto title={t("fromSidebarMenu")} icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>
              {t("deleteStep1Pre")} {moreBtn} {t("deleteStep1Post")}
            </ListItem>
            <ListItem>
              <Pane display="flex" alignItems="center">
                {t("inMenuJustChoose")}
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
          </OrderedList>
        </SubTuto>

        <SubTuto title={t("fromMap")} icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>{t("deleteMapStep1")}</ListItem>
            <ListItem>
              <Pane display="flex" alignItems="center">
                {t("inMenuJustChoose")}
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
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title={t("uncertifyTuto")}>
        <OrderedList margin={8}>
          <ListItem>
            <Pane display="flex" alignItems="center">
              {t("beforeIntro")}
            </Pane>
          </ListItem>
          <ListItem>
            {t("uncertifyStep2Pre")}{" "}
            <Button marginX={4} intent="danger">
              {t("uncertifyButton")}
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("parcelsTuto")}>
        {before}

        <OrderedList margin={8}>
          <ListItem>
            {t("parcelsStep1Pre")} {moreBtn} {t("parcelsStep1Post")}
          </ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              {t("inMenuJustChoose")}
              <Menu.Item background="tint1" marginLeft={8} icon={EditIcon}>
                {t("editMenuItem")}
              </Menu.Item>
            </Pane>
          </ListItem>
          <ListItem>{t("parcelsStep3")}</ListItem>
          <ListItem>
            {t("parcelsStep4Pre")} {certifyBtn} {t("or")} {saveBtn}{" "}
            {t("parcelsStep4Post")}
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

      <Tuto title={t("commentTuto")}>
        {before}

        <OrderedList margin={8}>
          <ListItem>
            {t("commentStep1Pre")} {moreBtn} {t("commentStep1Post")}
          </ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              {t("inMenuJustChoose")}
              <Menu.Item background="tint1" marginLeft={8} icon={EditIcon}>
                {t("editMenuItem")}
              </Menu.Item>
            </Pane>
          </ListItem>
          <ListItem>
            {t("commentStep3Pre")} {strong(t("commentField"))}{" "}
            {t("commentStep3Post")}
          </ListItem>
          <ListItem>
            {t("commentStep4Pre")} {certifyBtn} {t("or")} {saveBtn}{" "}
            {t("commentStep4Post")}
          </ListItem>
        </OrderedList>

        <Paragraph>
          {t("commentNoticePre")} <CommentIcon /> {t("commentNoticePost")}
        </Paragraph>
      </Tuto>

      <Problems>
        <Tuto title={t("cantFindStreetTitle")}>
          <Paragraph marginTop="default">{t("cantFindStreetBody")}</Paragraph>
        </Tuto>

        <Unauthorized title={t("unauthorizedTitle")} />

        <Sidebar />
      </Problems>
    </Pane>
  );
}

export default Numeros;
