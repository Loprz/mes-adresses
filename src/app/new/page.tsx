import NewPageComponent from "@/components/new";
import { ApiGeoService } from "../../lib/geo-api";
import { ApiBalAdminService } from "@/lib/bal-admin";
import { BALWidgetConfig } from "@/lib/bal-admin/type";

export default async function NewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const getQueryValue = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  const stateFips = getQueryValue(query.state);
  const legacyCommuneCode = getQueryValue(query.commune);
  const countyCode = getQueryValue(query.county);
  const placeCode = getQueryValue(query.place);
  const jurisdictionCode = placeCode || countyCode || legacyCommuneCode;

  let defaultCommune = null;
  if (jurisdictionCode) {
    defaultCommune = await ApiGeoService.getCommune(jurisdictionCode);
  }

  const initialStateFips =
    stateFips || defaultCommune?.stateFips || countyCode?.slice(0, 2);
  const initialCountyCode =
    countyCode ||
    (defaultCommune?.level === "county"
      ? defaultCommune.code
      : defaultCommune?.countyFips || undefined);
  const initialJurisdictionCode =
    placeCode || countyCode || legacyCommuneCode || defaultCommune?.code;

  let outdatedApiDepotClients: string[] = [];
  let outdatedHarvestSources: string[] = [];
  try {
    const widgetConfig: BALWidgetConfig =
      await ApiBalAdminService.getBALWidgetConfig();
    outdatedApiDepotClients =
      widgetConfig?.communes?.outdatedApiDepotClients || [];
    outdatedHarvestSources =
      widgetConfig?.communes?.outdatedHarvestSources || [];
  } catch (error) {
    console.error("Error fetching widget config:", error);
  }

  return (
    <NewPageComponent
      defaultCommune={defaultCommune}
      initialStateFips={initialStateFips}
      initialCountyCode={initialCountyCode}
      initialJurisdictionCode={initialJurisdictionCode}
      outdatedApiDepotClients={outdatedApiDepotClients}
      outdatedHarvestSources={outdatedHarvestSources}
    />
  );
}
