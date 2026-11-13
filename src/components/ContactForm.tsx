import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { FieldError } from "@/components/FieldError";
import { contactDefaultValues, contactSchema } from "@/lib/schemas/contactSchema";

export function ContactForm({ onConfirm }: { onConfirm: (contact: z.output<typeof contactSchema>) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<z.input<typeof contactSchema>, unknown, z.output<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaultValues,
  });

  return (
    <form className="contact-form" aria-labelledby="contact-heading" noValidate onSubmit={handleSubmit(onConfirm)}>
      <h2 id="contact-heading">Your details</h2>
      <div className="field">
        <label htmlFor="name">Full name</label>
        <input id="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby="err-name" {...register("name")} />
        <FieldError id="err-name" message={errors.name?.message} />
      </div>
      <div className="field">
        <label htmlFor="phone">Mobile number</label>
        <input id="phone" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby="hint-phone err-phone" {...register("phone")} />
        <p id="hint-phone" className="field-hint">
          A South African number. We would send a reminder the day before.
        </p>
        <FieldError id="err-phone" message={errors.phone?.message} />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="err-email" {...register("email")} />
        <FieldError id="err-email" message={errors.email?.message} />
      </div>
      <div className="field">
        <label htmlFor="note">Anything we should know? (optional)</label>
        <textarea id="note" rows={3} aria-invalid={!!errors.note} aria-describedby="err-note" {...register("note")} />
        <FieldError id="err-note" message={errors.note?.message} />
      </div>
      <div className="check-field">
        <input id="agree" type="checkbox" aria-invalid={!!errors.agree} aria-describedby="err-agree" {...register("agree")} />
        <label htmlFor="agree">I understand this is a demo: no real appointment is made and nothing is charged.</label>
      </div>
      <FieldError id="err-agree" message={errors.agree?.message} />
      <button type="submit" className="button button-primary button-block" disabled={!isDirty || isSubmitting}>
        Confirm appointment
      </button>
    </form>
  );
}
