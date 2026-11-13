import type { z } from "zod";
import { categories } from "@/data/categories";
import { stylists } from "@/data/stylists";
import { StylistPortrait } from "@/art/StylistPortrait";
import type { serviceSchema, stylistSchema } from "@/lib/schemas/catalogueSchema";

type StylistPickerProps = {
  chosenServices: z.infer<typeof serviceSchema>[];
  eligibleStylists: z.infer<typeof stylistSchema>[];
  onChoose: (stylistId: string) => void;
};

function _missingCategoryText(stylist: z.infer<typeof stylistSchema>, chosenServices: StylistPickerProps["chosenServices"]): string {
  const missingNames = categories.filter((category) => !stylist.categoryIds.includes(category.id) && chosenServices.some((item) => item.categoryId === category.id)).map((category) => category.name.toLowerCase());
  const result = `Doesn't do ${missingNames.join(" or ")}`;

  return result;
}

export function StylistPicker({ chosenServices, eligibleStylists, onChoose }: StylistPickerProps) {
  const hasNobody = !eligibleStylists.length;

  return (
    <section aria-labelledby="stylist-heading">
      <h2 id="stylist-heading">Choose your therapist</h2>
      {hasNobody && (
        <p className="refusal" role="alert">
          No one therapist does all of these together. Book them as separate appointments, or change your treatments.
        </p>
      )}
      <ul className="stylist-options">
        {stylists.map((stylist) => {
          const isEligible = eligibleStylists.includes(stylist);

          return (
            <li key={stylist.id}>
              <button type="button" className="stylist-option" disabled={!isEligible} onClick={() => onChoose(stylist.id)} data-testid={`stylist-${stylist.id}`}>
                <StylistPortrait stylistId={stylist.id} name={stylist.name} />
                <span className="stylist-text">
                  <span className="stylist-name">{stylist.name}</span>
                  <span className="stylist-role">{stylist.role}</span>
                  {!isEligible && <span className="stylist-unavailable">{_missingCategoryText(stylist, chosenServices)}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
