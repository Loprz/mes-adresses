import { useState, useCallback } from "react";
import { Pane, Button } from "evergreen-ui";
import { useTranslations } from "next-intl";

import Form from "@/components/form";
import AddNumerosInput from "./add-numeros-input";

interface AddNumerosProps {
  onSubmit: (numeros: string[]) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

function AddNumeros({ onSubmit, onCancel, isLoading }: AddNumerosProps) {
  const t = useTranslations("lists");
  const tc = useTranslations("common");
  const [numerosIds, setNumerosIds] = useState<string[]>([]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await onSubmit(numerosIds);
    },
    [numerosIds, onSubmit]
  );

  return (
    <Pane>
      <Form onFormSubmit={handleSubmit}>
        <Pane
          backgroundColor="white"
          padding={8}
          marginBottom={8}
          borderRadius={8}
        >
          <AddNumerosInput
            numerosIds={numerosIds}
            setNumerosIds={setNumerosIds}
          />
        </Pane>
        <Pane display="flex" justifyContent="end">
          <Button
            isLoading={isLoading}
            type="submit"
            appearance="primary"
            intent="success"
            disabled={numerosIds.length <= 0}
          >
            {isLoading ? t("saving") : tc("save")}
          </Button>

          <Button disabled={isLoading} marginLeft={8} onClick={onCancel}>
            {tc("cancel")}
          </Button>
        </Pane>
      </Form>
    </Pane>
  );
}

export default AddNumeros;
