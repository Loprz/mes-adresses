import { CommuneDTO } from "@/lib/openapi-api-bal";

export type CommuneBoundary = {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
};

export type CommuneType = CommuneDTO & {
  stateFips?: string;
  countyFips?: string | null;
  bbox?: number[];
  contour?: CommuneBoundary;
};
