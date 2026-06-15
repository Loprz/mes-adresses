import { Paragraph, Button, EditIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

import Tuto from "@/components/help/tuto";

interface UnauthorizedProps {
  title: string;
}

function Unauthorized({ title }: UnauthorizedProps) {
  const t = useTranslations("helpCommon");
  return (
    <Tuto title={title}>
      <Paragraph marginTop="default">
        {t("unauthorizedMakeSurePre")}
        <Button
          height={24}
          margin={8}
          appearance="primary"
          intent="danger"
          iconBefore={EditIcon}
        >
          {t("editingDisabled")}
        </Button>
        {t("unauthorizedMakeSurePost")}
      </Paragraph>
      <Paragraph marginTop="default">{t("unauthorizedIndicates")}</Paragraph>
      <Paragraph marginTop="default">{t("unauthorizedOwner")}</Paragraph>
    </Tuto>
  );
}

export default Unauthorized;
