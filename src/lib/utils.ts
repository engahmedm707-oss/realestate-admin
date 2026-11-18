/** أدوات صغيرة للتعامل مع الـ JSON المتداخل */

export function getDeep(source: unknown, path: string[]): string {
  let current: unknown = source;
  for (const key of path) {
    if (current === null || typeof current !== "object") return "";
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : "";
}

export function setDeep<T>(source: T, path: string[], value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  const base = (source ?? {}) as Record<string, unknown>;
  return {
    ...base,
    [head]: setDeep(base[head], rest, value),
  } as T;
}

/** دمج الـ draft المحفوظ مع الشكل الافتراضي (عشان أي حقول جديدة ما تختفيش) */
export function mergeDeep<T>(base: T, patch: unknown): T {
  if (patch === null || patch === undefined) return base;
  if (Array.isArray(base)) {
    return (Array.isArray(patch) ? patch : base) as T;
  }
  if (typeof base === "object" && typeof patch === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, val] of Object.entries(patch as Record<string, unknown>)) {
      const current = (base as Record<string, unknown>)[key];
      out[key] =
        current !== undefined && typeof current === "object"
          ? mergeDeep(current, val)
          : val;
    }
    return out as T;
  }
  return base;
}

const AR_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

/** 2026-11-18T10:30:00Z -> 18 نوفمبر 2026 - 10:30 ص */
export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";

  const day = date.getDate();
  const month = AR_MONTHS[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "م" : "ص";
  hours = hours % 12 || 12;

  return `${day} ${month} ${year} - ${hours}:${minutes} ${suffix}`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${date.getDate()} ${AR_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function filenameFromFolderName(name: string): string {
  const safe = name.trim().replace(/[\\/:*?"<>|]+/g, "_");
  return `${safe || "valuation"}.json`;
}
