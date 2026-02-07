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
