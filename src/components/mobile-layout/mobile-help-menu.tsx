import { useContext } from "react";
import {
  Button,
  HelpIcon,
  BookIcon,
  VideoIcon,
  Popover,
  Position,
  Menu,
  InfoSignIcon,
} from "evergreen-ui";

import { useTranslations } from "next-intl";

import { PEERTUBE_LINK } from "@/components/help/video-container";
import HelpContext from "@/contexts/help";

export function MobileHelpMenu() {
  const t = useTranslations("mobileHelp");
  const { showHelp, setShowHelp } = useContext(HelpContext);

  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      content={
        <Menu>
          <Menu.Group>
            <Menu.Item icon={HelpIcon} onClick={() => setShowHelp(!showHelp)}>
              {t("needHelp")}
            </Menu.Item>
            <Menu.Item
              is="a"
              target="_blank"
              icon={VideoIcon}
              href={`${PEERTUBE_LINK}/c/base_adresse_locale/videos`}
            >
              {t("videoTutorials")}
            </Menu.Item>
            <Menu.Item
              is="a"
              target="_blank"
              href="#"
              icon={BookIcon}
            >
              {t("addressingGuides")}
            </Menu.Item>
          </Menu.Group>
        </Menu>
      }
    >
      <Button appearance="minimal">
        <InfoSignIcon />
      </Button>
    </Popover>
  );
}
