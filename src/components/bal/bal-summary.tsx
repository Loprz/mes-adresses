import React, { useContext } from "react";
import { Heading, Pane, Text, IconButton, EditIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";
import LanguagePreview from "../bal/language-preview";
import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";
import {
  CanonicalJurisdiction,
  CanonicalLocalAddressBase,
  CanonicalPlaceName,
  CanonicalStreet,
} from "@/lib/domain/us-address-domain";

interface BALSummaryProps {
  localAddressBase: CanonicalLocalAddressBase;
  jurisdiction: CanonicalJurisdiction;
  streets: CanonicalStreet[];
  placeNames: CanonicalPlaceName[];
  jurisdictionFlag: string;
  onEditNomsAlt: () => void;
}

function BALSummary({
  localAddressBase,
  jurisdiction,
  streets,
  placeNames,
  jurisdictionFlag,
  onEditNomsAlt,
}: BALSummaryProps) {
  const t = useTranslations("panels");
  const { token } = useContext(TokenContext);
  const { isEditing } = useContext(BalDataContext);

  return (
    <Pane
      display="flex"
      flexDirection="column"
      backgroundColor="white"
      padding={16}
    >
      <Heading
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Pane display="flex" alignItems="center">
          <Pane
            height={40}
            width={40}
            flexShrink={0}
            backgroundImage={`url(${jurisdictionFlag})`}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="contain"
            marginRight={8}
          />
          {jurisdiction.jurisdictionName} - {jurisdiction.jurisdictionCode}
        </Pane>
        {!isEditing && token && (
          <IconButton
            icon={EditIcon}
            marginTop={-4}
            onClick={onEditNomsAlt}
            title={t("editAltNames")}
          />
        )}
      </Heading>
      <Pane marginLeft={40} marginY={8}>
        {localAddressBase.jurisdictionNamesAlt && (
          <LanguagePreview nomsAlt={localAddressBase.jurisdictionNamesAlt} />
        )}
      </Pane>
      <Pane display="flex" alignItems="center" gap={8}>
        {streets && (
          <Text>
            {t.rich("streetCount", {
              count: streets.length,
              b: (chunks) => <b>{chunks}</b>,
            })}
          </Text>
        )}
        {placeNames && (
          <Text>
            {t.rich("placeNameCountSummary", {
              count: placeNames.length,
              b: (chunks) => <b>{chunks}</b>,
            })}
          </Text>
        )}
        <Text>
          {t.rich("addressCount", {
            count: localAddressBase.numberOfAddresses,
            b: (chunks) => <b>{chunks}</b>,
          })}
        </Text>
      </Pane>
    </Pane>
  );
}

export default BALSummary;
