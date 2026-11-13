import { Link } from "react-router-dom";
import { categories } from "@/data/categories";
import { services } from "@/data/services";
import { Icon, categoryIcons } from "@/components/Icon";
import { formatDuration } from "@/lib/dates";
import { formatWholeRand } from "@/lib/pricing";

export function ServiceMenu() {
  return (
    <div className="menu">
      {categories.map((category) => (
        <section key={category.id} id={`menu-${category.id}`} className="menu-group" aria-labelledby={`menu-heading-${category.id}`}>
          <div className="menu-group-head">
            <Icon name={categoryIcons[category.id]} className="menu-glyph" />
            <h3 id={`menu-heading-${category.id}`}>{category.name}</h3>
          </div>
          <p className="menu-blurb">{category.blurb}</p>
          <ul className="menu-list">
            {services
              .filter((item) => item.categoryId === category.id)
              .map((item) => (
                <li key={item.id}>
                  <Link to={`/treatments/${item.id}`} className="menu-row">
                    <span className="menu-name">{item.name}</span>
                    <span className="menu-leader" aria-hidden="true" />
                    <span className="menu-duration">{formatDuration(item.durationMinutes)}</span>
                    <span className="menu-price">{formatWholeRand(item.priceCents)}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
