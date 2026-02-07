import { Heading, Pane, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";
import styles from "./welcome-illustration.module.css";

function WelcomeIllustration() {
  const t = useTranslations("home");

  return (
    <div className={styles["welcome-illustration"]}>
      <Pane
        padding={16}
        borderRadius={8}
        background="white"
        border="muted"
        elevation={1}
        position="relative"
        minWidth={360}
      >
        <div className={styles["illustration-wrapper"]}>
          <div />
        </div>

        <Heading is="h1" marginBottom={8}>
          {t("welcomeTitle")}
        </Heading>
        <Text>
          {t("welcomeDescription")}
        </Text>
      </Pane>
    </div>
  );
}

export default WelcomeIllustration;
