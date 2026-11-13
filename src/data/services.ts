import { z } from "zod";
import { serviceSchema } from "@/lib/schemas/catalogueSchema";

function service(id: string, categoryId: string, name: string, durationMinutes: number, priceRand: number, summary: string, details: string[]) {
  const result = { id, categoryId, name, durationMinutes, priceCents: priceRand * 100, summary, details };

  return result;
}

export const services = z.array(serviceSchema).parse([
  service("gel-hands", "nails", "Gel overlay, hands", 60, 380, "A glossy gel overlay on your natural nails, cured for a chip-free two to three weeks.", ["Cuticle care and shaping", "One gel colour or a French finish", "Removal of an old gel set is included"]),
  service("gel-toes", "nails", "Gel overlay, toes", 45, 320, "Gel colour on the toes that lasts through a month of sandals.", ["Shaping and cuticle care", "One gel colour"]),
  service("builder-gel", "nails", "Builder gel set", 90, 520, "A strengthening builder gel layer for nails that bend or break, finished in colour or nude.", ["Structure built on your natural nail", "Ideal for growing nails out", "Infill every three weeks"]),
  service("classic-manicure", "nails", "Classic manicure", 45, 260, "Soak, shape, cuticle care, a short hand massage and regular polish.", ["Regular polish of your choice", "Hand massage with rose-geranium balm"]),
  service("spa-pedicure", "nails", "Spa pedicure", 60, 340, "A warm foot soak, scrub, hard-skin care, massage and regular polish.", ["Exfoliating scrub and mask", "Hard-skin removal", "Regular polish of your choice"]),
  service("lash-lift", "lashes-brows", "Lash lift & tint", 60, 420, "Lifts and darkens your natural lashes for six to eight weeks, with no extensions.", ["Keratin lift solution", "Black or brown-black tint", "Avoid water on lashes for 24 hours"]),
  service("classic-lashes", "lashes-brows", "Classic lash set", 120, 550, "One extension on each natural lash for a soft, mascara-like look.", ["Lengths chosen for your eye shape", "Infill recommended every two to three weeks"]),
  service("lash-infill", "lashes-brows", "Lash infill", 60, 330, "Tops up a classic set within three weeks of your last visit.", ["For sets with at least half the lashes still in place"]),
  service("brow-lamination", "lashes-brows", "Brow lamination", 45, 360, "Sets brow hairs in a brushed-up shape that lasts around six weeks.", ["Includes a tidy and tint", "Not suitable within 48 hours of retinol use"]),
  service("brow-shape-tint", "lashes-brows", "Brow shape & tint", 30, 180, "Wax and tweeze to a shape that suits you, then a tint to fill sparse areas.", ["Shape mapped before any hair is removed"]),
  service("express-facial", "facials", "Express glow facial", 30, 320, "Cleanse, exfoliate, mask and moisturise in half an hour.", ["Good before an event", "No extractions"]),
  service("hydrating-facial", "facials", "Hydrating facial", 60, 620, "A deep-moisture facial with a cooling sheet mask and a face and neck massage.", ["For dry, tight or dehydrated skin", "Includes a skin consultation"]),
  service("deep-clean-facial", "facials", "Deep-clean facial", 75, 690, "Steam, gentle extractions and a clay mask for congested skin.", ["Extractions done by hand", "Some redness for an hour afterwards is normal"]),
  service("dermaplaning", "facials", "Dermaplaning", 30, 250, "Removes fine vellus hair and dead skin for a smoother base.", ["Best booked with a facial", "Avoid sun for 48 hours afterwards"]),
  service("brow-wax", "waxing", "Brow wax", 15, 95, "A quick tidy along the existing shape of your brows.", ["Low-temperature wax"]),
  service("lip-chin", "waxing", "Lip & chin", 15, 110, "Upper lip and chin in one short visit.", ["Low-temperature wax"]),
  service("underarm", "waxing", "Underarm wax", 15, 130, "Smooth underarms for three to four weeks.", ["Hair should be at least 5 mm long"]),
  service("half-leg", "waxing", "Half-leg wax", 30, 260, "Knee down, or knee up, finished with a soothing aloe gel.", ["Hair should be at least 5 mm long"]),
  service("full-leg", "waxing", "Full-leg wax", 45, 390, "Ankle to hip, finished with a soothing aloe gel.", ["Hair should be at least 5 mm long"]),
]);

export const serviceIds: ReadonlySet<string> = new Set(services.map((item) => item.id));

export function findService(serviceId: string | undefined) {
  const result = services.find((item) => item.id === serviceId);

  return result;
}
