import { describe, expect, it } from "vitest";
import { generateFreeStarts, type SlotRequestType } from "@/lib/slots";

const weekday = { opensMinutes: 510, closesMinutes: 1050 };
const base: SlotRequestType = {
  date: "2026-11-17",
  clock: { date: "2026-11-13", minutes: 600 },
  durationMinutes: 60,
  stepMinutes: 30,
  hours: weekday,
  busy: [],
};

describe("generateFreeStarts", () => {
  it("offers every half hour that ends by closing on an empty future day", () => {
    const starts = generateFreeStarts(base);
    expect(starts).toHaveLength(17);
    expect(starts[0]).toBe(510);
    expect(starts[16]).toBe(990);
  });
  it("includes a slot that ends exactly at closing and drops one that would run over", () => {
    const starts = generateFreeStarts({ ...base, durationMinutes: 90 });
    expect(starts[starts.length - 1]).toBe(960);
    expect(starts).not.toContain(990);
  });
  it("blocks every start that overlaps a booking, but allows touching ones", () => {
    const starts = generateFreeStarts({ ...base, busy: [{ startMinutes: 600, endMinutes: 660 }] });
    expect(starts).toHaveLength(14);
    expect(starts).toContain(540);
    expect(starts).not.toContain(570);
    expect(starts).not.toContain(600);
    expect(starts).not.toContain(630);
    expect(starts).toContain(660);
  });
  it("blocks starts around a booking that begins mid-slot", () => {
    const starts = generateFreeStarts({ ...base, durationMinutes: 30, busy: [{ startMinutes: 615, endMinutes: 645 }] });
    expect(starts).toContain(570);
    expect(starts).not.toContain(600);
    expect(starts).not.toContain(630);
    expect(starts).toContain(660);
  });
  it("drops slots that have already started today at 10:20", () => {
    const starts = generateFreeStarts({ ...base, date: "2026-11-13", clock: { date: "2026-11-13", minutes: 620 } });
    expect(starts[0]).toBe(630);
    expect(starts).toHaveLength(13);
  });
  it("drops a slot starting exactly now", () => {
    const starts = generateFreeStarts({ ...base, date: "2026-11-13", clock: { date: "2026-11-13", minutes: 630 } });
    expect(starts[0]).toBe(660);
  });
  it("offers nothing after closing, on a past day or on a closed day", () => {
    expect(generateFreeStarts({ ...base, date: "2026-11-13", clock: { date: "2026-11-13", minutes: 1100 } })).toEqual([]);
    expect(generateFreeStarts({ ...base, date: "2026-11-12" })).toEqual([]);
    expect(generateFreeStarts({ ...base, hours: null })).toEqual([]);
  });
  it("offers nothing when the service is longer than the day", () => {
    expect(generateFreeStarts({ ...base, hours: { opensMinutes: 480, closesMinutes: 840 }, durationMinutes: 390 })).toEqual([]);
  });
  it("refuses a zero duration or step", () => {
    expect(() => generateFreeStarts({ ...base, durationMinutes: 0 })).toThrow(RangeError);
    expect(() => generateFreeStarts({ ...base, stepMinutes: 0 })).toThrow(RangeError);
  });
});
