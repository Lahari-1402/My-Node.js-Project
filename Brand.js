const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  brand_name: {
    type: String,
    required: true
  },
  founder_name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  monthly_revenue: {
    type: Number,
    min: 0,
    default: 0
  },
  website: String,

  status: {
    type: String,
    enum: ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED"],
    default: "SUBMITTED"
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Brand", brandSchema);