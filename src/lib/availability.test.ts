import { describe, expect, it } from "vitest";
import type { z } from "zod";
import { findStylist } from "@/data/stylists";
import { bookableDates, freeStartsFor, hoursFor } from "@/lib/availability";
import { houseBlocksFor } from "@/lib/houseBlocks";
import type { appointmentSchema } from "@/lib/schemas/appointmentSchema";

const naledi = findStylist("naledi");
const ines = findStylist("ines");
if (!naledi || !ines) throw new Error("Test stylists missing from the catalogue");
const clock = { date: "2026-11-13", minutes: 600 };
const tuesday = "2026-11-17";

function appointmentAt(startMinutes: number, overrides: Partial<z.infer<typeof appointmentSchema>> = {}): z.infer<typeof appointmentSchema> {
  const result: z.infer<typeof appointmentSchema> = {
    ref: "HVL-AAA-AAA",
    serviceIds: ["gel-hands"],
    stylistId: "naledi",
    date: tuesday,
    startMinutes,
    durationMinutes: 60,
    totalCents: 38000,
    name: "Test",
    phone: "+27820000000",
    email: "t@example.com",
    note: "",
    createdAt: "2026-11-13T08:00:00.000Z",
    status: "confirmed",
    ...overrides,
  };

  return result;
}

describe("hoursFor", () => {
  it("uses salon hours on a stylist's working day and none otherwise", () => {
    expect(hoursFor(naledi, tuesday)).toEqual({ opensMinutes: 510, closesMinutes: 1050 });
    expect(hoursFor(naledi, "2026-11-14")).toEqual({ opensMinutes: 480, closesMinutes: 840 });
    expect(hoursFor(ines, "2026-11-14")).toBeNull();
    expect(hoursFor(naledi, "2026-11-15")).toBeNull();
    expect(hoursFor(naledi, "2026-11-16")).toBeNull();
  });
});

describe("freeStartsFor", () => {
  const baseline = freeStartsFor({ stylist: naledi, date: tuesday, durationMinutes: 60, appointments: [], clock });
  const freeStart = baseline[0];

  it("removes a start once a confirmed appointment holds it", () => {
    const starts = freeStartsFor({ stylist: naledi, date: tuesday, durationMinutes: 60, appointments: [appointmentAt(freeStart)], clock });
    expect(starts).not.toContain(freeStart);
  });
  it("ignores cancelled appointments and other stylists' appointments", () => {
    const cancelled = appointmentAt(freeStart, { status: "cancelled" });
    const otherStylist = appointmentAt(freeStart, { stylistId: "zara" });
    expect(freeStartsFor({ stylist: naledi, date: tuesday, durationMinutes: 60, appointments: [cancelled, otherStylist], clock })).toEqual(baseline);
  });
  it("offers nothing on a day the salon is closed", () => {
    expect(freeStartsFor({ stylist: naledi, date: "2026-11-15", durationMinutes: 60, appointments: [], clock })).toEqual([]);
  });
});

describe("houseBlocksFor", () => {
  it("is deterministic and stays inside opening hours", () => {
    for (const date of bookableDates(clock)) {
      const blocks = houseBlocksFor("zara", date, 510, 1050);
      expect(houseBlocksFor("zara", date, 510, 1050)).toEqual(blocks);
      for (const block of blocks) {
        expect(block.startMinutes).toBeGreaterThanOrEqual(510);
        expect(block.endMinutes).toBeLessThanOrEqual(1050);
        expect(block.endMinutes).toBeGreaterThan(block.startMinutes);
      }
    }
  });
});

describe("bookableDates", () => {
  it("covers 21 days starting today", () => {
    const dates = bookableDates(clock);
    expect(dates).toHaveLength(21);
    expect(dates[0]).toBe("2026-11-13");
    expect(dates[20]).toBe("2026-12-03");
  });
});
