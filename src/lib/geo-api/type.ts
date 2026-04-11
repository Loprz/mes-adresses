export type CommuneApiGeoType = {
  nom: string;
  code: string;
  stateFips?: string;
  countyFips?: string | null;
  departement?: {
    code: string;
    nom: string;
  };
  contour?: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  boundary?: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  bbox?: number[];
  bounds?: number[];
  /** Whether this is a place (city/town) or county */
  level?: 'place' | 'county';
  /** Place type: city, town, village, borough, or county */
  type?: string;
  /** Parent county name (for places) */
  countyName?: string;
  codeDepartement?: string;
  codeEpci?: string;
  codeRegion?: string;
  codesPostaux?: string[];
  population?: number;
  siren?: string;
  _score: number;
};

export type JurisdictionStateApiGeoType = {
  code: string;
  abbr: string;
  nom: string;
};

export type JurisdictionCountyApiGeoType = {
  code: string;
  nom: string;
  stateFips: string;
  stateAbbr: string;
};

export type JurisdictionPlaceApiGeoType = {
  code: string;
  nom: string;
  stateFips: string;
  stateAbbr: string;
  countyFips?: string | null;
  countyName?: string;
  type?: string;
};

export type CommuneDelegueeApiGeoType = {
  nom: string;
  code: string;
  chefLieu: string;
  type: string;
};
