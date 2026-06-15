import { Pane, Alert, Label } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface DisabledFormInputProps {
  label: string;
}

function DisabledFormInput({ label }: DisabledFormInputProps) {
  const t = useTranslations("disabledFormInput");
  return (
    <Pane
      background="white"
      padding={8}
      borderRadius={8}
      marginBottom={8}
      width="100%"
    >
      <Label>{label}</Label>
      <Alert
        marginY={4}
        intent="warning"
        title={t("notAvailable")}
      />
    </Pane>
  );
}

export default DisabledFormInput;
