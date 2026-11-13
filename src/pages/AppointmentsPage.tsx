import { Link } from "react-router-dom";
import { useAppointments, useClock } from "@/hooks/useAppStores";
import { mapAppointmentView } from "@/lib/appointmentView";
import { cn } from "@/lib/cn";
import { formatRand } from "@/lib/pricing";

export function AppointmentsPage() {
  const clock = useClock();
  const { appointments } = useAppointments();
  const views = appointments.map((appointment) => mapAppointmentView(appointment, clock)).sort((first, second) => first.date.localeCompare(second.date) || first.startMinutes - second.startMinutes);
  const upcoming = views.filter((view) => view.status === "confirmed" && view.isUpcoming);
  const earlier = views.filter((view) => !upcoming.includes(view)).reverse();

  if (!views.length) {
    return (
      <section className="empty" aria-labelledby="empty-heading">
        <h1 id="empty-heading">My appointments</h1>
        <p>No appointments yet. When you book, they appear here so you can check or cancel them.</p>
        <Link to="/book" className="button button-primary">
          Book an appointment
        </Link>
      </section>
    );
  }

  const groups = [
    { id: "upcoming", title: "Coming up", items: upcoming, emptyText: "Nothing coming up." },
    { id: "earlier", title: "Earlier and cancelled", items: earlier, emptyText: "" },
  ];

  return (
    <div className="appointments-page">
      <h1>My appointments</h1>
      {groups
        .filter((group) => !!group.items.length || !!group.emptyText)
        .map((group) => (
          <section key={group.id} aria-labelledby={`group-${group.id}`} className="appointment-group">
            <h2 id={`group-${group.id}`}>{group.title}</h2>
            {!group.items.length && <p className="step-hint">{group.emptyText}</p>}
            <ul className="appointment-list">
              {group.items.map((view) => (
                <li key={view.ref}>
                  <Link to={`/appointments/${view.ref}`} className={cn("appointment-row", view.status === "cancelled" && "is-cancelled")} data-testid="appointment-row">
                    <span className="appointment-date">{view.dateText}</span>
                    <span className="appointment-what text-wrap">
                      {view.chosenServices.map((item) => item.name).join(", ")} with {view.stylistName}
                    </span>
                    <span className="appointment-meta">
                      {view.timeText}, {formatRand(view.totalCents)}
                      {view.status === "cancelled" && <span className="badge">Cancelled</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
