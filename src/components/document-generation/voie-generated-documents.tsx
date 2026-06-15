import { Voie } from "@/lib/openapi-api-bal";
import { DownloadIcon, Menu } from "evergreen-ui";
import { useTranslations } from "next-intl";
import {
  DocumentGenerationData,
  GeneratedDocumentType,
} from "./document-generation.types";

interface VoieGeneratedDocumentsProps<type extends GeneratedDocumentType> {
  setDocumentGenerationData: (data: DocumentGenerationData<type>) => void;
  voie: Voie;
}

export function VoieGeneratedDocuments<type extends GeneratedDocumentType>({
  setDocumentGenerationData,
  voie,
}: VoieGeneratedDocumentsProps<type>) {
  const t = useTranslations("docGen");
  return (
    <>
      <Menu.Divider />
      <Menu.Group title={t("generateTemplate")}>
        <Menu.Item
          icon={DownloadIcon}
          onSelect={() =>
            setDocumentGenerationData({
              type: GeneratedDocumentType.ARRETE_DE_NUMEROTATION,
              for: voie,
              data: {},
            } as Parameters<typeof setDocumentGenerationData>[0])
          }
        >
          {t("numberingOrder")}
        </Menu.Item>
      </Menu.Group>
    </>
  );
}
