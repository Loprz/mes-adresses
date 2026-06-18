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
import { Pane, Alert } from "evergreen-ui";

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

  const balId = params.balId;
  const { voie, toponyme, numeros, editingId, setEditingId, isEditing } =
    useContext(BalDataContext);
  const { hint, drawMode } = useContext(DrawContext);
  const { token } = useContext(TokenContext);

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

    return layers;
  }, [
    isEditing,
    isParcelleSelectionEnabled,
    isParcelsDisplayed,
    isTileSourceLoaded,
  ]);

  const onClick = useCallback(
    (event) => {
      const features = map
        .queryRenderedFeatures(event.point)
        .filter(({ source }) => {
          return (
            source === PARCEL_SOURCE ||
            source === "tiles" ||
            source === MAPILLARY_SOURCE_ID
          );
        });
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

  const { markers } = useContext(MarkersContext);

  return (
    <Pane display="flex" flexDirection="column" flex={1}>
      <StyleControl
        style={style}
        handleStyle={setStyle}
        baseLocale={baseLocale}
        commune={commune}
        isParcelsDisplayed={isParcelsDisplayed}
        handleParcelsToggle={setIsParcelsDisplayed}
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
          onClose={() => setMapillaryImageId(null)}
          onCameraChange={setMapillaryCamera}
          points={mapillaryPoints}
        />
      </Pane>
    </Pane>
  );
}

export default Map;
