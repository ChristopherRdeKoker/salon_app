import { z } from "zod";
import { isISODate } from "@/lib/dates";

export const isoDateSchema = z.string().refine(isISODate, { message: "Must be a real date (YYYY-MM-DD)" });

const SA_PHONE_PATTERN = /^(?:\+27|0)([1-8]\d{8})$/;

export const saPhoneSchema = z
  .string()
  .trim()
  .min(1, "Please enter your phone number")
  .transform((value) => value.replace(/[\s()-]/g, ""))
  .refine((value) => SA_PHONE_PATTERN.test(value), { message: "Enter a South African number, like 082 000 0000 or +27 82 000 0000" })
  .transform((value) => `+27${value.replace(SA_PHONE_PATTERN, "$1")}`);

export const storedPhoneSchema = z.string().regex(/^\+27[1-8]\d{8}$/);
