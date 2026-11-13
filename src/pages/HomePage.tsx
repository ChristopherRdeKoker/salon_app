import { Link } from "react-router-dom";
import { stylists } from "@/data/stylists";
import { HeroArt } from "@/art/HeroArt";
import { StylistPortrait } from "@/art/StylistPortrait";
import { ServiceMenu } from "@/components/ServiceMenu";
import { OpeningHours } from "@/components/OpeningHours";

export function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-text">
          <h1 id="hero-heading">Nails, lashes and skin, done without rushing.</h1>
          <p className="lead">A small studio in Durban North with three therapists, one quiet room and a diary you can book straight into.</p>
          <div className="hero-actions">
            <Link to="/book" className="button button-primary">
              Book an appointment
            </Link>
            <button type="button" className="button button-ghost" onClick={() => document.getElementById("treatments")?.focus()}>
              See the price list
            </button>
          </div>
        </div>
        <HeroArt />
      </section>

      <section id="treatments" className="section" aria-labelledby="treatments-heading" tabIndex={-1}>
        <div className="section-head">
          <h2 id="treatments-heading">Price list</h2>
          <p>All prices include VAT. Tap a treatment for what's included.</p>
        </div>
        <ServiceMenu />
      </section>

      <section className="section" aria-labelledby="team-heading">
        <div className="section-head">
          <h2 id="team-heading">The therapists</h2>
        </div>
        <ul className="team">
          {stylists.map((stylist) => (
            <li key={stylist.id} className="team-member">
              <StylistPortrait stylistId={stylist.id} name={stylist.name} />
              <div className="team-text">
                <h3>{stylist.name}</h3>
                <p className="team-role">{stylist.role}</p>
                <p>{stylist.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section visit" aria-labelledby="visit-heading">
        <div className="section-head">
          <h2 id="visit-heading">Visiting</h2>
          <p>Durban North. Parking in front of the studio, step-free entrance.</p>
        </div>
        <OpeningHours />
      </section>
    </>
  );
}
