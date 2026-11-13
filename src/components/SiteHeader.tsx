import { Link, NavLink } from "react-router-dom";
import { useAppointments, useClock } from "@/hooks/useAppStores";
import { cn } from "@/lib/cn";
import { HexMark } from "@/art/HexMark";

export function SiteHeader() {
  const { appointments } = useAppointments();
  const clock = useClock();
  const upcomingCount = appointments.filter((appointment) => appointment.status === "confirmed" && appointment.date >= clock.date).length;
  const navClass = ({ isActive }: { isActive: boolean }) => cn("nav-item", isActive && "is-active");
  const homeNavClass = ({ isActive }: { isActive: boolean }) => cn("nav-item nav-home", isActive && "is-active");

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="wordmark" aria-label="Honeycomb, home">
          <HexMark />
          <span className="wordmark-text">
            <span className="wordmark-name">Honeycomb</span>
            <span className="wordmark-place">Beauty studio, Durban North</span>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Main">
          <NavLink to="/" end className={homeNavClass}>
            Treatments
          </NavLink>
          <NavLink to="/appointments" className={navClass}>
            My appointments
            {!!upcomingCount && (
              <span className="nav-count" aria-label={`${upcomingCount} upcoming`}>
                {upcomingCount}
              </span>
            )}
          </NavLink>
          <Link to="/book" className="button button-primary button-small">
            Book
          </Link>
        </nav>
      </div>
    </header>
  );
}
