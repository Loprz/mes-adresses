"use client";

import RecoverBALAlert from "@/components/bal-recovery/recover-bal-alert";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import { ChildrenProps } from "@/types/context";
import { CommuneType } from "@/types/commune";
import { useParams } from "next/navigation";
import React, { useState, useMemo, useEffect, useCallback } from "react";

interface BALRecoveryContextType {
  isRecoveryDisplayed: boolean;
  setIsRecoveryDisplayed: (value: boolean) => void;
  openRecovery: (options?: { commune?: CommuneType | null }) => void;
}

const BALRecoveryContext = React.createContext<BALRecoveryContextType | null>(
  null
);

export function BALRecoveryProvider(props: ChildrenProps) {
  const [isRecoveryDisplayed, setIsRecoveryDisplayed] = useState(false);
  const [baseLocale, setBaseLocale] = useState<BaseLocale | null>(null);
  const [defaultCommune, setDefaultCommune] = useState<CommuneType | null>(null);
  const params = useParams();
  const balId = params?.balId as string | undefined;

  const openRecovery = useCallback(
    (options?: { commune?: CommuneType | null }) => {
      setDefaultCommune(options?.commune || null);
      setIsRecoveryDisplayed(true);
    },
    []
  );

  const value = useMemo(
    () => ({
      isRecoveryDisplayed,
      setIsRecoveryDisplayed,
      openRecovery,
    }),
    [isRecoveryDisplayed, openRecovery]
  );

  useEffect(() => {
    async function loadBaseLocale() {
      const baseLocale = await BasesLocalesService.findBaseLocale(balId);
      setBaseLocale(baseLocale);
    }

    if (balId) {
      loadBaseLocale();
    } else {
      setBaseLocale(null);
    }
  }, [balId]);

  return (
    <>
      <RecoverBALAlert
        isShown={isRecoveryDisplayed}
        onClose={() => {
          setIsRecoveryDisplayed(false);
          setDefaultCommune(null);
        }}
        baseLocale={baseLocale}
        defaultCommune={defaultCommune}
      />
      <BALRecoveryContext.Provider value={value} {...props} />
    </>
  );
}

export const BALRecoveryConsumer = BALRecoveryContext.Consumer;

export default BALRecoveryContext;
