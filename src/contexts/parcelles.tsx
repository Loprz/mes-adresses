"use client";

import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { xor } from "lodash";
import type { Map as MaplibreMap, ExpressionSpecification } from "maplibre-gl";

import {
  SOURCE as PARCEL_SOURCE,
  SOURCE_LAYER as PARCEL_SOURCE_LAYER,
  LAYER as PARCEL_LAYER,
  PARCELS_AVAILABLE,
  PARCEL_TILES_TYPE,
} from "@/components/map/layers/parcels";

import { ChildrenProps } from "@/types/context";
import MapContext from "@/contexts/map";
import BalDataContext from "./bal-data";

interface ParcellesContextType {
  highlightedParcelles: string[];
  setHighlightedParcelles: React.Dispatch<React.SetStateAction<string[]>>;
  isParcelleSelectionEnabled: boolean;
  setIsParcelleSelectionEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  hoveredParcelles: { id: string; featureId?: string }[];
  handleHoveredParcelles: (parcelleHoveredIds: string[]) => void;
  handleParcelles: (parcellesToggle: string[]) => void;
  setShowSelectedParcelles?: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetFeatureState: (
    parcelleId: string,
    state: { [key: string]: any }
  ) => void;
  isDiffMode?: boolean;
  setIsDiffMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ParcellesContext = React.createContext<ParcellesContextType | null>(null);

// For vector tiles: query features by parcel ID
function getFeatureId(map: MaplibreMap, id: string): string | undefined {
  if (PARCEL_TILES_TYPE !== "vector") return undefined;

  const [feature] = map.querySourceFeatures(PARCEL_SOURCE, {
    sourceLayer: PARCEL_SOURCE_LAYER.PARCELS,
    filter: ["==", ["get", "id"], id],
  });

  return (feature?.id as string) || undefined;
}

export function ParcellesContextProvider(props: ChildrenProps) {
  const { map, isParcelsDisplayed, isStyleLoaded } = useContext(MapContext);
  const {
    baseLocale,
    commune,
    parcelles: selectedParcelles,
  } = useContext(BalDataContext);
  const [showSelectedParcelles, setShowSelectedParcelles] =
    useState<boolean>(true);
  const [isDiffMode, setIsDiffMode] = useState<boolean>(false);
  const [hoveredParcelles, setHoveredParcelles] = useState<
    {
      id: string;
      featureId?: string;
    }[]
  >([]);
  const [isParcelleSelectionEnabled, setIsParcelleSelectionEnabled] =
    useState<boolean>(false);
  const [highlightedParcelles, setHighlightedParcelles] = useState<string[]>(
    []
  );

  const prevHoveredParcelle = useRef<string[]>([]);

  // Feature state operations only work with vector tiles
  const isVectorTiles = PARCEL_TILES_TYPE === "vector" && PARCELS_AVAILABLE;

  const setHoverFeature = useCallback(
    (featureId: string, hover: boolean) => {
      if (!isVectorTiles || !map) return;
      map.setFeatureState(
        {
          source: PARCEL_SOURCE,
          sourceLayer: PARCEL_SOURCE_LAYER.PARCELS,
          id: featureId,
        },
        { hover }
      );
    },
    [map, isVectorTiles]
  );

  const handleHoveredParcelles = useCallback(
    (parcelleHoveredIds: string[]) => {
      if (map && isVectorTiles) {
        // Remove hover from parcels that are no longer hovered
        const oldHovereds: string[] = prevHoveredParcelle.current.filter(
          (id) => !parcelleHoveredIds.includes(id)
        );
        for (const oldHovered of oldHovereds) {
          const featureId: string = getFeatureId(map, oldHovered);
          setHoverFeature(featureId, false);
        }
        // Add hover to newly hovered parcels
        const newHovereds: string[] = parcelleHoveredIds.filter(
          (id) => !prevHoveredParcelle.current.includes(id)
        );
        for (const newHovered of newHovereds) {
          const featureId: string = getFeatureId(map, newHovered);
          setHoverFeature(featureId, true);
        }
        prevHoveredParcelle.current = parcelleHoveredIds;
        const newHoveredParcelles = parcelleHoveredIds.map((id) => ({
          id,
          featureId: getFeatureId(map, id),
        }));
        setHoveredParcelles(newHoveredParcelles);
      } else if (
        prevHoveredParcelle?.current?.length > 0 &&
        isParcelsDisplayed
      ) {
        for (const featureId of prevHoveredParcelle.current) {
          setHoverFeature(featureId, false);
        }
        prevHoveredParcelle.current = [];
        setHoveredParcelles([]);
      }
    },
    [map, isParcelsDisplayed, setHoverFeature, isVectorTiles]
  );

  const handleSetFeatureState = useCallback(
    (parcelleId: string, state: { [key: string]: boolean }) => {
      if (map && isVectorTiles) {
        const featureId = getFeatureId(map, parcelleId);
        if (!featureId) {
          return;
        }

        map.setFeatureState(
          {
            source: PARCEL_SOURCE,
            sourceLayer: PARCEL_SOURCE_LAYER.PARCELS,
            id: featureId,
          },
          state
        );
      }
    },
    [map, isVectorTiles]
  );

  const filterHighlightedWithParcelles = useCallback(
    (selectedParcelles) => {
      if (!isVectorTiles || !map) return;
      if (selectedParcelles.length > 0) {
        const exps: ExpressionSpecification[] = selectedParcelles.map((id) => [
          "==",
          ["get", "id"],
          id,
        ]);
        map.setFilter(PARCEL_LAYER.PARCELLE_HIGHLIGHTED, ["any", ...exps]);
      } else {
        map.setFilter(PARCEL_LAYER.PARCELLE_HIGHLIGHTED, [
          "==",
          ["get", "id"],
          "",
        ]);
      }
    },
    [map, isVectorTiles]
  );

  const handleParcelles = useCallback(
    (parcellesToggle: string[]) => {
      if (isParcelleSelectionEnabled) {
        const highlightParcelles = xor(parcellesToggle, highlightedParcelles);
        setHighlightedParcelles(highlightParcelles);
        filterHighlightedWithParcelles(highlightParcelles);
        handleHoveredParcelles([]);
      }
    },
    [
      isParcelleSelectionEnabled,
      highlightedParcelles,
      filterHighlightedWithParcelles,
      handleHoveredParcelles,
    ]
  );

  const toggleParcelsVisibility = useCallback(() => {
    if (!map || !isVectorTiles) return;
    Object.values(PARCEL_LAYER).forEach((layerId: string) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          "visibility",
          isParcelsDisplayed ? "visible" : "none"
        );
      }
    });
  }, [map, isParcelsDisplayed, isVectorTiles]);

  const filterSelectedParcelles = useCallback(() => {
    if (!isVectorTiles || !map) return;
    if (selectedParcelles.length > 0 && showSelectedParcelles) {
      const exps: ExpressionSpecification[] = selectedParcelles.map(
        (id: string) => ["==", ["get", "id"], id]
      );
      map.setFilter(PARCEL_LAYER.PARCELS_SELECTED, ["any", ...exps]);
    } else {
      map.setFilter(PARCEL_LAYER.PARCELS_SELECTED, [
        "==",
        ["get", "id"],
        "",
      ]);
    }
  }, [map, selectedParcelles, showSelectedParcelles, isVectorTiles]);

  const filterHighlightedParcelles = useCallback(() => {
    if (!isVectorTiles || !map) return;
    if (highlightedParcelles.length > 0) {
      const exps: ExpressionSpecification[] = highlightedParcelles.map((id) => [
        "==",
        ["get", "id"],
        id,
      ]);
      map.setFilter(
        isDiffMode
          ? PARCEL_LAYER.PARCELLE_HIGHLIGHTED_DIFF_MODE
          : PARCEL_LAYER.PARCELLE_HIGHLIGHTED,
        ["any", ...exps]
      );
    } else {
      map.setFilter(
        isDiffMode
          ? PARCEL_LAYER.PARCELLE_HIGHLIGHTED_DIFF_MODE
          : PARCEL_LAYER.PARCELLE_HIGHLIGHTED,
        ["==", ["get", "id"], ""]
      );
    }
  }, [map, highlightedParcelles, isDiffMode, isVectorTiles]);

  const reloadParcelsLayers = useCallback(() => {
    if (!map || !map.isStyleLoaded() || !isVectorTiles) {
      return;
    }

    // US parcels are geospatially indexed — no commune-based filtering needed.
    // Just toggle visibility and apply selection/highlight filters.
    toggleParcelsVisibility();

    if (isParcelsDisplayed) {
      filterSelectedParcelles();
      filterHighlightedParcelles();
    }
  }, [
    map,
    toggleParcelsVisibility,
    isParcelsDisplayed,
    filterSelectedParcelles,
    filterHighlightedParcelles,
    isVectorTiles,
  ]);

  // Toggle all parcel layers visibility
  useEffect(() => {
    if (
      map &&
      map.getSource(PARCEL_SOURCE) &&
      isStyleLoaded &&
      isParcelsDisplayed
    ) {
      toggleParcelsVisibility();
    }
  }, [map, isStyleLoaded, toggleParcelsVisibility, isParcelsDisplayed]);

  // Updates highlighted parcels when selection changes
  useEffect(() => {
    if (map && isParcelsDisplayed && isStyleLoaded && isVectorTiles) {
      filterSelectedParcelles();
      filterHighlightedParcelles();
    }
  }, [
    map,
    isParcelsDisplayed,
    isStyleLoaded,
    filterHighlightedParcelles,
    filterSelectedParcelles,
    isVectorTiles,
  ]);

  // Reset highlighted when selection mode is disabled
  useEffect(() => {
    if (!isParcelleSelectionEnabled && isStyleLoaded) {
      setHighlightedParcelles([]);
    }
  }, [isParcelleSelectionEnabled, isStyleLoaded]);

  useEffect(() => {
    if (isStyleLoaded) {
      reloadParcelsLayers();
    }
  }, [isStyleLoaded, reloadParcelsLayers]);

  const value = useMemo(
    () => ({
      highlightedParcelles,
      setHighlightedParcelles,
      isParcelleSelectionEnabled,
      setIsParcelleSelectionEnabled,
      handleParcelles,
      hoveredParcelles,
      handleHoveredParcelles,
      setShowSelectedParcelles,
      handleSetFeatureState,
      isDiffMode,
      setIsDiffMode,
    }),
    [
      highlightedParcelles,
      setHighlightedParcelles,
      isParcelleSelectionEnabled,
      handleParcelles,
      hoveredParcelles,
      handleHoveredParcelles,
      setShowSelectedParcelles,
      handleSetFeatureState,
      isDiffMode,
      setIsDiffMode,
    ]
  );

  return <ParcellesContext.Provider value={value} {...props} />;
}

export default ParcellesContext;
