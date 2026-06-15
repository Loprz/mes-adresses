"use client";

import { useTranslations } from "next-intl";
import styles from "./ie-warning.module.css";

function IEWarning() {
  const t = useTranslations("ieWarning");
  return (
    <div className={styles["ie-warning"]}>
      <p>{t.rich("browserUnsupported", { b: (chunks) => <b>{chunks}</b> })}</p>
      <p>
        <b>{t("recommendOther")}</b>
      </p>
    </div>
  );
}

export default IEWarning;
