import { useSearchParams } from "react-router-dom";
import { useAppointments, useClock } from "@/hooks/useAppStores";
import { readDraft } from "@/lib/bookingDraft";

export function useBookingDraft() {
  const [params, setParams] = useSearchParams();
  const clock = useClock();
  const { appointments } = useAppointments();
  const draft = readDraft(params, clock, appointments);

  function _update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) next.delete(key);
      else next.set(key, value);
    }
    setParams(next);
  }

  const result = {
    draft,
    clock,
    chooseServices: (serviceIds: string[]) => _update({ services: serviceIds.join(","), change: null, time: null }),
    chooseStylist: (stylistId: string) => _update({ stylist: stylistId, time: null }),
    chooseDate: (date: string) => _update({ date, time: null }),
    chooseTime: (startMinutes: number) => _update({ time: String(startMinutes) }),
    reopenServices: () => _update({ change: "services" }),
    reopenStylist: () => _update({ stylist: null, time: null }),
    reopenTime: () => _update({ time: null }),
  };

  return result;
}
