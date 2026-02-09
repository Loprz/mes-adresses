import { Voie } from "@/lib/openapi-api-bal";
import { DownloadIcon, Menu } from "evergreen-ui";
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
  return (
    <>
      <Menu.Divider />
      <Menu.Group title="Generate a template">
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
          Arrêté de numérotation
        </Menu.Item>
      </Menu.Group>
    </>
  );
}
