import { BaseLocaleFondDeCarte } from "@/lib/openapi-api-bal";
import {
  Pane,
  TextInputField,
  TextareaField,
  CrossIcon,
  IconButton,
} from "evergreen-ui";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "@/components/bal/panel-goal/secondary-goal/accordion-simple.module.css";

interface FondDeCarteFieldProps {
  initialValue: BaseLocaleFondDeCarte;
  onChange: (key: string, value: string) => void;
  onDelete: () => void;
  errors?: Record<"url" | "name", boolean>;
}

function FondDeCarteField({
  initialValue,
  onChange,
  onDelete,
  errors,
}: FondDeCarteFieldProps) {
  const t = useTranslations("settings");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const onAnimationEnd = () => {
    setIsAnimating(false);
    setTimeout(() => onDelete(), 500);
  };

  return (
    <Pane
      className={isAnimating ? styles.bounceInLeft : styles.bounceOutLeft}
      position="relative"
      display="flex"
      flexDirection="column"
      border="1px solid #e0e0e0"
      borderRadius={8}
      padding={10}
      marginBottom={10}
      marginTop={10}
      backgroundColor="white"
    >
      <IconButton
        title={t("deleteMapBackground")}
        onClick={() => onAnimationEnd()}
        intent="danger"
        icon={CrossIcon}
        position="absolute"
        top={0}
        right={0}
        appearance="minimal"
      />
      <TextInputField
        label={t("nameLabel")}
        title={t("mapBackgroundNameTitle")}
        value={initialValue.name}
        onChange={(e) => onChange("name", e.target.value)}
        width="80%"
        marginBottom={0}
        placeholder={t("myMapBackgroundPlaceholder")}
        required
        validationMessage={
          errors?.["name"] == false &&
          (initialValue.name === ""
            ? t("nameRequired")
            : t("nameInvalid"))
        }
        isInvalid={errors?.["name"] == false}
      />
      <TextareaField
        label={t("urlLabel")}
        required
        title={t("mapBackgroundUrlTitle")}
        value={initialValue.url}
        onChange={(e) => onChange("url", e.target.value)}
        marginBottom={8}
        marginTop={8}
        placeholder="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        validationMessage={
          errors?.["url"] == false && t("urlInvalid")
        }
        isInvalid={errors?.["url"] == false}
      />
    </Pane>
  );
}

export default FondDeCarteField;
