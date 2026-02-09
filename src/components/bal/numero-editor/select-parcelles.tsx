import { useContext, useEffect } from "react";
import {
  Pane,
  Button,
  Badge,
  Alert,
  TrashIcon,
  ControlIcon,
  Text,
} from "evergreen-ui";

import ParcellesContext from "@/contexts/parcelles";
import MapContext from "@/contexts/map";

import InputLabel from "@/components/input-label";

interface SelectParcellesProps {
  initialParcelles: string[];
  isToponyme?: boolean;
}

function SelectParcelles({
  initialParcelles = [],
  isToponyme,
}: SelectParcellesProps) {
  const { isParcelsDisplayed, setIsParcelsDisplayed } =
    useContext(MapContext);
  const {
    highlightedParcelles,
    setHighlightedParcelles,
    setIsParcelleSelectionEnabled,
    hoveredParcelles,
    handleHoveredParcelles,
    handleParcelles,
  } = useContext(ParcellesContext);
  const addressType = isToponyme ? "place name" : "number";

  useEffect(() => {
    setHighlightedParcelles(initialParcelles);
    setIsParcelleSelectionEnabled(true);

    return () => {
      setIsParcelleSelectionEnabled(false);
    };
  }, [setHighlightedParcelles, setIsParcelleSelectionEnabled]);

  return (
    <Pane display="flex" flexDirection="column">
      <InputLabel
        title="Parcel data"
        help={`From the map, click on the parcels you want to add to the ${addressType}. By specifying the parcels associated with this address, you accelerate its reuse by many services including mail carriers, fiber providers, and GPS services.`}
      />
      {highlightedParcelles.length > 0 ? (
        <Pane display="grid" gridTemplateColumns="1fr 1fr 1fr">
          {highlightedParcelles.map((parcelle) => {
            const isHovered = hoveredParcelles.some(
              ({ id }) => id === parcelle
            );
            return (
              <Badge
                key={parcelle}
                isInteractive
                color={isHovered ? "red" : "green"}
                margin={4}
                onClick={() => handleParcelles([parcelle])}
                onMouseEnter={() => handleHoveredParcelles([parcelle])}
                onMouseLeave={() => handleHoveredParcelles([])}
              >
                {parcelle}
                {isHovered && (
                  <TrashIcon
                    marginLeft={4}
                    size={14}
                    color="danger"
                    verticalAlign="text-bottom"
                  />
                )}
              </Badge>
            );
          })}
        </Pane>
      ) : (
        <Pane>
          <Alert marginTop={8}>
            <Text>
              On the map, click on the parcels you want to add to the{" "}
              {addressType}.
            </Text>
          </Alert>
        </Pane>
      )}

      <Button
        type="button"
        display="flex"
        justifyContent="center"
        marginTop={8}
        iconAfter={ControlIcon}
        onClick={() => setIsParcelsDisplayed(!isParcelsDisplayed)}
      >
        {isParcelsDisplayed ? "Hide" : "Show"} parcel data
      </Button>
    </Pane>
  );
}

export default SelectParcelles;
