"use client";

import { useState, useMemo, useEffect, useCallback, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import MapGl, {
  Source,
  Layer,
  Marker,
  ViewState,
  SourceProps,
  LayerProps,
  LngLatBoundsLike,
} from "react-map-gl/maplibre";
import { Pane, Alert, Text } from "evergreen-ui";

import MapContext, { MapStyle, SOURCE_TILE_ID } from "@/contexts/map";
import MarkersContext from "@/contexts/markers";
import TokenContext from "@/contexts/token";
import DrawContext, { DrawMode } from "@/contexts/draw";
import ParcellesContext from "@/contexts/parcelles";
import BalDataContext from "@/contexts/bal-data";

import {
  getTilesLayers,
  VOIE_LABEL,
  VOIE_TRACE_LINE,
  NUMEROS_POINT,
  NUMEROS_LABEL,
  LAYERS_SOURCE,
  TOPONYME_LABEL,
  TilesLayerMode,
  ZOOM,
} from "@/components/map/layers/tiles";
import EditableMarker from "@/components/map/editable-marker";
import NumerosMarkers from "@/components/map/numeros-markers";
import MapMarker from "@/components/map/map-marker";
import PopupFeature from "@/components/map/popup-feature/popup-feature";
import NavControl from "@/components/map/controls/nav-control";
import StyleControl from "@/components/map/controls/style-control";
import AddressEditorControl from "@/components/map/controls/address-editor-control";
import ImageControl from "@/components/map/controls/image-control";
import useBounds from "@/components/map/hooks/bounds";
import useHovered from "@/components/map/hooks/hovered";
import { ExtendedBaseLocaleDTO, Numero } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { CommuneType } from "@/types/commune";
import {
  handleSelectToponyme,
  handleSelectVoie,
  resetMapFilter,
  setMapFilter,
} from "@/lib/utils/map";
import GeolocationControl from "./controls/geolocation-control";
import {
  getStyleDynamically,
  buildOrthoStyle,
  resolveOrthoTiles,
  planIGN,
  vector,
} from "./styles";
import {
  parcelLayers,
  parcelRasterLayer,
  LAYER as PARCEL_LAYER,
  SOURCE_LAYER as PARCEL_SOURCE_LAYER,
  SOURCE as PARCEL_SOURCE,
  PARCELS_AVAILABLE,
  PARCEL_TILES_URL,
  PARCEL_TILES_TYPE,
  PARCEL_PROMOTE_ID,
} from "./layers/parcels";
import {
  BUILDINGS_SOURCE,
  BUILDINGS_LAYER,
  BUILDINGS_MIN_ZOOM,
  buildingLayers,
  fetchBuildings,
  EMPTY_BUILDINGS,
  BuildingsFeatureCollection,
  OFF_BUILDING_SOURCE,
  offBuildingLayer,
} from "./layers/buildings";
import { isPointOnAnyBuilding } from "@/lib/utils/point-in-polygon";
import {
  MAPILLARY_FEATURES_SOURCE_ID,
  MAPILLARY_FEATURES_TILE_URL,
  MAPILLARY_FEATURE_LAYER,
  mapillaryFeatureLayers,
  addMapillaryFeatureIcons,
  fetchDetectionImageId,
  MAILBOX_VALUE,
  MAILBOX_COLOR,
  DRIVEWAY_COLOR,
} from "./layers/mapillary-features";
import { fetchDetectionForFeature } from "./layers/mapillary-detection";
import RulerControl from "./controls/ruler-control";
import MapillaryControl from "./controls/mapillary-control";
import MapillaryViewer from "./mapillary-viewer";
import BoundaryControl from "./controls/boundary-control";
import {
  MAPILLARY_LAYERS_SOURCE,
  MAPILLARY_PICTURE_LAYER_ID,
  MAPILLARY_SOURCE_ID,
  MAPILLARY_TILE_URL,
  mapillaryPictureLayer,
  mapillarySequenceLayer,
} from "./layers/mapillary";
import {
  boundarySourceConfigs,
  boundaryLayerConfigs,
  BOUNDARY_SOURCES,
  BOUNDARY_LAYERS,
} from "./layers/boundaries";

const settings = {
  maxZoom: 19,
};

const interactionProps = {
  dragPan: true,
  dragRotate: true,
  scrollZoom: true,
  touchZoom: true,
  touchRotate: true,
  keyboard: true,
  doubleClickZoom: true,
};

export interface MapProps {
  commune: CommuneType;
  baseLocale: ExtendedBaseLocaleDTO;
  isAddressFormOpen: boolean;
  handleAddressForm: (open: boolean) => void;
}

function Map({
  commune,
  baseLocale,
  isAddressFormOpen,
  handleAddressForm,
}: MapProps) {
  const router = useRouter();
  const params = useParams();
  const {
    map,
    isTileSourceLoaded,
    handleMapRef,
    style,
    setStyle,
    isStyleLoaded,
    viewport,
    setViewport,
    isParcelsDisplayed,
    setIsParcelsDisplayed,
    boundaryVisibility,
    setBoundaryVisibility,
    balTilesUrl,
    isMapLoaded,
    tileLayersMode,
  } = useContext(MapContext);
  const { isParcelleSelectionEnabled, handleParcelles } =
    useContext(ParcellesContext);
  const { isMobile } = useContext(LayoutContext);
  const [showMapillary, setShowMapillary] = useState(false);
  const [mapillaryImageId, setMapillaryImageId] = useState<string | null>(null);
  const [mapillaryCamera, setMapillaryCamera] = useState<{
    lng: number;
    lat: number;
    bearing: number;
  } | null>(null);

  const [cursor, setCursor] = useState("default");
  const [isContextMenuDisplayed, setIsContextMenuDisplayed] = useState(null);
  const [mapStyle, setMapStyle] = useState<any>(generateNewStyle(style));
  const [isBuildingsDisplayed, setIsBuildingsDisplayed] = useState(false);
  const [buildingsData, setBuildingsData] =
    useState<BuildingsFeatureCollection>(EMPTY_BUILDINGS);
  const [offBuildingData, setOffBuildingData] = useState<any>({
    type: "FeatureCollection",
    features: [],
  });
  const [offBuildingCount, setOffBuildingCount] = useState(0);
  const [isMapillaryFeaturesDisplayed, setIsMapillaryFeaturesDisplayed] =
    useState(false);
  // When a mailbox/driveway is clicked, the geo location of that detection so
  // the imagery viewer can drop a pin showing where it is. `color` tags it by
  // kind (driveway vs mailbox); the viewer renders it as a prominent, world-
  // anchored marker that stays glued to the spot as the user moves between
  // images.
  const [mapillaryDetectionPoint, setMapillaryDetectionPoint] = useState<{
    id: string;
    lng: number;
    lat: number;
    color?: string;
  } | null>(null);
  // The detected object's outline (basic image coords) to highlight in the photo.
  const [mapillaryDetectionPolygon, setMapillaryDetectionPolygon] = useState<
    number[][] | null
  >(null);
  // The same object's outline in every image it was detected in (imageId →
  // outline), so the highlight follows the object as the user navigates images.
  const [mapillaryDetectionByImage, setMapillaryDetectionByImage] = useState<
    Record<string, number[][]>
  >({});

  const balId = params.balId;
  const { voie, toponyme, numeros, editingId, setEditingId, isEditing } =
    useContext(BalDataContext);
  const { hint, drawMode } = useContext(DrawContext);
  const { token } = useContext(TokenContext);
  const { markers, setPendingBuildingPlacement } = useContext(MarkersContext);

  const [handleHover, handleMouseLeave, featureHovered] = useHovered(map);
  const bounds = useBounds(map, commune, voie, toponyme);

  // Address points near the Mapillary camera, pulled from the rendered numeros
  // tiles so the viewer can pin them in the photo whether or not a single
  // street is open. Keyed on the rounded camera position so it doesn't recompute
  // on every bearing change while panning the photo.
  const camPosKey = mapillaryCamera
    ? `${mapillaryCamera.lng.toFixed(5)}|${mapillaryCamera.lat.toFixed(5)}`
    : "";
  const mapillaryPoints = useMemo(() => {
    if (!map || !mapillaryCamera) return [];
    let feats: any[] = [];
    try {
      feats = map.queryRenderedFeatures({ layers: [NUMEROS_POINT] }) || [];
    } catch {
      return [];
    }
    const { lng, lat } = mapillaryCamera;
    const mLon = 111320 * Math.cos((lat * Math.PI) / 180);
    const mLat = 111320;
    const seen = new Set<string>();
    const out: { id: string; lng: number; lat: number }[] = [];
    for (const f of feats) {
      const c = (f.geometry as any)?.coordinates;
      if (!c) continue;
      const dx = (c[0] - lng) * mLon;
      const dy = (c[1] - lat) * mLat;
      if (dx * dx + dy * dy > 200 * 200) continue; // within ~200 m of the camera
      const id = String(f.properties?.id ?? `${c[0]},${c[1]}`);
      if (seen.has(id)) continue;
      seen.add(id);
      out.push({ id, lng: c[0], lat: c[1] });
      if (out.length >= 80) break;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, camPosKey]);

  const displayPopupFeature =
    featureHovered !== null &&
    viewport.zoom > 14 &&
    (featureHovered.sourceLayer === LAYERS_SOURCE.VOIES_POINTS ||
      featureHovered.sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS ||
      featureHovered.sourceLayer === LAYERS_SOURCE.TOPONYME_POINTS ||
      featureHovered.sourceLayer === MAPILLARY_LAYERS_SOURCE.PICTURES);

  function getBaseStyle(style: MapStyle | string) {
    const fondDeCarte = baseLocale.settings?.fondsDeCartes?.find(
      ({ name }) => name === style
    );
    if (fondDeCarte) {
      return getStyleDynamically(fondDeCarte);
    }
    switch (style) {
      case MapStyle.ORTHO:
        return buildOrthoStyle(
          resolveOrthoTiles(commune.countyFips ?? commune.code?.slice(0, 5))
        );

      case MapStyle.VECTOR:
        return vector;

      case MapStyle.PLAN_IGN:
        return planIGN;
      default:
        return vector;
    }
  }

  function generateNewStyle(style: MapStyle | string) {
    const baseStyle = getBaseStyle(style);
    // Parcel layers are added as dynamic <Source>/<Layer> components, not baked into the style.
    return baseStyle;
  }

  const updatePositionsLayer = useCallback(() => {
    if (map && isTileSourceLoaded) {
      if (voie && drawMode === DrawMode.DRAW_METRIC_VOIE) {
        setMapFilter(map, NUMEROS_POINT, ["==", ["get", "idVoie"], voie.id]);
        setMapFilter(map, NUMEROS_LABEL, ["==", ["get", "idVoie"], voie.id]);
        setMapFilter(map, VOIE_LABEL, ["==", ["get", "id"], voie.id]);
        // Hide all traces
        setMapFilter(map, VOIE_TRACE_LINE, ["==", ["get", "id"], ""]);
        map.setLayerZoomRange(
          NUMEROS_POINT,
          ZOOM.NUMEROS_ZOOM.minZoom,
          ZOOM.NUMEROS_ZOOM.maxZoom
        );
      } else if (voie) {
        setMapFilter(map, VOIE_TRACE_LINE, null);
        setMapFilter(map, NUMEROS_POINT, null);
        setMapFilter(
          map,
          NUMEROS_LABEL,
          drawMode === DrawMode.RULER
            ? null
            : ["!=", ["get", "idVoie"], voie.id]
        );
        setMapFilter(map, VOIE_LABEL, null);
        setMapFilter(map, TOPONYME_LABEL, null);
        // Remove maxZoom filter to see numéros points on all zoom levels
        map.setLayerZoomRange(NUMEROS_POINT, undefined, undefined);
      } else if (toponyme) {
        setMapFilter(map, VOIE_TRACE_LINE, null);
        setMapFilter(map, NUMEROS_POINT, null);
        setMapFilter(map, NUMEROS_LABEL, [
          "!=",
          ["get", "idToponyme"],
          toponyme.id,
        ]);
        setMapFilter(map, VOIE_LABEL, null);
        setMapFilter(map, TOPONYME_LABEL, null);
        // Remove maxZoom filter to see numéros points on all zoom levels
        map.setLayerZoomRange(NUMEROS_POINT, undefined, undefined);
      } else {
        // Remove filter
        resetMapFilter(map);
        map.setLayerZoomRange(
          NUMEROS_POINT,
          ZOOM.NUMEROS_ZOOM.minZoom,
          ZOOM.NUMEROS_ZOOM.maxZoom
        );
      }
    }
  }, [map, voie, isTileSourceLoaded, drawMode, toponyme]);

  const interactiveLayerIds = useMemo(() => {
    const layers = [];

    if (isParcelleSelectionEnabled && isParcelsDisplayed && PARCELS_AVAILABLE) {
      return [PARCEL_LAYER.PARCELS_FILL];
    }

    if (!isEditing && isTileSourceLoaded) {
      layers.push(
        VOIE_TRACE_LINE,
        NUMEROS_POINT,
        NUMEROS_LABEL,
        VOIE_LABEL,
        TOPONYME_LABEL,
        MAPILLARY_PICTURE_LAYER_ID
      );
    }

    // Make building footprints clickable (to place a building-typed address)
    // while the layer is shown and we're not mid-edit.
    if (isBuildingsDisplayed && !isEditing) {
      layers.push(BUILDINGS_LAYER.FILL);
    }

    // Make mailbox/driveway icons clickable (to open the detection imagery).
    if (isMapillaryFeaturesDisplayed) {
      layers.push(
        MAPILLARY_FEATURE_LAYER.MAILBOX,
        MAPILLARY_FEATURE_LAYER.DRIVEWAY
      );
    }

    return layers;
  }, [
    isEditing,
    isParcelleSelectionEnabled,
    isParcelsDisplayed,
    isTileSourceLoaded,
    isBuildingsDisplayed,
    isMapillaryFeaturesDisplayed,
  ]);

  const onClick = useCallback(
    (event) => {
      const features = map
        .queryRenderedFeatures(event.point)
        .filter(({ source }) => {
          return (
            source === PARCEL_SOURCE ||
            source === "tiles" ||
            source === MAPILLARY_SOURCE_ID ||
            source === BUILDINGS_SOURCE ||
            source === MAPILLARY_FEATURES_SOURCE_ID
          );
        });

      // Clicking a detected mailbox/driveway opens the Mapillary imagery viewer
      // on the photo it was detected from, with a pin at its location.
      if (isMapillaryFeaturesDisplayed) {
        const feat = features.find(
          (f) => f.source === MAPILLARY_FEATURES_SOURCE_ID
        );
        if (feat) {
          const coords = (feat.geometry as any)?.coordinates;
          const featureId = String(feat.properties?.id ?? "");
          const featureColor =
            feat.properties?.value === MAILBOX_VALUE
              ? MAILBOX_COLOR
              : DRIVEWAY_COLOR;
          if (featureId) {
            const openAt = (
              imageId: string | null,
              polygon: number[][] | null,
              byImage: Record<string, number[][]> = {}
            ) => {
              if (!imageId) return;
              if (coords) {
                setMapillaryDetectionPoint({
                  id: featureId,
                  lng: coords[0],
                  lat: coords[1],
                  color: featureColor,
                });
              }
              setMapillaryDetectionByImage(byImage);
              setMapillaryDetectionPolygon(polygon);
              setMapillaryImageId(imageId);
            };
            // Prefer the detection (gives the image + the object's outline);
            // fall back to the feature's first image if detections are absent.
            fetchDetectionForFeature(featureId).then((det) => {
              if (det?.imageId) {
                openAt(det.imageId, det.polygon, det.byImage);
              } else {
                fetchDetectionImageId(featureId).then((imageId) =>
                  openAt(imageId, null)
                );
              }
            });
          }
          setIsContextMenuDisplayed(null);
          return;
        }
      }

      // Clicking an Overture building footprint starts a new building-typed
      // address at the click location, linked to the building's GERS ID.
      if (isBuildingsDisplayed && !isEditing) {
        const building = features.find((f) => f.source === BUILDINGS_SOURCE);
        if (building) {
          const { lng, lat } = event.lngLat || {};
          setPendingBuildingPlacement({
            longitude: lng,
            latitude: lat,
            gersId: building.properties?.gersId,
          });
          handleAddressForm(true);
          setIsContextMenuDisplayed(null);
          return;
        }
      }

      const feature = features && features[0];
      const source = feature && feature.source;

      switch (source) {
        case PARCEL_SOURCE: {
          const parcels = features.filter(
            ({ source, sourceLayer, layer }) =>
              source === PARCEL_SOURCE &&
              sourceLayer === PARCEL_SOURCE_LAYER.PARCELS &&
              layer?.id === PARCEL_LAYER.PARCELS_FILL
          );

          if (parcels.length > 0) {
            handleParcelles(parcels.map(({ properties }) => properties.id));
          }
          break;
        }
        case "tiles": {
          if (feature && !isEditing) {
            if (tileLayersMode === TilesLayerMode.TOPONYME) {
              handleSelectToponyme(feature, router, balId as string);
            } else {
              handleSelectVoie(feature, router, balId as string);
            }
          }
          break;
        }
        case MAPILLARY_SOURCE_ID: {
          if (feature.sourceLayer === MAPILLARY_LAYERS_SOURCE.PICTURES) {
            setMapillaryImageId(feature.properties.id);
          }
          break;
        }
        default:
          break;
      }

      setIsContextMenuDisplayed(null);
    },
    [
      router,
      balId,
      setEditingId,
      isEditing,
      voie,
      handleParcelles,
      tileLayersMode,
      isBuildingsDisplayed,
      setPendingBuildingPlacement,
      handleAddressForm,
      isMapillaryFeaturesDisplayed,
    ]
  );

  useEffect(() => {
    if (drawMode) {
      setCursor("crosshair");
    } else if (featureHovered) {
      setCursor("pointer");
    } else {
      setCursor("default");
    }
  }, [drawMode, featureHovered]);

  // Fetch Overture building footprints for the current viewport (debounced),
  // only while the buildings layer is enabled and the zoom is high enough to
  // keep the bbox — and the payload — small.
  useEffect(() => {
    if (!isBuildingsDisplayed || !map) {
      return;
    }
    if ((viewport?.zoom ?? 0) < BUILDINGS_MIN_ZOOM) {
      setBuildingsData(EMPTY_BUILDINGS);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const b = map.getBounds();
        const bbox = `${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}`;
        const fc = await fetchBuildings(bbox);
        if (!cancelled) {
          setBuildingsData(fc);
        }
      } catch (err) {
        console.error("Failed to load Overture buildings", err);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isBuildingsDisplayed, viewport, map]);

  // Address validation: flag address points that don't fall on any building
  // footprint. Runs over the numero points rendered in the viewport and the
  // building footprints currently loaded.
  useEffect(() => {
    const empty = { type: "FeatureCollection", features: [] };
    if (
      !isBuildingsDisplayed ||
      !map ||
      (viewport?.zoom ?? 0) < BUILDINGS_MIN_ZOOM ||
      buildingsData.features.length === 0
    ) {
      setOffBuildingData(empty);
      setOffBuildingCount(0);
      return;
    }
    const timer = setTimeout(() => {
      try {
        const numeroFeatures =
          map.queryRenderedFeatures({ layers: [NUMEROS_POINT] }) || [];
        const seen = new Set<string>();
        const orphans: any[] = [];
        for (const f of numeroFeatures) {
          const coords = (f.geometry as any)?.coordinates;
          if (!coords) continue;
          const id = String(f.properties?.id ?? coords.join(","));
          if (seen.has(id)) continue;
          seen.add(id);
          const [lng, lat] = coords;
          if (!isPointOnAnyBuilding(lng, lat, buildingsData.features as any)) {
            orphans.push({
              type: "Feature",
              geometry: { type: "Point", coordinates: [lng, lat] },
              properties: { id },
            });
          }
        }
        setOffBuildingData({ type: "FeatureCollection", features: orphans });
        setOffBuildingCount(orphans.length);
      } catch (err) {
        console.error("Off-building address check failed", err);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isBuildingsDisplayed, buildingsData, viewport, map]);

  // Register the mailbox/driveway icons once the style is ready (style swaps
  // drop registered images, so re-run when the style reloads).
  useEffect(() => {
    if (map && isStyleLoaded) {
      addMapillaryFeatureIcons(map);
    }
  }, [map, isStyleLoaded]);

  // When the imagery viewer opens, pan (without changing zoom) so the selected
  // point stays centered in the map area not covered by the docked viewer
  // (bottom-right), so the user doesn't have to readjust the view.
  useEffect(() => {
    if (!map || !mapillaryImageId || isMobile) {
      return;
    }
    const target = mapillaryDetectionPoint
      ? { lng: mapillaryDetectionPoint.lng, lat: mapillaryDetectionPoint.lat }
      : markers[0]?.longitude != null && markers[0]?.latitude != null
        ? { lng: markers[0].longitude, lat: markers[0].latitude }
        : null;
    if (!target) {
      return;
    }
    try {
      map.easeTo({
        center: [target.lng, target.lat],
        // Reserve space for the docked viewer (≈440×320 at bottom-right + margin).
        padding: { top: 0, left: 0, right: 456, bottom: 336 },
        duration: 500,
      });
    } catch {
      /* ignore */
    }
    // Only react to the viewer opening, not to marker drags / point updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapillaryImageId, map]);

  // Hide current voie's or toponyme's numeros
  useEffect(() => {
    updatePositionsLayer();
  }, [map, voie, toponyme, updatePositionsLayer]);

  // Change map's style and adapte layers
  useEffect(() => {
    if (map) {
      setMapStyle(generateNewStyle(style));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, style]);

  useEffect(() => {
    if (isStyleLoaded) {
      updatePositionsLayer();
    }
  }, [isStyleLoaded, updatePositionsLayer]);

  useEffect(() => {
    if (map) {
      const hash = window.location.hash.slice(1);

      if (bounds) {
        const camera = map.cameraForBounds(bounds as LngLatBoundsLike, {
          padding: 100,
        });
        setViewport((viewport: ViewState) => ({
          ...viewport,
          bearing: camera.bearing,
          longitude: (camera.center as any).lng,
          latitude: (camera.center as any).lat,
          zoom: camera.zoom,
        }));
      } else if (hash) {
        const [zoom, latitude, longitude]: string[] = hash.split("/");
        setViewport((viewport: ViewState) => ({
          ...viewport,
          longitude: Number(longitude),
          latitude: Number(latitude),
          zoom: Number(zoom),
        }));
      }
    }
  }, [map, bounds, setViewport]);

  const sourceTiles: SourceProps = useMemo(() => {
    return {
      id: SOURCE_TILE_ID,
      type: "vector",
      tiles: [balTilesUrl],
      promoteId: "id",
    };
  }, [balTilesUrl]);

  // Jurisdiction boundary highlight (subtle fill for current jurisdiction area)
  const layerCommune: LayerProps = useMemo(() => {
    return {
      id: "communes-fill",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "boundary",
      paint: {
        "fill-color": "#3288bd",
        "fill-opacity": 0,
      },
    };
  }, [commune]);

  const selectedVoieColor = useMemo(() => {
    if (!voie || !isMapLoaded) {
      return;
    }

    const featuresList = map?.querySourceFeatures(SOURCE_TILE_ID, {
      sourceLayer: LAYERS_SOURCE.VOIES_POINTS,
    });

    return featuresList?.find((feature) => feature.id === voie.id)?.properties
      .color;
  }, [map, voie, isMapLoaded]);


  return (
    <Pane display="flex" flexDirection="column" flex={1}>
      <StyleControl
        style={style}
        handleStyle={setStyle}
        baseLocale={baseLocale}
        commune={commune}
        isParcelsDisplayed={isParcelsDisplayed}
        handleParcelsToggle={setIsParcelsDisplayed}
        isBuildingsDisplayed={isBuildingsDisplayed}
        handleBuildingsToggle={() => setIsBuildingsDisplayed((show) => !show)}
        isMapillaryFeaturesDisplayed={isMapillaryFeaturesDisplayed}
        handleMapillaryFeaturesToggle={
          MAPILLARY_FEATURES_TILE_URL
            ? () => setIsMapillaryFeaturesDisplayed((show) => !show)
            : undefined
        }
      />

      <Pane
        position="absolute"
        zIndex={1}
        top={90}
        right={10}
        display="flex"
        flexDirection="column"
        gap={8}
      >
        {token && !isMobile && (
          <AddressEditorControl
            isAddressFormOpen={isAddressFormOpen}
            handleAddressForm={handleAddressForm}
            isDisabled={isEditing && !isAddressFormOpen}
          />
        )}
        {!isMobile && <ImageControl map={map} communeNom={commune.nom} />}
        {!isMobile && <RulerControl disabled={isEditing} />}
        {isMobile && navigator.geolocation && <GeolocationControl map={map} />}
        <MapillaryControl
          commune={commune}
          map={map}
          showMapillary={showMapillary}
          setShowMapillary={setShowMapillary}
        />
        <BoundaryControl
          visibility={boundaryVisibility}
          onChange={setBoundaryVisibility}
        />
      </Pane>

      {hint && (
        <Pane
          zIndex={1}
          position="fixed"
          alignSelf="center"
          top={130}
          maxWidth="50%"
        >
          <Alert title={hint} />
        </Pane>
      )}

      {isBuildingsDisplayed && offBuildingCount > 0 && (
        <Pane
          zIndex={1}
          position="absolute"
          top={96}
          left="50%"
          style={{ transform: "translateX(-50%)" }}
        >
          <Alert
            intent="warning"
            title={`${offBuildingCount} address${
              offBuildingCount === 1 ? "" : "es"
            } in view not on a building footprint`}
          />
        </Pane>
      )}

      {isMapillaryFeaturesDisplayed && (
        <Pane
          zIndex={1}
          position="absolute"
          // Drop below the off-building warning banner when it's showing, so the
          // two top overlays stack instead of overlapping (clears a 2-line alert).
          top={isBuildingsDisplayed && offBuildingCount > 0 ? 184 : 96}
          right={64}
          background="white"
          paddingX={10}
          paddingY={6}
          borderRadius={4}
          elevation={1}
          display="flex"
          flexDirection="column"
          gap={4}
        >
          <Pane display="flex" alignItems="center" gap={6}>
            <Pane
              width={10}
              height={10}
              borderRadius="50%"
              background="#1d6fd6"
            />
            <Text fontSize={12}>Mailbox (Mapillary)</Text>
          </Pane>
          <Pane display="flex" alignItems="center" gap={6}>
            <Pane
              width={10}
              height={10}
              borderRadius="50%"
              background="#7d3cc9"
            />
            <Text fontSize={12}>Driveway entrance (Mapillary)</Text>
          </Pane>
        </Pane>
      )}

      <Pane display="flex" flex={1} position="relative">
        <MapGl
          ref={handleMapRef}
          hash={true}
          {...viewport}
          mapStyle={mapStyle}
          styleDiffing={false}
          {...settings}
          {...interactionProps}
          interactiveLayerIds={interactiveLayerIds}
          cursor={cursor}
          onClick={onClick}
          onMove={({ viewState }) => setViewport(viewState)}
          onTouchEnd={onClick}
          onMouseMove={handleHover}
          onMouseLeave={handleMouseLeave}
          onMouseOut={handleMouseLeave}
          dragRotate={false}
        >
          <NavControl />

          <Layer {...(layerCommune as LayerProps)} />

          <Source {...sourceTiles}>
            {Object.values(getTilesLayers(tileLayersMode)).map((layer) => (
              <Layer key={layer.id} {...(layer as LayerProps)} />
            ))}
          </Source>

          {MAPILLARY_TILE_URL && (
            <Source
              id={MAPILLARY_SOURCE_ID}
              type="vector"
              tiles={[MAPILLARY_TILE_URL]}
              minzoom={6}
              maxzoom={14}
            >
              <Layer
                {...({
                  ...mapillarySequenceLayer,
                  paint: {
                    ...mapillarySequenceLayer.paint,
                    "line-opacity": showMapillary ? 1 : 0,
                  },
                } as LayerProps)}
              />
              <Layer
                {...({
                  ...mapillaryPictureLayer,
                  layout: { visibility: showMapillary ? "visible" : "none" },
                } as LayerProps)}
              />
            </Source>
          )}

          {/* TIGER Boundary Layers — States */}
          <Source
            id={BOUNDARY_SOURCES.STATES}
            type="raster"
            tiles={boundarySourceConfigs[BOUNDARY_SOURCES.STATES].tiles}
            tileSize={256}
          >
            <Layer
              {...({
                ...boundaryLayerConfigs[BOUNDARY_LAYERS.STATES],
                layout: {
                  visibility: boundaryVisibility.states ? "visible" : "none",
                },
              } as LayerProps)}
            />
          </Source>

          {/* TIGER Boundary Layers — Counties */}
          <Source
            id={BOUNDARY_SOURCES.COUNTIES}
            type="raster"
            tiles={boundarySourceConfigs[BOUNDARY_SOURCES.COUNTIES].tiles}
            tileSize={256}
          >
            <Layer
              {...({
                ...boundaryLayerConfigs[BOUNDARY_LAYERS.COUNTIES],
                layout: {
                  visibility: boundaryVisibility.counties ? "visible" : "none",
                },
              } as LayerProps)}
            />
          </Source>

          {/* TIGER Boundary Layers — Incorporated Places (cities/towns) */}
          <Source
            id={BOUNDARY_SOURCES.PLACES}
            type="raster"
            tiles={boundarySourceConfigs[BOUNDARY_SOURCES.PLACES].tiles}
            tileSize={256}
          >
            <Layer
              {...({
                ...boundaryLayerConfigs[BOUNDARY_LAYERS.PLACES],
                layout: {
                  visibility: boundaryVisibility.places ? "visible" : "none",
                },
              } as LayerProps)}
            />
          </Source>

          {/* Overture Building Footprints (viewport-driven GeoJSON) */}
          {isBuildingsDisplayed && (
            <Source
              id={BUILDINGS_SOURCE}
              type="geojson"
              data={buildingsData as any}
            >
              {buildingLayers.map((layer) => (
                <Layer key={layer.id} {...(layer as LayerProps)} />
              ))}
            </Source>
          )}

          {/* Address validation: addresses not on any building footprint */}
          {isBuildingsDisplayed && (
            <Source
              id={OFF_BUILDING_SOURCE}
              type="geojson"
              data={offBuildingData as any}
            >
              <Layer {...(offBuildingLayer as LayerProps)} />
            </Source>
          )}

          {/* Mapillary map-features: mailboxes + driveway entrances */}
          {isMapillaryFeaturesDisplayed && MAPILLARY_FEATURES_TILE_URL && (
            <Source
              id={MAPILLARY_FEATURES_SOURCE_ID}
              type="vector"
              tiles={[MAPILLARY_FEATURES_TILE_URL]}
              minzoom={14}
              maxzoom={14}
            >
              {mapillaryFeatureLayers.map((layer) => (
                <Layer key={layer.id} {...(layer as LayerProps)} />
              ))}
            </Source>
          )}

          {/* US Parcel Tile Layers */}
          {PARCELS_AVAILABLE && PARCEL_TILES_TYPE === "vector" && (
            <Source
              id={PARCEL_SOURCE}
              type="vector"
              tiles={[PARCEL_TILES_URL]}
              promoteId={PARCEL_PROMOTE_ID}
              minzoom={14}
              maxzoom={20}
            >
              {parcelLayers.map((layer) => (
                <Layer
                  key={layer.id}
                  {...({
                    ...layer,
                    layout: {
                      ...layer.layout,
                      visibility: isParcelsDisplayed
                        ? layer.layout?.visibility === "none"
                          ? "visible"
                          : layer.layout?.visibility
                        : "none",
                    },
                  } as LayerProps)}
                />
              ))}
            </Source>
          )}

          {PARCELS_AVAILABLE && PARCEL_TILES_TYPE === "raster" && (
            <Source
              id={PARCEL_SOURCE}
              type="raster"
              tiles={[PARCEL_TILES_URL]}
              tileSize={256}
              minzoom={15}
              maxzoom={17}
            >
              <Layer
                {...({
                  ...parcelRasterLayer,
                  layout: {
                    visibility: isParcelsDisplayed ? "visible" : "none",
                  },
                } as LayerProps)}
              />
            </Source>
          )}

          {(voie || toponyme) && !drawMode && numeros && (
            <NumerosMarkers
              numeros={numeros.filter(({ id }) => id !== editingId) as Numero[]}
              isContextMenuDisplayed={isContextMenuDisplayed}
              setIsContextMenuDisplayed={setIsContextMenuDisplayed}
              color={selectedVoieColor}
            />
          )}

          {isEditing && (
            <EditableMarker
              style={style}
              idVoie={voie?.id}
              isToponyme={Boolean(toponyme)}
              viewport={viewport}
            />
          )}

          {markers
            .filter((marker) => marker.isMapMarker)
            .map((marker) => (
              <MapMarker key={marker.id} marker={marker} />
            ))}

          {displayPopupFeature && (
            <PopupFeature feature={featureHovered} commune={commune} />
          )}

          {mapillaryCamera && (
            <Marker
              longitude={mapillaryCamera.lng}
              latitude={mapillaryCamera.lat}
              anchor="center"
            >
              <div
                style={{
                  transform: `rotate(${mapillaryCamera.bearing}deg)`,
                  transformOrigin: "50% 50%",
                  pointerEvents: "none",
                }}
              >
                <svg width="54" height="54" viewBox="0 0 54 54">
                  {/* Field-of-view cone pointing in the camera's bearing (north-up map) */}
                  <path
                    d="M27 27 L14 3 L40 3 Z"
                    fill="#05CB63"
                    fillOpacity="0.3"
                    stroke="#05CB63"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="27"
                    cy="27"
                    r="5"
                    fill="#05CB63"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </Marker>
          )}
        </MapGl>
        <MapillaryViewer
          imageId={mapillaryImageId}
          onClose={() => {
            setMapillaryImageId(null);
            setMapillaryDetectionPoint(null);
            setMapillaryDetectionPolygon(null);
            setMapillaryDetectionByImage({});
          }}
          onCameraChange={setMapillaryCamera}
          placeMode={!mapillaryDetectionPoint}
          points={
            mapillaryDetectionPoint
              ? [mapillaryDetectionPoint]
              : mapillaryPoints
          }
          detectionPolygon={mapillaryDetectionPolygon}
          detectionByImage={mapillaryDetectionByImage}
        />
      </Pane>
    </Pane>
  );
}

export default Map;
