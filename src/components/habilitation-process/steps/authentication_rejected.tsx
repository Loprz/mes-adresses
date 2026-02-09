import { Alert, Button, Pane, Text } from "evergreen-ui";
import { StrategyDTO } from "@/lib/openapi-api-bal";

interface AuthenticationRejectedStepProps {
  communeName: string;
  strategyType: StrategyDTO.type;
  handleClose: () => void;
}

function AuthenticationRejectedStep({
  communeName,
  strategyType,
  handleClose,
}: AuthenticationRejectedStepProps) {
  return (
    <Pane display="flex" flexDirection="column" gap={16}>
      <Alert intent="danger" title="Your authorization request has been rejected">
        <Text>
          {strategyType === StrategyDTO.type.EMAIL &&
            "You have exceeded the maximum number of allowed attempts."}
        </Text>
      </Alert>

      <Pane display="flex" flexDirection="row" justifyContent="end" gap={16}>
        <Button intent="primary" onClick={handleClose}>
          Close
        </Button>
      </Pane>
    </Pane>
  );
}

export default AuthenticationRejectedStep;
