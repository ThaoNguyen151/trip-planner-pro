/** Display digits with `.` as thousand separator (e.g. 10.000.000). */
export function formatMoneyInput(value: string | number | undefined): string {
  if (value === undefined || value === null || value === "") return "";
  const numericString = String(value).replace(/\D/g, "");
  if (!numericString) return "";
  return new Intl.NumberFormat("de-DE").format(Number(numericString));
}

/** Parse formatted money string to a number. */
export function parseMoneyInput(value: string): number {
  const rawValue = value.replace(/\./g, "").trim();
  return rawValue === "" ? 0 : Number(rawValue);
}
