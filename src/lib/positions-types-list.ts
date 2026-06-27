import { Position } from "@/lib/openapi-api-bal";

// The BAL API stores and returns position types as French enum values
// (Position.type, e.g. "entrée"), while the UI i18n catalog (the
// `positionTypes` namespace) is keyed by English slugs. This module is the
// single bridge between the two:
//   - `positionsTypesList` drives the <Select> options. Each option's `value`
//     is the API enum value (French) so it round-trips correctly to/from the
//     API; its visible label is rendered from the `positionTypes` namespace
//     using `key` (e.g. tp(option.key)).
//   - `getPositionTypeKey()` normalizes any incoming value (a French enum
//     value, or an already-English key) to the English i18n key, so display
//     code can do tp(getPositionTypeKey(value)).

export type PositionTypeOption = { value: Position.type; key: string };

export const positionsTypesList: PositionTypeOption[] = [
  { value: Position.type.ENTR_E, key: "entrance" },
  { value: Position.type.D_LIVRANCE_POSTALE, key: "postal_delivery" },
  { value: Position.type.B_TIMENT, key: "building" },
  { value: Position.type.CAGE_D_ESCALIER, key: "staircase" },
  { value: Position.type.LOGEMENT, key: "unit" },
  { value: Position.type.PARCELLE, key: "parcel" },
  { value: Position.type.SEGMENT, key: "segment" },
  { value: Position.type.SERVICE_TECHNIQUE, key: "utility" },
];

const FRENCH_TO_POSITION_KEY: Record<string, string> = {
  [Position.type.ENTR_E]: "entrance",
  [Position.type.B_TIMENT]: "building",
  [Position.type.CAGE_D_ESCALIER]: "staircase",
  [Position.type.LOGEMENT]: "unit",
  [Position.type.SERVICE_TECHNIQUE]: "utility",
  [Position.type.D_LIVRANCE_POSTALE]: "postal_delivery",
  [Position.type.PARCELLE]: "parcel",
  [Position.type.SEGMENT]: "segment",
};

export const getPositionTypeKey = (value?: string): string => {
  if (!value) return "entrance";
  return FRENCH_TO_POSITION_KEY[value] ?? value;
};
