import { CommuneDTO } from "@/lib/openapi-api-bal";

export type CommuneBoundary = {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
};

export type CommuneType = CommuneDTO & {
  bbox?: number[];
  contour?: CommuneBoundary;
};
