import React, { useEffect, useMemo, useState } from "react";
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
        setError(
          "Unable to retrieve registered emails for this jurisdiction. Please try again."
        );
      }
      setIsLoading(false);
    }

    if (baseLocaleId) {
      fetchRegisteredEmails();
    }
  }, [baseLocaleId, codeCommune, setEmailSelected]);

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
      <Alert intent="danger" title="Error loading emails" marginTop={16}>
        <Text>{error}</Text>
      </Alert>
    );
  }

  return (
    <>
      <Pane display="flex" flexDirection="column" alignItems="center">
        <Heading is="h5">Verify via official jurisdiction email</Heading>

        {emailsCommune.length === 0 && (
          <Alert
            intent="warning"
            title="No registered emails found"
            marginTop={16}
            width="100%"
          >
            <Text>
              No official email addresses are registered for this jurisdiction
              yet. Please contact{" "}
              <a href="mailto:support@nationaladdressplatform.us">
                support@nationaladdressplatform.us
              </a>{" "}
              to get your jurisdiction set up.
            </Text>
          </Alert>
        )}

        {emailsCommune.length === 1 && (
          <Text height={40} verticalAlign="middle" paddingTop={8}>
            A verification code will be sent to:{" "}
            <strong>{emailSelected}</strong>
          </Text>
        )}
        {emailsCommune.length > 1 && (
          <SelectField
            label="Select the email address to receive the verification code"
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
            Send verification code
          </Text>
        </Button>
      </Pane>

      {emailsCommune.length > 0 && (
        <Alert
          title="Is this email incorrect or outdated?"
          width="100%"
          marginTop={16}
          textAlign="left"
          overflow="auto"
        >
          <Text>
            Contact{" "}
            <a href="mailto:support@nationaladdressplatform.us">
              support@nationaladdressplatform.us
            </a>{" "}
            to update the registered email for your jurisdiction.
          </Text>
        </Alert>
      )}
    </>
  );
}

export default CodeEmail;
