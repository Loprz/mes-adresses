import { ApiGeoService } from "@/lib/geo-api";
import {
  JurisdictionCountyApiGeoType,
  JurisdictionPlaceApiGeoType,
  JurisdictionStateApiGeoType,
} from "@/lib/geo-api/type";
import { CommuneType } from "@/types/commune";
import {
  Alert,
  Button,
  Pane,
  Paragraph,
  SelectField,
  Spinner,
  Strong,
  Text,
} from "evergreen-ui";
import { useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useState } from "react";

interface JurisdictionSelectorProps {
  commune: CommuneType | null;
  setCommune: (commune: CommuneType | null) => void;
  initialStateFips?: string;
  initialCountyCode?: string;
  initialJurisdictionCode?: string;
  showSelectionHint?: boolean;
  showSelectedSummary?: boolean;
}

function getInitialStateFips(
  commune: CommuneType | null,
  initialStateFips?: string,
  initialCountyCode?: string
): string {
  return (
    commune?.stateFips ||
    initialStateFips ||
    initialCountyCode?.slice(0, 2) ||
    commune?.code?.slice(0, 2) ||
    ""
  );
}

function getInitialCountyCode(
  commune: CommuneType | null,
  initialCountyCode?: string
): string {
  if (!commune) {
    return initialCountyCode || "";
  }

  if (commune.level === "county") {
    return commune.code;
  }

  return commune.countyFips || initialCountyCode || "";
}

function getInitialJurisdictionCode(
  commune: CommuneType | null,
  initialJurisdictionCode?: string,
  initialCountyCode?: string
): string {
  return commune?.code || initialJurisdictionCode || initialCountyCode || "";
}

