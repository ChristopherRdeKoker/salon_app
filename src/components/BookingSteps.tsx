import { BookingStepEnum } from "@/lib/bookingDraft";
import { cn } from "@/lib/cn";

const stepLabels: Record<BookingStepEnum, string> = {
  [BookingStepEnum.Services]: "Treatments",
  [BookingStepEnum.Stylist]: "Therapist",
  [BookingStepEnum.Time]: "Day and time",
  [BookingStepEnum.Details]: "Your details",
};

const orderedSteps = [BookingStepEnum.Services, BookingStepEnum.Stylist, BookingStepEnum.Time, BookingStepEnum.Details];

export function BookingSteps({ current }: { current: BookingStepEnum }) {
  return (
    <ol className="steps" aria-label="Booking progress">
      {orderedSteps.map((step) => {
        const isDone = step < current;
        const isCurrent = step === current;
        const stateText = isDone ? "done" : "to do";
        const srText = isCurrent ? "current step" : stateText;

        return (
          <li key={step} className={cn("step", isDone && "is-done", isCurrent && "is-current")} aria-current={isCurrent ? "step" : undefined}>
            <span className="step-number" aria-hidden="true">
              {step}
            </span>
            <span className="step-label">{stepLabels[step]}</span>
            <span className="visually-hidden">, {srText}</span>
          </li>
        );
      })}
    </ol>
  );
}
