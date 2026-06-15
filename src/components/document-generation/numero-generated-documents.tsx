import LocalStorageContext from "@/contexts/local-storage";
import { Numero } from "@/lib/openapi-api-bal";
import { DownloadIcon, Menu, Tooltip } from "evergreen-ui";
import { useTranslations } from "next-intl";
import { useContext } from "react";
import {
  DocumentGenerationData,
  GeneratedDocumentType,
} from "./document-generation.types";

interface NumeroGeneratedDocumentsProps<type extends GeneratedDocumentType> {
  setDocumentGenerationData: (data: DocumentGenerationData<type>) => void;
  numero: Numero;
}

export function NumeroGeneratedDocuments<type extends GeneratedDocumentType>({
  setDocumentGenerationData,
  numero,
}: NumeroGeneratedDocumentsProps<type>) {
  const t = useTranslations("docGen");
  const { certificatEmetteur } = useContext(LocalStorageContext);

  let generateCertificatAdressageItem = (
    <Menu.Item
      icon={DownloadIcon}
      disabled={!numero.certifie || numero.parcelles.length === 0}
      onSelect={() =>
        setDocumentGenerationData({
          type: GeneratedDocumentType.CERTIFICAT_ADRESSAGE,
          for: numero,
          data: {
            destinataire: "",
            emetteur: certificatEmetteur || "",
            rememberEmetteur: Boolean(certificatEmetteur),
          },
        } as Parameters<typeof setDocumentGenerationData>[0])
      }
    >
      {t("addressCertificate")}
    </Menu.Item>
  );

  let generateArreteDeNumerotationItem = (
    <Menu.Item
      icon={DownloadIcon}
      disabled={!numero.certifie}
      onSelect={() =>
        setDocumentGenerationData({
          type: GeneratedDocumentType.ARRETE_DE_NUMEROTATION,
          for: numero,
          data: {},
        } as Parameters<typeof setDocumentGenerationData>[0])
      }
    >
      {t("numberingOrder")}
    </Menu.Item>
  );

  if (!numero.certifie || numero.parcelles.length === 0) {
    generateCertificatAdressageItem = (
      <Tooltip content={t("certOnlyCertifiedParcel")}>
        {generateCertificatAdressageItem}
      </Tooltip>
    );
  }
  if (!numero.certifie) {
    generateArreteDeNumerotationItem = (
      <Tooltip content={t("numberingOnlyCertified")}>
        {generateArreteDeNumerotationItem}
      </Tooltip>
    );
  }

  return (
    <>
      <Menu.Divider />
      <Menu.Group title={t("generateTemplate")}>
        {generateCertificatAdressageItem}
        {generateArreteDeNumerotationItem}
      </Menu.Group>
    </>
  );
}
