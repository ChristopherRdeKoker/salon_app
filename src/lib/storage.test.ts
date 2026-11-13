import { describe, expect, it } from "vitest";
import type { z } from "zod";
import type { appointmentSchema } from "@/lib/schemas/appointmentSchema";
import { APPOINTMENTS_KEY, createMemoryStore, loadAppointments, saveAppointments, type KeyValueStoreType } from "@/lib/storage";

const serviceIds = new Set(["gel-hands", "brow-wax"]);
const stylistIds = new Set(["naledi", "ines"]);
const good: z.infer<typeof appointmentSchema> = {
  ref: "BLW-ABC-234",
  serviceIds: ["gel-hands"],
  stylistId: "naledi",
  date: "2026-11-17",
  startMinutes: 540,
  durationMinutes: 60,
  totalCents: 38000,
  name: "Test",
  phone: "+27820000000",
  email: "t@example.com",
  note: "",
  createdAt: "2026-11-13T08:00:00.000Z",
  status: "confirmed",
};

function storeWith(value: string): KeyValueStoreType {
  const store = createMemoryStore();
  store.setItem(APPOINTMENTS_KEY, value);

  return store;
}

describe("loadAppointments", () => {
  it("returns empty with no notice when nothing is saved", () => {
    expect(loadAppointments(createMemoryStore(), serviceIds, stylistIds)).toEqual({ items: [], notice: null });
  });
  it("round-trips a valid appointment", () => {
    const store = createMemoryStore();
    expect(saveAppointments(store, [good])).toBeNull();
    expect(loadAppointments(store, serviceIds, stylistIds)).toEqual({ items: [good], notice: null });
  });
  it("recovers from invalid JSON and keeps a backup", () => {
    const store = storeWith("{not json");
    const loaded = loadAppointments(store, serviceIds, stylistIds);
    expect(loaded.items).toEqual([]);
    expect(loaded.notice).toMatch(/unreadable/);
    expect(store.getItem(`${APPOINTMENTS_KEY}.corrupt`)).toBe("{not json");
  });
  it("recovers from a wrong top-level type", () => {
    const loaded = loadAppointments(storeWith('{"a":1}'), serviceIds, stylistIds);
    expect(loaded.items).toEqual([]);
    expect(loaded.notice).toMatch(/unexpected format/);
  });
  it("keeps good appointments and says how many were dropped", () => {
    const bad = [
      { ...good, ref: "BLW-ABC-235", stylistId: "nobody" },
      { ...good, ref: "BLW-ABC-236", serviceIds: ["gel-hands", "nope"] },
      { ...good, ref: "BLW-ABC-237", status: "pending" },
      { ...good, ref: "BLW-ABC-238", date: "2026-02-30" },
      { ...good, ref: "BLW-ABC-239", phone: "0820000000" },
      { ...good, ref: "BLW-ABC-242", startMinutes: 545 },
      { ...good, ref: "BLW-ABC-243", extra: 1 },
      null,
      good,
    ];
    const store = storeWith(JSON.stringify([good, ...bad]));
    const loaded = loadAppointments(store, serviceIds, stylistIds);
    expect(loaded.items).toEqual([good]);
    expect(loaded.notice).toBe("9 of 10 saved appointments couldn't be read and were removed. The other 1 is intact.");
    expect(store.getItem(`${APPOINTMENTS_KEY}.corrupt`)).not.toBeNull();
  });
  it("survives a store that throws on every call", () => {
    const throwing: KeyValueStoreType = {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
      removeItem() {
        throw new Error("blocked");
      },
    };
    const loaded = loadAppointments(throwing, serviceIds, stylistIds);
    expect(loaded.items).toEqual([]);
    expect(loaded.notice).toMatch(/blocked/);
    expect(saveAppointments(throwing, [])).toMatch(/Couldn't save/);
  });
});

describe("saveAppointments", () => {
  it("refuses to write an invalid appointment", () => {
    const store = createMemoryStore();
    expect(saveAppointments(store, [{ ...good, totalCents: -5 }])).toMatch(/failed validation/);
    expect(store.getItem(APPOINTMENTS_KEY)).toBeNull();
  });
});
