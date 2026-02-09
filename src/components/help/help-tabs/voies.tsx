import {
  Pane,
  Paragraph,
  OrderedList,
  ListItem,
  Strong,
  Menu,
  Button,
  AddIcon,
  ColumnLayoutIcon,
  MapIcon,
  MoreIcon,
  SendToMapIcon,
  TrashIcon,
  KeyTabIcon,
} from "evergreen-ui";

import Tuto from "@/components/help/tuto";
import SubTuto from "@/components/help/tuto/sub-tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Sidebar from "@/components/help/tuto/sidebar";
import Problems from "@/components/help/help-tabs/problems";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";

const before = (
  <Paragraph marginTop="default">
    Display the list of streets for a jurisdiction by clicking on its name
    in the upper left of your screen.
  </Paragraph>
);

function Voies() {
  return (
    <Pane>
      <VideoContainer
        title="Creating / Editing a street:"
        link={`${PEERTUBE_LINK}/w/v2caTXtfYkvg6wUELBvLs2`}
      />
      <Tuto title="Add a street">
        {before}
        <OrderedList margin={8}>
          <ListItem>
            Click the button
            <Button
              iconBefore={AddIcon}
              marginX={4}
              appearance="primary"
              intent="success"
            >
              Add a street
            </Button>
          </ListItem>
          <ListItem>
            Enter the name of the street you want to create in the field{" "}
            <Strong size={500} fontStyle="italic">
              Street name...
            </Strong>
          </ListItem>
          <ListItem>
            To finish, click on the button{" "}
            <Button marginX={4} appearance="primary" intent="success">
              Add
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title="Rename a street">
        {before}

        <OrderedList margin={8}>
          <ListItem>Click on the street name</ListItem>
          <ListItem>Edit the street name</ListItem>
          <ListItem>
            To finish, click on{" "}
            <Button marginX={4} appearance="primary" intent="success">
              Save
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title="View a street">
        {before}

        <SubTuto title="From the sidebar" icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>
              Click on the button{" "}
              <Button
                background="tint1"
                iconBefore={MoreIcon}
                appearance="minimal"
              />{" "}
              to the right of the street name
            </ListItem>
            <ListItem>
              <Pane display="flex" alignItems="center">
                In the menu that appeared, choose
                <Menu.Item
                  background="tint1"
                  marginLeft={8}
                  icon={SendToMapIcon}
                >
                  View
                </Menu.Item>
              </Pane>
            </ListItem>
          </OrderedList>
        </SubTuto>

        <SubTuto title="From the map" icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>
              Click on the street name or on one of its numbers
            </ListItem>
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title="Delete a street">
        {before}

        <OrderedList margin={8}>
          <ListItem>
            Click on the button{" "}
            <Button
              background="tint1"
              iconBefore={MoreIcon}
              appearance="minimal"
            />{" "}
            located to the right of the street name
          </ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              In the menu that just appeared, choose
              <Menu.Item
                background="tint1"
                marginLeft={8}
                icon={TrashIcon}
                intent="danger"
              >
                Delete...
              </Menu.Item>
            </Pane>
          </ListItem>
          <ListItem>
            To finish, confirm your choice by clicking{" "}
            <Button marginX={4} intent="danger" appearance="primary">
              Delete
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title="Convert a street to a place name">
        {before}
        <Paragraph marginTop="default">
          You can convert a street to a place name if the street does not
          contain any numbers.
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>
            Click on the button
            <Button
              background="tint1"
              iconBefore={MoreIcon}
              appearance="minimal"
            />
            located to the right of the street name
          </ListItem>
          <ListItem>
            In the menu that just appeared, choose
            <Button iconBefore={KeyTabIcon} marginX={4}>
              Convert to place name
            </Button>
          </ListItem>
          <ListItem>
            To finish, confirm your choice by clicking on
            <Button marginX={4} appearance="primary">
              Confirm
            </Button>
          </ListItem>
          <ListItem>
            You will be redirected to editing the new place name
          </ListItem>
        </OrderedList>
      </Tuto>

      <Problems>
        <Unauthorized title="I can't add/delete a street" />
        <Sidebar />
      </Problems>
    </Pane>
  );
}

export default Voies;
