const mongoose = require("mongoose");

const jenisPelaksanaanSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "nama jenis pelaksanaan harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JenisPelaksanaan", jenisPelaksanaanSchema);
