export type AnyRow = Record<string, any>;

export const asArray = (value: any): AnyRow[] => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

export const displayText = (value: unknown, fallback = "-") => {
  const text = String(value ?? "").trim();
  return text || fallback;
};

export const numberOrZero = (value: unknown) => Number(value ?? 0) || 0;

export const downloadCsv = (filename: string, headers: string[], rows: unknown[][]) => {
  const escapeCell = (value: unknown) => {
    const text = String(value ?? "");
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

