/**
 * Dependency-free point-in-polygon tests for address ↔ building-footprint
 * validation. Works directly on GeoJSON coordinate arrays (Polygon and
 * MultiPolygon), so it can run over the Overture building footprints already
 * loaded in the map viewport without pulling a geometry library.
 */

type Ring = number[][]; // [ [lng,lat], ... ]

/** Ray-casting test: is [lng,lat] inside a single ring (outer or hole)? */
function pointInRing(lng: number, lat: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** A single Polygon = [outerRing, ...holes]. Inside outer and outside all holes. */
function pointInPolygon(lng: number, lat: number, polygon: Ring[]): boolean {
  if (polygon.length === 0) return false;
  if (!pointInRing(lng, lat, polygon[0])) return false;
  for (let h = 1; h < polygon.length; h++) {
    if (pointInRing(lng, lat, polygon[h])) return false; // inside a hole
  }
  return true;
}

/**
 * Test a point against a GeoJSON geometry that is a Polygon or MultiPolygon.
 */
export function pointInGeometry(
  lng: number,
  lat: number,
  geometry: { type: string; coordinates: any }
): boolean {
  if (!geometry) return false;
  if (geometry.type === "Polygon") {
    return pointInPolygon(lng, lat, geometry.coordinates as Ring[]);
  }
  if (geometry.type === "MultiPolygon") {
    return (geometry.coordinates as Ring[][]).some((poly) =>
      pointInPolygon(lng, lat, poly)
    );
  }
  return false;
}

/**
 * Returns true if [lng,lat] falls inside ANY of the given building features.
 */
export function isPointOnAnyBuilding(
  lng: number,
  lat: number,
  features: Array<{ geometry: { type: string; coordinates: any } }>
): boolean {
  for (const f of features) {
    if (pointInGeometry(lng, lat, f.geometry)) return true;
  }
  return false;
}
