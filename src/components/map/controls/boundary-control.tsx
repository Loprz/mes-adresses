"use client";

import { useState, useRef, useEffect } from "react";
import { Pane, Button, Checkbox, Heading, GlobeIcon } from "evergreen-ui";

export type BoundaryVisibility = {
  states: boolean;
  counties: boolean;
  places: boolean;
};

interface BoundaryControlProps {
  visibility: BoundaryVisibility;
  onChange: (visibility: BoundaryVisibility) => void;
}

function BoundaryControl({ visibility, onChange }: BoundaryControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const anyVisible =
    visibility.states || visibility.counties || visibility.places;

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <Pane position="relative" ref={panelRef}>
      <Button
        appearance="minimal"
        padding={8}
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle TIGER boundary layers"
      >
        <GlobeIcon color={anyVisible ? "selected" : "muted"} size={16} />
      </Button>

      {isOpen && (
        <Pane
          position="absolute"
          right={44}
          top={0}
          background="white"
          elevation={3}
          borderRadius={4}
          padding={12}
          width={220}
          zIndex={10}
        >
          <Heading size={200} marginBottom={8}>
            TIGER Boundary Layers
          </Heading>
          <Pane display="flex" flexDirection="column" gap={4}>
            <Checkbox
              label="State boundaries"
              checked={visibility.states}
              onChange={(e) =>
                onChange({ ...visibility, states: (e.target as HTMLInputElement).checked })
              }
            />
            <Checkbox
              label="County boundaries"
              checked={visibility.counties}
              onChange={(e) =>
                onChange({ ...visibility, counties: (e.target as HTMLInputElement).checked })
              }
            />
            <Checkbox
              label="City/town boundaries"
              checked={visibility.places}
              onChange={(e) =>
                onChange({ ...visibility, places: (e.target as HTMLInputElement).checked })
              }
            />
          </Pane>
        </Pane>
      )}
    </Pane>
  );
}

export default BoundaryControl;
