import { Tooltip, Button, ControlIcon } from "evergreen-ui";
import { PARCELS_AVAILABLE } from "@/components/map/layers/parcels";

interface ParcelControlProps {
  isParcelsDisplayed?: boolean;
  onClick: () => void;
}

function ParcelControl({
  isParcelsDisplayed,
  onClick,
}: ParcelControlProps) {
  return PARCELS_AVAILABLE ? (
    <Tooltip
      content={
        isParcelsDisplayed ? "Hide parcel data" : "Show parcel data"
      }
    >
      <Button
        style={{ padding: ".8em" }}
        onClick={onClick}
        title={
          isParcelsDisplayed ? "Hide parcel data" : "Show parcel data"
        }
      >
        <ControlIcon color={isParcelsDisplayed ? "selected" : "muted"} />
      </Button>
    </Tooltip>
  ) : (
    <Tooltip content="Parcel data is not configured — set NEXT_PUBLIC_PARCEL_TILES_URL">
      <Button
        style={{ padding: ".8em" }}
        cursor="not-allowed"
        title="Parcel data is not available"
      >
        <ControlIcon color="muted" />
      </Button>
    </Tooltip>
  );
}

export default ParcelControl;
