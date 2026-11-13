import { z } from "zod";
import { REFERENCE_PATTERN } from "@/lib/reference";
import { isoDateSchema, storedPhoneSchema } from "@/lib/schemas/fieldSchemas";

export const appointmentStatusSchema = z.enum(["confirmed", "cancelled"]);

export const appointmentSchema = z
  .object({
    ref: z.string().regex(REFERENCE_PATTERN),
    serviceIds: z.array(z.string().min(1)).min(1).max(6),
    stylistId: z.string().min(1),
    date: isoDateSchema,
    startMinutes: z.number().int().min(0).max(1439).multipleOf(15),
    durationMinutes: z.number().int().min(15).max(720).multipleOf(15),
    totalCents: z.number().int().nonnegative(),
    name: z.string().min(1).max(80),
    phone: storedPhoneSchema,
    email: z.string().email().max(200),
    note: z.string().max(300),
    createdAt: z.string().datetime(),
    status: appointmentStatusSchema,
  })
  .strict()
  .refine((appointment) => appointment.startMinutes + appointment.durationMinutes <= 1440, { message: "Appointment must end the same day", path: ["durationMinutes"] });

export const appointmentListSchema = z.array(appointmentSchema);
