"use client";

import { useRouter } from "next/navigation";
import Image from "next/legacy/image";

import {
  Pane,
  Heading,
  Paragraph,
  Text,
  Strong,
  UnorderedList,
  ListItem,
  Button,
  EnvelopeIcon,
  Link,
} from "evergreen-ui";

export default function Accessibility() {
  const router = useRouter();

  return (
    <>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="4em"
        marginX="6em"
        marginTop="2em"
        fontSize={14}
      >
        <Pane width="100%" maxWidth={500} textAlign="center">
          <Image
            src="/static/images/accessibilite-illustration.svg"
            layout="responsive"
            height={100}
            width={500}
            alt=""
          />
        </Pane>

        <Pane gap="1em" display="flex" flexDirection="column">
          <Heading is="h2" size={900} color="#2952CC">
            Accessibility Statement
          </Heading>
          <Pane display="flex" flexDirection="column" justifyContent="center">
            <Pane>
              <Paragraph lineHeight="200%">
                The <Strong>National Address Platform</Strong> is committed to
                ensuring digital accessibility for people with disabilities. We
                strive to meet the requirements of{" "}
                <Strong>Section 508 of the Rehabilitation Act</Strong> and the{" "}
                <Strong>
                  Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                </Strong>
                . To this end, we are implementing the following actions:
              </Paragraph>
              <UnorderedList>
                <ListItem>Provide an accessible web experience.</ListItem>
                <ListItem>
                  Pay attention to accessibility of address data and
                  documentation.
                </ListItem>
                <ListItem>
                  Continuously test and improve platform accessibility.
                </ListItem>
              </UnorderedList>
            </Pane>

            <Pane
              width="fit-content"
              padding="1em"
              background="#EBF0FF"
              border="solid 3px #2952CC"
              borderRadius={5}
              marginTop={20}
            >
              <Text fontSize={16}>
                This accessibility statement was established on{" "}
                <Strong>02/01/2026</Strong> and applies to the{" "}
                <Strong>National Address Platform editor</Strong>.
              </Text>
            </Pane>
          </Pane>
        </Pane>

        <Pane display="flex" flexDirection="column" gap="1em">
          <Heading is="h3" size={800} color="#2952CC">
            Conformance Status
          </Heading>
          <Pane
            padding="2em"
            background="#FFF8E1"
            border="solid 3px #F9A825"
            borderRadius={5}
            textAlign="center"
            width="fit-content"
          >
            <Text color="#F57F17" fontSize={22} fontWeight={600}>
              Partially Conformant
            </Text>
          </Pane>
          <Paragraph lineHeight="200%">
            The <Strong>National Address Platform</Strong> is partially
            conformant with WCAG 2.1 Level AA. A comprehensive accessibility
            audit is planned. We are actively working to identify and address
            any accessibility gaps.
          </Paragraph>
        </Pane>

        <Pane width="100%" display="flex" flexDirection="column" gap="1em">
          <Heading is="h3" size={800} color="#2952CC">
            Feedback &amp; Contact
          </Heading>
          <Paragraph width="100%" lineHeight="200%">
            If you are unable to access any content or service on this platform,
            please contact our team so we can direct you to an accessible
            alternative or provide the content in another format.
          </Paragraph>
          <Button
            onClick={async () => {
              await router.push("mailto:support@nap.us.gov");
            }}
            appearance="primary"
            iconBefore={EnvelopeIcon}
            width="fit-content"
          >
            Contact Us
          </Button>
        </Pane>

        <Pane
          width="100%"
          display="flex"
          flexDirection="column"
          gap="1em"
          marginBottom="2em"
        >
          <Heading is="h3" size={800} color="#2952CC">
            Remedies
          </Heading>
          <Pane>
            <Paragraph>
              If you encounter an{" "}
              <Strong>accessibility barrier</Strong> preventing you from
              accessing content or functionality on this platform, and you have
              contacted us without receiving a satisfactory response, you have
              the right to file a complaint.
            </Paragraph>
            <UnorderedList>
              <ListItem>
                <Link
                  href="https://www.ada.gov/file-a-complaint/"
                  textDecoration="underline"
                  color="neutral"
                  target="_blank"
                >
                  File a complaint with the{" "}
                  <Strong>U.S. Department of Justice</Strong> (ADA).
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.section508.gov/"
                  textDecoration="underline"
                  color="neutral"
                  target="_blank"
                >
                  Learn more about <Strong>Section 508</Strong> requirements.
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                  textDecoration="underline"
                  color="neutral"
                  target="_blank"
                >
                  Review <Strong>WCAG 2.1</Strong> guidelines.
                </Link>
              </ListItem>
            </UnorderedList>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
}
