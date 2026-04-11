import JurisdictionSelector from "@/components/jurisdiction-selector";
import { CommuneType } from "@/types/commune";
import { Pane, Paragraph } from "evergreen-ui";
import { useTranslations } from "next-intl";
import CommunePublicationInfos from "../commune-publication-infos";

interface SearchCommuneStepProps {
  commune: CommuneType | null;
  setCommune: (commune: CommuneType | null) => void;
  initialStateFips?: string;
  initialCountyCode?: string;
  initialJurisdictionCode?: string;
  allowAutomaticProceed: boolean;
  outdatedApiDepotClients: string[];
  outdatedHarvestSources: string[];
  onCreateNewBAL: () => void;
}

function SearchCommuneStep({
  commune,
  setCommune,
  initialStateFips,
  initialCountyCode,
  initialJurisdictionCode,
  allowAutomaticProceed,
  outdatedApiDepotClients,
  outdatedHarvestSources,
  onCreateNewBAL,
}: SearchCommuneStepProps) {
  const tNewBase = useTranslations("newBase");

  return (
    <Pane maxWidth={760}>
      <Paragraph marginBottom={24}>{tNewBase("step1Description")}</Paragraph>

      <JurisdictionSelector
        commune={commune}
        setCommune={setCommune}
        initialStateFips={initialStateFips}
        initialCountyCode={initialCountyCode}
        initialJurisdictionCode={initialJurisdictionCode}
      />

      {commune && (
        <Pane marginTop={16}>
          <CommunePublicationInfos
            onCreateNewBAL={onCreateNewBAL}
            commune={commune}
            allowAutomaticProceed={allowAutomaticProceed}
            outdatedApiDepotClients={outdatedApiDepotClients}
            outdatedHarvestSources={outdatedHarvestSources}
          />
        </Pane>
      )}
    </Pane>
  );
}

export default SearchCommuneStep;
