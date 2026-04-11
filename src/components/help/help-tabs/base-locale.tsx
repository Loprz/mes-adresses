import {
  Pane,
  OrderedList,
  ListItem,
  Button,
  Strong,
  Paragraph,
  Tab,
  CogIcon,
  PlusIcon,
} from "evergreen-ui";

import BALRecovery from "@/components/bal-recovery/bal-recovery";
import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Problems from "@/components/help/help-tabs/problems";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";

function BaseLocale() {
  return (
    <Pane>
      <VideoContainer
        title="Creating a Local Address Base:"
        link={`${PEERTUBE_LINK}/w/f2b6yiXosmfoKkmyF4YLtE`}
      />
      <Tuto title="Create a new Local Address Base">
        <Paragraph marginTop="default">
          On the <b>New Local Address Base</b> page, select the tab{" "}
          <Tab isSelected>Create</Tab>
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>
            Enter the name of your Local Address Base in the field{" "}
            <Strong size={500} fontStyle="italic">
              Name
            </Strong>
            . This will help you identify your Local Address Base.
          </ListItem>
          <ListItem>
            Enter the email address of your local government or the administrator of
            the Local Address Base. This address will receive the link
            to access and edit your Local Address Base.
          </ListItem>
          <ListItem>
            Select the state, then the county, then the city, township, or
            county-wide option for the jurisdiction you want to manage.
          </ListItem>
          <ListItem>
            If you are creating a county-wide LAB, keep the county selected in
            the final list instead of choosing a city or township.
          </ListItem>
          <ListItem>
            If you want to start from scratch, uncheck the box{" "}
            <Strong size={500} fontStyle="italic">
              Import streets and numbers from the NAP
            </Strong>
            .
          </ListItem>
          <ListItem>
            To finish, click the button{" "}
            <Button
              marginX={4}
              appearance="primary"
              intent="success"
              iconAfter={PlusIcon}
            >
              Create the Local Address Base
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title="Import a Local Address Base">
        <Paragraph marginTop="default">
          On the <b>New Local Address Base</b> page, select the tab{" "}
          <Tab isSelected>Import a CSV file</Tab>
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>
            Select or drop your file in <b>csv</b> format.
            Note that this file must not exceed 10 MB.
          </ListItem>
          <ListItem>
            Enter the name of your Local Address Base in the field{" "}
            <Strong size={500} fontStyle="italic">
              Name
            </Strong>
            . This will help you identify your Local Address Base.
          </ListItem>
          <ListItem>
            Enter the email address of your jurisdiction or the administrator of
            the Local Address Base. This address will receive the link
            to access and edit your Local Address Base.
          </ListItem>
          <ListItem>
            Select the same state, county, and city, township, or county-wide
            jurisdiction that is represented in your CSV file.
          </ListItem>
          <ListItem>
            The uploaded file must contain addresses for only that one
            jurisdiction.
          </ListItem>
          <ListItem>
            To finish, click on the button{" "}
            <Button
              marginX={4}
              appearance="primary"
              intent="success"
              iconAfter={PlusIcon}
            >
              Create the Local Address Base
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title="Manage your Local Address Base">
        <Paragraph marginTop="default">
          Access your Local Address Base settings by clicking on
          the icon{" "}
          <span>
            <CogIcon marginX={4} />
          </span>{" "}
          located in the upper right of your screen. Then choose "Settings".
        </Paragraph>
        <Paragraph marginTop="default">You will be able to:</Paragraph>
        <OrderedList margin={8}>
          <ListItem>Change the name of your Local Address Base</ListItem>
          <ListItem>Add or remove collaborators</ListItem>
          <ListItem>Download your addresses in .csv format</ListItem>
        </OrderedList>

        <Paragraph marginTop="default">
          Once your settings are done, click{" "}
          <Button marginX={4} appearance="primary">
            Save changes
          </Button>
        </Paragraph>
      </Tuto>

      <Problems>
        <Unauthorized title="I can't edit my LAB" />

        <Tuto title="I can't find my jurisdiction">
          <Paragraph marginTop="default">
            If your jurisdiction is a new one resulting from a merger, it may
            not appear in the selector yet. First, make sure you have chosen
            the correct state and county, and use the county-wide option if you
            are managing unincorporated areas. If it still does not appear,
            you can contact us at{" "}
            <a href="mailto:support@nap.us.gov">support@nap.us.gov</a>
          </Paragraph>
        </Tuto>

        <BALRecovery />
      </Problems>
    </Pane>
  );
}

export default BaseLocale;
