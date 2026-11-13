import type { z } from "zod";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { formatDate, formatDuration, formatTime } from "@/lib/dates";
import { breakDownPrice } from "@/lib/pricing";
import type { serviceSchema, stylistSchema } from "@/lib/schemas/catalogueSchema";

type BookingSummaryProps = {
  chosenServices: z.infer<typeof serviceSchema>[];
  durationMinutes: number;
  stylist: z.infer<typeof stylistSchema> | null;
  date: string | null;
  startMinutes: number | null;
  onChangeServices: () => void;
  onChangeStylist: () => void;
  onChangeTime: () => void;
};

export function BookingSummary({ chosenServices, durationMinutes, stylist, date, startMinutes, onChangeServices, onChangeStylist, onChangeTime }: BookingSummaryProps) {
  if (!chosenServices.length) return null;

  const price = breakDownPrice(chosenServices.map((item) => ({ label: item.name, priceCents: item.priceCents })));
  const hasTime = !!date && startMinutes !== null;
  const timeText = hasTime ? `${formatDate(date)}, ${formatTime(startMinutes)} to ${formatTime(startMinutes + durationMinutes)}` : null;

  return (
    <aside className="summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading">Your visit</h2>
      <div className="summary-row">
        <p className="summary-value">
          {chosenServices.length === 1 ? "1 treatment" : `${chosenServices.length} treatments`}, {formatDuration(durationMinutes)}
        </p>
        <button type="button" className="text-button" onClick={onChangeServices}>
          Change treatments
        </button>
      </div>
      {stylist && (
        <div className="summary-row">
          <p className="summary-value">With {stylist.name}</p>
          <button type="button" className="text-button" onClick={onChangeStylist}>
            Change therapist
          </button>
        </div>
      )}
      {timeText && (
        <div className="summary-row">
          <p className="summary-value" data-testid="summary-time">
            {timeText}
          </p>
          <button type="button" className="text-button" onClick={onChangeTime}>
            Change time
          </button>
        </div>
      )}
      <PriceBreakdown price={price} />
      <p className="summary-note">Prices include VAT. Pay at the studio after your visit.</p>
    </aside>
  );
}
