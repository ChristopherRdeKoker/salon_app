import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { categories } from "@/data/categories";
import { findService, services } from "@/data/services";
import { FieldError } from "@/components/FieldError";
import { formatDuration } from "@/lib/dates";
import { formatWholeRand } from "@/lib/pricing";
import { servicePickSchema } from "@/lib/schemas/servicePickSchema";

type ServicePickerProps = {
  initialServiceIds: string[];
  onChoose: (serviceIds: string[]) => void;
};

export function ServicePicker({ initialServiceIds, onChoose }: ServicePickerProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof servicePickSchema>>({
    resolver: zodResolver(servicePickSchema),
    defaultValues: { serviceIds: initialServiceIds },
  });

  const pickedServices = (watch("serviceIds") || []).flatMap((serviceId) => findService(serviceId) ?? []);
  const pickedMinutes = pickedServices.reduce((sum, item) => sum + item.durationMinutes, 0);
  const pickedCents = pickedServices.reduce((sum, item) => sum + item.priceCents, 0);
  const hasPicked = !!pickedServices.length;

  return (
    <form className="picker" aria-labelledby="picker-heading" noValidate onSubmit={handleSubmit((payload) => onChoose(payload.serviceIds))}>
      <h2 id="picker-heading">Choose your treatments</h2>
      <p className="step-hint">Pick one or more. They are booked back to back with one therapist.</p>
      {categories.map((category) => (
        <fieldset key={category.id} className="picker-group">
          <legend>{category.name}</legend>
          {services
            .filter((item) => item.categoryId === category.id)
            .map((item) => (
              <label key={item.id} className="picker-option">
                <input type="checkbox" value={item.id} {...register("serviceIds")} />
                <span className="picker-name">{item.name}</span>
                <span className="picker-meta">
                  {formatDuration(item.durationMinutes)}, {formatWholeRand(item.priceCents)}
                </span>
              </label>
            ))}
        </fieldset>
      ))}
      <FieldError id="err-services" message={errors.serviceIds?.message} />
      <div className="picker-bar">
        <p aria-live="polite">{hasPicked ? `${pickedServices.length} chosen, ${formatDuration(pickedMinutes)}, ${formatWholeRand(pickedCents)}` : "Nothing chosen yet"}</p>
        <button type="submit" className="button button-primary" disabled={!hasPicked || isSubmitting}>
          Choose a therapist
        </button>
      </div>
    </form>
  );
}
