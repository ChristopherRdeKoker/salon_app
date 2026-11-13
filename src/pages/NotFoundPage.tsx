import { Link } from "react-router-dom";

export function NotFoundPage({ message = "That page doesn't exist." }: { message?: string }) {
  return (
    <section className="empty" aria-labelledby="missing-heading">
      <h1 id="missing-heading">Not found</h1>
      <p>{message}</p>
      <Link to="/" className="button button-primary">
        See all treatments
      </Link>
    </section>
  );
}
