import {
  useState,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { Pane, Button, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";

import AddNumerosWithVoie from "./add-numeros-with-voie";
import AddNumerosWithPolygon from "./add-numeros-with-polygon";
import DrawContext from "@/contexts/draw";

interface AddNumerosProps {
  numerosIds: string[];
  setNumerosIds: Dispatch<SetStateAction<string[]>>;
  isLoading?: boolean;
}

function AddNumerosInput({ numerosIds, setNumerosIds }: AddNumerosProps) {
  const t = useTranslations("lists");
  const tc = useTranslations("common");
  const [typeSelection, setTypeSelection] = useState<"voie" | "polygon">(null);
  const { drawMode, setDrawMode } = useContext(DrawContext);

  useEffect(() => {
    if (!typeSelection && drawMode) {
      setDrawMode(null);
    }
  }, [drawMode, setDrawMode, typeSelection]);

  return (
    <Pane>
      <Pane marginBottom="8px">
        <Pane marginBottom="8px">
          <Text marginBottom="8px">{t("associateNumbers")}</Text>
        </Pane>
        <Pane display="flex" alignItems="center" justifyContent="space-between">
          <Button
            marginTop={0}
            type="button"
            onClick={() => setTypeSelection("voie")}
          >
            {t("withStreet")}
          </Button>
          <Text>{tc("or")}</Text>
          <Button
            marginTop={0}
            type="button"
            onClick={() => setTypeSelection("polygon")}
          >
            {t("byDrawing")}
          </Button>
        </Pane>
      </Pane>{" "}
      {typeSelection == "voie" && (
        <AddNumerosWithVoie
          numerosIds={numerosIds}
          setNumerosIds={setNumerosIds}
        />
      )}
      {typeSelection == "polygon" && (
        <AddNumerosWithPolygon
          numerosIds={numerosIds}
          setNumerosIds={setNumerosIds}
        />
      )}
    </Pane>
  );
}

export default AddNumerosInput;
