"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getCommuneFlagProxy } from "@/lib/api-blason-commune";
import Image from "next/image";

function CommuneFlag({ codeCommune }: { codeCommune: string }) {
  const t = useTranslations("dialogs");
  const [flag, setFlag] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommuneFlag = async () => {
      try {
        const flagUrl = await getCommuneFlagProxy(codeCommune);
        setFlag(flagUrl);
      } catch (err) {
        console.error("Error fetching commune flag", err);
        setFlag(null);
      }
    };

    fetchCommuneFlag();
  }, [codeCommune]);

  return (
    <Image
      width={100}
      height={100}
      src={flag || "/static/images/mairie.svg"}
      alt={t("jurisdictionLogo")}
      style={{
        width: "auto",
        height: "100px",
        marginBottom: "16px",
      }}
    />
  );
}

export default CommuneFlag;
