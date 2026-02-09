"use client";

import qs from "querystring";
import { toaster } from "evergreen-ui";
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
  private static async request(url: string) {
    try {
      const res = await fetch(`${API_BASE}${url}`);
      return res.json();
    } catch (error) {
      toaster.danger("Unexpected error", {
        description: error.message,
      });
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

    // Include limit if specified
    if (options.limit) {
      query.limit = options.limit;
    }

    const res = await this.request(
      `/commune/search?${qs.stringify(query)}`
    );
    return res || [];
  }

  public static async getCommune(
    code: string,
    options = {}
  ): Promise<CommuneApiGeoType> {
    return this.request(
      `/commune/${code.toUpperCase()}?${qs.stringify(options)}`
    );
  }
}
