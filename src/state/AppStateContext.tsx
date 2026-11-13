import { createContext, useContext, useState, type ReactNode } from "react";
import { serviceIds } from "@/data/services";
import { stylistIds } from "@/data/stylists";
import { loadAppointments, openBrowserStore, saveAppointments } from "@/lib/storage";
import { createAppointmentStore, type AppointmentStoreType } from "@/state/appointmentStore";
import { createNoticeStore, type NoticeStoreType } from "@/state/noticeStore";

type AppStateType = {
  startedAt: Date;
  notices: NoticeStoreType;
  appointments: AppointmentStoreType;
};

const AppStateContext = createContext<AppStateType | null>(null);

function _bootstrap(now: Date): AppStateType {
  const { store, notice } = openBrowserStore();
  const loaded = loadAppointments(store, serviceIds, stylistIds);
  if (loaded.notice) saveAppointments(store, loaded.items);

  const startupNotices: string[] = [];
  if (notice) startupNotices.push(notice);
  if (loaded.notice) startupNotices.push(loaded.notice);

  const notices = createNoticeStore(startupNotices);
  const result = { startedAt: now, notices, appointments: createAppointmentStore(store, loaded.items, notices) };

  return result;
}

export function AppStateProvider({ now, children }: { now: Date; children: ReactNode }) {
  const [appState] = useState(() => _bootstrap(now));

  return <AppStateContext.Provider value={appState}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateType {
  const appState = useContext(AppStateContext);
  if (!appState) throw new Error("useAppState must be used inside AppStateProvider");

  return appState;
}
