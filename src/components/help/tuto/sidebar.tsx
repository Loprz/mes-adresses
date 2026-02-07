import { Paragraph, IconButton, ChevronRightIcon } from "evergreen-ui";

import Tuto from "@/components/help/tuto";

function Sidebar() {
  return (
    <Tuto title="I can't see the sidebar">
      <Paragraph marginTop="default">
        This menu may be hidden to leave more space for the map.
      </Paragraph>
      <Paragraph marginTop="default">
        To make it reappear, click the button{" "}
        <IconButton display="inline-block" margin={8} icon={ChevronRightIcon} />
        in the upper left of your screen.
      </Paragraph>
    </Tuto>
  );
}

export default Sidebar;
