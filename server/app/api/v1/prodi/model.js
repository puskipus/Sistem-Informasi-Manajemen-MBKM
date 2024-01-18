const mongoose = require("mongoose");

const prodiSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "nama prodi harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prodi", prodiSchema);
