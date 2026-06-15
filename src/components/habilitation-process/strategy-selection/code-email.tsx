import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Pane,
  Heading,
  Button,
  Alert,
  Text,
  EnvelopeIcon,
  SelectField,
  Spinner,
} from "evergreen-ui";

import { HabilitationService } from "@/lib/openapi-api-bal";

const SUPPORT_EMAIL = "support@nationaladdressplatform.us";

function isEmail(email: string) {
  const regexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(String(email).toLowerCase());
}

interface CodeEmailProps {
  baseLocaleId: string;
  codeCommune: string;
  emailSelected: string;
  setEmailSelected: React.Dispatch<React.SetStateAction<string>>;
  handleStrategy: () => void;
}

function CodeEmail({
  baseLocaleId,
  codeCommune,
  emailSelected,
  setEmailSelected,
  handleStrategy,
}: CodeEmailProps) {
  const t = useTranslations("codeEmail");
  const [emailsCommune, setEmailsCommune] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegisteredEmails() {
      setIsLoading(true);
      setError(null);
      try {
        const emails =
          await HabilitationService.getRegisteredEmails(baseLocaleId);
        setEmailsCommune(emails);
        if (emails.length > 0) {
          setEmailSelected(emails[0]);
        }
      } catch (err: any) {
        console.error("Failed to fetch registered emails:", err);
        setError(t("loadError"));
      }
      setIsLoading(false);
    }

    if (baseLocaleId) {
      fetchRegisteredEmails();
    }
  }, [baseLocaleId, codeCommune, setEmailSelected, t]);

  const isValidEmailSelected = useMemo(() => {
    return emailSelected ? isEmail(emailSelected) : false;
  }, [emailSelected]);

  if (isLoading) {
    return (
      <Pane
        display="flex"
        alignItems="center"
        justifyContent="center"
        flex={1}
        padding={32}
      >
        <Spinner />
      </Pane>
    );
  }

  if (error) {
    return (
      <Alert intent="danger" title={t("errorTitle")} marginTop={16}>
        <Text>{error}</Text>
      </Alert>
    );
  }

  return (
    <>
      <Pane display="flex" flexDirection="column" alignItems="center">
        <Heading is="h5">{t("heading")}</Heading>

        {emailsCommune.length === 0 && (
          <Alert
            intent="warning"
            title={t("noEmailsTitle")}
            marginTop={16}
            width="100%"
          >
            <Text>
              {t.rich("noEmailsBody", {
                link: (chunks) => (
                  <a href={`mailto:${SUPPORT_EMAIL}`}>{chunks}</a>
                ),
              })}
            </Text>
          </Alert>
        )}

        {emailsCommune.length === 1 && (
          <Text height={40} verticalAlign="middle" paddingTop={8}>
            {t.rich("codeSentTo", {
              email: emailSelected,
              b: (chunks) => <strong>{chunks}</strong>,
            })}
          </Text>
        )}
        {emailsCommune.length > 1 && (
          <SelectField
            label={t("selectEmail")}
            marginTop={8}
            marginBottom={0}
            value={emailSelected}
            onChange={({ target }) => {
              setEmailSelected(target.value);
            }}
          >
            {emailsCommune.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </SelectField>
        )}
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={16}
        marginBottom={16}
      >
        <Button
          disabled={!emailSelected || !isValidEmailSelected}
          cursor={emailSelected ? "pointer" : "not-allowed"}
          appearance="primary"
          onClick={handleStrategy}
          width={260}
          height={56}
          borderRadius={4}
          lineHeight="18px"
          iconBefore={<EnvelopeIcon size={24} />}
        >
          <Text
            whiteSpace="pre-line"
            color="white"
            fontSize={16}
            textAlign="left"
          >
            {t("sendCode")}
          </Text>
        </Button>
      </Pane>

      {emailsCommune.length > 0 && (
        <Alert
          title={t("incorrectTitle")}
          width="100%"
          marginTop={16}
          textAlign="left"
          overflow="auto"
        >
          <Text>
            {t.rich("incorrectBody", {
              link: (chunks) => <a href={`mailto:${SUPPORT_EMAIL}`}>{chunks}</a>,
            })}
          </Text>
        </Alert>
      )}
    </>
  );
}

export default CodeEmail;
