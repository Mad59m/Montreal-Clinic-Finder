const mongoose = require("mongoose");

const Place = mongoose.model(
  "Place",
  new mongoose.Schema({
    place_id: String
  })
);

module.exports = Place;
