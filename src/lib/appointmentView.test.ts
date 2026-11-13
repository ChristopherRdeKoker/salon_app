import { describe, expect, it } from "vitest";
import { mapAppointmentView } from "@/lib/appointmentView";

const appointment = {
  ref: "HVL-ABC-234",
  serviceIds: ["gel-hands", "brow-wax"],
  stylistId: "ines",
  date: "2026-11-13",
  startMinutes: 660,
  durationMinutes: 75,
  totalCents: 47500,
  name: "Test",
  phone: "+27820000000",
  email: "t@example.com",
  note: "",
  createdAt: "2026-11-13T08:00:00.000Z",
  status: "confirmed" as const,
};

describe("mapAppointmentView", () => {
  it("names the services, therapist and time range", () => {
    const view = mapAppointmentView(appointment, { date: "2026-11-13", minutes: 600 });
    expect(view.chosenServices.map((item) => item.name)).toEqual(["Gel overlay, hands", "Brow wax"]);
    expect(view.stylistName).toBe("Inês");
    expect(view.timeText).toBe("11:00 to 12:15");
    expect(view.phoneText).toBe("+27 82 000 0000");
  });
  it("is cancellable only while confirmed and still ahead", () => {
    expect(mapAppointmentView(appointment, { date: "2026-11-13", minutes: 600 }).isCancellable).toBe(true);
    expect(mapAppointmentView(appointment, { date: "2026-11-13", minutes: 660 }).isCancellable).toBe(false);
    expect(mapAppointmentView(appointment, { date: "2026-11-14", minutes: 0 }).isUpcoming).toBe(false);
    expect(mapAppointmentView({ ...appointment, status: "cancelled" }, { date: "2026-11-12", minutes: 0 }).isCancellable).toBe(false);
  });
});
