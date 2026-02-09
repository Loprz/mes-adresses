const BAL_BLASON_BUCKET_URL =
  "https://base-adresse-locale-prod-blasons-communes.s3.fr-par.scw.cloud";

const DEFAULT_URL_DISTRICT_FLAG = "/static/images/commune-default-flag.svg";

const JURISDICTION_LOGOS_URL = "/static/data/jurisdiction-logos.json";

// US FIPS: 5-digit county or 7-digit place (numeric string)
function isUsFipsCode(code: string): boolean {
  return /^\d{5}$/.test(code) || /^\d{7}$/.test(code);
}

let jurisdictionLogosCache: Record<string, string> | null = null;

async function getJurisdictionLogosMap(): Promise<Record<string, string>> {
  if (jurisdictionLogosCache) return jurisdictionLogosCache;
  try {
    const res = await fetch(JURISDICTION_LOGOS_URL);
    if (!res.ok) return {};
    const data = (await res.json()) as Record<string, string>;
    const map: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith("_") || typeof value !== "string") continue;
      const url = value.trim();
      if (url && (url.startsWith("http") || url.startsWith("/") || url.startsWith("data:image"))) {
        map[key] = url;
      }
    }
    jurisdictionLogosCache = map;
    return map;
  } catch {
    return {};
  }
}

// Fetch the commune flag from a proxy for front-end to avoid CORS issues
export const getCommuneFlagProxy = async (
  codeCommune: string
): Promise<string> => {
  const response = await fetch(`/api/proxy-flag-commune/${codeCommune}`);

  return response.json();
};

export const getCommuneFlag = async (codeCommune: string): Promise<string> => {
  // US jurisdictions: look up in static JSON (e.g. AI-populated jurisdiction logos)
  if (isUsFipsCode(codeCommune)) {
    const map = await getJurisdictionLogosMap();
    const url = map[codeCommune];
    if (url) return url;
    return DEFAULT_URL_DISTRICT_FLAG;
  }

  if (!process.env.NEXT_PUBLIC_API_ANNUAIRE_DES_COLLECTIVITES) {
    return getCommuneFlagFromBal(codeCommune);
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ANNUAIRE_DES_COLLECTIVITES}/commune/logo/${codeCommune}`
    );

    const url = await response.text();

    const isValidUrl =
      url && (url.startsWith("http") || url.startsWith("data:image"));

    if (!response.ok || !isValidUrl) {
      return getCommuneFlagFromBal(codeCommune);
    }

    return url;
  } catch (err) {
    console.error(
      "Error fetching jurisdiction emblem from municipalities directory",
      err
    );
    return getCommuneFlagFromBal(codeCommune);
  }
};

export const getCommuneFlagFromBal = async (
  codeCommune: string
): Promise<string> => {
  const url = `${BAL_BLASON_BUCKET_URL}/${codeCommune}.svg`;

  const response = await fetch(url, {
    method: "HEAD",
  });

  if (!response.ok) {
    return DEFAULT_URL_DISTRICT_FLAG;
  }

  return url;
};
