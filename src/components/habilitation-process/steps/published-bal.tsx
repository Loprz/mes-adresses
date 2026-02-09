import {
  Button,
  Heading,
  Pane,
  Paragraph,
  Strong,
  defaultTheme,
} from "evergreen-ui";
import Confetti from "react-confetti";
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
              title="Publication"
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
              Your Local Address Base has been successfully published
            </Heading>
          )}
        </Pane>

        <Pane background="white" padding={24} borderRadius={8}>
          <Heading is="h3" marginBottom={8}>
            Thanks to publication
          </Heading>
          <Paragraph is="li" marginBottom={8}>
            All{" "}
            <Strong>modifications will automatically be uploaded</Strong> to the{" "}
            <a
              href={`https://nationaladdressplatform.us/jurisdiction/${commune.code}`}
              target="_blank"
              rel="noreferrer"
            >
              National Address Database.
            </a>
          </Paragraph>
          <Paragraph is="li" marginBottom={8}>
            Your jurisdiction has complied with the{" "}
            <a
              href="https://nationaladdressplatform.us/standards"
              target="_blank"
              rel="noreferrer"
            >
              applicable addressing standards
            </a>
            .
          </Paragraph>
          <Paragraph is="li" marginBottom={8}>
            Emergency services, government agencies, and the public can
            now <Strong>submit reports</Strong> to help you
            improve the reliability of your addresses.
          </Paragraph>
          <Paragraph is="li" marginBottom={16}>
            You can now{" "}
            <Strong>download numbering certificates</Strong> for
            streets and address numbers.
          </Paragraph>
          <Heading is="h3" marginBottom={8}>
            Next goal
          </Heading>
          <Paragraph>
            Improve your address reliability thanks to{" "}
            <a
              href="https://nationaladdressplatform.us/guide/certification"
              target="_blank"
              rel="noreferrer"
            >
              certification
            </a>
            . This helps highlight your work and{" "}
            <Strong>facilitate data reuse</Strong>.
          </Paragraph>
        </Pane>

        <Pane display="flex" flexDirection="row" justifyContent="end" gap={16}>
          <Button intent="primary" appearance="primary" onClick={handleClose}>
            Continue addressing
          </Button>
        </Pane>
      </Pane>
    </>
  );
}

export default PublishedBalStep;
