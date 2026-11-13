import { describe, expect, it } from "vitest";
import { BookingStepEnum, parseServiceIds, readDraft } from "@/lib/bookingDraft";

const clock = { date: "2026-11-13", minutes: 600 };

function draftFor(query: string) {
  const result = readDraft(new URLSearchParams(query), clock, []);

  return result;
}

describe("parseServiceIds", () => {
  it("keeps known ids once, in order", () => {
    expect(parseServiceIds("gel-hands,nope,gel-hands,brow-wax")).toEqual(["gel-hands", "brow-wax"]);
    expect(parseServiceIds(null)).toEqual([]);
  });
});

describe("readDraft", () => {
  it("starts at services when nothing valid is chosen", () => {
    expect(draftFor("services=nope").step).toBe(BookingStepEnum.Services);
  });
  it("sums durations and offers only stylists who do every chosen category", () => {
    const draft = draftFor("services=gel-hands,brow-wax");
    expect(draft.durationMinutes).toBe(75);
    expect(draft.eligibleStylists.map((stylist) => stylist.id)).toEqual(["ines"]);
    expect(draft.step).toBe(BookingStepEnum.Stylist);
  });
  it("ignores a stylist who can't do the services", () => {
    const draft = draftFor("services=gel-hands,lash-lift&stylist=zara");
    expect(draft.stylist).toBeNull();
    expect(draft.eligibleStylists.map((stylist) => stylist.id)).toEqual(["naledi"]);
  });
  it("moves to details only with a free time on a date inside the window", () => {
    const pickTime = draftFor("services=gel-hands&stylist=naledi&date=2026-11-17");
    expect(pickTime.step).toBe(BookingStepEnum.Time);
    const firstFree = pickTime.freeStarts[0];
    const details = draftFor(`services=gel-hands&stylist=naledi&date=2026-11-17&time=${firstFree}`);
    expect(details.step).toBe(BookingStepEnum.Details);
    expect(details.startMinutes).toBe(firstFree);
  });
  it("flags a time that isn't free and drops dates outside the window", () => {
    const taken = draftFor("services=gel-hands&stylist=naledi&date=2026-11-17&time=1500");
    expect(taken.isTimeTaken).toBe(true);
    expect(taken.step).toBe(BookingStepEnum.Time);
    expect(draftFor("services=gel-hands&stylist=naledi&date=2026-11-12").date).toBeNull();
    expect(draftFor("services=gel-hands&stylist=naledi&date=2027-01-12").date).toBeNull();
  });
});

describe("readDraft change flag", () => {
  it("reopens the treatments step without losing the chosen treatments", () => {
    const draft = draftFor("services=gel-hands&stylist=naledi&change=services");
    expect(draft.step).toBe(BookingStepEnum.Services);
    expect(draft.chosenServices.map((item) => item.id)).toEqual(["gel-hands"]);
  });
});
