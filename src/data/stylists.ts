import { z } from "zod";
import { openingHoursSchema, stylistSchema } from "@/lib/schemas/catalogueSchema";

export const stylists = z.array(stylistSchema).parse([
  { id: "naledi", name: "Naledi", role: "Nail and lash artist", bio: "Known for clean cuticle work and soft almond shapes. Ask her about builder gel if your nails keep breaking.", categoryIds: ["nails", "lashes-brows"], workingWeekdays: [2, 3, 4, 5, 6] },
  { id: "zara", name: "Zara", role: "Skin and brow therapist", bio: "Runs every facial with a short skin chat first. Brow lamination is her favourite ten minutes of the day.", categoryIds: ["facials", "lashes-brows", "waxing"], workingWeekdays: [2, 3, 4, 5, 6] },
  { id: "ines", name: "Inês", role: "Nail and waxing specialist", bio: "Quick, calm and thorough, which is exactly what you want from a wax. Also does a very neat pedicure.", categoryIds: ["nails", "waxing", "facials"], workingWeekdays: [2, 3, 4, 5] },
]);

export const stylistIds: ReadonlySet<string> = new Set(stylists.map((stylist) => stylist.id));

export function findStylist(stylistId: string | null | undefined) {
  const result = stylists.find((stylist) => stylist.id === stylistId);

  return result;
}

const weekdayHours = { opensMinutes: 8 * 60 + 30, closesMinutes: 17 * 60 + 30 };
const saturdayHours = { opensMinutes: 8 * 60, closesMinutes: 14 * 60 };

export const openingHoursByWeekday = z.array(openingHoursSchema.nullable()).length(7).parse([null, null, weekdayHours, weekdayHours, weekdayHours, weekdayHours, saturdayHours]);

export const SLOT_STEP_MINUTES = 30;
export const BOOKING_WINDOW_DAYS = 21;
