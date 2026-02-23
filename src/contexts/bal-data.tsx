"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { union } from "lodash";

import {
  HabilitationDTO,
  Numero,
  Toponyme,
  Voie,
  BasesLocalesService,
  VoiesService,
  ToponymesService,
  BaseLocaleSync,
  ExtendedBaseLocaleDTO,
  ExtentedToponymeDTO,
  ExtendedVoieDTO,
} from "@/lib/openapi-api-bal";
import TokenContext from "@/contexts/token";
import useHabilitation from "@/hooks/habilitation";
import LayoutContext from "./layout";
import { CommuneType } from "@/types/commune";
import { getCommuneWithBBox } from "@/lib/commune";
import { Pane, Paragraph, Spinner } from "evergreen-ui";
import {
  CanonicalAddress,
  CanonicalJurisdiction,
  CanonicalLocalAddressBase,
  CanonicalPlaceName,
  CanonicalStreet,
  toCanonicalAddress,
  toCanonicalJurisdiction,
  toCanonicalLocalAddressBase,
  toCanonicalPlaceName,
  toCanonicalStreet,
} from "@/lib/domain/us-address-domain";

interface BALDataContextType {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editingId: string | null;
  setEditingId: (isEditing: string | null) => void;
  editingItem: Voie | Toponyme | Numero;
  baseLocale: ExtendedBaseLocaleDTO;
  localAddressBase: CanonicalLocalAddressBase;
  reloadBaseLocale: () => void;
  habilitation: HabilitationDTO;
  reloadHabilitation: () => Promise<void>;
  parcelles: Array<string>;
  reloadParcelles: () => Promise<void>;
  setVoies: React.Dispatch<React.SetStateAction<ExtendedVoieDTO[]>>;
  voie: Voie;
  setVoie: React.Dispatch<React.SetStateAction<Voie>>;
  toponyme: Toponyme;
  setToponyme: (Toponyme: Toponyme) => void;
  numeros: Array<Numero>;
  addresses: CanonicalAddress[];
  reloadNumeros: () => Promise<void>;
  voies: ExtendedVoieDTO[];
  streets: CanonicalStreet[];
  reloadVoies: () => Promise<void>;
  toponymes: ExtentedToponymeDTO[];
  placeNames: CanonicalPlaceName[];
  reloadToponymes: () => Promise<void>;
  isRefrehSyncStat: boolean;
  refreshBALSync: () => Promise<void>;
  habilitationIsLoading: boolean;
  isHabilitationProcessDisplayed: boolean;
  setIsHabilitationProcessDisplayed: (
    isHabilitationProcessDisplayed: boolean
  ) => void;
  reloadVoieNumeros: (voieId: string) => Promise<void>;
  commune: CommuneType | null;
  jurisdiction: CanonicalJurisdiction | null;
  setNumeros: React.Dispatch<React.SetStateAction<Numero[]>>;
}

const BalDataContext = React.createContext<BALDataContextType | null>(null);

interface BalDataContextProviderProps {
  initialBaseLocale: ExtendedBaseLocaleDTO;
  children: React.ReactNode;
}

