import qs from "querystring";
import { CommuneApiGeoType } from "./type";

/**
 * US Jurisdiction Search Service
 *
 * Replaces the French geo.api.gouv.fr with our own backend API.
 * The backend searches US FIPS county data and returns results
 * in the same format the frontend components expect.
 */
const BAL_API_URL =
  process.env.NEXT_PUBLIC_BAL_API_URL || "http://localhost:5050/v2";

// Strip trailing path if present (e.g., "http://localhost:5050/v2" → "http://localhost:5050/v2")
const API_BASE = BAL_API_URL.replace(/\/+$/, "");

export class ApiGeoService {
  private static async request<T = unknown>(url: string): Promise<T | null> {
    try {
      const res = await fetch(`${API_BASE}${url}`);
      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch (error) {
      console.error("ApiGeoService request failed:", (error as Error).message);
    }
    return null;
  }

  public static async searchCommunes(
    search: string,
    options: Record<string, any> = {}
  ): Promise<CommuneApiGeoType[]> {
    const query: any = {
      nom: search,
    };

    if (options.limit) {
      query.limit = options.limit;
    }

    const res = await this.request<CommuneApiGeoType[]>(
      `/jurisdictions/search?${qs.stringify(query)}`
    );
    return Array.isArray(res) ? res : [];
  }

  public static async getCommune(
    code: string,
    options = {}
  ): Promise<CommuneApiGeoType> {
    return this.request(
      `/jurisdictions/${code.toUpperCase()}?${qs.stringify(options)}`
    );
  }
}
