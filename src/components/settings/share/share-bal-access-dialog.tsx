import { Alert, Dialog, MobilePhoneIcon, Pane, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";
import ShareClipBoard from "./share-clipboard";
import ShareQRCode from "./share-qr-code";
import { BaseLocale } from "@/lib/openapi-api-bal";

interface ShareEmailsDialogProps {
  baseLocale: BaseLocale;
  isShown: boolean;
  token: string;
  onCloseComplete: () => void;
}

const EDITEUR_URL =
  process.env.NEXT_PUBLIC_EDITEUR_URL || "https://mes-adresses.data.gouv.fr";

export function ShareBALAccessDialog({
  baseLocale,
  isShown,
  token,
  onCloseComplete,
}: ShareEmailsDialogProps) {
  const t = useTranslations("settings");
  const urlAdminBal = `${EDITEUR_URL}/bal/${baseLocale.id}/${token}`;

  return (
    <Dialog
      isShown={isShown}
      title={t("shareAccessTitle")}
      hasFooter={false}
      onCloseComplete={onCloseComplete}
    >
      <Pane paddingBottom={16}>
        <ShareClipBoard url={urlAdminBal} />
        <br />
        <ShareQRCode url={urlAdminBal} />
        <Alert intent="success" marginTop={12} hasIcon={false}>
          <Pane display="flex" alignItems="center">
            <MobilePhoneIcon size={24} marginRight={8} />
            <Text>{t("worksOnPhone")}</Text>
          </Pane>
        </Alert>
      </Pane>
    </Dialog>
  );
}
