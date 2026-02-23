import { CommuneType } from "@/types/commune";
import {
  CommuneService,
  ExtendedBaseLocaleDTO,
  ExtentedToponymeDTO,
  ExtendedVoieDTO,
} from "./openapi-api-bal";
import { ApiGeoService } from "./geo-api";
import bbox from "@turf/bbox";

function isValidBBox(candidate: unknown): candidate is number[] {
  return (
    Array.isArray(candidate) &&
    candidate.length === 4 &&
    candidate.every((value) => Number.isFinite(value))
  );
}

function getBBoxFromFeatures(
  features: Array<{ bbox?: number[] }>
): number[] | undefined {
  const bboxs = features
    .map(({ bbox }) => bbox)
    .filter((bbox): bbox is number[] => isValidBBox(bbox));

  if (!bboxs.length) {
    return;
  }

  return [
    Math.min(...bboxs.map((currentBBox) => currentBBox[0])),
    Math.min(...bboxs.map((currentBBox) => currentBBox[1])),
    Math.max(...bboxs.map((currentBBox) => currentBBox[2])),
    Math.max(...bboxs.map((currentBBox) => currentBBox[3])),
  ];
}

export async function getCommuneWithBBox(
  baseLocale: ExtendedBaseLocaleDTO,
  voies: ExtendedVoieDTO[],
  toponymes: ExtentedToponymeDTO[] = []
): Promise<CommuneType> {
  const commune: CommuneType = await CommuneService.findCommune(
    baseLocale.commune
  );
  const fallbackBBox = getBBoxFromFeatures([...voies, ...toponymes]);

  try {
    const communeApiGeo = await ApiGeoService.getCommune(baseLocale.commune, {
      fields: "contour",
    });
    const boundary = communeApiGeo?.contour || communeApiGeo?.boundary;
    if (boundary) {
      commune.bbox = bbox(boundary as any);
      commune.contour = boundary;
    }

    if (!commune.bbox) {
      const geoBBox = communeApiGeo?.bbox || communeApiGeo?.bounds;
      if (isValidBBox(geoBBox)) {
        commune.bbox = geoBBox;
      }
    }
  } catch {
    // Fallback below
  }

  if (!commune.bbox && fallbackBBox) {
    commune.bbox = fallbackBBox;
  }

  return commune;
}
