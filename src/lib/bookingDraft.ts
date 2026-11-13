import type { z } from "zod";
import { findService } from "@/data/services";
import { findStylist, stylists } from "@/data/stylists";
import { freeStartsFor, isWithinWindow, type ClockType } from "@/lib/availability";
import { isISODate } from "@/lib/dates";
import type { appointmentSchema } from "@/lib/schemas/appointmentSchema";
import type { serviceSchema, stylistSchema } from "@/lib/schemas/catalogueSchema";

export enum BookingStepEnum {
  Services = 1,
  Stylist = 2,
  Time = 3,
  Details = 4,
}

type ServiceType = z.infer<typeof serviceSchema>;
type StylistType = z.infer<typeof stylistSchema>;

export function canStylistDo(stylist: StylistType, chosen: readonly ServiceType[]): boolean {
  const isCapable = chosen.every((item) => stylist.categoryIds.includes(item.categoryId));

  return isCapable;
}

export function parseServiceIds(text: string | null): string[] {
  const result: string[] = [];
  for (const serviceId of (text ?? "").split(",")) {
    const isKnownAndNew = !!findService(serviceId) && !result.includes(serviceId);
    if (isKnownAndNew) result.push(serviceId);
  }

  return result;
}

export function readDraft(params: URLSearchParams, clock: ClockType, appointments: readonly z.infer<typeof appointmentSchema>[]) {
  const chosenServices = parseServiceIds(params.get("services")).flatMap((serviceId) => findService(serviceId) ?? []);
  const durationMinutes = chosenServices.reduce((sum, item) => sum + item.durationMinutes, 0);
  const eligibleStylists = stylists.filter((stylist) => canStylistDo(stylist, chosenServices));

  const requestedStylist = findStylist(params.get("stylist"));
  const stylist = requestedStylist && eligibleStylists.includes(requestedStylist) ? requestedStylist : null;

  const requestedDate = params.get("date");
  const date = isISODate(requestedDate) && isWithinWindow(requestedDate, clock) ? requestedDate : null;

  const freeStarts = stylist && date && durationMinutes ? freeStartsFor({ stylist, date, durationMinutes, appointments, clock }) : [];
  const requestedTimeText = params.get("time");
  const requestedTime = requestedTimeText === null ? null : Number(requestedTimeText);
  const isTimeFree = requestedTime !== null && freeStarts.includes(requestedTime);
  const startMinutes = isTimeFree ? requestedTime : null;
  const isTimeTaken = requestedTime !== null && !isTimeFree;

  const isChoosingServices = !chosenServices.length || params.get("change") === "services";
  const stepWithoutTime = stylist ? BookingStepEnum.Time : BookingStepEnum.Stylist;
  const stepWithServices = startMinutes !== null && stylist ? BookingStepEnum.Details : stepWithoutTime;
  const step = isChoosingServices ? BookingStepEnum.Services : stepWithServices;

  const result = { chosenServices, durationMinutes, eligibleStylists, stylist, date, freeStarts, startMinutes, isTimeTaken, step };

  return result;
}
