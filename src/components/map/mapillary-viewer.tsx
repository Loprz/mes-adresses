"use client";

import { useContext, useEffect, useRef, useState } from "react";
import {
  Pane,
  IconButton,
  CrossIcon,
  MaximizeIcon,
  MinimizeIcon,
  Text,
} from "evergreen-ui";
import { useTranslations } from "next-intl";
import { Viewer, CameraControls, SimpleMarker } from "mapillary-js";
import "mapillary-js/dist/mapillary.css";
import MarkersContext from "@/contexts/markers";
import { MAPILLARY_TOKEN } from "./layers/mapillary";

export interface MapillaryCamera {
  lng: number;
  lat: number;
  bearing: number;
}

interface MapillaryViewerProps {
  imageId: string | null;
  onClose: () => void;
  // When true, clicking in the photo moves the active marker to that point.
  placeMode?: boolean;
  // Reports the camera position + viewing direction so the map can draw a
  // field-of-view cone. Called with null when the viewer closes.
  onCameraChange?: (camera: MapillaryCamera | null) => void;
}

function MapillaryViewer({
  imageId,
  onClose,
  placeMode = true,
  onCameraChange,
}: MapillaryViewerProps) {
  const t = useTranslations("mapControls");
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  // Docked (small, bottom-right) vs. maximized (left split, map stays usable).
  const [maximized, setMaximized] = useState(false);

  const { markers, updateMarker } = useContext(MarkersContext);
  // Read markers/updateMarker via refs so the viewer's click handler (bound
  // once at creation) always sees current values instead of a stale closure.
  const markersRef = useRef(markers);
  const updateMarkerRef = useRef(updateMarker);
  const placeModeRef = useRef(placeMode);
  const onCameraChangeRef = useRef(onCameraChange);
  markersRef.current = markers;
  updateMarkerRef.current = updateMarker;
  placeModeRef.current = placeMode;
  onCameraChangeRef.current = onCameraChange;

  // Latest camera position / bearing, combined into one emit to the map.
  const camPosRef = useRef<{ lng: number; lat: number } | null>(null);
  const camBearingRef = useRef<number>(0);

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

    // In-photo pin showing the active address point's current location.
    let markerComp: any = null;
    try {
      markerComp = viewer.getComponent("marker");
    } catch {
      markerComp = null;
    }
    const syncPhotoMarker = () => {
      const active = markersRef.current[0];
      if (!markerComp || !active?.longitude || !active?.latitude) return;
      try {
        markerComp.removeAll();
        markerComp.add([
          new SimpleMarker(
            "nap-active-point",
            { lng: active.longitude, lat: active.latitude },
            {
              color: "#f06a1b",
              ballColor: "#ffffff",
              radius: 1,
              interactive: false,
            }
          ),
        ]);
      } catch {
        /* marker geometry not ready yet — ignore */
      }
    };

    // Report camera position + viewing direction to the map (FOV cone).
    const emitCamera = () => {
      const pos = camPosRef.current;
      if (pos) {
        onCameraChangeRef.current?.({
          lng: pos.lng,
          lat: pos.lat,
          bearing: camBearingRef.current,
        });
      }
    };

    viewer.on("image", (event) => {
      camPosRef.current = event.image.lngLat;
      emitCamera();
      syncPhotoMarker();
    });
    viewer.on("bearing", (event) => {
      camBearingRef.current = event.bearing;
      emitCamera();
    });
    viewer.on("load", syncPhotoMarker);

    const onClick = (event: { lngLat: { lng: number; lat: number } | null }) => {
      if (!placeModeRef.current || !event.lngLat) return;
      const active = markersRef.current[0];
      if (!active) return;
      updateMarkerRef.current(active.id, {
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        type: active.type,
      });
      syncPhotoMarker(); // move the in-photo pin for visible feedback
    };
    viewer.on("click", onClick);

    return () => {
      onCameraChangeRef.current?.(null);
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

  // MapillaryJS needs an explicit resize when its container changes size.
  useEffect(() => {
    const id = window.setTimeout(() => viewerRef.current?.resize(), 50);
    return () => window.clearTimeout(id);
  }, [maximized]);

  if (!imageId || !MAPILLARY_TOKEN) return null;

  const dockedSize = { bottom: 16, right: 16, width: 440, height: 320 };
  const maximizedSize = { top: 0, left: 0, bottom: 0, width: "55%" };

  return (
    <Pane
      position="absolute"
      {...(maximized ? maximizedSize : dockedSize)}
      zIndex={3}
      elevation={3}
      borderRadius={maximized ? 0 : 6}
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
          icon={maximized ? MinimizeIcon : MaximizeIcon}
          appearance="minimal"
          onClick={() => setMaximized((m) => !m)}
          title={maximized ? t("collapseViewer") : t("expandViewer")}
        />
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
