import { BaseLocaleFondDeCarte } from "@/lib/openapi-api-bal";
import {
  Pane,
  TextInputField,
  TextareaField,
  CrossIcon,
  IconButton,
} from "evergreen-ui";
import { useEffect, useState } from "react";
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
        title="Delete map background"
        onClick={() => onAnimationEnd()}
        intent="danger"
        icon={CrossIcon}
        position="absolute"
        top={0}
        right={0}
        appearance="minimal"
      />
      <TextInputField
        label="Nom"
        title="Map background name"
        value={initialValue.name}
        onChange={(e) => onChange("name", e.target.value)}
        width="80%"
        marginBottom={0}
        placeholder="My map background"
        required
        validationMessage={
          errors?.["name"] == false &&
          (initialValue.name === ""
            ? "Name is required"
            : "Name is invalid")
        }
        isInvalid={errors?.["name"] == false}
      />
      <TextareaField
        label="Url"
        required
        title="Map background URL"
        value={initialValue.url}
        onChange={(e) => onChange("url", e.target.value)}
        marginBottom={8}
        marginTop={8}
        placeholder="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}"
        validationMessage={
          errors?.["url"] == false && "The map background URL is invalid"
        }
        isInvalid={errors?.["url"] == false}
      />
    </Pane>
  );
}

export default FondDeCarteField;
