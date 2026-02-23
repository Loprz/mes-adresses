import {
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  ExtentedToponymeDTO,
  Numero,
} from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";

export interface CanonicalLocalAddressBase {
  id: string;
  name: string;
  jurisdictionCode: string;
  jurisdictionName?: string;
  jurisdictionNamesAlt?: Record<string, any> | null;
  status: ExtendedBaseLocaleDTO["status"];
  authorizationId?: string | null;
  numberOfAddresses: number;
  numberOfCertifiedAddresses: number;
  allAddressesCertified: boolean;
}

export interface CanonicalJurisdiction {
  jurisdictionCode: string;
  jurisdictionName: string;
  level?: "place" | "county";
  type?: string;
  countyName?: string;
  hasOpenMapTiles: boolean;
  hasOrtho: boolean;
  hasPlanIGN: boolean;
  hasParcels: boolean;
  isCOM: boolean;
  delegatedJurisdictions: CommuneType["communesDeleguees"];
  bounds?: number[];
  boundary?: CommuneType["contour"];
}

export interface CanonicalStreet {
  id: string;
  localAddressBaseId: string;
  name: string;
  namesAlt?: Record<string, any> | null;
  numberingType: ExtendedVoieDTO["typeNumerotation"];
  centerline?: Record<string, any> | null;
  bounds?: number[] | null;
  comment?: string | null;
  numberOfAddresses: number;
  numberOfCertifiedAddresses: number;
  allAddressesCertified: boolean;
}

export interface CanonicalPlaceName {
  id: string;
  localAddressBaseId: string;
  name: string;
  namesAlt?: Record<string, any> | null;
  delegatedJurisdictionCode?: string | null;
  parcelIds?: string[] | null;
  bounds?: Record<string, any> | null;
  numberOfAddresses: number;
  numberOfCertifiedAddresses: number;
  allAddressesCertified: boolean;
}

export interface CanonicalAddress {
  id: string;
  localAddressBaseId: string;
  streetId: string;
  placeNameId?: string | null;
  houseNumber: number;
  numberSuffix?: string | null;
  fullAddressNumber?: string | null;
  comment?: string | null;
  parcelIds?: string[] | null;
  certified: boolean;
  delegatedJurisdictionCode?: string | null;
}

export function toCanonicalLocalAddressBase(
  baseLocale: ExtendedBaseLocaleDTO
): CanonicalLocalAddressBase {
  return {
    id: baseLocale.id,
    name: baseLocale.nom,
    jurisdictionCode: baseLocale.commune,
    jurisdictionName: baseLocale.communeNom,
    jurisdictionNamesAlt: baseLocale.communeNomsAlt,
    status: baseLocale.status,
    authorizationId: baseLocale.habilitationId,
    numberOfAddresses: baseLocale.nbNumeros,
    numberOfCertifiedAddresses: baseLocale.nbNumerosCertifies,
    allAddressesCertified: baseLocale.isAllCertified,
  };
}

export function toCanonicalJurisdiction(
  commune: CommuneType
): CanonicalJurisdiction {
  return {
    jurisdictionCode: commune.code,
    jurisdictionName: commune.nom,
    level: commune.level,
    type: commune.type,
    countyName: commune.countyName,
    hasOpenMapTiles: commune.hasOpenMapTiles,
    hasOrtho: commune.hasOrtho,
    hasPlanIGN: commune.hasPlanIGN,
    hasParcels: commune.hasParcels,
    isCOM: commune.isCOM,
    delegatedJurisdictions: commune.communesDeleguees,
    bounds: commune.bbox,
    boundary: commune.contour,
  };
}

export function toCanonicalStreet(voie: ExtendedVoieDTO): CanonicalStreet {
  return {
    id: voie.id,
    localAddressBaseId: voie.balId,
    name: voie.nom,
    namesAlt: voie.nomAlt,
    numberingType: voie.typeNumerotation,
    centerline: voie.trace,
    bounds: voie.bbox,
    comment: voie.comment,
    numberOfAddresses: voie.nbNumeros,
    numberOfCertifiedAddresses: voie.nbNumerosCertifies,
    allAddressesCertified: voie.isAllCertified,
  };
}

export function toCanonicalPlaceName(
  toponyme: ExtentedToponymeDTO
): CanonicalPlaceName {
  return {
    id: toponyme.id,
    localAddressBaseId: toponyme.balId,
    name: toponyme.nom,
    namesAlt: toponyme.nomAlt,
    delegatedJurisdictionCode: toponyme.communeDeleguee,
    parcelIds: toponyme.parcelles,
    bounds: toponyme.bbox,
    numberOfAddresses: toponyme.nbNumeros,
    numberOfCertifiedAddresses: toponyme.nbNumerosCertifies,
    allAddressesCertified: toponyme.isAllCertified,
  };
}

export function toCanonicalAddress(numero: Numero): CanonicalAddress {
  return {
    id: numero.id,
    localAddressBaseId: numero.balId,
    streetId: numero.voieId,
    placeNameId: numero.toponymeId,
    houseNumber: numero.numero,
    numberSuffix: numero.suffixe,
    fullAddressNumber: numero.numeroComplet,
    comment: numero.comment,
    parcelIds: numero.parcelles,
    certified: numero.certifie,
    delegatedJurisdictionCode: numero.communeDeleguee,
  };
}

