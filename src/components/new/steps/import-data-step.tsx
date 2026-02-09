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
import { uniqBy } from "lodash";

interface ImportDataStepProps {
  commune: CommuneType;
  importValue: string;
  setImportValue: (value: "ban" | "file") => void;
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

const getImportOptions = (commune: CommuneType) => [
  {
    label: "Start from existing data in the National Address Platform",
    value: "ban",
    description: (
      <>
        This method is recommended in most cases. It allows you
        to start from addresses already present in the{" "}
        <a
          href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/carte-base-adresse-nationale?id=${commune.code}`}
          target="_blank"
        >
          National Address Platform
        </a>{" "}
        (NAP) and to enrich them with your own data.
      </>
    ),
  },
  {
    label: "Use a CSV file in LAB format",
    value: "file",
    description:
      "This method is recommended if you already have a CSV file in LAB format.",
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
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const options = getImportOptions(commune);

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
          <Alert title="An error occurred" intent="danger" marginTop={16}>
            This file type is not supported. You must upload a
            CSV file.
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
            <Alert
              title="An error occurred"
              intent="danger"
              marginTop={16}
            >
              The file does not match the jurisdiction selected in
              the previous step.
            </Alert>
          );
        } else if (communes.length > 1) {
          onAlert(
            <Alert
              title="An error occurred"
              intent="danger"
              marginTop={16}
            >
              The file must contain only one jurisdiction. Please
              check your file.
            </Alert>
          );
        } else {
          onAlert(
            <Alert
              title="An error occurred"
              intent="danger"
              marginTop={16}
            >
              No jurisdiction could be found.
            </Alert>
          );
        }

        if (invalidRowsCount > 0) {
          onAlert(
            <Alert
              title="The file contains errors"
              intent="warning"
              marginTop={16}
            >
              <Paragraph marginTop={8}>
                {invalidRowsCount > 1 ? (
                  <>
                    <Strong>
                      {invalidRowsCount} rows contain at least one error
                    </Strong>{" "}
                    and cannot be imported into your Local Address
                    Base.
                  </>
                ) : (
                  <>
                    <Strong>1 row contains at least one error</Strong> and
                    cannot be imported into your Local Address Base.
                  </>
                )}
              </Paragraph>

              <Paragraph>
                By continuing, only compliant addresses will be used
                to create your Local Address Base.
              </Paragraph>

              <Paragraph>
                For a detailed report of the errors that were
                detected, see{" "}
                <a
                  href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/bases-locales/validateur`}
                  target="_blank"
                  rel="noreferrer"
                >
                  the Local Address Base validator{" "}
                  <ShareIcon verticalAlign="middle" />
                </a>
                .
              </Paragraph>
            </Alert>,
            true
          );
        }
      } catch (err) {
        console.error(err);
        onAlert(
          <Alert title="An error occurred" intent="danger" marginTop={16}>
            An error occurred while analyzing the file.
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
        <Alert title="An error occurred" intent="danger" marginTop={16}>
          You can only upload one file.
        </Alert>
      );
    } else if (file.size > MAX_SIZE) {
      return onAlert(
        <Alert title="An error occurred" intent="danger" marginTop={16}>
          This file is too large. You must upload a file smaller
          than 10 MB.
        </Alert>
      );
    } else {
      onAlert(
        <Alert title="An error occurred" intent="danger" marginTop={16}>
          Unable to upload this file.
        </Alert>
      );
    }
  };

  const description = options.find(
    (option) => option.value === importValue
  )?.description;

  return (
    <>
      <Pane aria-label="Choose your starting point" role="group">
        <Text fontWeight={500} fontSize="14px" color="gray700">
          Choose your starting point
        </Text>
        {options.map((option) => (
          <Fragment key={option.value}>
            <Radio
              size={16}
              name="import-option"
              checked={importValue === option.value}
              label={option.label}
              onChange={() => setImportValue(option.value as "ban" | "file")}
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
            placeholder="Select or drag your LAB file in CSV format here (maximum 10 MB)"
            loadingLabel="Analyzing..."
            disabled={isLoading}
            onDrop={onDrop}
            onDropRejected={onDropRejected}
            isLoading={isLoading}
          />
          {alert}

          <Alert
            title="Do you already have a Local Address Base in CSV format managed from another tool?"
            marginY={16}
          >
            <Paragraph marginTop={16}>
              Use the submission form to publish your addresses to
              the National Address Platform.
            </Paragraph>
            <Pane marginTop={16}>
              <Button
                appearance="primary"
                iconBefore={InboxIcon}
                is="a"
                href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/bases-locales/publication`}
                target="_blank"
              >
                Go to submission form
              </Button>
            </Pane>
          </Alert>
        </Pane>
      )}
    </>
  );
}

export default ImportDataStep;
