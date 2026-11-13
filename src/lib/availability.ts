import type { z } from "zod";
import { BOOKING_WINDOW_DAYS, openingHoursByWeekday, SLOT_STEP_MINUTES } from "@/data/stylists";
import { addDays, weekdayOf, type ISODateType } from "@/lib/dates";
import { houseBlocksFor } from "@/lib/houseBlocks";
import type { appointmentSchema } from "@/lib/schemas/appointmentSchema";
import type { stylistSchema } from "@/lib/schemas/catalogueSchema";
import { generateFreeStarts, type IntervalType } from "@/lib/slots";

export type ClockType = { date: ISODateType; minutes: number };

type AvailabilityRequestType = {
  stylist: z.infer<typeof stylistSchema>;
  date: ISODateType;
  durationMinutes: number;
  appointments: readonly z.infer<typeof appointmentSchema>[];
  clock: ClockType;
};

export function hoursFor(stylist: z.infer<typeof stylistSchema>, date: ISODateType) {
  const weekday = weekdayOf(date);
  const salonHours = openingHoursByWeekday[weekday];
  const isWorking = stylist.workingWeekdays.includes(weekday);
  const result = isWorking ? salonHours : null;

  return result;
}

export function busyIntervalsFor(stylistId: string, date: ISODateType, appointments: AvailabilityRequestType["appointments"], hours: { opensMinutes: number; closesMinutes: number }): IntervalType[] {
  const booked = appointments
    .filter((appointment) => appointment.status === "confirmed" && appointment.stylistId === stylistId && appointment.date === date)
    .map((appointment) => ({ startMinutes: appointment.startMinutes, endMinutes: appointment.startMinutes + appointment.durationMinutes }));
  const houseBlocks = houseBlocksFor(stylistId, date, hours.opensMinutes, hours.closesMinutes);
  const result = [...booked, ...houseBlocks];

  return result;
}

export function freeStartsFor({ stylist, date, durationMinutes, appointments, clock }: AvailabilityRequestType): number[] {
  const hours = hoursFor(stylist, date);
  const busy = hours ? busyIntervalsFor(stylist.id, date, appointments, hours) : [];
  const result = generateFreeStarts({ date, clock, durationMinutes, stepMinutes: SLOT_STEP_MINUTES, hours, busy });

  return result;
}

export function bookableDates(clock: ClockType): ISODateType[] {
  const result = Array.from({ length: BOOKING_WINDOW_DAYS }, (_, offset) => addDays(clock.date, offset));

  return result;
}

export function isWithinWindow(date: ISODateType, clock: ClockType): boolean {
  const isInside = bookableDates(clock).includes(date);

  return isInside;
}
