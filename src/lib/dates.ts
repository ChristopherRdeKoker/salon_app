export type ISODateType = string;

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;
const MINUTE_MS = 60_000;
export const SALON_UTC_OFFSET_MINUTES = 120;

export function daysInMonth(year: number, monthIndex: number): number {
  const result = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

  return result;
}

export function isISODate(value: unknown): value is ISODateType {
  if (typeof value !== "string") return false;
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const isRealDate = month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month - 1);

  return isRealDate;
}

export function toDayNumber(iso: ISODateType): number {
  if (!isISODate(iso)) throw new RangeError(`Not an ISO date: ${iso}`);
  const [year, month, day] = iso.split("-").map(Number);
  const result = Math.round(Date.UTC(year, month - 1, day) / DAY_MS);

  return result;
}

export function fromDayNumber(dayNumber: number): ISODateType {
  const utc = new Date(dayNumber * DAY_MS);
  const yearText = String(utc.getUTCFullYear()).padStart(4, "0");
  const monthText = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const dayText = String(utc.getUTCDate()).padStart(2, "0");
  const result = `${yearText}-${monthText}-${dayText}`;

  return result;
}

export function addDays(iso: ISODateType, days: number): ISODateType {
  const result = fromDayNumber(toDayNumber(iso) + days);

  return result;
}

export function weekdayOf(iso: ISODateType): number {
  const result = new Date(toDayNumber(iso) * DAY_MS).getUTCDay();

  return result;
}

export function salonClock(now: Date): { date: ISODateType; minutes: number } {
  const shiftedMs = now.getTime() + SALON_UTC_OFFSET_MINUTES * MINUTE_MS;
  const dayNumber = Math.floor(shiftedMs / DAY_MS);
  const minutes = Math.floor((shiftedMs - dayNumber * DAY_MS) / MINUTE_MS);
  const result = { date: fromDayNumber(dayNumber), minutes };

  return result;
}

export function formatDate(iso: ISODateType, options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }): string {
  const result = new Intl.DateTimeFormat("en-ZA", { ...options, timeZone: "UTC" }).format(new Date(toDayNumber(iso) * DAY_MS));

  return result;
}

export function formatTime(minutes: number): string {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const remainder = String(minutes % 60).padStart(2, "0");
  const result = `${hours}:${remainder}`;

  return result;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  const hourText = hours ? `${hours} h` : "";
  const minuteText = remainder ? `${remainder} min` : "";
  const result = [hourText, minuteText].filter(Boolean).join(" ");

  return result;
}
