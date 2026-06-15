import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";
import { trainingTypeMap } from "@/lib/bal-admin";
import { EventType } from "@/lib/bal-admin/type";
import { getDateFnsLocale, getFullDate } from "@/lib/utils/date";
import {
  ArrowRightIcon,
  Badge,
  Button,
  CalendarIcon,
  Heading,
  Icon,
  Pane,
  Text,
} from "evergreen-ui";
import { useContext } from "react";
import { useTranslations, useLocale } from "next-intl";

interface TrainingTabProps {
  nextTrainings: EventType[];
}

function TrainingTab({ nextTrainings }: TrainingTabProps) {
  const t = useTranslations("homeDrawer");
  const locale = useLocale();
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  return (
    <Pane display="flex" flexDirection="column">
      {nextTrainings.length === 0 && (
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={1}
          padding={10}
        >
          <Text>{t("noEvents")}</Text>
        </Pane>
      )}
      <Pane is="ul" listStyle="none" padding={0} margin={0}>
        {nextTrainings.length > 0 &&
          nextTrainings.map(
            ({ id, type, date, startHour, endHour, description, href }, index) => {
              const typeInfo =
                trainingTypeMap[type] ?? ({
                  color: "neutral" as const,
                  label: type ?? t("eventFallback"),
                });
              return (
              <Pane
                key={id}
                is="li"
                display="flex"
                flexDirection="column"
                padding={10}
                gap={8}
                justifyContent="space-between"
                borderBottom={
                  index === nextTrainings.length - 1 ? "none" : "1px solid #ccc"
                }
              >
                <Badge color={typeInfo.color} width="fit-content">
                  {typeInfo.label}
                </Badge>
                <Heading display="flex" alignItems="center" size={400}>
                  <Icon icon={CalendarIcon} marginRight={5} />
                  <span>{getFullDate(new Date(date), getDateFnsLocale(locale))}</span>
                  <Pane marginX={5}>|</Pane>
                  <span>
                    {startHour} - {endHour}
                  </span>
                </Heading>
                <Text>{description}</Text>
                <Button
                  is="a"
                  iconAfter={ArrowRightIcon}
                  href={
                    href ??
                    `${process.env.NEXT_PUBLIC_ADRESSE_URL}/formation-en-ligne#open-event-modal-${id}`
                  }
                  onClick={() => {
                    matomoTrackEvent(
                      MatomoEventCategory.HOME_PAGE,
                      MatomoEventAction[MatomoEventCategory.HOME_PAGE]
                        .REGISTER_TO_WEBINAIRE
                    );
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  alignSelf="flex-end"
                  width="fit-content"
                >
                  {t("register")}
                </Button>
              </Pane>
            );
            }
          )}
      </Pane>
      <Button
        is="a"
        iconAfter={ArrowRightIcon}
        href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/evenements`}
        target="_blank"
        rel="noopener noreferrer"
        alignSelf="center"
        width="fit-content"
        margin={10}
      >
        {t("seeAllEvents")}
      </Button>
    </Pane>
  );
}

export default TrainingTab;
