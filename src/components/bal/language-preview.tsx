import Image from "next/legacy/image";
import {
  Pane,
  UnorderedList,
  ListItem,
  Tooltip,
  Position,
  HelpIcon,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import languesRegionales from "@ban-team/shared-data/langues-regionales.json";

import availableFlags from "@/available-flags.json";

interface LanguagePreviewProps {
  nomsAlt: Record<string, string>;
}

function LanguagePreview({ nomsAlt }: LanguagePreviewProps) {
  const t = useTranslations("panels");
  const isFlagExist = availableFlags.includes(Object.keys(nomsAlt)[0]);
  const foundLangueRegionale = languesRegionales.find(
    (lr) => lr.code === Object.keys(nomsAlt)[0]
  );

  return Object.keys(nomsAlt).length > 1 ? (
    <Pane
      fontStyle="italic"
      fontWeight="lighter"
      display="flex"
      gap={5}
      alignItems="center"
      fontSize={13}
    >
      <Tooltip
        content={
          <UnorderedList
            display="flex"
            flexDirection="column"
            padding={0}
            margin={0}
          >
            {Object.keys(nomsAlt).map((language) => {
              const foundLangueRegionale = languesRegionales.find(
                (lr) => lr.code === language
              );

              return (
                <ListItem
                  key={language}
                  color="white"
                  listStyleType="hidden"
                  display="grid"
                  alignItems="start"
                  gridTemplateColumns="22px 1fr"
                  gap={8}
                  marginLeft={-15}
                >
                  <Image
                    src={
                      isFlagExist
                        ? `/static/images/flags/${language}.svg`
                        : "/images/icons/flags/ntr.svg"
                    }
                    height={22}
                    width={22}
                    alt={
                      foundLangueRegionale
                        ? t("streetNameIn", {
                            language: foundLangueRegionale.label,
                          })
                        : t("langNotSupported")
                    }
                  />
                  {nomsAlt[language]}
                </ListItem>
              );
            })}
          </UnorderedList>
        }
        position={Position.BOTTOM_LEFT}
      >
        <HelpIcon size={16} />
      </Tooltip>
      {t("regionalAlternatives")}
    </Pane>
  ) : (
    <Pane
      fontStyle="italic"
      fontWeight="lighter"
      display="flex"
      gap={8}
      alignItems="center"
    >
      <Image
        src={
          isFlagExist
            ? `/static/images/flags/${Object.keys(nomsAlt)[0]}.svg`
            : "/static/images/flags/ntr.svg"
        }
        height={18}
        width={18}
        alt={
          foundLangueRegionale
            ? t("streetNameIn", { language: foundLangueRegionale.label })
            : t("langNotDetected")
        }
      />
      <Pane fontWeight="lighter" fontSize={14}>
        {Object.values(nomsAlt)[0]}
      </Pane>
    </Pane>
  );
}

export default LanguagePreview;
