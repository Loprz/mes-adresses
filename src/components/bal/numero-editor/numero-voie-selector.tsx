import { useEffect, useState } from "react";
import { sortBy } from "lodash";
import {
  Button,
  Pane,
  Text,
  PlusIcon,
  PropertyIcon,
  SelectField,
} from "evergreen-ui";
import { useTranslations } from "next-intl";

import { normalizeSort } from "@/lib/normalize";

import useFocus from "@/hooks/focus";

import AssistedTextField from "@/components/assisted-text-field";

interface NumeroVoieSelectorProps {
  voieId: string | null;
  nomVoie: string;
  voies: any[];
  mode: "creation" | "selection";
  validationMessage: string | null;
  handleVoie: (voieId: string | null) => void;
  handleNomVoie: (nomVoie: string) => void;
}

function NumeroVoieSelector({
  voieId = null,
  voies,
  nomVoie = "",
  mode = "selection",
  validationMessage = null,
  handleVoie,
  handleNomVoie,
}: NumeroVoieSelectorProps) {
  const t = useTranslations("editorForm");
  const [isCreateMode, setIsCreateMode] = useState(
    mode === "creation" || !voieId
  );
  const [ref, setIsFocus] = useFocus(true);

  const toggleMode = () => {
    setIsCreateMode((mode) => !mode);
  };

  const handleNomVoieChange = (e) => {
    handleNomVoie(e.target.value);
  };

  const handleVoieChange = (e) => {
    const idVoie = e.target.value;
    handleVoie(idVoie ?? null);
  };

  useEffect(() => {
    if (isCreateMode) {
      handleNomVoie("");
    }
  }, [isCreateMode, handleNomVoie]);

  return (
    <Pane display="flex" flex={1} alignItems="flex-end">
      <Pane>
        {isCreateMode ? (
          <AssistedTextField
            forwadedRef={ref}
            exitFocus={() => setIsFocus(false)}
            label={t("newStreet")}
            placeholder={t("streetName")}
            value={nomVoie}
            validationMessage={validationMessage}
            onChange={handleNomVoieChange}
          />
        ) : (
          <SelectField
            required
            label={t("street")}
            flex={1}
            value={voieId}
            margin={0}
            onChange={handleVoieChange}
          >
            {!voieId && <option value="">{t("selectStreet")}</option>}
            {sortBy(voies, (v) => normalizeSort(v.nom)).map(({ id, nom }) => (
              <option key={id} value={id}>
                {nom}
              </option>
            ))}
          </SelectField>
        )}
      </Pane>

      <Text marginX={16}>{t("or")}</Text>

      <Button
        type="button"
        iconBefore={isCreateMode ? PropertyIcon : PlusIcon}
        onClick={toggleMode}
      >
        {isCreateMode ? t("chooseStreet") : t("createStreet")}
      </Button>
    </Pane>
  );
}

export default NumeroVoieSelector;
