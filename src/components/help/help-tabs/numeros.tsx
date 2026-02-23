import {
  Pane,
  Paragraph,
  OrderedList,
  ListItem,
  Strong,
  Button,
  Menu,
  IconButton,
  MapMarkerIcon,
  CommentIcon,
  ColumnLayoutIcon,
  Badge,
  AddIcon,
  MapIcon,
  MoreIcon,
  EditIcon,
  TrashIcon,
  EndorsedIcon,
  PlusIcon,
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
    Display the list of numbers for a street by selecting it from the
    sidebar or by clicking on its name or one of its numbers directly from
    the map.
  </Paragraph>
);

function Numeros() {
  return (
    <Pane>
      <VideoContainer
        title="Creating / Editing a number:"
        link={`${PEERTUBE_LINK}/w/ts9chg7zehHXkTrotsjpqr`}
      />
      <Tuto title="Good to know">
        <ListItem listStyleType="none">
          To improve address quality, we recommend
          certifying all of your addresses.{" "}
          <b>A certified address is declared authentic by the local government</b>,
          which improves the quality of the Local Address Base and facilitates
          its reuse.
        </ListItem>
      </Tuto>
      <Tuto title="Add a number">
        {before}

        <SubTuto title="From the sidebar" icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>
              Click the button
              <Button
                iconBefore={AddIcon}
                marginX={4}
                appearance="primary"
                intent="success"
              >
                Add a number
              </Button>
            </ListItem>
            <ListItem>
              A <MapMarkerIcon color="info" /> has appeared at the center of the
              map, move it to the desired location using your mouse
            </ListItem>
            <ListItem>
              Enter the number in the field{" "}
              <Strong size={500}>Number</Strong>
            </ListItem>
            <ListItem>
              Enter the suffix (example: 1/2) in the field{" "}
              <Strong size={500}>Suffix</Strong>
            </ListItem>
            <ListItem>
              Search for the street the number belongs to and select
              it. Note that if a street is already selected, it will be
              suggested by default. You can also create a new
              street directly by clicking{" "}
              <Button marginX={4} iconBefore={PlusIcon}>
                Create a street
              </Button>
              . You will be automatically redirected to this street.
            </ListItem>
            <ListItem>
              Select the position using the dropdown{" "}
              <Strong size={500}>Type</Strong>
            </ListItem>
            <ListItem>
              To finish, click the button{" "}
              <Button
                marginX={4}
                appearance="primary"
                intent="success"
                iconAfter={EndorsedIcon}
              >
                Certify and save
              </Button>{" "}
              if you validate this address, or{" "}
              <Button marginX={4} intent="success">
                Save
              </Button>{" "}
              to give yourself time to verify before certifying.
            </ListItem>
          </OrderedList>
        </SubTuto>

        <SubTuto title="From the map" icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>
              <Pane display="flex" alignItems="center">
                Click on the button{" "}
                <IconButton
                  marginLeft={8}
                  icon={AddIcon}
                  intent="success"
                  appearance="primary"
                />
              </Pane>
            </ListItem>
            <ListItem>
              A <MapMarkerIcon color="info" /> has appeared at the center of the
              map, move it to the desired location using your mouse
            </ListItem>
            <ListItem>
              In the new menu that appeared, enter the number in the
              field <Strong size={500}>Number</Strong>
            </ListItem>
            <ListItem>
              Enter the suffix (example: bis) in the field{" "}
              <Strong size={500}>Suffix</Strong>
            </ListItem>
            <ListItem>
              Search for the street to which the number belongs and select
              it. Note that if a street is already selected, it will be
              suggested by default. You can also create a new
              street directly by clicking{" "}
              <Button marginX={4} iconBefore={PlusIcon}>
                Create a street
              </Button>
              . You will be automatically redirected to this street.
            </ListItem>
            <ListItem>
              Select the position using the dropdown{" "}
              <Strong size={500}>Type</Strong>
            </ListItem>
            <ListItem>
              To finish, click on the button{" "}
              <Button
                marginX={4}
                appearance="primary"
                intent="success"
                iconAfter={EndorsedIcon}
              >
                Certify and save
              </Button>{" "}
              if you validate this address, or{" "}
              <Button marginX={4} intent="success">
                Save
              </Button>{" "}
              to give yourself time to verify before certifying.
            </ListItem>
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title="Edit a number">
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
              to the right of the number
            </ListItem>
            <ListItem>
              <Pane display="flex" alignItems="center">
                In the menu that appeared, choose
                <Menu.Item background="tint1" marginLeft={8} icon={EditIcon}>
                  Edit
                </Menu.Item>
              </Pane>
            </ListItem>
            <ListItem>
              You can now modify the number, suffix,
              address type, or position by moving the{" "}
              <MapMarkerIcon color="info" /> on the map, and certify your
              address.
            </ListItem>
          </OrderedList>
        </SubTuto>

        <SubTuto title="From the map" icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>Click on the number</ListItem>
            <ListItem>
              You can now modify the number, suffix,
              address type or position by moving the{" "}
              <MapMarkerIcon color="info" /> on the map and certify your
              address.
            </ListItem>
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title="Delete a number">
        {before}

        <SubTuto title="From the sidebar menu" icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>
              Click on the button{" "}
              <Button
                background="tint1"
                iconBefore={MoreIcon}
                appearance="minimal"
              />{" "}
              located to the right of the number
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
          </OrderedList>
        </SubTuto>

        <SubTuto title="From the map" icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>Right-click on the number</ListItem>
            <ListItem>
              <Pane display="flex" alignItems="center">
                In the menu that just appeared, choose
                <Menu.Item
                  background="tint1"
                  marginLeft={8}
                  icon={TrashIcon}
                  intent="danger"
                >
                  Delete…
                </Menu.Item>
              </Pane>
            </ListItem>
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title="Uncertify an address">
        <OrderedList margin={8}>
          <ListItem>
            <Pane display="flex" alignItems="center">
              Display the list of numbers for a street by selecting it
              from the sidebar or by clicking on its name or one of its
              numbers directly from the map.
            </Pane>
          </ListItem>
          <ListItem>
            At the bottom of the page, click the button{" "}
            <Button marginX={4} intent="danger">
              Uncertify and save
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title="Associate parcels">
        {before}

        <OrderedList margin={8}>
          <ListItem>
            Click on the button{" "}
            <Button
              background="tint1"
              iconBefore={MoreIcon}
              appearance="minimal"
            />{" "}
            located to the right of the number
          </ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              In the menu that just appeared, choose
              <Menu.Item background="tint1" marginLeft={8} icon={EditIcon}>
                Edit
              </Menu.Item>
            </Pane>
          </ListItem>
          <ListItem>
            From the map, click on the parcel(s) you want to
            associate with the number
          </ListItem>
          <ListItem>
            To save the parcels, click the button{" "}
            <Button
              marginX={4}
              appearance="primary"
              intent="success"
              iconAfter={EndorsedIcon}
            >
              Certify and save
            </Button>{" "}
            or{" "}
            <Button marginX={4} intent="success">
              Save
            </Button>{" "}
            if you do not want to certify this address at this time.
          </ListItem>
        </OrderedList>

        <Pane>
          <Strong>Parcel color code:</Strong>
          <Paragraph display="flex">
            <Badge margin={4} height="100%" color="green">
              associated parcel
            </Badge>
            <Badge margin={4} height="100%" color="yellow">
              parcel that can be associated
            </Badge>
            <Badge margin={4} height="100%" color="red">
              parcel that can be dissociated
            </Badge>
          </Paragraph>
        </Pane>
      </Tuto>

      <Tuto title="Add a note or comment">
        {before}

        <OrderedList margin={8}>
          <ListItem>
            Click on the button{" "}
            <Button
              background="tint1"
              iconBefore={MoreIcon}
              appearance="minimal"
            />{" "}
            located to the right of the number
          </ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              In the menu that just appeared, choose
              <Menu.Item background="tint1" marginLeft={8} icon={EditIcon}>
                Edit
              </Menu.Item>
            </Pane>
          </ListItem>
          <ListItem>
            Fill in the text field <Strong size={500}>Comment</Strong>{" "}
            to leave a note about the number
          </ListItem>
          <ListItem>
            To save your comment, click the button{" "}
            <Button
              marginX={4}
              appearance="primary"
              intent="success"
              iconAfter={EndorsedIcon}
            >
              Certify and save
            </Button>{" "}
            or{" "}
            <Button marginX={4} intent="success">
              Save
            </Button>{" "}
            if you do not wish to certify this address at the moment.
          </ListItem>
        </OrderedList>

        <Paragraph>
          You will notice a <CommentIcon /> on the number row. Hovering over
          it will show the comment.
        </Paragraph>
      </Tuto>

      <Problems>
        <Tuto title="I can't find a street when adding a number from the map">
          <Paragraph marginTop="default">
            Before creating a number from the map, make sure that the street
            it belongs to has been created.
          </Paragraph>
        </Tuto>

        <Unauthorized title="I can't add/delete a number" />

        <Sidebar />
      </Problems>
    </Pane>
  );
}

export default Numeros;
