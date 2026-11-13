import { z } from "zod";

export const categoryIdSchema = z.enum(["nails", "lashes-brows", "facials", "waxing"]);

export const serviceSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    categoryId: categoryIdSchema,
    name: z.string().min(2).max(60),
    summary: z.string().min(10).max(200),
    details: z.array(z.string().min(5)).min(1).max(5),
    durationMinutes: z.number().int().min(15).max(240).multipleOf(15),
    priceCents: z.number().int().positive(),
  })
  .strict();

export const categorySchema = z
  .object({
    id: categoryIdSchema,
    name: z.string().min(2),
    blurb: z.string().min(10),
  })
  .strict();

export const openingHoursSchema = z
  .object({
    opensMinutes: z.number().int().min(0).max(1440),
    closesMinutes: z.number().int().min(0).max(1440),
  })
  .strict()
  .refine((hours) => hours.closesMinutes > hours.opensMinutes, { message: "Closing must be after opening" });

export const stylistSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(2).max(40),
    role: z.string().min(2).max(60),
    bio: z.string().min(10).max(240),
    categoryIds: z.array(categoryIdSchema).min(1),
    workingWeekdays: z.array(z.number().int().min(0).max(6)).min(1),
  })
  .strict();
