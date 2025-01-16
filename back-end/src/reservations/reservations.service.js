const knex = require("../db/connection");

function list(query) {
  const { date, mobile_number } = query;

  if (mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date", "asc");
  }

  if (date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .andWhereNot({ status: "finished" })
      .orderBy("reservation_time", "asc");
  }

  return knex("reservations")
    .select("*")
    .orderBy("reservation_date", "asc");
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((rows) => rows[0]);
}

function read(reservationId) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .first();
}

function update(reservationId, updatedFields) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .update(updatedFields, "*")
    .then((rows) => rows[0]);
}

function updateStatus(reservationId, status) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .update({ status })
    .returning("*")
    .then((rows) => rows[0]);
}

module.exports = {
  list,
  create,
  read,
  update,
  updateStatus,
};