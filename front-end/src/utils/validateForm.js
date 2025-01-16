export default function validateForm(formData) {
  const { reservation_date, reservation_time, people } = formData;
  const dateTimeString = `${reservation_date}T${reservation_time}`;
  const reservationDateTime = new Date(dateTimeString);
  const todayDate = new Date().toISOString().split("T")[0];
  const now = new Date();
  const [hours, minutes] = reservation_time.split(":").map(Number);
  const reservationTimeInMinutes = hours * 60 + minutes;
  const openTime = 10 * 60 + 30;
  const closeTime = 21 * 60 + 30;

  console.log("Inputs:", {
    reservation_date,
    reservation_time,
    people,
  });

  if (!reservation_date || !reservation_time || !people) {
    console.warn("Missing required fields.");
    return "All fields are required.";
  }

  if (reservation_date < todayDate) {
    console.warn("Reservation must be for a future date.");
    return "Reservation must be for a future date.";
  }

  if (reservationDateTime.getDay() === 2) {
    console.warn("The restaurant is closed on Tuesdays.");
    return "The restaurant is closed on Tuesdays.";
  }

  if (
    reservationTimeInMinutes < openTime ||
    reservationTimeInMinutes > closeTime
  ) {
    console.warn("Reservation time out of range.");
    return "Reservation time must be between 10:30 AM and 9:30 PM.";
  }

  if (reservationDateTime < now) {
    console.warn("Reservation must be for a future time.");
    return "Reservation date and time must be in the future.";
  }

  if (!people || isNaN(people) || Number(people) <= 0) {
    console.warn("People count invalid.");
    return "Number of people must be at least 1.";
  }

  console.log("Validation Passed.");
  return null;
}