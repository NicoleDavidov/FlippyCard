const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    front: {
      type: String,
      required: true,
      trim: true
    },
    back: {
      type: String,
      required: true,
      trim: true
    },
    explanation: {
      type: String
    },

    level: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },

    createdBy: {
      type: String,
      enum: ["system", "user"],
      default: "system"
    },

    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
