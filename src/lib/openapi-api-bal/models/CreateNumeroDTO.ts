/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Position } from './Position';

export type CreateNumeroDTO = {
    numero: number;
    suffixe?: string | null;
    comment?: string | null;
    toponymeId?: string | null;
    parcelles?: Array<string>;
    certifie?: boolean;
    communeDeleguee?: string;
    positions: Array<Position>;
    /**
     * Overture Maps GERS ID — links this address to an Overture building/entity.
     */
    gersId?: string;
};

