import { Pane, Button, ChevronLeftIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

import CodeValidation from "./code-validation";

interface AuthenticationValidateStepProps {
  emailCommune: string;
  validatePinCode: (code: string) => Promise<void>;
  resendCode: () => Promise<boolean>;
  onCancel: () => void;
  flagURL: string | null;
}

function AuthenticationValidateStep({
  emailCommune,
  validatePinCode,
  resendCode,
  onCancel,
  flagURL,
}: AuthenticationValidateStepProps) {
  const tc = useTranslations("common");
  return (
    <Pane>
      <CodeValidation
        email={emailCommune}
        resendCode={resendCode}
        handleSubmit={validatePinCode}
        flagURL={flagURL}
      />

      <Button iconBefore={ChevronLeftIcon} onClick={onCancel}>
        {tc("cancel")}
      </Button>
    </Pane>
  );
}

export default AuthenticationValidateStep;
