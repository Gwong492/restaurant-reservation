import React from "react";
import ReservationForm from "./ReservationForm";

function NewReservations() {
  return (
    <main className="helvetica">
      <h3 className="date-title m-3 form-title">Create Reservation</h3>
      <div>
        <ReservationForm status="new" />
      </div>
    </main>
  );
}

export default NewReservations;