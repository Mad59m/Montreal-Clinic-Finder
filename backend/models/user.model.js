const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,    
    places: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Place"
        }
      ]
  })
);

module.exports = User;
