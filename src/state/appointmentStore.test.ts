import { describe, expect, it } from "vitest";
import { findStylist } from "@/data/stylists";
import { freeStartsFor } from "@/lib/availability";
import { REFERENCE_PATTERN } from "@/lib/reference";
import { APPOINTMENTS_KEY, createMemoryStore } from "@/lib/storage";
import { BookingFailureEnum, createAppointmentStore } from "@/state/appointmentStore";
import { createNoticeStore } from "@/state/noticeStore";

const now = new Date("2026-11-13T08:00:00Z");
const clock = { date: "2026-11-13", minutes: 600 };
const contact = { name: "Test Person", phone: "+27820000000", email: "t@example.com", note: "", agree: true };
const naledi = findStylist("naledi");
if (!naledi) throw new Error("Test stylist missing");
const firstFree = freeStartsFor({ stylist: naledi, date: "2026-11-17", durationMinutes: 60, appointments: [], clock })[0];
const request = { serviceIds: ["gel-hands"], stylistId: "naledi", date: "2026-11-17", startMinutes: firstFree };

function freshStore() {
  const storage = createMemoryStore();
  const store = createAppointmentStore(storage, [], createNoticeStore([]));
  const result = { storage, store };

  return result;
}

describe("appointment store", () => {
  it("books a free slot, prices it and saves it", () => {
    const { storage, store } = freshStore();
    const outcome = store.create(request, contact, now);
    expect(outcome.problem).toBeNull();
    expect(outcome.appointment?.ref).toMatch(REFERENCE_PATTERN);
    expect(outcome.appointment?.totalCents).toBe(38000);
    expect(outcome.appointment?.durationMinutes).toBe(60);
    expect(storage.getItem(APPOINTMENTS_KEY)).toContain(outcome.appointment?.ref);
  });
  it("refuses to double-book the same stylist and slot", () => {
    const { store } = freshStore();
    store.create(request, contact, now);
    expect(store.create(request, contact, now)).toEqual({ appointment: null, problem: BookingFailureEnum.SlotUnavailable });
  });
  it("frees the slot again after a cancel", () => {
    const { store } = freshStore();
    const outcome = store.create(request, contact, now);
    expect(store.cancel(outcome.appointment?.ref ?? "")).toBe(true);
    expect(store.create(request, contact, now).problem).toBeNull();
  });
  it("refuses unknown services, an unqualified stylist and a past slot", () => {
    const { store } = freshStore();
    expect(store.create({ ...request, serviceIds: ["nope"] }, contact, now).problem).toBe(BookingFailureEnum.UnknownService);
    expect(store.create({ ...request, serviceIds: [] }, contact, now).problem).toBe(BookingFailureEnum.UnknownService);
    expect(store.create({ ...request, serviceIds: ["hydrating-facial"] }, contact, now).problem).toBe(BookingFailureEnum.StylistCannotDoServices);
    expect(store.create({ ...request, date: "2026-11-12" }, contact, now).problem).toBe(BookingFailureEnum.SlotUnavailable);
  });
  it("reports false when cancelling something that isn't booked", () => {
    expect(freshStore().store.cancel("HVL-ZZZ-ZZZ")).toBe(false);
  });
});
