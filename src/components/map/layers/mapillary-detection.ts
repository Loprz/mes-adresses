/**
 * Mapillary detection geometry — fetch + decode.
 *
 * A Mapillary map-feature's /detections endpoint returns, per contributing
 * image, the detected object's outline as a base64-encoded Mapbox Vector Tile
 * (layer "mpy-or", one polygon feature, normalized to the tile `extent`). We
 * decode it here — dependency-free, to avoid a lockfile change — into a closed
 * ring of basic image coordinates ([0,1], origin top-left) that MapillaryJS's
 * PolygonGeometry/OutlineTag can draw over the photo, highlighting the object.
 */

import { MAPILLARY_TOKEN } from "./mapillary";

export type DetectionResult = {
  imageId: string | null;
  // Closed ring of [x, y] in basic image coords (0..1), or null if undecodable.
  polygon: number[][] | null;
};

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// Minimal protobuf reader (positive varints up to 53 bits; enough for MVT).
class PBReader {
  buf: Uint8Array;
  pos = 0;
  len: number;
  constructor(buf: Uint8Array) {
    this.buf = buf;
    this.len = buf.length;
  }
  varint(): number {
    let result = 0;
    let shift = 0;
    let b: number;
    do {
      b = this.buf[this.pos++];
      result +=
        shift < 28 ? (b & 0x7f) << shift : (b & 0x7f) * Math.pow(2, shift);
      shift += 7;
    } while (b & 0x80);
    return result;
  }
  skip(wireType: number) {
    if (wireType === 0) this.varint();
    else if (wireType === 2) this.pos += this.varint();
    else if (wireType === 5) this.pos += 4;
    else if (wireType === 1) this.pos += 8;
  }
}

const zigzag = (n: number) => (n >>> 1) ^ -(n & 1);

/** Decode the first polygon ring from a base64 MVT detection geometry. */
export function decodeDetectionPolygon(b64: string): number[][] | null {
  try {
    const r = new PBReader(base64ToBytes(b64));
    let extent = 4096;
    let geomCmds: number[] | null = null;

    // Tile message → field 3 = Layer
    while (r.pos < r.len && !geomCmds) {
      const tag = r.varint();
      const field = tag >> 3;
      const wt = tag & 7;
      if (field === 3 && wt === 2) {
        const end = r.pos + r.varint();
        while (r.pos < end) {
          const t2 = r.varint();
          const f2 = t2 >> 3;
          const w2 = t2 & 7;
          if (f2 === 5 && w2 === 0) {
            extent = r.varint(); // Layer.extent
          } else if (f2 === 2 && w2 === 2) {
            // Layer.features → Feature
            const fend = r.pos + r.varint();
            while (r.pos < fend) {
              const t3 = r.varint();
              const f3 = t3 >> 3;
              const w3 = t3 & 7;
              if (f3 === 4 && w3 === 2) {
                const gend = r.pos + r.varint();
                const cmds: number[] = [];
                while (r.pos < gend) cmds.push(r.varint());
                if (!geomCmds) geomCmds = cmds;
              } else {
                r.skip(w3);
              }
            }
          } else {
            r.skip(w2);
          }
        }
        r.pos = end;
      } else {
        r.skip(wt);
      }
    }

    if (!geomCmds || !extent) return null;

    // Decode geometry commands → ring (in tile coords).
    const ring: number[][] = [];
    let x = 0;
    let y = 0;
    let i = 0;
    while (i < geomCmds.length) {
      const cmd = geomCmds[i++];
      const id = cmd & 7;
      const count = cmd >> 3;
      if (id === 1 || id === 2) {
        for (let c = 0; c < count && i + 1 < geomCmds.length; c++) {
          x += zigzag(geomCmds[i++]);
          y += zigzag(geomCmds[i++]);
          ring.push([x, y]);
        }
      }
      // id === 7 (ClosePath) carries no coords
    }
    if (ring.length < 3) return null;

    const norm = ring.map(([px, py]) => [px / extent, py / extent]);
    const first = norm[0];
    const last = norm[norm.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      norm.push([first[0], first[1]]); // close the ring
    }
    return norm;
  } catch {
    return null;
  }
}

/**
 * For a map-feature id, return an image it was detected in plus the decoded
 * detection outline (basic image coords) for that image.
 */
export async function fetchDetectionForFeature(
  featureId: string
): Promise<DetectionResult | null> {
  if (!MAPILLARY_TOKEN || !featureId) return null;
  try {
    const url =
      `https://graph.mapillary.com/${featureId}/detections` +
      `?fields=image,value,geometry&access_token=${MAPILLARY_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const detections = data?.data || [];
    if (!detections.length) return null;
    const d = detections[0];
    const imageId = d?.image?.id ? String(d.image.id) : null;
    const polygon = d?.geometry ? decodeDetectionPolygon(d.geometry) : null;
    return { imageId, polygon };
  } catch {
    return null;
  }
}
