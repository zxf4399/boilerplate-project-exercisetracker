const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  duration: {
    type: Number,
  },
  date: {
    type: Date,
  },
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  exercises: {
    type: [exerciseSchema],
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
