/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CommunePrecedenteDTO } from './CommunePrecedenteDTO';

export type CommuneDTO = {
    code: string;
    /** @deprecated Legacy field — no longer used in US context */
    codeCommunesCadastre?: Array<string>;
    nom: string;
    /** Whether this is a place (city/town) or county */
    level?: 'place' | 'county';
    /** Type: city, town, village, borough, or county */
    type?: string;
    /** Parent county name (for places) */
    countyName?: string;
    isCOM: boolean;
    hasParcels: boolean;
    hasOpenMapTiles: boolean;
    hasOrtho: boolean;
    hasPlanIGN: boolean;
    communesDeleguees: Array<CommunePrecedenteDTO>;
};

