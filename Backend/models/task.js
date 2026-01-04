const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    TaskName: {
      type: String,
      required: true,
      trim: true,
    },

    Description: {
      type: String,
      default: "",
    },

    Priority: { 
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    TaskStatus: {
      type: String,
      enum: ["Pending", "Complete"],
      default: "Pending",
    },

    Deadline: {
      type: Date,
      required: true,
    },

    // Optional (recommended if auth exists)
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);
