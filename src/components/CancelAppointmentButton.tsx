import { useState } from "react";

export function CancelAppointmentButton({ onCancel }: { onCancel: () => void }) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isConfirming) {
    return (
      <button type="button" className="button button-ghost button-danger" onClick={() => setIsConfirming(true)}>
        Cancel appointment
      </button>
    );
  }

  return (
    <div className="confirm-cancel" role="group" aria-label="Confirm cancellation">
      <p>Cancel this appointment? The time goes back into the diary.</p>
      <div className="confirm-cancel-actions">
        <button type="button" className="button button-danger-solid" onClick={onCancel}>
          Yes, cancel it
        </button>
        <button type="button" className="button button-ghost" onClick={() => setIsConfirming(false)} autoFocus>
          Keep it
        </button>
      </div>
    </div>
  );
}
