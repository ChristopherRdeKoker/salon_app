import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";
import { BookingSteps } from "@/components/BookingSteps";
import { BookingSummary } from "@/components/BookingSummary";
import { ContactForm } from "@/components/ContactForm";
import { ServicePicker } from "@/components/ServicePicker";
import { StylistPicker } from "@/components/StylistPicker";
import { TimePicker } from "@/components/TimePicker";
import { useAppointments } from "@/hooks/useAppStores";
import { useBookingDraft } from "@/hooks/useBookingDraft";
import { BookingStepEnum } from "@/lib/bookingDraft";
import type { contactSchema } from "@/lib/schemas/contactSchema";
import { BookingFailureEnum } from "@/state/appointmentStore";

const failureMessages: Record<BookingFailureEnum, string> = {
  [BookingFailureEnum.UnknownService]: "One of the treatments is no longer on the menu. Please choose your treatments again.",
  [BookingFailureEnum.StylistCannotDoServices]: "That therapist doesn't do all of these treatments. Please choose another therapist.",
  [BookingFailureEnum.SlotUnavailable]: "That time has just been taken or has passed. Please choose another time.",
};

export function BookPage() {
  const navigate = useNavigate();
  const { createAppointment } = useAppointments();
  const { draft, clock, chooseServices, chooseStylist, chooseDate, chooseTime, reopenServices, reopenStylist, reopenTime } = useBookingDraft();
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleConfirm(contact: z.output<typeof contactSchema>) {
    if (!draft.stylist || !draft.date || draft.startMinutes === null) return;
    const request = { serviceIds: draft.chosenServices.map((item) => item.id), stylistId: draft.stylist.id, date: draft.date, startMinutes: draft.startMinutes };
    const outcome = createAppointment(request, contact, new Date());
    if (outcome.appointment) navigate(`/appointments/${outcome.appointment.ref}`, { state: { isNew: true } });
    if (outcome.problem) setSubmitError(failureMessages[outcome.problem]);
  }

  return (
    <div className="book-page">
      <h1>Book an appointment</h1>
      <BookingSteps current={draft.step} />
      <div className="book-layout">
        <div className="book-main">
          {draft.step === BookingStepEnum.Services && <ServicePicker initialServiceIds={draft.chosenServices.map((item) => item.id)} onChoose={chooseServices} />}
          {draft.step === BookingStepEnum.Stylist && <StylistPicker chosenServices={draft.chosenServices} eligibleStylists={draft.eligibleStylists} onChoose={chooseStylist} />}
          {draft.step === BookingStepEnum.Time && draft.stylist && (
            <TimePicker
              stylist={draft.stylist}
              durationMinutes={draft.durationMinutes}
              clock={clock}
              selectedDate={draft.date}
              freeStarts={draft.freeStarts}
              isTimeTaken={draft.isTimeTaken}
              onChooseDate={chooseDate}
              onChooseTime={chooseTime}
            />
          )}
          {draft.step === BookingStepEnum.Details && (
            <>
              <ContactForm onConfirm={handleConfirm} />
              {submitError && (
                <p className="refusal" role="alert" data-testid="booking-error">
                  {submitError}
                </p>
              )}
            </>
          )}
        </div>
        <BookingSummary
          chosenServices={draft.chosenServices}
          durationMinutes={draft.durationMinutes}
          stylist={draft.stylist}
          date={draft.date}
          startMinutes={draft.startMinutes}
          onChangeServices={reopenServices}
          onChangeStylist={reopenStylist}
          onChangeTime={reopenTime}
        />
      </div>
    </div>
  );
}
