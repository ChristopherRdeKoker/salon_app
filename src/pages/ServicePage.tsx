import { Link, useParams } from "react-router-dom";
import { categories } from "@/data/categories";
import { findService } from "@/data/services";
import { stylists } from "@/data/stylists";
import { Icon, categoryIcons } from "@/components/Icon";
import { canStylistDo } from "@/lib/bookingDraft";
import { formatDuration } from "@/lib/dates";
import { formatWholeRand } from "@/lib/pricing";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function ServicePage() {
  const { serviceId } = useParams();
  const treatment = findService(serviceId);
  if (!treatment) return <NotFoundPage message="We couldn't find that treatment." />;

  const category = categories.find((item) => item.id === treatment.categoryId);
  const therapistNames = stylists.filter((stylist) => canStylistDo(stylist, [treatment])).map((stylist) => stylist.name);

  return (
    <article className="service-page">
      <Link to="/" className="back-link">
        All treatments
      </Link>
      <p className="service-category">
        <Icon name={categoryIcons[treatment.categoryId]} />
        {category?.name}
      </p>
      <h1 className="text-wrap">{treatment.name}</h1>
      <p className="lead">{treatment.summary}</p>
      <dl className="service-facts">
        <div>
          <dt>Time</dt>
          <dd>{formatDuration(treatment.durationMinutes)}</dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd data-testid="service-price">{formatWholeRand(treatment.priceCents)}</dd>
        </div>
        <div>
          <dt>With</dt>
          <dd>{therapistNames.join(", ")}</dd>
        </div>
      </dl>
      <h2>What's included</h2>
      <ul className="service-details">
        {treatment.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
      <Link to={`/book?services=${treatment.id}&change=services`} className="button button-primary" data-testid="book-service">
        Book this treatment
      </Link>
    </article>
  );
}
