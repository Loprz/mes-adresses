import { Paragraph, Button, EditIcon } from "evergreen-ui";

import Tuto from "@/components/help/tuto";

interface UnauthorizedProps {
  title: string;
}

function Unauthorized({ title }: UnauthorizedProps) {
  return (
    <Tuto title={title}>
      <Paragraph marginTop="default">
        Make sure that
        <Button
          height={24}
          margin={8}
          appearance="primary"
          intent="danger"
          iconBefore={EditIcon}
        >
          Editing disabled
        </Button>
        does not appear in the upper right of your screen.
      </Paragraph>
      <Paragraph marginTop="default">
        This indicates that you are not authenticated or do not have
        permission to edit this LAB.
      </Paragraph>
      <Paragraph marginTop="default">
        However, if you are the owner, simply click on the link that was
        sent to you by email when your LAB was created.
      </Paragraph>
    </Tuto>
  );
}

export default Unauthorized;
