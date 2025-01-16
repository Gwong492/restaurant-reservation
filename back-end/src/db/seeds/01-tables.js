const tablesData = require("./01-tables.json");

exports.seed = function (knex) {
  return knex("tables")
    .del()
    .then(() => {
      return knex("tables").insert(tablesData);
    });
};