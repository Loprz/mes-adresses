import { useState, useEffect } from "react";
import { Button, Paragraph, Spinner, Strong } from "evergreen-ui";
import { DataGouvService } from "@/lib/data-gouv/data-gouv";
import {
  Dataset,
  Organization as OrganizationDataGouv,
} from "@/lib/data-gouv/types";
import { Organization as OrganizationMoissonneur } from "@/lib/moissonneur/type";
import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import { ApiMoissonneurBalService } from "@/lib/moissonneur";

interface PublishedBALMoissoneurProps {
  commune: CommuneType;
  revision: Revision;
  outdatedHarvestSources: string[];
}

function PublishedBALMoissoneur({
  revision,
  outdatedHarvestSources,
  commune,
}: PublishedBALMoissoneurProps) {
  const [organizationMoissonneur, setOrganizationMoissonneur] =
    useState<OrganizationMoissonneur | null>(null);
  const [organizationDataGouv, setOrganizationDataGouv] =
    useState<OrganizationDataGouv | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isOutdatedSource = outdatedHarvestSources.includes(
    revision.context.extras.sourceId
  );

  useEffect(() => {
    const loadOrganization = async () => {
      setIsLoading(true);
      if (revision.context.extras.sourceId) {
        try {
          const sourceId: string = revision.context.extras.sourceId;
          const dataset: Dataset = await DataGouvService.findDataset(sourceId);
          setOrganizationDataGouv(dataset.organization);
          if (dataset?.organization?.id) {
            const organizationMoissonneur =
              await ApiMoissonneurBalService.getOrganization(
                dataset.organization.id
              );
            setOrganizationMoissonneur(organizationMoissonneur);
          }
        } catch (error) {
          console.error("Error fetching organization:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadOrganization();
  }, [revision]);

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      {organizationDataGouv && (
        <>
          <Paragraph marginTop={16}>
            A Local Address Base is already published for {commune.nom} by{" "}
            {organizationDataGouv.name}.
          </Paragraph>
          {!isOutdatedSource && (
            <Paragraph marginTop={16}>
              We recommend contacting this organization before replacing it:{" "}
              {organizationMoissonneur?.email ? (
                <Strong>{organizationMoissonneur.email}</Strong>
              ) : (
                <Button
                  is="a"
                  height={30}
                  href={organizationDataGouv.page}
                  target="_blank"
                >
                  View {organizationDataGouv.name} on data.gouv
                </Button>
              )}
            </Paragraph>
          )}
        </>
      )}

      {isOutdatedSource && (
        <Paragraph marginTop={16}>
          The published Local Address Base appears outdated. You may continue
          to the next step if you need to replace it with your jurisdiction's
          LAB.
        </Paragraph>
      )}

      <Paragraph marginTop={16}>
        Your jurisdiction remains the official local addressing authority, and
        you can take over publication directly by continuing to the next step.
      </Paragraph>
    </>
  );
}

export default PublishedBALMoissoneur;
