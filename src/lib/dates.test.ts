import { describe, expect, it } from "vitest";
import { addDays, formatDuration, formatTime, isISODate, salonClock, weekdayOf } from "@/lib/dates";

describe("salonClock", () => {
  it("reads South African time (UTC+2) for a UTC instant", () => {
    expect(salonClock(new Date("2026-11-13T08:20:00Z"))).toEqual({ date: "2026-11-13", minutes: 620 });
  });
  it("rolls over to the next day after 22:00 UTC", () => {
    expect(salonClock(new Date("2026-11-13T22:30:00Z"))).toEqual({ date: "2026-11-14", minutes: 30 });
  });
});

describe("date helpers", () => {
  it("knows the weekday", () => {
    expect(weekdayOf("2026-11-13")).toBe(5);
    expect(weekdayOf("2026-11-15")).toBe(0);
  });
  it("adds days across a month end", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
  });
  it("rejects impossible dates", () => {
    expect(isISODate("2026-02-30")).toBe(false);
    expect(isISODate("2026-11-13")).toBe(true);
  });
  it("formats times and durations", () => {
    expect(formatTime(510)).toBe("08:30");
    expect(formatDuration(90)).toBe("1 h 30 min");
    expect(formatDuration(45)).toBe("45 min");
    expect(formatDuration(120)).toBe("2 h");
  });
});
