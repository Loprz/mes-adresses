import {
  Button,
  Heading,
  Pane,
  Paragraph,
  Strong,
  defaultTheme,
} from "evergreen-ui";
import Confetti from "react-confetti";
import { useTranslations } from "next-intl";
import style from "./animation-achievement.module.css";
import AchievementBadge from "@/components/bal/panel-goal/achievements-badge/achievements-badge";
import { useEffect, useState } from "react";
import { CommuneType } from "@/types/commune";

interface PublishedBalStepProps {
  commune: CommuneType;
  handleClose: () => void;
  dialogWidth: number;
}

function PublishedBalStep({
  commune,
  handleClose,
  dialogWidth,
}: PublishedBalStepProps) {
  const t = useTranslations("publishSuccess");
  const s = (chunks: React.ReactNode) => <Strong>{chunks}</Strong>;
  const [displayTitle, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimating(true);
    }, 1000);
  }, []);

  return (
    <>
      <Confetti
        className="confetti"
        recycle={false}
        numberOfPieces={500}
        tweenDuration={1}
        width={dialogWidth}
        style={{
          position: "absolute",
        }}
      />
      <Pane display="flex" flexDirection="column" gap={16}>
        <Pane
          background="white"
          paddingY={32}
          paddingX={16}
          borderRadius={8}
          height={128}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap={32}
        >
          {displayTitle && (
            <AchievementBadge
              icone="/static/images/achievements/published-bal.svg"
              title={t("publication")}
              completed={true}
              width={64}
              height={64}
              className={style.tada}
            />
          )}
          {displayTitle && (
            <Heading
              is="h2"
              textAlign="center"
              size={600}
              className={style.slideInRight}
              color={defaultTheme.colors.green700}
            >
              {t("successHeading")}
            </Heading>
          )}
        </Pane>

        <Pane background="white" padding={24} borderRadius={8}>
          <Heading is="h3" marginBottom={8}>
            {t("thanksToPublication")}
          </Heading>
          <Paragraph is="li" marginBottom={8}>
            {t.rich("benefitUploaded", {
              s,
              link: (chunks) => (
                <a
                  href={`https://nationaladdressplatform.us/jurisdiction/${commune.code}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {chunks}
                </a>
              ),
            })}
          </Paragraph>
          <Paragraph is="li" marginBottom={8}>
            {t.rich("benefitStandards", {
              link: (chunks) => (
                <a
                  href="https://nationaladdressplatform.us/standards"
                  target="_blank"
                  rel="noreferrer"
                >
                  {chunks}
                </a>
              ),
            })}
          </Paragraph>
          <Paragraph is="li" marginBottom={8}>
            {t.rich("benefitReports", { s })}
          </Paragraph>
          <Paragraph is="li" marginBottom={16}>
            {t.rich("benefitCertificates", { s })}
          </Paragraph>
          <Heading is="h3" marginBottom={8}>
            {t("nextGoal")}
          </Heading>
          <Paragraph>
            {t.rich("nextGoalText", {
              s,
              link: (chunks) => (
                <a
                  href="https://nationaladdressplatform.us/guide/certification"
                  target="_blank"
                  rel="noreferrer"
                >
                  {chunks}
                </a>
              ),
            })}
          </Paragraph>
        </Pane>

        <Pane display="flex" flexDirection="row" justifyContent="end" gap={16}>
          <Button intent="primary" appearance="primary" onClick={handleClose}>
            {t("continueAddressing")}
          </Button>
        </Pane>
      </Pane>
    </>
  );
}

export default PublishedBalStep;
