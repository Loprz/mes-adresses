"use client";

import { Pane, Heading, Paragraph } from "evergreen-ui";
import useWindowSize from "@/hooks/useWindowSize";

export default function LegalNotice() {
  const { isMobile } = useWindowSize();
  return (
    <>
      <Pane
        fontSize={18}
        {...(isMobile
          ? { padding: 20 }
          : {
              padding: 20,
              marginX: "6em",
              marginY: "2em",
            })}
      >
        <Heading is="h1" fontSize={24} marginBottom={30}>
          National Address Platform &ndash; Legal Notice
        </Heading>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            About This Platform
          </Heading>

          <Paragraph>
            The National Address Platform (NAP) is an open-source initiative to
            build a comprehensive, authoritative national address database for the
            United States. This platform is inspired by France&apos;s Base Adresse
            Nationale and adapted for US addressing standards and practices.
          </Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            Open Source License
          </Heading>

          <Paragraph>
            This software is provided under an open-source license. The source
            code is available on GitHub. Use of this platform is subject to the
            terms of the applicable open-source license agreement.
          </Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            Data Sources
          </Heading>

          <Paragraph>
            Address data available through this platform is compiled from multiple
            sources including local government submissions, the Overture Maps
            Foundation, the National Address Database (NAD), and other public
            data sources. While every effort is made to ensure accuracy, the
            platform makes no guarantees regarding data completeness or
            correctness.
          </Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            Accessibility
          </Heading>

          <Paragraph>
            We are committed to ensuring digital accessibility for people of all
            abilities. We are continually improving the user experience for
            everyone and applying the relevant accessibility standards, including
            compliance with Section 508 of the Rehabilitation Act and WCAG 2.1
            Level AA guidelines.
          </Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            Report an Issue
          </Heading>

          <Paragraph>
            If you encounter an accessibility barrier or any other issue
            preventing you from accessing content or functionality on this
            platform, please contact us at{" "}
            <a href="mailto:support@nap.us.gov">support@nap.us.gov</a>.
          </Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            Security
          </Heading>

          <Paragraph>
            This platform is protected by SSL/TLS encryption, indicated by the
            padlock icon in your browser. This protection helps ensure the
            confidentiality of data exchanges.
          </Paragraph>

          <Paragraph>
            This platform will never send emails requesting personal information
            such as passwords or Social Security numbers. Be cautious of any
            such requests.
          </Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            Privacy
          </Heading>

          <Paragraph>
            Address data published through this platform is public geographic
            information. Personal information submitted by platform
            administrators (such as email addresses) is used solely for account
            management and communication purposes and is not shared with third
            parties.
          </Paragraph>
        </Pane>
      </Pane>
    </>
  );
}