export function BalDataContextProvider({
  initialBaseLocale,
  children,
}: BalDataContextProviderProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, _setEditingId] = useState<string>(null);
  const [parcelles, setParcelles] = useState<Array<string>>([]);
  const [numeros, setNumeros] = useState<Array<Numero>>([]);
  const [voies, setVoies] = useState<ExtendedVoieDTO[]>([]);
  const [toponymes, setToponymes] = useState<ExtentedToponymeDTO[]>([]);
  const [commune, setCommune] = useState<CommuneType | null>(null);
  const [voie, setVoie] = useState<Voie | undefined>();
  const [toponyme, setToponyme] = useState<Toponyme | undefined>();
  const [baseLocale, setBaseLocale] =
    useState<ExtendedBaseLocaleDTO>(initialBaseLocale);
  const [isRefrehSyncStat, setIsRefrehSyncStat] = useState<boolean>(false);
  const { pushToast } = useContext(LayoutContext);
  const { token } = useContext(TokenContext);
  const [isBALDataLoaded, setIsBALDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function fetchBALData() {
      try {
        const voies = await BasesLocalesService.findBaseLocaleVoies(
          initialBaseLocale.id
        );
        const toponymes = await BasesLocalesService.findBaseLocaleToponymes(
          initialBaseLocale.id
        );
        const commune = await getCommuneWithBBox(
          initialBaseLocale,
          voies,
          toponymes
        );
        setVoies(voies);
        setToponymes(toponymes);
        setCommune(commune);
        setIsBALDataLoaded(true);
      } catch (error) {
        console.error("Error fetching BAL data:", error);
      }
    }

    if (!isBALDataLoaded) {
      fetchBALData();
    }
  }, [initialBaseLocale, isBALDataLoaded]);

  const {
    habilitation,
    reloadHabilitation,
    isLoading: habilitationIsLoading,
    isHabilitationProcessDisplayed,
    setIsHabilitationProcessDisplayed,
  } = useHabilitation(initialBaseLocale, token);

  const reloadParcelles = useCallback(async () => {
    const parcelles: Array<string> =
      await BasesLocalesService.findBaseLocaleParcelles(baseLocale.id);
    setParcelles(parcelles);
  }, [baseLocale.id]);

  const reloadVoies = useCallback(async () => {
    const voies: ExtendedVoieDTO[] =
      await BasesLocalesService.findBaseLocaleVoies(baseLocale.id);
    setVoies(voies);
  }, [baseLocale.id]);

  const reloadToponymes = useCallback(async () => {
    const toponymes: ExtentedToponymeDTO[] =
      await BasesLocalesService.findBaseLocaleToponymes(baseLocale.id);
    setToponymes(toponymes);
  }, [baseLocale.id]);

  const reloadVoieNumeros = useCallback(async (voieId: string) => {
    const numeros: Numero[] = await VoiesService.findVoieNumeros(voieId);
    setNumeros(numeros);
  }, []);

  const reloadNumeros = useCallback(async () => {
    let numeros: Numero[];
    if (voie) {
      numeros = await VoiesService.findVoieNumeros(voie.id);
    } else if (toponyme) {
      numeros = await ToponymesService.findToponymeNumeros(toponyme.id);
    }

    if (numeros) {
      setNumeros(numeros);
    }
  }, [voie, toponyme]);

  const reloadBaseLocale = useCallback(async () => {
    const bal = await BasesLocalesService.findBaseLocale(baseLocale.id);
    setBaseLocale(bal);
  }, [baseLocale.id]);

  const refreshBALSync = useCallback(async () => {
    const { sync }: { sync: BaseLocaleSync } = baseLocale;
    if (
      sync &&
      sync.status === BaseLocaleSync.status.SYNCED &&
      !sync.isPaused &&
      !isRefrehSyncStat
    ) {
      setIsRefrehSyncStat(true);
      setTimeout(async () => {
        await reloadBaseLocale();
        setIsRefrehSyncStat(false);
        pushToast({
          title: "New changes have been detected",
          message:
            "They will be automatically transmitted to the National Address Platform within a few hours.",
          intent: "info",
          duration: 5000,
        });
      }, 30000); // Maximum interval between CRON job
    }
  }, [baseLocale, isRefrehSyncStat, reloadBaseLocale, pushToast]);

  const setEditingId = useCallback(
    (editingId: string) => {
      if (token) {
        _setEditingId(editingId);
        setIsEditing(Boolean(editingId));
      }
    },
    [token]
  );

  const editingItem = useMemo(() => {
    if (editingId) {
      if (voie?.id === editingId) {
        return voie;
      }

      if (toponyme?.id === editingId) {
        return toponyme;
      }

      return union(voies, toponymes, numeros).find(
        ({ id }) => id === editingId
      );
    }
  }, [editingId, numeros, voie, toponyme, voies, toponymes]);

  useEffect(() => {
    reloadParcelles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function resumeBal() {
      await BasesLocalesService.resumeBaseLocale(baseLocale.id);
      await reloadBaseLocale();
    }
    // Resume LAB sync if authorization is accepted and sync was paused
    if (
      habilitation?.status === HabilitationDTO.status.ACCEPTED &&
      baseLocale.sync?.isPaused == true
    ) {
      resumeBal();
    }
  }, [
    baseLocale.id,
    baseLocale.sync?.isPaused,
    habilitation?.status,
    reloadBaseLocale,
  ]);

  const localAddressBase = useMemo(
    () => toCanonicalLocalAddressBase(baseLocale),
    [baseLocale]
  );
  const jurisdiction = useMemo(
    () => (commune ? toCanonicalJurisdiction(commune) : null),
    [commune]
  );
  const streets = useMemo(() => voies.map(toCanonicalStreet), [voies]);
  const placeNames = useMemo(
    () => toponymes.map(toCanonicalPlaceName),
    [toponymes]
  );
  const addresses = useMemo(() => numeros.map(toCanonicalAddress), [numeros]);

  const value = useMemo(
    () => ({
      isEditing,
      setIsEditing,
      editingId,
      editingItem,
      baseLocale,
      localAddressBase,
      habilitation,
      parcelles,
      voie,
      toponyme,
      numeros,
      addresses,
      voies: voies,
      streets,
      toponymes: toponymes,
      placeNames,
      isRefrehSyncStat,
      setEditingId,
      refreshBALSync,
      reloadHabilitation,
      reloadParcelles,
      reloadNumeros,
      reloadVoies,
      reloadToponymes,
      reloadBaseLocale,
      setVoie,
      setVoies,
      setToponyme,
      setNumeros,
      habilitationIsLoading,
      isHabilitationProcessDisplayed,
      setIsHabilitationProcessDisplayed,
      reloadVoieNumeros,
      commune,
      jurisdiction,
    }),
    [
      isEditing,
      editingId,
      setEditingId,
      editingItem,
      parcelles,
      reloadParcelles,
      baseLocale,
      localAddressBase,
      reloadBaseLocale,
      habilitation,
      reloadHabilitation,
      voie,
      numeros,
      addresses,
      voies,
      streets,
      toponymes,
      placeNames,
      setVoies,
      reloadNumeros,
      reloadVoies,
      reloadToponymes,
      toponyme,
      isRefrehSyncStat,
      refreshBALSync,
      habilitationIsLoading,
      isHabilitationProcessDisplayed,
      setIsHabilitationProcessDisplayed,
      reloadVoieNumeros,
      commune,
      jurisdiction,
      setNumeros,
    ]
  );

  return (
    <BalDataContext.Provider value={value}>
      {isBALDataLoaded ? (
        children
      ) : (
        <Pane
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          background="tint1"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner />
          <Paragraph marginTop={10}>
            Loading the Local Address Base...
          </Paragraph>
        </Pane>
      )}
    </BalDataContext.Provider>
  );
}

export const BalDataContextConsumer = BalDataContext.Consumer;

export default BalDataContext;
