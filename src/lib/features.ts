const enabledValues = new Set(["1", "true"]);

export function isReportsFeatureEnabled() {
  return enabledValues.has(
    (process.env.NEXT_PUBLIC_REPORTS_ENABLED || "").toLowerCase()
  );
}
