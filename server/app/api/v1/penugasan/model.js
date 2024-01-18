const mongoose = require("mongoose");

const penugasanSchema = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: [true, "judul tugas harus diisi"],
    },
    petunjuk: {
      type: String,
    },
    lampiran: {
      type: String,
    },
    tenggat: {
      type: Date,
    },
  },
  { timestamps: true }
);

penugasanSchema.pre("save", function (next) {
  // Convert tenggat date to Indonesian time and format as dd-mm-yyyy
  if (this.tenggat) {
    const date = new Date(this.tenggat);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
    this.tenggat = formattedDate;
  }
  next();
});

module.exports = mongoose.model("Penugasan", penugasanSchema);
