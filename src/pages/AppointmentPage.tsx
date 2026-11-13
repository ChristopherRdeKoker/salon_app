import { Link, useLocation, useParams } from "react-router-dom";
import { z } from "zod";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { CancelAppointmentButton } from "@/components/CancelAppointmentButton";
import { useAppointments, useClock, useNotices } from "@/hooks/useAppStores";
import { mapAppointmentView } from "@/lib/appointmentView";
import { breakDownPrice } from "@/lib/pricing";
import { NotFoundPage } from "@/pages/NotFoundPage";

const locationStateSchema = z.object({ isNew: z.boolean() }).nullable().catch(null);

export function AppointmentPage() {
  const { reference } = useParams();
  const location = useLocation();
  const clock = useClock();
  const { appointments, cancelAppointment } = useAppointments();
  const { pushNotice } = useNotices();

  const found = appointments.find((appointment) => appointment.ref === reference);
  if (!found) return <NotFoundPage message="We couldn't find that appointment in this browser." />;

  const view = mapAppointmentView(found, clock);
  const isNew = !!locationStateSchema.parse(location.state)?.isNew;
  const isCancelled = view.status === "cancelled";
  const price = breakDownPrice(view.chosenServices.map((item) => ({ label: item.name, priceCents: item.priceCents })));
  const pastHeading = isCancelled ? "Cancelled appointment" : "Your appointment";
  const heading = isNew ? "You're booked" : pastHeading;

  function handleCancel() {
    const isCancelledNow = cancelAppointment(view.ref);
    if (!isCancelledNow) pushNotice(`Appointment ${view.ref} was already cancelled.`);
  }

  return (
    <article className="appointment-page">
      <Link to="/appointments" className="back-link">
        All appointments
      </Link>
      <h1 data-testid="appointment-heading">{heading}</h1>
      {isNew && <p className="lead">We've saved this in your browser. In a real studio you'd get an SMS and an email now.</p>}
      <section className="ticket" aria-label="Appointment card">
        <div className="ticket-head">
          <p className="ticket-name">Blushwood</p>
          <p className="ticket-ref">
            Reference <span data-testid="appointment-ref">{view.ref}</span>
          </p>
        </div>
        <dl className="ticket-facts">
          <div>
            <dt>When</dt>
            <dd data-testid="appointment-when">
              {view.dateText}, {view.timeText}
            </dd>
          </div>
          <div>
            <dt>Therapist</dt>
            <dd>{view.stylistName}</dd>
          </div>
          <div>
            <dt>Booked for</dt>
            <dd className="text-wrap">
              {view.name}, {view.phoneText}
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd data-testid="appointment-status">{isCancelled ? "Cancelled" : "Confirmed"}</dd>
          </div>
        </dl>
        {!!view.note && <p className="ticket-note text-wrap">Note: {view.note}</p>}
        <PriceBreakdown price={price} />
      </section>
      <div className="appointment-actions">
        {view.isCancellable && <CancelAppointmentButton onCancel={handleCancel} />}
        <Link to="/book" className="button button-ghost">
          Book another
        </Link>
      </div>
    </article>
  );
}
