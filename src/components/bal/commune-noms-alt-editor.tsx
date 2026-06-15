"use client";

import { useState, useContext, useCallback, useEffect } from "react";
import { Pane, Button, Label } from "evergreen-ui";
import { useTranslations } from "next-intl";

import BalDataContext from "@/contexts/bal-data";

import useValidationMessage from "@/hooks/validation-messages";

import Form from "@/components/form";
import FormInput from "@/components/form-input";
import LanguesRegionalesForm from "@/components/langues-regionales-form";
import {
  BaseLocale,
  BasesLocalesService,
  UpdateBaseLocaleDTO,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";

interface CommuneNomsAltEditorProps {
  initialValue?: BaseLocale;
  closeForm: () => void;
}

function CommuneNomsAltEditor({
  initialValue,
  closeForm,
}: CommuneNomsAltEditorProps) {
  const t = useTranslations("panels");
  const te = useTranslations("editorForm");
  const tc = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const [communeNomsAlt, setCommuneNomsAlt] = useState(
    initialValue?.communeNomsAlt
  );
  const { reloadBaseLocale } = useContext(BalDataContext);
  const { getValidationMessage, setValidationMessages } =
    useValidationMessage();
  const { toaster } = useContext(LayoutContext);

  const onFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setValidationMessages(null);
      setIsLoading(true);

      try {
        const body: UpdateBaseLocaleDTO = {
          communeNomsAlt:
            Object.keys(communeNomsAlt).length > 0 ? communeNomsAlt : null,
        };

        const submit = toaster(
          async () =>
            BasesLocalesService.updateBaseLocale(initialValue.id, body),
          t("regionalNameUpdated"),
          t("regionalNameUpdateError"),
          (err) => {
            setValidationMessages(err.body.message);
          }
        );

        await submit();
        await reloadBaseLocale();
        closeForm();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      initialValue,
      communeNomsAlt,
      closeForm,
      setValidationMessages,
      toaster,
      reloadBaseLocale,
      t,
    ]
  );

  const onFormCancel = useCallback(
    (e) => {
      e.preventDefault();
      closeForm();
    },
    [closeForm]
  );

  // Reset validation messages on changes
  useEffect(() => {
    setValidationMessages(null);
  }, [communeNomsAlt]);

  return (
    <Form
      editingId={initialValue?.id}
      closeForm={closeForm}
      onFormSubmit={onFormSubmit}
    >
      <Pane>
        <FormInput>
          <Label>{t("jurisdictionNameRegional")}</Label>
          <LanguesRegionalesForm
            initialValue={initialValue?.communeNomsAlt}
            validationMessage={getValidationMessage("lang_alt")}
            handleLanguages={setCommuneNomsAlt}
            autoOpen={true}
          />
        </FormInput>
      </Pane>

      <Pane>
        <Button
          isLoading={isLoading}
          type="submit"
          appearance="primary"
          intent="success"
        >
          {isLoading ? te("inProgress") : tc("save")}
        </Button>

        {closeForm && (
          <Button
            disabled={isLoading}
            appearance="minimal"
            marginLeft={8}
            display="inline-flex"
            onClick={onFormCancel}
          >
            {tc("cancel")}
          </Button>
        )}
      </Pane>
    </Form>
  );
}

export default CommuneNomsAltEditor;
