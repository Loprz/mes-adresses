import { Pane, Heading, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";

import StarRating from "./star-rating";
import { AccordionCard } from "@/components/accordion-card";
import { useState } from "react";
import AchievementBadge from "../achievements-badge/achievements-badge";
import Counter from "@/components/counter";

function QualityGoal() {
  const t = useTranslations("panels");
  const [isActive, setIsActive] = useState(false);

  const isAllCertified = false;
  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane paddingLeft={8} width="100%">
            <Pane display="flex" alignItems="center" gap={16}>
              <AchievementBadge
                icone="/static/images/achievements/fiabilite.svg"
                title={t("badgeTitle")}
                completed={isAllCertified}
              />
              <Heading color={isAllCertified && "#317159"}>
                {t("quality")}
              </Heading>
            </Pane>
            <Pane width="100%">
              <StarRating value={3} />
              <Pane display="flex" justifyContent="center" alignItems="center">
                <Counter label={t("errorsDetected")} value={1} color="red" />
                <Counter
                  label={t("warningsDetected")}
                  value={2}
                  color="orange"
                />
              </Pane>
            </Pane>
          </Pane>
        }
        backgroundColor="white"
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
        caretPosition="start"
      >
        <Pane padding={8}>
          <Heading size={400}>{t("quality")}</Heading>
          <Text>
            {t.rich("qualityProse", {
              u: (chunks) => <u>{chunks}</u>,
              br: () => <br />,
            })}
          </Text>
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default QualityGoal;
