import { z } from "zod";
import { appointmentListSchema, appointmentSchema } from "@/lib/schemas/appointmentSchema";

export type KeyValueStoreType = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

type ReadOutcomeType = { raw: unknown[]; notice: null } | { raw: null; notice: string };

export const APPOINTMENTS_KEY = "blushwood.appointments.v1";

export function createMemoryStore(): KeyValueStoreType {
  const entries = new Map<string, string>();
  const result = {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => void entries.set(key, value),
    removeItem: (key: string) => void entries.delete(key),
  };

  return result;
}

function _readJsonArray(store: KeyValueStoreType): ReadOutcomeType {
  let text: string | null;
  try {
    text = store.getItem(APPOINTMENTS_KEY);
  } catch {
    return { raw: null, notice: "Your browser blocked access to saved appointments, so nothing is saved between visits right now." };
  }
  if (text === null) return { raw: [], notice: null };

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { raw: null, notice: "Saved appointments were unreadable (not valid data) and have been reset. A copy was kept in this browser." };
  }

  const asArray = z.array(z.unknown()).safeParse(parsed);
  const result: ReadOutcomeType = asArray.success ? { raw: asArray.data, notice: null } : { raw: null, notice: "Saved appointments were in an unexpected format and have been reset. A copy was kept in this browser." };

  return result;
}

function _keepBackup(store: KeyValueStoreType): void {
  try {
    const text = store.getItem(APPOINTMENTS_KEY);
    if (text !== null) store.setItem(`${APPOINTMENTS_KEY}.corrupt`, text);
  } catch {
    return;
  }
}

export function loadAppointments(store: KeyValueStoreType, serviceIds: ReadonlySet<string>, stylistIds: ReadonlySet<string>) {
  const outcome = _readJsonArray(store);
  if (outcome.raw === null) {
    _keepBackup(store);
    return { items: [], notice: outcome.notice };
  }

  const seenRefs = new Set<string>();
  const items: z.infer<typeof appointmentSchema>[] = [];
  for (const raw of outcome.raw) {
    const parsed = appointmentSchema.safeParse(raw);
    const isKnown = parsed.success && stylistIds.has(parsed.data.stylistId) && parsed.data.serviceIds.every((serviceId) => serviceIds.has(serviceId));
    if (!parsed.success || !isKnown || seenRefs.has(parsed.data.ref)) continue;
    seenRefs.add(parsed.data.ref);
    items.push(parsed.data);
  }

  const droppedCount = outcome.raw.length - items.length;
  if (!droppedCount) return { items, notice: null };

  _keepBackup(store);
  const keptText = items.length === 1 ? "The other 1 is intact." : `The other ${items.length} are intact.`;
  const result = { items, notice: `${droppedCount} of ${outcome.raw.length} saved appointments couldn't be read and were removed. ${keptText}` };

  return result;
}

export function saveAppointments(store: KeyValueStoreType, appointments: readonly z.infer<typeof appointmentSchema>[]): string | null {
  const checked = appointmentListSchema.safeParse(appointments);
  if (!checked.success) return "An appointment failed validation and was not saved.";

  try {
    store.setItem(APPOINTMENTS_KEY, JSON.stringify(checked.data));
    return null;
  } catch {
    return "Couldn't save to this browser's storage (it may be full or blocked). Changes will last until you close the tab.";
  }
}

export function openBrowserStore(): { store: KeyValueStoreType; notice: string | null } {
  try {
    const browserStore = window.localStorage;
    browserStore.setItem("blushwood.probe", "1");
    browserStore.removeItem("blushwood.probe");
    return { store: browserStore, notice: null };
  } catch {
    return { store: createMemoryStore(), notice: "This browser blocks local storage, so appointments only last until you close the tab." };
  }
}
