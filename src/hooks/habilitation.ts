import {
  useState,
  useCallback,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import {
  ExtendedBaseLocaleDTO,
  HabilitationDTO,
  HabilitationService,
} from "@/lib/openapi-api-bal";

interface UseHabilitationType {
  habilitation: HabilitationDTO | null;
  reloadHabilitation: () => Promise<void>;
  isLoading: boolean;
  isHabilitationProcessDisplayed: boolean;
  setIsHabilitationProcessDisplayed: Dispatch<SetStateAction<boolean>>;
}

export default function useHabilitation(
  baseLocale: ExtendedBaseLocaleDTO,
  token: string
): UseHabilitationType {
  const [habilitation, setHabilitation] = useState<HabilitationDTO | null>(
    null
  );
  const [isHabilitationProcessDisplayed, setIsHabilitationProcessDisplayed] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const reloadHabilitation = useCallback(async () => {
    if (token) {
      try {
        const habilitation: HabilitationDTO =
          await HabilitationService.findHabilitation(baseLocale.id);
        setHabilitation(habilitation);
      } catch {
        setHabilitation(null);
      }
    }
  }, [baseLocale.id, token]);

  useEffect(() => {
    async function handleReloadHabilitation() {
      setIsLoading(true);
      await reloadHabilitation();
      setIsLoading(false);
    }

    handleReloadHabilitation();
  }, [token, reloadHabilitation]);

  return {
    habilitation,
    reloadHabilitation,
    isLoading,
    isHabilitationProcessDisplayed,
    setIsHabilitationProcessDisplayed,
  };
}
