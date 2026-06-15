"use client";

import { useRouter } from "next/navigation";
import Image from "next/legacy/image";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("accessibility");
  const b = (chunks: React.ReactNode) => <Strong>{chunks}</Strong>;

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
            {t("title")}
          </Heading>
          <Pane display="flex" flexDirection="column" justifyContent="center">
            <Pane>
              <Paragraph lineHeight="200%">{t.rich("intro", { b })}</Paragraph>
              <UnorderedList>
                <ListItem>{t("action1")}</ListItem>
                <ListItem>{t("action2")}</ListItem>
                <ListItem>{t("action3")}</ListItem>
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
              <Text fontSize={16}>{t.rich("established", { b })}</Text>
            </Pane>
          </Pane>
        </Pane>

        <Pane display="flex" flexDirection="column" gap="1em">
          <Heading is="h3" size={800} color="#2952CC">
            {t("conformanceTitle")}
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
              {t("partiallyConformant")}
            </Text>
          </Pane>
          <Paragraph lineHeight="200%">
            {t.rich("conformanceBody", { b })}
          </Paragraph>
        </Pane>

        <Pane width="100%" display="flex" flexDirection="column" gap="1em">
          <Heading is="h3" size={800} color="#2952CC">
            {t("feedbackTitle")}
          </Heading>
          <Paragraph width="100%" lineHeight="200%">
            {t("feedbackBody")}
          </Paragraph>
          <Button
            onClick={async () => {
              await router.push("mailto:support@nap.us.gov");
            }}
            appearance="primary"
            iconBefore={EnvelopeIcon}
            width="fit-content"
          >
            {t("contactUs")}
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
            {t("remediesTitle")}
          </Heading>
          <Pane>
            <Paragraph>{t.rich("remediesBody", { b })}</Paragraph>
            <UnorderedList>
              <ListItem>
                <Link
                  href="https://www.ada.gov/file-a-complaint/"
                  textDecoration="underline"
                  color="neutral"
                  target="_blank"
                >
                  {t.rich("complaintDoj", { b })}
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.section508.gov/"
                  textDecoration="underline"
                  color="neutral"
                  target="_blank"
                >
                  {t.rich("learnSection508", { b })}
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                  textDecoration="underline"
                  color="neutral"
                  target="_blank"
                >
                  {t.rich("reviewWcag", { b })}
                </Link>
              </ListItem>
            </UnorderedList>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
}
