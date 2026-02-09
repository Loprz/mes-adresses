import LocalStorageContext from "@/contexts/local-storage";
import { GenerateCertificatDTO } from "@/lib/openapi-api-bal";
import { Dialog, Pane, TextInputField, Checkbox } from "evergreen-ui";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import {
  DocumentGenerationData,
  GeneratedDocumentType,
} from "./document-generation.types";

export type CertificatGenerationData = GenerateCertificatDTO & {
  rememberEmetteur?: boolean;
};

interface GenerateCertificatDialogProps<type extends GeneratedDocumentType> {
  data: DocumentGenerationData<type> | null;
  setData: Dispatch<SetStateAction<DocumentGenerationData<type> | null>>;
  onDownload: (
    numeroId: string,
    data: CertificatGenerationData
  ) => Promise<void>;
}

export function GenerateCertificatDialog<type extends GeneratedDocumentType>({
  data: docData,
  setData,
  onDownload,
}: GenerateCertificatDialogProps<type>) {
  const { data } =
    (docData as DocumentGenerationData<GeneratedDocumentType.CERTIFICAT_ADRESSAGE>) ||
    {};
  const [isGeneratingCertificat, setIsGeneratingCertificat] = useState(false);
  const { setCertificatEmetteur } = useContext(LocalStorageContext);

  return (
    <Dialog
      isShown={docData?.type === GeneratedDocumentType.CERTIFICAT_ADRESSAGE}
      title="Generate an addressing certificate"
      cancelLabel="Cancel"
      confirmLabel="Download"
      onCloseComplete={() => setData(null)}
      onCancel={() => setData(null)}
      isConfirmLoading={isGeneratingCertificat}
      isConfirmDisabled={isGeneratingCertificat}
      shouldCloseOnOverlayClick={!isGeneratingCertificat}
      shouldCloseOnEscapePress={!isGeneratingCertificat}
      hasCancel={!isGeneratingCertificat}
      hasClose={!isGeneratingCertificat}
      onConfirm={async () => {
        if (data) {
          setIsGeneratingCertificat(true);
          await onDownload(docData.for.id, data);
          if (data.rememberEmetteur) {
            setCertificatEmetteur(data.emetteur);
          } else {
            setCertificatEmetteur(undefined);
          }
          setIsGeneratingCertificat(false);
          setData(null);
        }
      }}
    >
      <Pane is="form" onSubmit={(e) => e.preventDefault()}>
        <TextInputField
          label="Issuer (optional)"
          description="L' will be mentioned in the addressing certificate'"
          value={data?.emetteur || ""}
          onChange={(e) =>
            setData((data) => ({
              ...data,
              data: {
                ...data.data,
                emetteur: e.target.value,
              },
            }))
          }
          placeholder="Sylvie Loiseau, Adjointe au Maire"
        />
        <Checkbox
          label="Remember the issuer'"
          checked={data?.rememberEmetteur || false}
          onChange={(e) =>
            setData((data) => ({
              ...data,
              data: {
                ...data.data,
                rememberEmetteur: (e.target as HTMLInputElement).checked,
              },
            }))
          }
          marginBottom={16}
        />
        <TextInputField
          label="Destinataire (optionnel)"
          description="Enter the recipient name for a named certificate"
          value={data?.destinataire || ""}
          onChange={(e) =>
            setData((data) => ({
              ...data,
              data: {
                ...data.data,
                destinataire: e.target.value,
              },
            }))
          }
          placeholder="Mr John Smith"
        />
      </Pane>
    </Dialog>
  );
}
