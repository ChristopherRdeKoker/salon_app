import type { z } from "zod";
import { findService } from "@/data/services";
import { findStylist } from "@/data/stylists";
import type { ClockType } from "@/lib/availability";
import { formatDate, formatTime } from "@/lib/dates";
import type { appointmentSchema } from "@/lib/schemas/appointmentSchema";

export function mapAppointmentView(appointment: z.infer<typeof appointmentSchema>, clock: ClockType) {
  const chosenServices = appointment.serviceIds.flatMap((serviceId) => findService(serviceId) ?? []);
  const stylistName = findStylist(appointment.stylistId)?.name ?? "Unknown therapist";
  const endMinutes = appointment.startMinutes + appointment.durationMinutes;
  const isSameDayLater = appointment.date === clock.date && appointment.startMinutes > clock.minutes;
  const isUpcoming = appointment.date > clock.date || isSameDayLater;
  const isCancellable = appointment.status === "confirmed" && isUpcoming;

  const result = {
    ...appointment,
    chosenServices,
    stylistName,
    dateText: formatDate(appointment.date),
    phoneText: appointment.phone.replace(/^\+27(\d{2})(\d{3})(\d{4})$/, "+27 $1 $2 $3"),
    timeText: `${formatTime(appointment.startMinutes)} to ${formatTime(endMinutes)}`,
    isUpcoming,
    isCancellable,
  };

  return result;
}
