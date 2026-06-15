"use client";

import ProtectedPage from "@/layouts/protected-page";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useTranslations } from "next-intl";
import LayoutContext from "@/contexts/layout";
import NextLink from "next/link";
import { Text, Link } from "evergreen-ui";
import ToponymeEditor from "@/components/bal/toponyme-editor";
import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";
import { TilesLayerMode } from "@/components/map/layers/tiles";

export default function NewToponymePage() {
  const t = useTranslations("lists");
  const router = useRouter();
  const { setBreadcrumbs } = useContext(LayoutContext);
  const { commune, baseLocale } = useContext(BalDataContext);
  const { setTileLayersMode } = useContext(MapContext);

  useEffect(() => {
    setTileLayersMode(TilesLayerMode.TOPONYME);
  }, [setTileLayersMode]);

  useEffect(() => {
    setBreadcrumbs(
      <>
        <Link
          is={NextLink}
          href={`/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}`}
        >
          {t("breadcrumbPlaceNames")}
        </Link>
        <Text color="muted">{" > "}</Text>
        <Text aria-current="page">{t("newPlaceName")}</Text>
      </>
    );

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, baseLocale.id, t]);

  return (
    <ProtectedPage>
      <ToponymeEditor
        commune={commune}
        onClose={() => {
          router.push(`/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}`);
        }}
        onSubmit={(idToponyme) => {
          router.push(
            `/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/${idToponyme}/numeros`
          );
        }}
      />
    </ProtectedPage>
  );
}
