const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png",
    },
    about: {
      type: String,
      required: true,
      default: "I am a software developer",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
