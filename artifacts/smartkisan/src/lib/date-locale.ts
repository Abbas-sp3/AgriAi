import type { LangCode, T } from "./i18n";

/** BCP 47 tags for Intl — covers mr/pa where date-fns has no locale. */
const INTL_LOCALE: Record<LangCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
  gu: "gu-IN",
  pa: "pa-IN",
};

const ENGLISH_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Resolve API month strings (English, e.g. "June", "July") to 0–11. */
export function englishMonthNameToIndex(month: string): number {
  const m = month.trim();
  const lower = m.toLowerCase();
  const i = ENGLISH_MONTHS.findIndex((name) => lower.startsWith(name.slice(0, 3).toLowerCase()));
  return i;
}

export function formatLocalizedMonthShort(monthIndex: number, lang: LangCode): string {
  if (monthIndex < 0 || monthIndex > 11) return "";
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], { month: "short" }).format(new Date(2000, monthIndex, 1));
}

export function formatLocalizedMonthLong(monthIndex: number, lang: LangCode): string {
  if (monthIndex < 0 || monthIndex > 11) return "";
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], { month: "long" }).format(new Date(2000, monthIndex, 1));
}

/** Format API lists like ["June","July"] for the selected language. */
export function formatEnglishMonthList(months: string[], lang: LangCode): string {
  return months
    .map((raw) => {
      const idx = englishMonthNameToIndex(raw);
      if (idx < 0) return raw;
      return formatLocalizedMonthShort(idx, lang);
    })
    .join(", ");
}

export function formatForecastWeekday(date: Date, lang: LangCode): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], { weekday: "short" }).format(date);
}

export function formatForecastDateLine(date: Date, lang: LangCode): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], { month: "short", day: "numeric" }).format(date);
}

export function currentMonthNameLong(lang: LangCode): string {
  const now = new Date();
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], { month: "long" }).format(now);
}

export function formatNewsPublishedDate(iso: string, lang: LangCode): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(INTL_LOCALE[lang], {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/** Normalize crop calendar season strings from the API for display. */
export function translateCropSeason(t: (key: keyof T) => string, season: string): string {
  const s = season.toLowerCase();
  if (s === "kharif") return t("season_kharif");
  if (s === "rabi") return t("season_rabi");
  if (s === "zaid") return t("season_zaid");
  if (s === "exotic") return t("exotic_badge");
  return season;
}
