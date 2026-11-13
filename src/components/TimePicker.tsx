import type { z } from "zod";
import { DayStrip } from "@/components/DayStrip";
import { useAppointments } from "@/hooks/useAppStores";
import { bookableDates, freeStartsFor, hoursFor, type ClockType } from "@/lib/availability";
import { formatDate, formatDuration, formatTime } from "@/lib/dates";
import type { stylistSchema } from "@/lib/schemas/catalogueSchema";

type TimePickerProps = {
  stylist: z.infer<typeof stylistSchema>;
  durationMinutes: number;
  clock: ClockType;
  selectedDate: string | null;
  freeStarts: number[];
  isTimeTaken: boolean;
  onChooseDate: (date: string) => void;
  onChooseTime: (startMinutes: number) => void;
};

export function TimePicker({ stylist, durationMinutes, clock, selectedDate, freeStarts, isTimeTaken, onChooseDate, onChooseTime }: TimePickerProps) {
  const { appointments } = useAppointments();
  const days = bookableDates(clock).map((date) => ({
    date,
    freeCount: freeStartsFor({ stylist, date, durationMinutes, appointments, clock }).length,
    isClosed: !hoursFor(stylist, date),
  }));
  const hasAnyDay = days.some((day) => !!day.freeCount);

  return (
    <section aria-labelledby="time-heading">
      <h2 id="time-heading">Choose a day and time</h2>
      <p className="step-hint">
        {stylist.name} has {formatDuration(durationMinutes)} free at these times over the next three weeks.
      </p>
      {isTimeTaken && (
        <p className="refusal" role="alert" data-testid="time-taken">
          That time is no longer free. Please choose another.
        </p>
      )}
      {!hasAnyDay && <p className="refusal">No free times in the next three weeks. Try fewer treatments or another therapist.</p>}
      <DayStrip days={days} selectedDate={selectedDate} onChoose={onChooseDate} />
      {selectedDate && (
        <div className="slots" role="group" aria-label={`Times on ${formatDate(selectedDate)}`}>
          <h3 className="slots-heading">{formatDate(selectedDate)}</h3>
          {!freeStarts.length && <p className="step-hint">No free times on this day.</p>}
          <ul className="slot-grid">
            {freeStarts.map((startMinutes) => (
              <li key={startMinutes}>
                <button type="button" className="slot" onClick={() => onChooseTime(startMinutes)} data-testid="slot" data-start={startMinutes}>
                  {formatTime(startMinutes)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