function JurisdictionSelector({
  commune,
  setCommune,
  initialStateFips,
  initialCountyCode,
  initialJurisdictionCode,
  showSelectionHint = true,
  showSelectedSummary = true,
}: JurisdictionSelectorProps) {
  const tJurisdiction = useTranslations("jurisdiction");
  const [states, setStates] = useState<JurisdictionStateApiGeoType[]>([]);
  const [counties, setCounties] = useState<JurisdictionCountyApiGeoType[]>([]);
  const [places, setPlaces] = useState<JurisdictionPlaceApiGeoType[]>([]);
  const [selectedStateFips, setSelectedStateFips] = useState(
    getInitialStateFips(commune, initialStateFips, initialCountyCode)
  );
  const [selectedCountyCode, setSelectedCountyCode] = useState(
    getInitialCountyCode(commune, initialCountyCode)
  );
  const [selectedJurisdictionCode, setSelectedJurisdictionCode] = useState(
    getInitialJurisdictionCode(
      commune,
      initialJurisdictionCode,
      initialCountyCode
    )
  );
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCounties, setIsLoadingCounties] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [isLoadingJurisdiction, setIsLoadingJurisdiction] = useState(false);
  const [hasLoadedPlaces, setHasLoadedPlaces] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const [statesError, setStatesError] = useState(false);
  const [countiesError, setCountiesError] = useState(false);
  const [placesError, setPlacesError] = useState(false);
  const [jurisdictionError, setJurisdictionError] = useState(false);

  const selectedCounty =
    counties.find((county) => county.code === selectedCountyCode) || null;
  const selectedState =
    states.find((state) => state.code === selectedStateFips) || null;
  const isCountySelection =
    commune?.level === "county" || commune?.code === selectedCountyCode;
  const selectedPlace =
    places.find((place) => place.code === commune?.code) || null;
  const countyName =
    selectedCounty?.nom || commune?.countyName || commune?.nom || "";
  const pathSegments = [
    selectedState?.nom,
    countyName,
    isCountySelection
      ? tJurisdiction("countyWidePathItem")
      : selectedPlace?.nom || commune?.nom,
  ].filter(Boolean);
  const loadErrorMessage = statesError
    ? tJurisdiction("loadErrorStates")
    : countiesError
      ? tJurisdiction("loadErrorCounties")
      : placesError
        ? tJurisdiction("loadErrorPlaces")
        : jurisdictionError
          ? tJurisdiction("loadErrorJurisdiction")
          : null;

  useEffect(() => {
    let isCancelled = false;

    const loadStates = async () => {
      setIsLoadingStates(true);
      setStatesError(false);

      try {
        const nextStates = await ApiGeoService.getStates();
        if (!isCancelled) {
          setStates(nextStates);
        }
      } catch {
        if (!isCancelled) {
          setStates([]);
          setStatesError(true);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingStates(false);
        }
      }
    };

    void loadStates();

    return () => {
      isCancelled = true;
    };
  }, [retryToken]);

  useEffect(() => {
    if (!commune?.code) {
      return;
    }

    setSelectedStateFips(
      getInitialStateFips(commune, initialStateFips, initialCountyCode)
    );
    setSelectedCountyCode(getInitialCountyCode(commune, initialCountyCode));
    setSelectedJurisdictionCode(
      getInitialJurisdictionCode(
        commune,
        initialJurisdictionCode,
        initialCountyCode
      )
    );
  }, [
    commune?.code,
    commune?.countyFips,
    commune?.level,
    commune?.stateFips,
    initialCountyCode,
    initialJurisdictionCode,
    initialStateFips,
  ]);

  useEffect(() => {
    if (!selectedStateFips) {
      setCounties([]);
      setPlaces([]);
      setCountiesError(false);
      setPlacesError(false);
      setHasLoadedPlaces(false);
      return;
    }

    let isCancelled = false;

    const loadCounties = async () => {
      setIsLoadingCounties(true);
      setCountiesError(false);

      try {
        const nextCounties = await ApiGeoService.getCounties(selectedStateFips);
        if (!isCancelled) {
          setCounties(nextCounties);
        }
      } catch {
        if (!isCancelled) {
          setCounties([]);
          setCountiesError(true);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingCounties(false);
        }
      }
    };

    void loadCounties();

    return () => {
      isCancelled = true;
    };
  }, [selectedStateFips, retryToken]);

  useEffect(() => {
    if (!selectedCountyCode) {
      setPlaces([]);
      setHasLoadedPlaces(false);
      setPlacesError(false);
      return;
    }

    let isCancelled = false;

    const loadPlaces = async () => {
      setIsLoadingPlaces(true);
      setHasLoadedPlaces(false);
      setPlacesError(false);

      try {
        const nextPlaces = await ApiGeoService.getPlaces(selectedCountyCode);
        if (!isCancelled) {
          setPlaces(nextPlaces);
          setHasLoadedPlaces(true);
        }
      } catch {
        if (!isCancelled) {
          setPlaces([]);
          setPlacesError(true);
          setHasLoadedPlaces(false);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingPlaces(false);
        }
      }
    };

    void loadPlaces();

    return () => {
      isCancelled = true;
    };
  }, [selectedCountyCode, retryToken]);

  useEffect(() => {
    if (!selectedJurisdictionCode) {
      setJurisdictionError(false);
      return;
    }

    let isCancelled = false;

    const loadJurisdiction = async () => {
      setIsLoadingJurisdiction(true);
      setJurisdictionError(false);

      try {
        const nextCommune = await ApiGeoService.getCommune(
          selectedJurisdictionCode
        );
        if (!isCancelled && nextCommune) {
          setCommune(nextCommune as CommuneType);
        } else if (!isCancelled) {
          setJurisdictionError(true);
        }
      } catch {
        if (!isCancelled) {
          setJurisdictionError(true);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingJurisdiction(false);
        }
      }
    };

    void loadJurisdiction();

    return () => {
      isCancelled = true;
    };
  }, [selectedJurisdictionCode, setCommune, retryToken]);

  const handleStateChange = (stateFips: string) => {
    setSelectedStateFips(stateFips);
    setSelectedCountyCode("");
    setSelectedJurisdictionCode("");
    setPlaces([]);
    setCountiesError(false);
    setPlacesError(false);
    setJurisdictionError(false);
    setHasLoadedPlaces(false);
    setCommune(null);
  };

  const handleCountyChange = (countyCode: string) => {
    setSelectedCountyCode(countyCode);
    setSelectedJurisdictionCode(countyCode);
    setPlaces([]);
    setPlacesError(false);
    setJurisdictionError(false);
    setHasLoadedPlaces(false);
    setCommune(null);
  };

  const handleJurisdictionChange = (jurisdictionCode: string) => {
    if (jurisdictionCode === selectedJurisdictionCode) {
      setJurisdictionError(false);
      return;
    }

    setSelectedJurisdictionCode(jurisdictionCode);
    setJurisdictionError(false);
    setCommune(null);
  };

  const handleRetry = () => {
    setStatesError(false);
    setCountiesError(false);
    setPlacesError(false);
    setJurisdictionError(false);
    setRetryToken((currentValue) => currentValue + 1);
  };

  return (
    <Pane>
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
        gap={16}
      >
        <SelectField
          label={tJurisdiction("selectState")}
          value={selectedStateFips}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            handleStateChange(event.target.value)
          }
          disabled={isLoadingStates}
          marginBottom={0}
        >
          <option value="">
            {isLoadingStates
              ? tJurisdiction("loadingStates")
              : tJurisdiction("selectState")}
          </option>
          {states.map((state) => (
            <option key={state.code} value={state.code}>
              {state.nom} ({state.abbr})
            </option>
          ))}
        </SelectField>

        <SelectField
          label={tJurisdiction("selectCounty")}
          value={selectedCountyCode}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            handleCountyChange(event.target.value)
          }
          disabled={!selectedStateFips || isLoadingCounties}
          marginBottom={0}
        >
          <option value="">
            {isLoadingCounties
              ? tJurisdiction("loadingCounties")
              : tJurisdiction("selectCounty")}
          </option>
          {counties.map((county) => (
            <option key={county.code} value={county.code}>
              {county.nom}
            </option>
          ))}
        </SelectField>

        <SelectField
          label={tJurisdiction("selectCity")}
          value={selectedJurisdictionCode}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            handleJurisdictionChange(event.target.value)
          }
          disabled={!selectedCountyCode || isLoadingPlaces}
          marginBottom={0}
        >
          <option value="">
            {isLoadingPlaces
              ? tJurisdiction("loadingPlaces")
              : tJurisdiction("selectCity")}
          </option>
          {selectedCounty && (
            <option key={selectedCounty.code} value={selectedCounty.code}>
              {tJurisdiction("useCountyOption", { county: selectedCounty.nom })}
            </option>
          )}
          {places.map((place) => (
            <option key={place.code} value={place.code}>
              {place.nom}
            </option>
          ))}
        </SelectField>
      </Pane>

      {loadErrorMessage && (
        <Alert marginTop={16} intent="danger">
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={12}
          >
            <Paragraph>{loadErrorMessage}</Paragraph>
            <Button type="button" onClick={handleRetry}>
              {tJurisdiction("retry")}
            </Button>
          </Pane>
        </Alert>
      )}

      {selectedCounty && hasLoadedPlaces && places.length === 0 && !placesError && (
        <Alert marginTop={16} intent="warning">
          {tJurisdiction("noPlacesFound", { county: selectedCounty.nom })}
        </Alert>
      )}

      {showSelectionHint && selectedCounty && (
        <Paragraph marginTop={12} color="muted">
          {tJurisdiction("selectionHint", { county: selectedCounty.nom })}
        </Paragraph>
      )}

      {(isLoadingJurisdiction || isLoadingCounties || isLoadingPlaces) && (
        <Pane
          display="flex"
          alignItems="center"
          gap={8}
          marginTop={16}
          padding={12}
          background="tint1"
          borderRadius={8}
        >
          <Spinner size={16} />
          <Text color="muted">
            {isLoadingJurisdiction
              ? tJurisdiction("loadingJurisdiction")
              : isLoadingPlaces
                ? tJurisdiction("loadingPlaces")
                : tJurisdiction("loadingCounties")}
          </Text>
        </Pane>
      )}

      {showSelectedSummary && commune && (
        <Pane
          marginTop={16}
          padding={16}
          border
          borderRadius={8}
          background="white"
        >
          <Paragraph marginBottom={4} color="muted">
            {tJurisdiction("selectedSummaryTitle")}
          </Paragraph>
          <Paragraph marginBottom={8}>
            <Strong>{commune.nom}</Strong>
          </Paragraph>
          <Paragraph marginBottom={4}>
            <Strong>{tJurisdiction("selectionTypeLabel")}:</Strong>{" "}
            {isCountySelection
              ? tJurisdiction("countyWideTitle")
              : tJurisdiction("placeTitle")}
          </Paragraph>
          <Paragraph marginBottom={4}>
            <Strong>{tJurisdiction("pathLabel")}:</Strong>{" "}
            {pathSegments.join(" -> ")}
          </Paragraph>
          <Paragraph marginBottom={8} color="muted">
            {isCountySelection
              ? tJurisdiction("countyWideDescription", { county: countyName })
              : tJurisdiction("placeDescription", {
                  county: countyName,
                  place: commune.nom,
                })}
          </Paragraph>
          <Text color="muted" display="block">
            {tJurisdiction("fipsCode")}: {commune.code}
          </Text>
        </Pane>
      )}
    </Pane>
  );
}

export default JurisdictionSelector;
