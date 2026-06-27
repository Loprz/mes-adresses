import { Position } from "@/lib/openapi-api-bal";
import { PositionDTO, Signalement } from "@/lib/openapi-signalement";
import { getPositionTypeKey } from "@/lib/positions-types-list";
import { useTranslations } from "next-intl";
import {
  Heading,
  Pane,
  Small,
  Strong,
  Text,
  Badge,
  MinusIcon,
  PlusIcon,
} from "evergreen-ui";
import React from "react";

interface SignalementPositionProps {
  positions: PositionDTO[] | Position[];
  signalementType?: Signalement.type;
}

export function SignalementPosition({
  positions,
  signalementType,
}: SignalementPositionProps) {
  const tp = useTranslations("positionTypes");
  const ts = useTranslations("signalement");

  return (
    <Pane marginTop={10} padding={8} borderRadius={8} className="glass-pane">
      <Text fontWeight="bold">
        {ts("position.label", { count: positions.length })}
      </Text>
      <Pane display="grid" gridTemplateColumns="3fr 1fr 1fr" rowGap={6}>
        <Pane />
        <Strong fontWeight={200} fontSize="small">
          {ts("position.lat")}
        </Strong>
        <Strong fontWeight={200} fontSize="small">
          {ts("position.long")}
        </Strong>
        {positions.map(({ type, point }, index) => (
          <React.Fragment key={index}>
            {signalementType === Signalement.type.LOCATION_TO_CREATE ? (
              <Badge
                display="flex"
                alignItems="center"
                width="fit-content"
                size="small"
                marginY={2}
                color="teal"
              >
                <PlusIcon marginRight={4} />
                {tp(getPositionTypeKey(type))}
              </Badge>
            ) : signalementType === Signalement.type.LOCATION_TO_DELETE ? (
              <Badge
                display="flex"
                alignItems="center"
                width="fit-content"
                size="small"
                marginY={2}
                color="orange"
              >
                <MinusIcon marginRight={4} />
                {tp(getPositionTypeKey(type))}
              </Badge>
            ) : (
              <Badge width="fit-content" marginY={2} color="blue">
                {tp(getPositionTypeKey(type))}
              </Badge>
            )}
            <Heading size={100} marginY="auto">
              <Small>{point.coordinates[1].toFixed(6)}</Small>
            </Heading>
            <Heading size={100} marginY="auto">
              <Small>{point.coordinates[0].toFixed(6)}</Small>
            </Heading>
          </React.Fragment>
        ))}
      </Pane>
    </Pane>
  );
}
