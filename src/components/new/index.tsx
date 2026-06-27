"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import dynamic from "next/dynamic";
import Stepper from "@/components/stepper";
import { Button, Pane } from "evergreen-ui";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import LocalStorageContext from "@/contexts/local-storage";
import { useRouter } from "next/navigation";
import { useBALDataImport } from "@/hooks/bal-data-import";
import LayoutContext from "@/contexts/layout";
import { CommuneType } from "@/types/commune";
import { useTranslations } from "next-intl";
import styles from "./new.module.css";

const SearchCommuneStep = dynamic(
  () => import("@/components/new/steps/search-commune-step")
);
const ImportDataStep = dynamic(
  () => import("@/components/new/steps/import-data-step")
);
const BALInfosStep = dynamic(() => import("@/components/new/steps/bal-infos-step"));

interface NewPageProps {
  defaultCommune?: CommuneType;
  initialStateFips?: string;
  initialCountyCode?: string;
  initialJurisdictionCode?: string;
  outdatedApiDepotClients: string[];
  outdatedHarvestSources: string[];
}

const getSuggestedBALName = (commune?: CommuneType) => {
  return commune ? `Addresses of ${commune.nom}` : null;
};

export default function NewPageComponent({
  defaultCommune,
  initialStateFips,
  initialCountyCode,
  initialJurisdictionCode,
  outdatedApiDepotClients,
  outdatedHarvestSources,
}: NewPageProps) {
  const tNewBase = useTranslations("newBase");
  const tCommon = useTranslations("common");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { addBalAccess } = useContext(LocalStorageContext);
  const { pushToast } = useContext(LayoutContext);
  const [commune, setCommune] = useState<CommuneType | null>(defaultCommune);
  const [importValue, setImportValue] = useState<"ban" | "file" | "overture">(
    "ban"
  );
  const [csvImportFile, setCsvImportFile] = useState<File | null>(null);
  const [balName, setBalName] = useState<string | null>(null);
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [allowAutomaticProceed, setAllowAutomaticProceed] = useState(true);
  const { importFromCSVFile, importFromBAN, importFromOverture } =
    useBALDataImport();
  const router = useRouter();

  useEffect(() => {
    if (commune) {
      setBalName(getSuggestedBALName(commune));
    } else {
      setBalName(null);
    }
  }, [commune]);

  useEffect(() => {
    if (commune?.code) {
      setAllowAutomaticProceed(true);
    }
  }, [commune?.code]);

  const steps = useMemo(() => {
    return [
      {
        label: tNewBase("step1Title"),
        canBrowseNext: Boolean(commune),
        canBrowseBack: false,
      },
      {
        label: tNewBase("step2Title"),
        canBrowseNext:
          importValue === "file"
            ? Boolean(csvImportFile)
            : Boolean(importValue),
        canBrowseBack: !isLoading,
      },
      {
        label: tNewBase("step3Title"),
        canBrowseNext:
          !isLoading && Boolean(balName) && Boolean(adminEmails.length),
        canBrowseBack: !isLoading,
      },
    ];
  }, [commune, importValue, csvImportFile, isLoading, balName, adminEmails, tNewBase]);

  const onPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
    if (currentStepIndex === 1) {
      setAllowAutomaticProceed(false);
    }
  }, [currentStepIndex]);

  const onNextStep = useCallback(() => {
    if (currentStepIndex !== steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [currentStepIndex, steps.length]);

  const createNewBal = async (isDemo?: boolean) => {
    let bal: BaseLocale;

    setIsLoading(true);

    try {
      if (isDemo) {
        bal = await BasesLocalesService.createBaseLocaleDemo({
          commune: commune.code,
        });
      } else {
        bal = await BasesLocalesService.createBaseLocale({
          nom: balName,
          emails: adminEmails,
          commune: commune.code,
        });
      }
    } catch (err) {
      pushToast({
        title: tCommon("error"),
        message: tNewBase("createError"),
        intent: "danger",
      });
      setIsLoading(false);
      return;
    }

    addBalAccess(bal.id, bal.token);

    try {
      if (importValue === "file") {
        await importFromCSVFile(bal, csvImportFile);
      } else if (importValue === "overture") {
        await importFromOverture(bal);
      } else if (importValue === "ban") {
        await importFromBAN(bal);
      }
    } catch (err) {
      pushToast({
        title: tCommon("error"),
        message: tNewBase("importError"),
        intent: "danger",
      });
      setIsLoading(false);
      return;
    }

    router.push(`/bal/${bal.id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNewBal();
  };

  return (
    <>
      <Pane flex={1} is="form" onSubmit={handleSubmit}>
        <Stepper
          steps={steps}
          currentStepIndex={currentStepIndex}
          onStepChange={setCurrentStepIndex}
        >
          <Pane display="flex" height="100%">
            <Pane flex={1} display="flex" flexDirection="column">
              {currentStepIndex === 0 && (
                <SearchCommuneStep
                  onCreateNewBAL={onNextStep}
                  commune={commune}
                  setCommune={setCommune}
                  initialStateFips={initialStateFips}
                  initialCountyCode={initialCountyCode}
                  initialJurisdictionCode={initialJurisdictionCode}
                  allowAutomaticProceed={allowAutomaticProceed}
                  outdatedApiDepotClients={outdatedApiDepotClients}
                  outdatedHarvestSources={outdatedHarvestSources}
                />
              )}
              {currentStepIndex === 1 && (
                <ImportDataStep
                  commune={commune}
                  importValue={importValue}
                  setImportValue={setImportValue}
                  csvImportFile={csvImportFile}
                  setCsvImportFile={setCsvImportFile}
                />
              )}
              {currentStepIndex === 2 && (
                <BALInfosStep
                  balName={balName}
                  setBalName={setBalName}
                  adminEmails={adminEmails}
                  setAdminEmails={setAdminEmails}
                  createDemoBAL={() => createNewBal(true)}
                  isLoading={isLoading}
                />
              )}
              {currentStepIndex !== 0 && (
                <Pane className={styles["stepper-controls"]}>
                  <Button
                    onClick={onPreviousStep}
                    disabled={!steps[currentStepIndex].canBrowseBack}
                    type="button"
                    {...(!steps[currentStepIndex].canBrowseBack && {
                      style: { visibility: "hidden" },
                    })}
                  >
                    Previous
                  </Button>
                  <Button
                    appearance="primary"
                    onClick={(e) => {
                      currentStepIndex === steps.length - 1
                        ? handleSubmit(e)
                        : onNextStep();
                    }}
                    disabled={!steps[currentStepIndex].canBrowseNext}
                    type="button"
                  >
                    {currentStepIndex === steps.length - 1
                      ? "Finish"
                      : "Next"}
                  </Button>
                </Pane>
              )}
            </Pane>
            <Pane className={styles["welcome-illustration"]} />
          </Pane>
        </Stepper>
      </Pane>
    </>
  );
}
