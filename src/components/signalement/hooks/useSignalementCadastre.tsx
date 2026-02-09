"use client";

import MapContext from "@/contexts/map";
import ParcellesContext from "@/contexts/parcelles";
import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect } from "react";

export function useSignalementCadastre(parcelles: string[]) {
  const { isStyleLoaded, setIsParcelsDisplayed } = useContext(MapContext);

  const { setHighlightedParcelles, setShowSelectedParcelles, setIsDiffMode } =
    useContext(ParcellesContext);
  const params = useParams();
  const toggleSignalementParcels = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        setIsParcelsDisplayed(true);
        setShowSelectedParcelles(false);
        setHighlightedParcelles(parcelles);
        setIsDiffMode(true);
      } else {
        setIsParcelsDisplayed(false);
        setShowSelectedParcelles(true);
        setHighlightedParcelles([]);
        setIsDiffMode(false);
      }
    },
    [
      parcelles,
      setHighlightedParcelles,
      setIsParcelsDisplayed,
      setShowSelectedParcelles,
      setIsDiffMode,
    ]
  );

  // Disable parcels on route change
  useEffect(() => {
    toggleSignalementParcels(false);
  }, [params]);

  // Enable parcels when there are parcels and the map style is loaded
  useEffect(() => {
    if (isStyleLoaded && parcelles?.length > 0) {
      toggleSignalementParcels(true);
    }
  }, [toggleSignalementParcels, isStyleLoaded, parcelles]);
}
