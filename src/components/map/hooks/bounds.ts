"use client";

import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import bbox from "@turf/bbox";
import type { Map } from "maplibre-gl";
import BalDataContext from "@/contexts/bal-data";
import { Toponyme, Voie } from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";
import { useParams } from "next/navigation";

function isValidBounds(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length === 4 &&
    value.every((coordinate) => Number.isFinite(coordinate))
  );
}

function getUnionBounds(boundsList: number[][]): number[] | null {
  if (!boundsList.length) {
    return null;
  }

  return [
    Math.min(...boundsList.map((currentBounds) => currentBounds[0])),
    Math.min(...boundsList.map((currentBounds) => currentBounds[1])),
    Math.max(...boundsList.map((currentBounds) => currentBounds[2])),
    Math.max(...boundsList.map((currentBounds) => currentBounds[3])),
  ];
}

function useBounds(
  map: Map,
  commune: CommuneType,
  voie: Voie,
  toponyme: Toponyme
) {
  const params = useParams();
  const { editingItem, voies, toponymes } = useContext(BalDataContext);
  const aggregateBounds = useMemo(() => {
    const featuresBounds = [...voies, ...toponymes]
      .map(({ bbox }) => bbox)
      .filter((currentBounds): currentBounds is number[] =>
        isValidBounds(currentBounds)
      );
    return getUnionBounds(featuresBounds);
  }, [voies, toponymes]);
  const [bounds, setBounds] = useState<number[] | null>(
    isValidBounds(commune.bbox) ? commune.bbox : aggregateBounds
  );

  const [wasCenteredOnCommuneOnce, setWasCenteredOnCommuneOnce] =
    useState(false);

  const bboxForItem = useCallback(
    (item) => {
      if (map && item && item.trace) {
        const traceBounds = bbox(item.trace);
        return isValidBounds(traceBounds) ? traceBounds : null;
      } else if (map && item && item.bbox) {
        return isValidBounds(item.bbox) ? item.bbox : null;
      }
      return null;
    },
    [map]
  );

  useEffect(() => {
    if (!map) {
      return;
    }

    if (editingItem) {
      const editingBounds = bboxForItem(editingItem);
      if (editingBounds) {
        setBounds(editingBounds);
      }
    } else if (!wasCenteredOnCommuneOnce) {
      const initialBounds = isValidBounds(commune.bbox)
        ? commune.bbox
        : aggregateBounds;
      if (initialBounds) {
        setBounds(initialBounds);
        setWasCenteredOnCommuneOnce(true);
      }
    }
  }, [
    editingItem,
    wasCenteredOnCommuneOnce,
    map,
    bboxForItem,
    commune.bbox,
    aggregateBounds,
  ]);

  useEffect(() => {
    const idVoie = params.idVoie;
    const idToponyme = params.idToponyme;

    if (!map) {
      return;
    }

    if (idVoie) {
      const voieBounds = bboxForItem(voie);
      if (voieBounds) {
        setBounds(voieBounds);
      }
    } else if (idToponyme) {
      const toponymeBounds = bboxForItem(toponyme);
      if (toponymeBounds) {
        setBounds(toponymeBounds);
      }
    }
  }, [params, voie, toponyme, map, bboxForItem]);

  return bounds;
}

export default useBounds;
