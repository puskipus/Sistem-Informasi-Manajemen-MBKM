const mongoose = require("mongoose");

const informasiSchema = new mongoose.Schema(
  {
    aktivitas: {
      type: String,
      required: [true, "aktivitas harus diisi"],
    },
    pelaksana: {
      type: String,
    },
    waktu: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Informasi", informasiSchema);
