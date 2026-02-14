/* eslint no-restricted-imports: off */
import { Revision } from "./types";

function getDepotBase(): string {
  const explicit = process.env.NEXT_PUBLIC_BAN_API_DEPOT;
  if (explicit) return explicit;
  const balUrl = process.env.NEXT_PUBLIC_BAL_API_URL;
  if (balUrl) {
    try {
      const origin = new URL(balUrl).origin;
      return `${origin}/api-depot`;
    } catch {
      // ignore invalid URL
    }
  }
  return "https://plateforme-bal.adresse.data.gouv.fr/api-depot";
}

const BAN_API_DEPOT = getDepotBase();

export class ApiDepotService {
  private static async request<T>(url: string): Promise<T | null> {
    try {
      const res = await fetch(`${BAN_API_DEPOT}${url}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = (body as { message?: string })?.message ?? res.statusText;
        console.warn(`API Depot ${res.status}: ${msg}`);
        return null;
      }
      return (await res.json()) as T;
    } catch (err) {
      console.warn("API Depot request failed:", err);
      return null;
    }
  }

  public static async getRevisions(codeCommune: string): Promise<Revision[]> {
    const data = await this.request<Revision[]>(
      `/communes/${codeCommune}/revisions`
    );
    return Array.isArray(data) ? data : [];
  }

  public static async getCurrentRevision(
    codeCommune: string
  ): Promise<Revision | null> {
    return this.request<Revision>(
      `/communes/${codeCommune}/current-revision`
    );
  }

  public static async getEmailsCommune(codeCommune: string): Promise<string[]> {
    const data = await this.request<string[]>(
      `/communes/${codeCommune}/emails`
    );
    return Array.isArray(data) ? data : [];
  }
}
