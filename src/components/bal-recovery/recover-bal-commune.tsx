"use client";

import { useCallback, useState, useContext, useEffect } from "react";
import NextImage from "next/legacy/image";
import {
  Alert,
  Button,
  Heading,
  Pane,
  Paragraph,
  Spinner,
  Strong,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import LocalStorageContext from "@/contexts/local-storage";

import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import JurisdictionSelector from "@/components/jurisdiction-selector";
import { CommuneType } from "@/types/commune";
import { hasBeenSentRecently } from "@/lib/utils/date";
import { ApiDepotService } from "@/lib/api-depot";

interface RecoverBALCommuneProps {
  baseLocale?: BaseLocale;
  defaultCommune?: CommuneType | null;
  error?: string;
  isLoading?: boolean;
  setError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  onClose: () => void;
}

function RecoverBALCommune({
  baseLocale,
  defaultCommune,
  error,
  isLoading,
  setError,
  setIsLoading,
  onClose,
}: RecoverBALCommuneProps) {
  const t = useTranslations("dialogs");
  const tc = useTranslations("common");
  const { recoveryEmailCommuneSent, setRecoveryEmailCommuneSent } =
    useContext(LocalStorageContext);
  const { pushToast } = useContext(LayoutContext);
  const [commune, setCommune] = useState<CommuneType | null>(
    defaultCommune || null
  );
  const [emailsCommune, setEmailsCommune] = useState<string[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState<boolean>(false);
  const selectedCommuneCode = commune?.code || baseLocale?.commune;

  const fetchEmailsCommune = useCallback(async (codeCommune: string) => {
    setIsLoadingEmails(true);
    try {
      const emails = await ApiDepotService.getEmailsCommune(codeCommune);
      setEmailsCommune(emails);
    } finally {
      setIsLoadingEmails(false);
    }
  }, []);

  const selectCommune = useCallback(
    (nextCommune: CommuneType | null) => {
      setCommune(nextCommune);

      if (!nextCommune?.code) {
        setEmailsCommune([]);
        return;
      }

      fetchEmailsCommune(nextCommune.code);
    },
    [fetchEmailsCommune]
  );

  useEffect(() => {
    if (baseLocale?.id || !defaultCommune?.code) {
      return;
    }

    setCommune(defaultCommune);
    void fetchEmailsCommune(defaultCommune.code);
  }, [baseLocale?.id, defaultCommune, fetchEmailsCommune]);

  useEffect(() => {
    if (!baseLocale?.id) {
      return;
    }

    void fetchEmailsCommune(baseLocale.commune);
  }, [baseLocale?.id, baseLocale?.commune, fetchEmailsCommune]);

  useEffect(() => {
    if (!commune?.code) {
      return;
    }

    setError(null);
  }, [commune?.code, setError]);

  const recoveryCommune = useCallback(async () => {
    const codeCommune = commune?.code || baseLocale?.commune;
    await BasesLocalesService.recoveryBasesLocalesByCommune({
      codeCommune,
    });
    setRecoveryEmailCommuneSent(new Date());
    pushToast({
      title: t("emailSentToJurisdiction"),
      intent: "success",
    });
    setError(null);
  }, [
    commune?.code,
    baseLocale?.commune,
    setRecoveryEmailCommuneSent,
    pushToast,
    setError,
    t,
  ]);

  const handleConfirmCommune = useCallback(async () => {
    setIsLoading(true);

    if (hasBeenSentRecently(recoveryEmailCommuneSent)) {
      setIsLoading(false);
      onClose();
      pushToast({
        title: t("emailAlreadySent"),
        intent: "warning",
      });
      return;
    }

    try {
      await recoveryCommune();
      onClose();
    } catch (error) {
      setError(error.body?.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    recoveryEmailCommuneSent,
    onClose,
    pushToast,
    recoveryCommune,
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
          <NextImage
            width={66}
            height={66}
            src={"/static/images/mairie.svg"}
            alt={t("jurisdictionLogo")}
            style={{ filter: "grayscale(100%)" }}
          />
        </Pane>
        <Heading is="h2" marginBottom={8}>
          {t("withOfficialEmail")}
        </Heading>
        {!baseLocale?.id && (
          <Paragraph marginBottom={8}>{t("chooseJurisdiction")}</Paragraph>
        )}
        {!baseLocale && (
          <JurisdictionSelector
            commune={commune}
            setCommune={selectCommune}
            showSelectionHint={false}
          />
        )}
        {error && (
          <Alert marginTop={16} intent="danger">
            {error}
          </Alert>
        )}
        {isLoadingEmails && (
          <Pane marginTop={16} display="flex" alignItems="center" gap={8}>
            <Spinner />
            <Paragraph>{t("loadingEmails")}</Paragraph>
          </Pane>
        )}
        {!isLoadingEmails && emailsCommune.length > 0 && (
          <Alert marginTop={16} intent="info" hasIcon={false}>
            <Paragraph color="blue600">
              {t.rich("emailRecoveryInfo", {
                emails: emailsCommune.join(", "),
                s: (chunks) => <Strong>{chunks}</Strong>,
              })}
            </Paragraph>
          </Alert>
        )}
        {!isLoadingEmails && selectedCommuneCode && emailsCommune.length === 0 && (
          <Alert marginTop={16} intent="warning">
            {t("emailPreviewFallback")}
          </Alert>
        )}
      </Pane>
      {(!baseLocale || baseLocale.status === BaseLocale.status.PUBLISHED) && (
        <Button
          marginTop={16}
          onClick={handleConfirmCommune}
          appearance="primary"
          disabled={(!Boolean(baseLocale?.id) && !commune) || isLoading}
          alignSelf="flex-end"
        >
          {isLoading ? tc("loading") : t("receiveEmail")}
        </Button>
      )}
    </Pane>
  );
}

export default RecoverBALCommune;
