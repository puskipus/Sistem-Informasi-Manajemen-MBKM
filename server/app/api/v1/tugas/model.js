const mongoose = require("mongoose");

const tugasSchema = new mongoose.Schema(
  {
    idMahasiswa: {
      type: mongoose.Types.ObjectId,
      ref: "Mahasiswa",
      required: [true, "idMahasiswa harus diisi"],
    },
    idPenugasan: {
      type: mongoose.Types.ObjectId,
      ref: "Penugasan",
      required: [true, "idPenugasan harus diisi"],
    },
    file: {
      type: String,
      required: [true, "file harus diisi"],
    },
    nilai: {
      type: Number,
      default: 0,
      validate: {
        validator: function (v) {
          return v.length >= 0 && v.length <= 100;
        },
        message: (props) => `Masukkan nilai antara 0-100`,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tugas", tugasSchema);
