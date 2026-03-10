// models/log.model.js

// import mongoose to connect to MongoDB
const mongoose = require("mongoose");


// create a schema for logs
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
            default: "Unknown Error",
          },
          count: Number,
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
      errors: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("LogFile", logSchema);
