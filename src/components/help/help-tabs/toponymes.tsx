import {
  OrderedList,
  Pane,
  ListItem,
  Button,
  AddIcon,
  MapMarkerIcon,
  Menu,
  MoreIcon,
  Paragraph,
  Tab,
  Heading,
  Badge,
  Strong,
  EditIcon,
  Text,
  TrashIcon,
  Select,
} from "evergreen-ui";

import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Sidebar from "@/components/help/tuto/sidebar";
import Problems from "@/components/help/help-tabs/problems";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";

const before = (
  <Paragraph marginTop="default">
    Display the list of place names for a jurisdiction by clicking on its name
    in the upper left of your screen
  </Paragraph>
);

function Toponymes() {
  return (
    <Pane>
      <VideoContainer
        title="Creating / Editing a place name:"
        link={`${PEERTUBE_LINK}/w/7AeS1b84kmwjbL3A19Wphw`}
      />
      <Tuto title="Add a place name">
        {before}
        <OrderedList margin={8}>
          <ListItem>
            Sélectionnez l‘onglet{" "}
            <Tab>
              <Heading size={300}>Place Name List</Heading>
            </Tab>
            , then click{" "}
            <Button
              iconBefore={AddIcon}
              marginX={4}
              appearance="primary"
              intent="success"
            >
              Ajouter un toponyme
            </Button>
          </ListItem>
          <ListItem>
            Enter the place name in the field{" "}
            <Text color="muted">
              <i>Place name...</i>
            </Text>
          </ListItem>
          <ListItem>
            Un <MapMarkerIcon color="info" /> has appeared on the map. You
            can move it to assign one or more positions to your
            place name.
            <br />
            You can specify the position type using the dropdown{" "}
            <Select>
              <option>Segment</option>
            </Select>
            If you do not want to define a position for the place name,
            simply click on{" "}
            <TrashIcon marginX={6} color="danger" verticalAlign="middle" />
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title="Assign a number to a place name">
        {before}
        <OrderedList margin={8}>
          <ListItem>
            Cliquez sur le bouton
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
            Select the street of the number you want to assign
          </ListItem>
          <ListItem>
            A dropdown will appear. You can select one or more
            numbers from the list. All numbers in the list will be
            assigned to the place name if no number is selected.
          </ListItem>
          <ListItem>
            Pour terminer, cliquez sur le bouton{" "}
            <Button marginX={4} appearance="primary" intent="success">
              Enregistrer
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title="Edit a place name">
        {before}
        <OrderedList margin={8}>
          <ListItem>Click on the place name</ListItem>
          <ListItem>Edit the place name</ListItem>
          <ListItem>
            You can also modify the place name position by moving
            the <MapMarkerIcon color="info" /> on the map
          </ListItem>
          <ListItem>
            You can add positions with the button{" "}
            <Button
              iconBefore={AddIcon}
              marginX={4}
              appearance="primary"
              intent="success"
            >
              Add a position to the place name
            </Button>
            or remove them with the button{" "}
            <TrashIcon marginX={6} color="danger" verticalAlign="middle" />
          </ListItem>
          <ListItem>
            Pour terminer, cliquez sur{" "}
            <Button marginX={4} appearance="primary" intent="success">
              Enregistrer
            </Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title="Delete a place name">
        {before}
        <OrderedList margin={8}>
          <ListItem>
            Cliquez sur le bouton{" "}
            <Button
              background="tint1"
              iconBefore={MoreIcon}
              appearance="minimal"
            />{" "}
            to the right of the place name
          </ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              In the menu that appeared, choose
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

      <Tuto title="Associate parcels">
        {before}

        <OrderedList margin={8}>
          <ListItem>
            Cliquez sur le bouton{" "}
            <Button
              background="tint1"
              iconBefore={MoreIcon}
              appearance="minimal"
            />{" "}
            to the right of the place name
          </ListItem>
          <ListItem>
            <Pane display="flex" alignItems="center">
              Dans le menu qui vient d’apparaître, choisissez
              <Menu.Item background="tint1" marginLeft={8} icon={EditIcon}>
                Edit
              </Menu.Item>
            </Pane>
          </ListItem>
          <ListItem>
            From the map, click on the parcel(s) you want to
            associate with the place name
          </ListItem>
          <ListItem>
            To save the parcels, click the button{" "}
            <Button marginX={4} appearance="primary" intent="success">
              Enregistrer
            </Button>
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

      <Problems>
        <Unauthorized title="I can't add/delete a place name" />
        <Sidebar />
      </Problems>
    </Pane>
  );
}

export default Toponymes;
