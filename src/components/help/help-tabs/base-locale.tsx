import {
  Pane,
  OrderedList,
  ListItem,
  Button,
  Strong,
  Paragraph,
  Tab,
  CogIcon,
  PlusIcon,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import BALRecovery from "@/components/bal-recovery/bal-recovery";
import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Problems from "@/components/help/help-tabs/problems";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";

function BaseLocale() {
  const t = useTranslations("helpBaseLocale");
  const tc = useTranslations("helpCommon");
  const strong = (chunks: React.ReactNode) => (
    <Strong size={500} fontStyle="italic">
      {chunks}
    </Strong>
  );
  const bold = (chunks: React.ReactNode) => <b>{chunks}</b>;

  return (
    <Pane>
      <VideoContainer
        title={t("videoTitle")}
        link={`${PEERTUBE_LINK}/w/f2b6yiXosmfoKkmyF4YLtE`}
      />
      <Tuto title={t("createTuto")}>
        <Paragraph marginTop="default">
          {t.rich("createIntroPre", { b: bold })}{" "}
          <Tab isSelected>{t("tabCreate")}</Tab>
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>{t.rich("createStep1", { s: strong })}</ListItem>
          <ListItem>{t("createStep2")}</ListItem>
          <ListItem>{t("createStep3")}</ListItem>
          <ListItem>{t("createStep4")}</ListItem>
          <ListItem>{t.rich("createStep5", { s: strong })}</ListItem>
          <ListItem>
            {t("createStep6Pre")}{" "}
            <Button
              marginX={4}
              appearance="primary"
              intent="success"
              iconAfter={PlusIcon}
            >
              {tc("createLabButton")}
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("importTuto")}>
        <Paragraph marginTop="default">
          {t.rich("createIntroPre", { b: bold })}{" "}
          <Tab isSelected>{t("tabImport")}</Tab>
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>{t.rich("importStep1", { b: bold })}</ListItem>
          <ListItem>{t.rich("importStep2", { s: strong })}</ListItem>
          <ListItem>{t("importStep3")}</ListItem>
          <ListItem>{t("importStep4")}</ListItem>
          <ListItem>{t("importStep5")}</ListItem>
          <ListItem>
            {t("importStep6Pre")}{" "}
            <Button
              marginX={4}
              appearance="primary"
              intent="success"
              iconAfter={PlusIcon}
            >
              {tc("createLabButton")}
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title={t("manageTuto")}>
        <Paragraph marginTop="default">
          {t("manageIntroPre")}{" "}
          <span>
            <CogIcon marginX={4} />
          </span>{" "}
          {t("manageIntroPost")}
        </Paragraph>
        <Paragraph marginTop="default">{t("youWillBeAble")}</Paragraph>
        <OrderedList margin={8}>
          <ListItem>{t("manageItem1")}</ListItem>
          <ListItem>{t("manageItem2")}</ListItem>
          <ListItem>{t("manageItem3")}</ListItem>
        </OrderedList>

        <Paragraph marginTop="default">
          {t("manageSavePre")}{" "}
          <Button marginX={4} appearance="primary">
            {tc("saveChanges")}
          </Button>
        </Paragraph>
      </Tuto>

      <Problems>
        <Unauthorized title={tc("cantEditTitle")} />

        <Tuto title={tc("cantFindJurisdictionTitle")}>
          <Paragraph marginTop="default">
            {tc.rich("cantFindJurisdiction", {
              link: (chunks) => (
                <a href="mailto:support@nap.us.gov">{chunks}</a>
              ),
            })}
          </Paragraph>
        </Tuto>

        <BALRecovery />
      </Problems>
    </Pane>
  );
}

export default BaseLocale;
