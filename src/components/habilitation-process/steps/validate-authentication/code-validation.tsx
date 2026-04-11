import React, { useEffect } from "react";
import NextImage from "next/legacy/image";
import {
  Pane,
  Heading,
  Text,
  Link,
  Alert,
  UnorderedList,
  ListItem,
  EnvelopeIcon,
  SendMessageIcon,
  EyeOpenIcon,
} from "evergreen-ui";

import PinField, { usePinField } from "react-pin-field";

interface CodeValidationProps {
  email: string;
  handleSubmit: (code: string) => Promise<void>;
  resendCode: () => Promise<boolean>;
  flagURL: string | null;
}

function CodeValidation({
  email,
  handleSubmit,
  resendCode,
  flagURL,
}: CodeValidationProps) {
  const handler = usePinField();

  const handleCodeComplete = (code: string) => {
    handler.setValue("");
    handleSubmit(code);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (handler.refs.current && handler.refs.current.length > 0) {
        handler.refs.current[0]?.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [handler.refs]);

  return (
    <Pane>
      <Pane
        display="flex"
        alignItems="center"
        flexDirection="column"
        background="white"
        padding={16}
        borderRadius={8}
        marginBottom={16}
      >
        <NextImage
          width={66}
          height={66}
          src={flagURL || "/static/images/mairie.svg"}
          alt="jurisdiction logo"
        />
        <Heading is="h2" marginTop={16}>
          Jurisdiction Authentication
        </Heading>
      </Pane>

      <Pane
        display="flex"
        flexDirection="column"
        background="white"
        padding={16}
        borderRadius={8}
        marginBottom={16}
      >
        <Heading is="h3" textAlign="center">
          Enter the code that was sent to your email address: {email}
        </Heading>
        <Pane display="flex" justifyContent="center" gap={8} marginY={32}>
          <PinField
            length={6}
            handler={handler}
            onComplete={handleCodeComplete}
            style={{
              height: "76px",
              width: "76px",
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "bold",
              padding: "16px",
            }}
          />
        </Pane>
        <Alert
          title="The code will no longer be valid if you close the window"
          marginBottom={16}
          textAlign="left"
        />
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        background="white"
        padding={16}
        borderRadius={8}
        marginBottom={16}
      >
        <Heading>Didn&apos;t receive your code?</Heading>
        <UnorderedList>
          <ListItem icon={EyeOpenIcon}>
            <Text size={400}>Check your spam folder</Text>
          </ListItem>

          <ListItem icon={EnvelopeIcon}>
            <Text>
              Add the sender address to your email whitelist in your spam filter
              settings
            </Text>
          </ListItem>

          <ListItem icon={SendMessageIcon}>
            <Pane cursor="pointer" onClick={resendCode}>
              <Link>Resend the code</Link>
            </Pane>
          </ListItem>
        </UnorderedList>
      </Pane>
    </Pane>
  );
}

export default CodeValidation;
