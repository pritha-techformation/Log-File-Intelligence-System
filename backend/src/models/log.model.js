const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },

    analysis: {
      topErrors: [
        {
          type: {
            type: String,
            required: true,
          },
          count: {
            type: Number,
            required: true,
          },
        },
      ],

      errorFrequency: {
        type: Number,
        default: 0,
      },

      mostFrequentTimeRange: {
        type: String,
      },
      timeRanges: [
        {
          range: String,
          count: Number,
        },
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("LogFile", logSchema);
