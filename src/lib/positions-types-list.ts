export const positionsTypesList = [
  { value: "entrance", name: "Entrance" },
  { value: "postal_delivery", name: "Postal delivery" },
  { value: "building", name: "Building" },
  { value: "staircase", name: "Staircase" },
  { value: "unit", name: "Unit" },
  { value: "parcel", name: "Parcel" },
  { value: "segment", name: "Road segment" },
  { value: "utility", name: "Utility" },
  { value: "rooftop", name: "Rooftop" },
  { value: "structure", name: "Structure" },
];

export const getPositionName = (value) => {
  const position = positionsTypesList.find(
    (position) => position.value === value
  );
  return position ? position.name : value;
};

// The API/BAL model stores position types as French enum values
// (Position.type, e.g. "entrée"), while the UI list and i18n keys are English.
// Normalize any incoming value to the English key used by the positionTypes
// translation namespace. Pass-through if already an English key or unknown.
const FRENCH_TO_POSITION_KEY: Record<string, string> = {
  "entrée": "entrance",
  "bâtiment": "building",
  "cage d’escalier": "staircase",
  "logement": "unit",
  "service technique": "utility",
  "délivrance postale": "postal_delivery",
  "parcelle": "parcel",
  "segment": "segment",
};

export const getPositionTypeKey = (value?: string): string => {
  if (!value) return "entrance";
  return FRENCH_TO_POSITION_KEY[value] ?? value;
};
