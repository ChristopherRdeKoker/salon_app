import { z } from "zod";
import { categorySchema } from "@/lib/schemas/catalogueSchema";

export const categories = z.array(categorySchema).parse([
  { id: "nails", name: "Nails", blurb: "Gel, builder gel and classic polish for hands and feet, shaped and finished by hand." },
  { id: "lashes-brows", name: "Lashes & brows", blurb: "Lifts, sets and laminations that frame the face without looking done." },
  { id: "facials", name: "Facials", blurb: "Calm, unhurried skin treatments matched to how your skin feels on the day." },
  { id: "waxing", name: "Waxing", blurb: "Quick, careful waxing with a low-temperature wax for sensitive skin." },
]);
