import ProductTour from "@/components/product-tour";
import { Heading, Pane, Paragraph } from "evergreen-ui";

const steps = [
  {
    target: "body",
    placement: "center",
    content: (
      <Pane>
        <Heading size={800}>
          Your Local Address Base has received improvement proposals
        </Heading>
        <Paragraph margin={20} textAlign="justify">
          Residents or public services have proposed improvements to the
          addresses in your jurisdiction through the reporting system.
        </Paragraph>
      </Pane>
    ),
  },
  {
    target: "div[class^='main-tabs_tabsList'] > a:last-child",
    content: (
      <Pane>
        <Paragraph>
          To view them, go to the reports tab.
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 15,
    callback: () => {
      const element = document.querySelector(
        "div[class^='main-tabs_tabsList'] > a:last-child"
      ) as HTMLElement | null;
      if (element) {
        element.click();
      } else {
        console.warn(
          "Element not found: div[class^='main-tabs_tabsList'] > a:last-child"
        );
      }
    },
  },
  {
    target: "div[role='tablist'] > span:nth-child(1)",
    content: (
      <Pane>
        <Paragraph>
          This tab lets you view pending reports awaiting review
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 5,
  },
  {
    target: "div[role='tablist'] > span:nth-child(2)",
    content: (
      <Pane>
        <Paragraph>
          This tab lets you view reports that have already been processed
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 5,
  },
  {
    target: "input[placeholder='Search for a report']",
    content: (
      <Pane>
        <Paragraph>
          You can filter reports by name by typing in this search bar...
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 20,
  },
  {
    target: ".filter-button",
    content: (
      <Pane>
        <Paragraph>
          ...or by type (Creation, Modification, and Deletion) by clicking this
          button
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 5,
  },
  {
    target: ".main-table-cell",
    content: (
      <Pane>
        <Paragraph>
          Finally, select a report either from the list...
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 5,
  },
  {
    target: ".maplibregl-marker",
    content: (
      <Pane>
        <Paragraph>Or from the map</Paragraph>
      </Pane>
    ),
    spotlightPadding: 5,
  },
];

export default function SignalementProductTour() {
  return <ProductTour steps={steps} localStorageKey="signalement" />;
}
