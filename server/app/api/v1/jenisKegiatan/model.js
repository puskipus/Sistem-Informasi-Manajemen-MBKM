const mongoose = require("mongoose");

const jenisKegiatanSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "nama jenis kegiatan harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JenisKegiatan", jenisKegiatanSchema);
