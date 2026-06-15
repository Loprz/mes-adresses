"use client";

import { useState, useCallback, useContext } from "react";
import { useTranslations } from "next-intl";
import {
  Pane,
  Text,
  Button,
  Dialog,
  TextInputField,
  WarningSignIcon,
} from "evergreen-ui";

import { BasesLocalesService } from "@/lib/openapi-api-bal";

import BalDataContext from "@/contexts/bal-data";

import { useInput } from "@/hooks/input";
import useFocus from "@/hooks/focus";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";

interface DemoWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  communeName: string;
  isReadonly: boolean;
}

function DemoWarning({
  baseLocale,
  communeName,
  isReadonly,
}: DemoWarningProps) {
  const t = useTranslations("demoWarning");
  const tc = useTranslations("common");
  const [isShown, setIsShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nom, setNom] = useState(t("defaultName", { communeName }));
  const [email, onEmailChange] = useInput();
  const [ref, setIsFocus] = useFocus();
  const { isMobile, pushToast } = useContext(LayoutContext);

  const { reloadBaseLocale } = useContext(BalDataContext);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        await BasesLocalesService.updateBaseLocaleDemoToDraft(baseLocale.id, {
          nom: nom ? nom.trim() : null,
          email,
        });

        await reloadBaseLocale();
      } catch (error: unknown) {
        pushToast({
          title: tc("error"),
          message: t("saveError"),
          intent: "danger",
        });
      }

      setIsShown(false);
      setIsLoading(false);
    },
    [baseLocale.id, email, nom, reloadBaseLocale, pushToast]
  );

  return (
    <Pane
      width="100%"
      textAlign="center"
      backgroundColor="orange"
      position="fixed"
      bottom={isReadonly ? 50 : 0}
      height={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <WarningSignIcon
        size={20}
        marginX=".5em"
        style={{ verticalAlign: "sub" }}
      />
      <Text fontSize={isMobile ? 10 : 14}>{t("banner")}</Text>

      <Dialog
        isShown={isShown}
        title={t("saveTitle")}
        cancelLabel={tc("cancel")}
        intent="success"
        isConfirmLoading={isLoading}
        confirmLabel={t("keep")}
        hasFooter={false}
        onCloseComplete={() => {
          setIsShown(false);
        }}
        onOpenComplete={() => {
          setIsFocus(true);
        }}
      >
        <form onSubmit={onSubmit}>
          <TextInputField
            ref={ref}
            required
            autoComplete="new-password" // Hack to bypass chrome autocomplete
            name="nom"
            id="nom"
            disabled={isLoading}
            value={nom}
            label={t("nameLabel")}
            placeholder={communeName}
            onChange={(e) => {
              setNom(e.target.value as string);
            }}
          />

          <TextInputField
            required
            type="email"
            name="email"
            id="email"
            disabled={isLoading}
            value={email}
            label={t("emailLabel")}
            placeholder="name@example.com"
            onChange={onEmailChange}
          />
          <Button
            appearance="primary"
            intent="success"
            isLoading={isLoading}
            type="submit"
          >
            {t("save")}
          </Button>
        </form>
      </Dialog>

      <Button
        height={24}
        marginX=".5em"
        width="fit-content"
        onClick={() => {
          setIsShown(true);
        }}
      >
        {t("keep")}
      </Button>
    </Pane>
  );
}

export default DemoWarning;
