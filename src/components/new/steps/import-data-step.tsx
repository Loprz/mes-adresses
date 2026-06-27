import Uploader from "@/components/uploader";
import { getFileExtension } from "@/lib/utils/file";
import { CommuneType } from "@/types/commune";
import {
  validate,
  ValidateType,
  ValidateRowFullType,
} from "@ban-team/validateur-bal";
import {
  Alert,
  Button,
  InboxIcon,
  Pane,
  Paragraph,
  Radio,
  ShareIcon,
  Strong,
  Text,
} from "evergreen-ui";
import { Fragment, JSX, useState } from "react";
import { useTranslations } from "next-intl";
import { uniqBy } from "lodash";

interface ImportDataStepProps {
  commune: CommuneType;
  importValue: string;
  setImportValue: (value: "ban" | "file" | "overture") => void;
  csvImportFile: File | null;
  setCsvImportFile: (file: File | null) => void;
}

type CommuneRow = {
  code: string;
  nom: string;
};

function extractCommuneCodeFromRow({ parsedValues, additionalValues }): string {
  return (
    parsedValues.commune_insee || additionalValues?.cle_interop?.codeCommune
  );
}

function extractCommuneFromCSV(rows: ValidateRowFullType[]): CommuneRow[] {
  // Get cle_interop and slice it to get the commune's code
  const communes: CommuneRow[] = rows.map(
    ({ parsedValues, additionalValues }) => ({
      code: extractCommuneCodeFromRow({ parsedValues, additionalValues }),
      nom: parsedValues.commune_nom as string,
    })
  );

  return uniqBy(communes, "code");
}

const getImportOptions = (
  commune: CommuneType,
  t: ReturnType<typeof useTranslations>
) => [
  {
    label: t("optionBanLabel"),
    value: "ban",
    description: t.rich("optionBanDescription", {
      link: (chunks) => (
        <a
          href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/carte-base-adresse-nationale?id=${commune.code}`}
          target="_blank"
        >
          {chunks}
        </a>
      ),
    }),
  },
  {
    label: t("optionOvertureLabel"),
    value: "overture",
    description: t("optionOvertureDescription"),
  },
  {
    label: t("optionFileLabel"),
    value: "file",
    description: t("optionFileDescription"),
  },
];

const MAX_SIZE = 10 * 1024 * 1024;

function ImportDataStep({
  importValue,
  setImportValue,
  csvImportFile,
  setCsvImportFile,
  commune,
}: ImportDataStepProps) {
  const t = useTranslations("importStep");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const options = getImportOptions(commune, t);

  const onAlert = (alert: JSX.Element, canCreateBAL?: boolean) => {
    if (!canCreateBAL) {
      setCsvImportFile(null);
    }
    setAlert(alert);
  };

  const onDrop = async ([file]) => {
    setAlert(null);
    if (file) {
      if (getFileExtension(file.name).toLowerCase() !== "csv") {
        return onAlert(
          <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
            {t("errorNotCsv")}
          </Alert>
        );
      }

      try {
        setIsLoading(true);
        // Detect multi communes
        const validationReport: ValidateType = (await validate(file, {
          profile: "1.4",
        })) as ValidateType;
        const communes: CommuneRow[] = extractCommuneFromCSV(
          validationReport.rows
        );
        const invalidRowsCount = validationReport.rows.filter(
          (row) =>
            !row.isValid && extractCommuneCodeFromRow(row) === commune.code
        ).length;

        if (communes.length === 1 && communes[0].code === commune.code) {
          setCsvImportFile(file);
        } else if (communes.length === 1 && communes[0].code !== commune.code) {
          onAlert(
            <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
              {t("errorWrongJurisdiction")}
            </Alert>
          );
        } else if (communes.length > 1) {
          onAlert(
            <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
              {t("errorMultipleJurisdictions")}
            </Alert>
          );
        } else {
          onAlert(
            <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
              {t("errorNoJurisdiction")}
            </Alert>
          );
        }

        if (invalidRowsCount > 0) {
          onAlert(
            <Alert
              title={t("fileErrorsTitle")}
              intent="warning"
              marginTop={16}
            >
              <Paragraph marginTop={8}>
                {t.rich("rowsError", {
                  count: invalidRowsCount,
                  b: (chunks) => <Strong>{chunks}</Strong>,
                })}
              </Paragraph>

              <Paragraph>{t("onlyCompliant")}</Paragraph>

              <Paragraph>
                {t.rich("detailedReport", {
                  link: (chunks) => (
                    <a
                      href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/bases-locales/validateur`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {chunks} <ShareIcon verticalAlign="middle" />
                    </a>
                  ),
                })}
              </Paragraph>
            </Alert>,
            true
          );
        }
      } catch (err) {
        console.error(err);
        onAlert(
          <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
            {t("errorAnalyzing")}
          </Alert>
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onDropRejected = (rejectedFiles) => {
    const [file] = rejectedFiles;

    if (rejectedFiles.length > 1) {
      onAlert(
        <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
          {t("errorOnlyOneFile")}
        </Alert>
      );
    } else if (file.size > MAX_SIZE) {
      return onAlert(
        <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
          {t("errorTooLarge")}
        </Alert>
      );
    } else {
      onAlert(
        <Alert title={t("errorTitle")} intent="danger" marginTop={16}>
          {t("errorUploadFailed")}
        </Alert>
      );
    }
  };

  const description = options.find(
    (option) => option.value === importValue
  )?.description;

  return (
    <>
      <Pane aria-label={t("chooseStartingPoint")} role="group">
        <Text fontWeight={500} fontSize="14px" color="gray700">
          {t("chooseStartingPoint")}
        </Text>
        {options.map((option) => (
          <Fragment key={option.value}>
            <Radio
              size={16}
              name="import-option"
              checked={importValue === option.value}
              label={option.label}
              onChange={() =>
                setImportValue(option.value as "ban" | "file" | "overture")
              }
            />
            {importValue === option.value && (
              <Alert intent="info" marginBottom={16}>
                <Text>{description}</Text>
              </Alert>
            )}
          </Fragment>
        ))}
      </Pane>

      {importValue === "file" && (
        <Pane>
          <Uploader
            file={csvImportFile}
            maxSize={MAX_SIZE}
            height={150}
            marginBottom={24}
            placeholder={t("uploaderPlaceholder")}
            loadingLabel={t("analyzing")}
            disabled={isLoading}
            onDrop={onDrop}
            onDropRejected={onDropRejected}
            isLoading={isLoading}
          />
          {alert}

          <Alert title={t("alreadyHaveTitle")} marginY={16}>
            <Paragraph marginTop={16}>{t("useSubmissionForm")}</Paragraph>
            <Pane marginTop={16}>
              <Button
                appearance="primary"
                iconBefore={InboxIcon}
                is="a"
                href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/bases-locales/publication`}
                target="_blank"
              >
                {t("goToSubmissionForm")}
              </Button>
            </Pane>
          </Alert>
        </Pane>
      )}
    </>
  );
}

export default ImportDataStep;
