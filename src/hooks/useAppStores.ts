import { useSyncExternalStore } from "react";
import { salonClock } from "@/lib/dates";
import { useAppState } from "@/state/AppStateContext";

export function useClock() {
  const { startedAt } = useAppState();
  const result = salonClock(startedAt);

  return result;
}

export function useAppointments() {
  const { appointments } = useAppState();
  const list = useSyncExternalStore(appointments.subscribe, appointments.getSnapshot);
  const result = { appointments: list, createAppointment: appointments.create, cancelAppointment: appointments.cancel };

  return result;
}

export function useNotices() {
  const { notices } = useAppState();
  const list = useSyncExternalStore(notices.subscribe, notices.getSnapshot);
  const result = { notices: list, dismissNotice: notices.dismiss, pushNotice: notices.push };

  return result;
}
