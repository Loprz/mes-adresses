import { Label, Text, TextareaField } from "evergreen-ui";
import { useTranslations } from "next-intl";

import FormInput from "@/components/form-input";

interface CommentProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  validationMessage?: string;
  input?: string;
  limit?: number;
  isDisabled?: boolean;
}

function Comment({
  onChange,
  validationMessage = null,
  input = "",
  limit = 5000,
  isDisabled = false,
}: CommentProps) {
  const t = useTranslations("comment");
  return (
    <FormInput>
      <Label marginBottom={4} display="block">
        {t("label")}
      </Label>
      <TextareaField
        placeholder={t("placeholder")}
        value={input}
        disabled={isDisabled}
        onChange={input.length < limit ? onChange : () => {}}
        isInvalid={Boolean(validationMessage)}
        validationMessage={validationMessage}
      />
    </FormInput>
  );
}

export default Comment;
