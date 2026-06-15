"use client";

import { useCallback, useContext } from "react";
import {
  Alert,
  Button,
  EnvelopeIcon,
  Heading,
  Pane,
  Paragraph,
  TextInput,
} from "evergreen-ui";

import { useTranslations } from "next-intl";

import { validateEmail } from "@/lib/utils/email";

import LocalStorageContext from "@/contexts/local-storage";

import { useInput } from "@/hooks/input";
import { BasesLocalesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { hasBeenSentRecently } from "@/lib/utils/date";

interface RecoverBALMailProps {
  defaultEmail?: string;
  baseLocaleId?: string;
  error?: string;
  isLoading?: boolean;
  setError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  onClose: () => void;
}

function RecoverBALMail({
  defaultEmail,
  error,
  isLoading,
  setError,
  setIsLoading,
  baseLocaleId,
  onClose,
}: RecoverBALMailProps) {
  const t = useTranslations("dialogs");
  const tc = useTranslations("common");
  const { recoveryEmailSent, setRecoveryEmailSent } =
    useContext(LocalStorageContext);
  const { pushToast } = useContext(LayoutContext);
  const [email, onEmailChange, resetEmail] = useInput(defaultEmail);

  const recoveryBasesLocales = useCallback(async () => {
    await BasesLocalesService.recoveryBasesLocales({
      email,
      id: baseLocaleId,
    });
    setRecoveryEmailSent(new Date());
    pushToast({
      title: t("emailSentTo", { email }),
      intent: "success",
    });
    setError(null);
  }, [email, baseLocaleId, setRecoveryEmailSent, pushToast, setError, t]);

  const handleConfirmEmail = useCallback(async () => {
    setIsLoading(true);

    if (hasBeenSentRecently(recoveryEmailSent)) {
      setIsLoading(false);
      onClose();
      pushToast({
        title: t("emailAlreadySent"),
        intent: "warning",
      });
      throw new Error(t("emailAlreadySent"));
    }

    try {
      await recoveryBasesLocales();
      resetEmail();
      onClose();
    } catch (error) {
      setError(error.body?.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    recoveryEmailSent,
    onClose,
    pushToast,
    recoveryBasesLocales,
    resetEmail,
    setError,
    t,
  ]);

  return (
    <Pane
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      marginTop={16}
      padding={16}
      background="white"
      borderRadius={8}
    >
      <Pane>
        <Pane display="flex" justifyContent="center" marginBottom={8}>
          <EnvelopeIcon size={66} color="gray800" />
        </Pane>
        <Heading is="h2" marginBottom={8}>
          {t("withYourEmail")}
        </Heading>
        <Paragraph marginBottom={20}>{t("emailWillBeSent")}</Paragraph>
        <TextInput
          display="block"
          type="email"
          width="100%"
          placeholder={t("emailPlaceholder")}
          maxWidth={400}
          value={email}
          onChange={onEmailChange}
        />
        {error && (
          <Alert marginTop={16} intent="danger">
            {error}
          </Alert>
        )}

        <Alert marginTop={24} marginBottom={8} intent="info" hasIcon={false}>
          <Paragraph color="blue600">
            {baseLocaleId ? t("recoverInfoBal") : t("recoverInfoList")}
          </Paragraph>
        </Alert>
      </Pane>
      <Button
        marginTop={16}
        onClick={handleConfirmEmail}
        appearance="primary"
        disabled={!validateEmail(email) || isLoading}
        alignSelf="flex-end"
      >
        {isLoading ? tc("loading") : t("receiveEmail")}
      </Button>
    </Pane>
  );
}

export default RecoverBALMail;
