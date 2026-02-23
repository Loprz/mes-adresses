import { Pane, Heading, Text } from "evergreen-ui";

import StarRating from "./star-rating";
import { AccordionCard } from "@/components/accordion-card";
import { useState } from "react";
import AchievementBadge from "../achievements-badge/achievements-badge";
import Counter from "@/components/counter";

function QualityGoal() {
  const [isActive, setIsActive] = useState(false);

  const isAllCertified = false;
  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane paddingLeft={8} width="100%">
            <Pane display="flex" alignItems="center" gap={16}>
              <AchievementBadge
                icone="/static/images/achievements/fiabilite.svg"
                title="Publication"
                completed={isAllCertified}
              />
              <Heading color={isAllCertified && "#317159"}>Quality</Heading>
            </Pane>
            <Pane width="100%">
              <StarRating value={3} />
              <Pane display="flex" justifyContent="center" alignItems="center">
                <Counter label="Errors detected" value={1} color="red" />
                <Counter
                  label="Warnings detected"
                  value={2}
                  color="orange"
                />
              </Pane>
            </Pane>
          </Pane>
        }
        backgroundColor="white"
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
        caretPosition="start"
      >
        <Pane padding={8}>
          <Heading size={400}>Quality</Heading>
          <Text>
            To ensure the quality of your Local Address Base, it is{" "}
            <u>important to correct the alerts</u>.
            <br />
            <br />
            Alerts are quality indicators for your Local Address Base.
            They are classified as errors and warnings.
            <br />
            To ensure the quality of your Local Address Base, it is
            important to correct the alerts.
            <br />
            <br />
            Errors are alerts that must be corrected before
            publication of your Local Address Base.
            <br />
            Warnings are alerts that can be corrected after
            the publication of your Local Address Base.
          </Text>
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default QualityGoal;
