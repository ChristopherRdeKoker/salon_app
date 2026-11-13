import { z } from "zod";
import { saPhoneSchema } from "@/lib/schemas/fieldSchemas";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80, "Name is too long"),
  phone: saPhoneSchema,
  email: z.string().trim().email("Please enter a valid email address").max(200, "Email is too long"),
  note: z.string().trim().max(300, "Keep the note under 300 characters"),
  agree: z.boolean().refine((value) => value, { message: "Please confirm you understand this is a demo" }),
});

export const contactDefaultValues: z.input<typeof contactSchema> = { name: "", phone: "", email: "", note: "", agree: false };
