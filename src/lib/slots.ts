import type { z } from "zod";
import type { ISODateType } from "@/lib/dates";
import type { openingHoursSchema } from "@/lib/schemas/catalogueSchema";

export type IntervalType = { startMinutes: number; endMinutes: number };

export type SlotRequestType = {
  date: ISODateType;
  clock: { date: ISODateType; minutes: number };
  durationMinutes: number;
  stepMinutes: number;
  hours: z.infer<typeof openingHoursSchema> | null;
  busy: readonly IntervalType[];
};

export function overlaps(first: IntervalType, second: IntervalType): boolean {
  const isOverlapping = first.startMinutes < second.endMinutes && second.startMinutes < first.endMinutes;

  return isOverlapping;
}

export function generateFreeStarts({ date, clock, durationMinutes, stepMinutes, hours, busy }: SlotRequestType): number[] {
  if (!Number.isSafeInteger(durationMinutes) || durationMinutes <= 0) throw new RangeError(`Duration must be a positive whole number of minutes, got ${durationMinutes}`);
  if (!Number.isSafeInteger(stepMinutes) || stepMinutes <= 0) throw new RangeError(`Slot step must be a positive whole number of minutes, got ${stepMinutes}`);

  const result: number[] = [];
  const isPastDay = date < clock.date;
  if (!hours || isPastDay) return result;

  const isToday = date === clock.date;
  for (let start = hours.opensMinutes; start + durationMinutes <= hours.closesMinutes; start += stepMinutes) {
    const isPast = isToday && start <= clock.minutes;
    const candidate = { startMinutes: start, endMinutes: start + durationMinutes };
    const isClash = busy.some((interval) => overlaps(candidate, interval));
    if (!isPast && !isClash) result.push(start);
  }

  return result;
}
