export type CommuneApiGeoType = {
  nom: string;
  code: string;
  departement?: {
    code: string;
    nom: string;
  };
  contour?: {
    type: "Polygon";
    coordinates: number[][][];
  };
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

export type CommuneDelegueeApiGeoType = {
  nom: string;
  code: string;
  chefLieu: string;
  type: string;
};
