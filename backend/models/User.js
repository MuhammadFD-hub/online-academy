const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    pfpCloudData: {
      public_id: { type: String, default: null },
      format: { type: String, default: null },
    },
    bgCloudData: {
      public_id: { type: String, default: null },
      format: { type: String, default: null },
    },
    username: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: String,
      default: null,
    },
    gender: {
      type: Boolean,
      default: null,
    },
    settings: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
