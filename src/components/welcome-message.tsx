"use client";

import { useState, useEffect, useContext } from "react";
import {
  Pane,
  Dialog,
  Paragraph,
  Heading,
  CrossIcon,
  Icon,
} from "evergreen-ui";

import CommuneFlag from "./commune-flag";
import { CommuneType } from "@/types/commune";
import { AchievementBadge } from "./bal/panel-goal/achievements-badge/achievements-badge";
import MiniCard from "./mini-card";
import LocalStorageContext from "@/contexts/local-storage";

function WelcomeMessage({ commune }: { commune: CommuneType }) {
  const { wasWelcomed, setWasWelcomed } = useContext(LocalStorageContext);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    setIsShown(!wasWelcomed);
  }, [wasWelcomed]);

  return (
    <Dialog
      isShown={isShown}
      intent="success"
      header={
        <Pane position="relative" width="100%">
          <Pane display="flex" flexDirection="column" alignItems="center">
            <Heading textAlign="center">
              <CommuneFlag codeCommune={commune.code} />
            </Heading>
            <Heading>
              Welcome to the new Local Address Base for {commune.nom}
            </Heading>
          </Pane>
          <Icon
            icon={CrossIcon}
            cursor="pointer"
            position="absolute"
            right={0}
            top={0}
            onClick={() => setWasWelcomed(true)}
          />
        </Pane>
      }
      confirmLabel="Start addressing"
      hasCancel={false}
      onConfirm={() => setWasWelcomed(true)}
      onCloseComplete={() => setWasWelcomed(true)}
    >
      <Pane>
        <Pane marginTop={16} display="flex" flexDirection="row">
          <Pane marginRight={32}>
            <AchievementBadge
              icone="/static/images/achievements/published-bal.svg"
              title="Publication"
              completed={true}
              width={64}
              height={64}
            />
          </Pane>
          <Pane>
            <Heading>
              Start by <b>publishing</b>
            </Heading>
            <Paragraph marginY={16}>
              Once published, this LAB becomes the official source of addresses
              for {commune.nom}.
            </Paragraph>
          </Pane>
        </Pane>
        <br />
        <Pane display="flex" flexDirection="row">
          <Pane>
            <Heading>Address at your own pace.</Heading>
            <Paragraph marginY={16}>
              Once published, addresses are synchronized with the National
              Address Platform.
              <br />
              All your changes will be synced automatically.
            </Paragraph>
          </Pane>
        </Pane>

        <Pane marginY={16}>
          <Heading marginBottom={16}>Need help?</Heading>
          <Pane
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <MiniCard
              img="/static/images/education.png"
              message="Take a training"
              href="#"
            />
            <MiniCard
              img="/static/images/video-call.png"
              message="Watch the tutorials"
              href="https://tube.numerique.gouv.fr/w/p/cm6YcSnDdztzRjKTH3vNFn?playlistPosition=1"
            />
            <MiniCard
              img="/static/images/manual.png"
              message="Read the guides"
              href="#"
            />
          </Pane>
        </Pane>
      </Pane>
    </Dialog>
  );
}

export default WelcomeMessage;
