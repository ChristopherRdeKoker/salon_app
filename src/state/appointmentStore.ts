import type { z } from "zod";
import { findService, serviceIds } from "@/data/services";
import { findStylist, stylistIds } from "@/data/stylists";
import { freeStartsFor, isWithinWindow } from "@/lib/availability";
import { canStylistDo } from "@/lib/bookingDraft";
import { salonClock } from "@/lib/dates";
import { breakDownPrice } from "@/lib/pricing";
import { makeReference } from "@/lib/reference";
import type { appointmentSchema } from "@/lib/schemas/appointmentSchema";
import type { contactSchema } from "@/lib/schemas/contactSchema";
import { APPOINTMENTS_KEY, loadAppointments, saveAppointments, type KeyValueStoreType } from "@/lib/storage";
import type { NoticeStoreType } from "@/state/noticeStore";
import { createObservable } from "@/state/observable";

type AppointmentType = z.infer<typeof appointmentSchema>;

export enum BookingFailureEnum {
  UnknownService = 1,
  StylistCannotDoServices = 2,
  SlotUnavailable = 3,
}

export type AppointmentRequestType = { serviceIds: string[]; stylistId: string; date: string; startMinutes: number };

export type BookingOutcomeType = { appointment: AppointmentType; problem: null } | { appointment: null; problem: BookingFailureEnum };

export function createAppointmentStore(storage: KeyValueStoreType, initial: readonly AppointmentType[], notices: NoticeStoreType) {
  const appointments = createObservable<readonly AppointmentType[]>(initial);

  function _commit(next: readonly AppointmentType[]): void {
    appointments.set(next);
    const saveProblem = saveAppointments(storage, next);
    if (saveProblem) notices.push(saveProblem);
  }

  function _reloadFromStorage(event: StorageEvent): void {
    if (event.key !== APPOINTMENTS_KEY) return;
    const loaded = loadAppointments(storage, serviceIds, stylistIds);
    appointments.set(loaded.items);
    if (loaded.notice) notices.push(loaded.notice);
  }

  let subscriberCount = 0;

  function subscribe(listener: () => void): () => void {
    const unsubscribe = appointments.subscribe(listener);
    subscriberCount++;
    if (subscriberCount === 1) window.addEventListener("storage", _reloadFromStorage);
    return () => {
      unsubscribe();
      subscriberCount--;
      if (!subscriberCount) window.removeEventListener("storage", _reloadFromStorage);
    };
  }

  function create(request: AppointmentRequestType, contact: z.output<typeof contactSchema>, now: Date): BookingOutcomeType {
    const chosenServices = request.serviceIds.flatMap((serviceId) => findService(serviceId) ?? []);
    const stylist = findStylist(request.stylistId);
    const hasUnknownService = !request.serviceIds.length || chosenServices.length !== request.serviceIds.length;
    if (hasUnknownService) return { appointment: null, problem: BookingFailureEnum.UnknownService };
    if (!stylist || !canStylistDo(stylist, chosenServices)) return { appointment: null, problem: BookingFailureEnum.StylistCannotDoServices };

    const clock = salonClock(now);
    const current = appointments.get();
    const durationMinutes = chosenServices.reduce((sum, item) => sum + item.durationMinutes, 0);
    const freeStarts = isWithinWindow(request.date, clock) ? freeStartsFor({ stylist, date: request.date, durationMinutes, appointments: current, clock }) : [];
    if (!freeStarts.includes(request.startMinutes)) return { appointment: null, problem: BookingFailureEnum.SlotUnavailable };

    const price = breakDownPrice(chosenServices.map((item) => ({ label: item.name, priceCents: item.priceCents })));
    const appointment: AppointmentType = {
      ref: makeReference(new Set(current.map((existing) => existing.ref))),
      serviceIds: chosenServices.map((item) => item.id),
      stylistId: stylist.id,
      date: request.date,
      startMinutes: request.startMinutes,
      durationMinutes,
      totalCents: price.totalCents,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      note: contact.note,
      createdAt: now.toISOString(),
      status: "confirmed",
    };
    _commit([...current, appointment]);

    const result = { appointment, problem: null };

    return result;
  }

  function cancel(ref: string): boolean {
    const current = appointments.get();
    const isFound = current.some((appointment) => appointment.ref === ref && appointment.status === "confirmed");
    if (isFound) _commit(current.map((appointment) => (appointment.ref === ref ? { ...appointment, status: "cancelled" as const } : appointment)));

    return isFound;
  }

  const result = { subscribe, getSnapshot: appointments.get, create, cancel };

  return result;
}

export type AppointmentStoreType = ReturnType<typeof createAppointmentStore>;
