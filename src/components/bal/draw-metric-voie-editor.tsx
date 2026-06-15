import { useContext, useCallback, useEffect } from "react";
import { Pane, Heading, Button, Alert, EraserIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

import DrawContext, { DrawMode } from "@/contexts/draw";
import { LineString, Voie } from "@/lib/openapi-api-bal";

interface DrawMetricVoieEditorProps {
  voie?: Voie;
}

export function DrawMetricVoieEditor({ voie }: DrawMetricVoieEditorProps) {
  const t = useTranslations("editorForm");
  const { hint, data, setData, setDrawMode } = useContext(DrawContext);

  useEffect(() => {
    setDrawMode(DrawMode.DRAW_METRIC_VOIE);

    if (voie?.trace) {
      setData({
        type: "Feature",
        properties: {},
        geometry: voie.trace as LineString,
      });
    } else {
      setData(null);
    }

    return () => {
      setDrawMode(null);
    };
  }, [voie, setData, setDrawMode]);

  return (
    <Pane borderLeft="default" paddingX={12} marginBottom={12}>
      <Heading is="h4">{t("streetPath")}</Heading>

      <Alert marginTop={8} intent="none" title={t("drawStreetPath")}>
        {hint}
      </Alert>

      {data && (
        <Button
          type="button"
          appearance="primary"
          intent="danger"
          marginY={8}
          marginRight={12}
          iconBefore={EraserIcon}
          onClick={() => {
            setData(null);
          }}
        >
          {t("clearPath")}
        </Button>
      )}
    </Pane>
  );
}
