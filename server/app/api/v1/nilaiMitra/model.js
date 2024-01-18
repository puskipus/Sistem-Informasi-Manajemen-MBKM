const mongoose = require("mongoose");

const nilaiMitraSchema = new mongoose.Schema(
  {
    namaMitra: {
      type: String,
      required: [true, "nama mitra harus diisi"],
    },
    posisi: {
      type: String,
      required: [true, "posisi harus diisi"],
    },
    buktiNilai: {
      type: String,
    },
    status: {
      type: String,
      default: "Diperiksa",
    },
    catatan: {
      type: String,
    },
    idMahasiswa: {
      type: mongoose.Types.ObjectId,
      ref: "Mahasiswa",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NilaiMitra", nilaiMitraSchema);
