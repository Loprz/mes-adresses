"use client";

import {
  BaseLocale,
  BasesLocalesService,
  OpenAPI,
} from "@/lib/openapi-api-bal";
import { useRef } from "react";

export function useBALDataImport() {
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );

  const importFromCSVFile = async (bal: BaseLocale, file: File) => {
    Object.assign(OpenAPI, { TOKEN: bal.token });
    // Force content type to be text/csv
    // To fix application/vnd.ms-excel issue on Windows and Firefox
    const blobFile = new Blob([file as Blob], {
      type: "text/csv",
    });
    const response = await BasesLocalesService.uploadCsvBalFile(bal.id, {
      file: blobFile,
    });

    if (!response.isValid) {
      throw new Error("The CSV file is invalid.");
    }
  };

  const pollUntilPopulated = (bal: BaseLocale) =>
    new Promise((resolve, reject) => {
      interval.current = setInterval(async () => {
        try {
          const isPopulating = await BasesLocalesService.isPopulatingBaseLocale(
            bal.id
          );

          if (!isPopulating) {
            clearInterval(interval.current);
            resolve(true);
          }
        } catch (err) {
          clearInterval(interval.current);
          reject(err);
        }
      }, 2000);
    });

  const importFromBAN = async (bal: BaseLocale) => {
    Object.assign(OpenAPI, { TOKEN: bal.token });
    BasesLocalesService.populateBaseLocale(bal.id);

    return pollUntilPopulated(bal);
  };

  const importFromOverture = async (bal: BaseLocale) => {
    Object.assign(OpenAPI, { TOKEN: bal.token });
    // Fire the on-demand Overture extract; we ignore the (potentially long)
    // request promise and track completion via the is_populating poll instead.
    BasesLocalesService.populateBaseLocale(bal.id, "overture");

    return pollUntilPopulated(bal);
  };

  return { importFromCSVFile, importFromBAN, importFromOverture };
}
