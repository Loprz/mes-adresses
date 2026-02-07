import React, { useContext } from "react";
import { Card, Pane, PlusIcon, UndoIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";
import BALRecoveryContext from "@/contexts/bal-recovery";
import ButtonCircleEffect from "../button-circle-effect";
import { useRouter } from "next/navigation";

function CreateBaseLocaleCard() {
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const router = useRouter();
  const t = useTranslations("home");

  return (
    <Card
      flexShrink={0}
      width={290}
      height={400}
      border
      elevation={2}
      margin={12}
      display="flex"
      flexDirection="column"
    >
      <ButtonCircleEffect
        label={t("createNew")}
        onClick={() => router.push("/new")}
        icon={PlusIcon}
      />
      <Pane borderTop="1px solid #E6E8F0" />
      <ButtonCircleEffect
        label={t("recoverBase")}
        onClick={() => setIsRecoveryDisplayed(true)}
        icon={UndoIcon}
      />
    </Card>
  );
}

export default CreateBaseLocaleCard;
