import { Pane, Heading, Strong, Text, Link } from "evergreen-ui";
import { useTranslations } from "next-intl";
import styles from "./button-pro-connect.module.css";

interface ProConnectProps {
  handleStrategy: () => void;
}

function ProConnect({ handleStrategy }: ProConnectProps) {
  const t = useTranslations("proConnect");
  return (
    <>
      <Pane>
        <Heading is="h5" height={60} textAlign="center">
          {t("useAccount")}
        </Heading>
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={16}
        marginBottom={32}
      >
        <button
          className={styles["proconnect-button"]}
          style={{ cursor: "pointer" }}
          onClick={handleStrategy}
        >
          <span className={styles["proconnect-sr-only"]}>{t("signIn")}</span>
        </button>
      </Pane>
      <Link
        href="https://proconnect.crisp.help/fr/article/utiliser-proconnect-au-sein-dune-collectivite-ou-dune-mairie-1mobnb6/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text textDecoration="underline">
          <Strong>{t("tutorial")}</Strong>
        </Text>
      </Link>
    </>
  );
}

export default ProConnect;
