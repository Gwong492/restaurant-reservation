import React, { useState, useEffect } from "react";
import { createReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, useParams } from "react-router-dom";
import { formatAsTime } from "../utils/date-time";
import validateForm from "../utils/validateForm";

function ReservationForm({ initialFormState = {}, status }) {
  const { reservation_id } = useParams();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });
  const [error, setError] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (initialFormState && Object.keys(initialFormState).length > 0) {
      setFormData({ ...initialFormState });
    }
  }, [initialFormState]);

  function handleChange({ target }) {
    const { name, value } = target;
    console.log(`Field Changed: ${name} => ${value}`);

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "people" ? Number(value) : value,
    }));

    if (hasSubmitted) {
      const validationError = validateForm({
        ...formData,
        [name]: name === "people" ? Number(value) : value,
      });

      if (validationError) {
        console.warn("Validation Warning:", validationError);
        setError(validationError);
      } else {
        setError(null);
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Form Submission Data:", formData);
    setHasSubmitted(true);

    const validationError = validateForm({
      ...formData,
      people: Number(formData.people),
    });

    if (validationError) {
      console.warn(
        "Validation Error on Submit:",
        validationError
      );
      setError(validationError);
      return;
    }

    setError(null);

    try {
      const reservationData = {
        ...formData,
        people: Number(formData.people),
        reservation_time: formatAsTime(formData.reservation_time),
      };

      if (status === "edit") {
        console.log("Updating Reservation...");
        await updateReservation(reservationData, reservation_id, status);
      } else {
        console.log("Creating Reservation...");
        await createReservation(reservationData);
      }

      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      console.error("API Error:", error);
      ErrorAlert(error);
    }
  }

  function renderField({
    label,
    name,
    type = "text",
    min,
    placeholder = null,
  }) {
    return (
      <label className="form-components">
        {label}
        <input
          name={name}
          type={type}
          min={min}
          onChange={handleChange}
          value={formData[name]}
          placeholder={placeholder}
          required
        />
      </label>
    );
  }

  return (
    <main className="helvetica align-content-center">
      {hasSubmitted && error ? (
        <div className="alert alert-danger">{error}</div>
      ) : null}
      <form className="reservation-form col" onSubmit={handleSubmit}>
        {renderField({
          label: "First Name",
          name: "first_name",
          placeholder: "Enter First Name",
        })}
        {renderField({
          label: "Last Name",
          name: "last_name",
          placeholder: "Enter Last Name",
        })}
        {renderField({
          label: "Phone Number",
          name: "mobile_number",
          placeholder: "XXX-XXX-XXXX",
        })}
        {renderField({ label: "Date", name: "reservation_date", type: "date" })}
        {renderField({ label: "Time", name: "reservation_time", type: "time" })}
        {renderField({
          label: "Number of people",
          name: "people",
          type: "number",
          min: 1,
        })}

        <div className="buttons d-flex justify-content-between">
          <button
            className="btn btn-outline-dark w-100"
            type="button"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
          <button className="btn submit-button w-100 ml-2" type="submit">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default ReservationForm;