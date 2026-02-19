import { CommuneType } from "@/types/commune";
import {
  CommuneService,
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
} from "./openapi-api-bal";
import { ApiGeoService } from "./geo-api";
import bbox from "@turf/bbox";

function getBBoxFromVoies(voies: ExtendedVoieDTO[]): number[] | undefined {
  const bboxs = voies
    .map(({ bbox }) => bbox)
    .filter(
      (bbox): bbox is number[] =>
        Array.isArray(bbox) &&
        bbox.length === 4 &&
        bbox.every((value) => Number.isFinite(value))
    );

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
  voies: ExtendedVoieDTO[]
): Promise<CommuneType> {
  const commune: CommuneType = await CommuneService.findCommune(
    baseLocale.commune
  );
  const fallbackBBox = getBBoxFromVoies(voies);

  try {
    const communeApiGeo = await ApiGeoService.getCommune(baseLocale.commune, {
      fields: "contour",
    });
    if (communeApiGeo.contour) {
      commune.bbox = bbox(communeApiGeo.contour);
      commune.contour = communeApiGeo.contour;
    }
  } catch {
    // Fallback below
  }

  if (!commune.bbox && fallbackBBox) {
    commune.bbox = fallbackBBox;
  }

  return commune;
}
