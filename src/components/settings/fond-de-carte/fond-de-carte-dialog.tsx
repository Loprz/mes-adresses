import { Alert, Dialog, Pane } from "evergreen-ui";
import { BaseLocale } from "@/lib/openapi-api-bal";
import FondDeCarteForm from "./fond-de-carte-form";

interface FondDeCarteDialogProps {
  isShown: boolean;
  onCloseComplete: () => void;
}

export function FondDeCarteDialog({
  isShown,
  onCloseComplete,
}: FondDeCarteDialogProps) {
  return (
    <Dialog
      isShown={isShown}
      title="Add map background"
      hasFooter={false}
      onCloseComplete={onCloseComplete}
    >
      <Pane paddingBottom={16}>
        <Alert
          marginBottom={8}
          intent="none"
          title="How to add your own map backgrounds?"
        >
          Only WMTS or WMS service URLs are supported. The data
          must be raster type and images must be 256x256 pixels. See
          the example below.
        </Alert>
        <FondDeCarteForm />
      </Pane>
    </Dialog>
  );
}

export default FondDeCarteDialog;
