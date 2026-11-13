import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/dates";

type DayStripProps = {
  days: { date: string; freeCount: number; isClosed: boolean }[];
  selectedDate: string | null;
  onChoose: (date: string) => void;
};

export function DayStrip({ days, selectedDate, onChoose }: DayStripProps) {
  return (
    <div className="day-strip" role="group" aria-label="Choose a day">
      {days.map((day) => {
        const isSelected = day.date === selectedDate;
        const isFull = !day.freeCount;
        const countText = day.freeCount === 1 ? "1 time" : `${day.freeCount} times`;
        const fullText = day.isClosed ? "Closed" : "Fully booked";
        const availabilityText = isFull ? fullText : countText;

        return (
          <button
            key={day.date}
            type="button"
            className={cn("day", isSelected && "is-selected")}
            aria-pressed={isSelected}
            disabled={isFull}
            onClick={() => onChoose(day.date)}
            data-testid="day"
            data-date={day.date}
          >
            <span className="day-weekday">{formatDate(day.date, { weekday: "short" })}</span>
            <span className="day-number">{formatDate(day.date, { day: "numeric" })}</span>
            <span className="day-month">{formatDate(day.date, { month: "short" })}</span>
            <span className="day-count">{availabilityText}</span>
          </button>
        );
      })}
    </div>
  );
}
