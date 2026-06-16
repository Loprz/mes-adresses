"use client";

import { useContext, useEffect, useRef } from "react";
import { Pane, IconButton, CrossIcon, Text } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { Viewer, CameraControls } from "mapillary-js";
import "mapillary-js/dist/mapillary.css";
import MarkersContext from "@/contexts/markers";
import { MAPILLARY_TOKEN } from "./layers/mapillary";

interface MapillaryViewerProps {
  imageId: string | null;
  onClose: () => void;
  // When true, clicking in the photo moves the active marker to that point.
  placeMode?: boolean;
}

function MapillaryViewer({
  imageId,
  onClose,
  placeMode = true,
}: MapillaryViewerProps) {
  const t = useTranslations("mapControls");
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  const { markers, updateMarker } = useContext(MarkersContext);
  // Read markers/updateMarker via refs so the viewer's click handler (bound
  // once at creation) always sees current values instead of a stale closure.
  const markersRef = useRef(markers);
  const updateMarkerRef = useRef(updateMarker);
  const placeModeRef = useRef(placeMode);
  markersRef.current = markers;
  updateMarkerRef.current = updateMarker;
  placeModeRef.current = placeMode;

  // Create the viewer once we have a container + first image, destroy on unmount.
  useEffect(() => {
    if (!imageId || !containerRef.current || !MAPILLARY_TOKEN) return;

    const viewer = new Viewer({
      accessToken: MAPILLARY_TOKEN,
      container: containerRef.current,
      imageId,
      cameraControls: CameraControls.Street, // required for accurate click lngLat
      component: { cover: false },
    });
    viewerRef.current = viewer;

    const onClick = (event: { lngLat: { lng: number; lat: number } | null }) => {
      if (!placeModeRef.current || !event.lngLat) return;
      const active = markersRef.current[0];
      if (!active) return;
      updateMarkerRef.current(active.id, {
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        type: active.type,
      });
    };
    viewer.on("click", onClick);

    return () => {
      viewer.remove();
      viewerRef.current = null;
    };
    // Re-create only when the source image changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageId]);

  // Navigate to a newly clicked image without rebuilding the viewer.
  useEffect(() => {
    if (viewerRef.current && imageId) {
      viewerRef.current.moveTo(imageId).catch(() => {
        /* image not navigable yet — ignore */
      });
    }
  }, [imageId]);

  if (!imageId || !MAPILLARY_TOKEN) return null;

  return (
    <Pane
      position="absolute"
      bottom={16}
      right={16}
      width={440}
      height={320}
      zIndex={3}
      elevation={3}
      borderRadius={6}
      overflow="hidden"
      background="white"
    >
      <Pane
        position="absolute"
        top={6}
        right={6}
        zIndex={4}
        display="flex"
        alignItems="center"
        gap={6}
      >
        {placeMode && (
          <Text
            size={300}
            background="rgba(0,0,0,0.65)"
            color="white"
            paddingX={6}
            paddingY={2}
            borderRadius={4}
          >
            {t("clickPhotoToPlace")}
          </Text>
        )}
        <IconButton
          icon={CrossIcon}
          appearance="minimal"
          onClick={onClose}
          title={t("closeStreetView")}
        />
      </Pane>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </Pane>
  );
}

export default MapillaryViewer;
