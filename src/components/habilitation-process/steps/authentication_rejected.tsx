import { Alert, Button, Pane, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { StrategyDTO } from "@/lib/openapi-api-bal";

interface AuthenticationRejectedStepProps {
  communeName: string;
  strategyType: StrategyDTO.type;
  handleClose: () => void;
}

function AuthenticationRejectedStep({
  strategyType,
  handleClose,
}: AuthenticationRejectedStepProps) {
  const t = useTranslations("authRejected");
  const tc = useTranslations("common");
  return (
    <Pane display="flex" flexDirection="column" gap={16}>
      <Alert intent="danger" title={t("title")}>
        <Text>
          {strategyType === StrategyDTO.type.EMAIL && t("maxAttempts")}
        </Text>
      </Alert>

      <Pane display="flex" flexDirection="row" justifyContent="end" gap={16}>
        <Button intent="primary" onClick={handleClose}>
          {tc("close")}
        </Button>
      </Pane>
    </Pane>
  );
}

export default AuthenticationRejectedStep;
