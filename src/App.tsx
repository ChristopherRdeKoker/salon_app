import { createHashRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom";
import { NoticeBar } from "@/components/NoticeBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AppointmentPage } from "@/pages/AppointmentPage";
import { AppointmentsPage } from "@/pages/AppointmentsPage";
import { BookPage } from "@/pages/BookPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ServicePage } from "@/pages/ServicePage";
import { AppStateProvider } from "@/state/AppStateContext";

function Layout() {
  return (
    <>
      <button type="button" className="skip-link" onClick={() => document.getElementById("main")?.focus()}>
        Skip to content
      </button>
      <SiteHeader />
      <NoticeBar />
      <main id="main" className="page" tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </>
  );
}

const router = createHashRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/treatments/:serviceId", element: <ServicePage /> },
        { path: "/book", element: <BookPage /> },
        { path: "/appointments", element: <AppointmentsPage /> },
        { path: "/appointments/:reference", element: <AppointmentPage /> },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  { future: { v7_relativeSplatPath: true, v7_fetcherPersist: true, v7_normalizeFormMethod: true, v7_partialHydration: true, v7_skipActionErrorRevalidation: true } },
);

export function App({ now }: { now: Date }) {
  return (
    <AppStateProvider now={now}>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </AppStateProvider>
  );
}
