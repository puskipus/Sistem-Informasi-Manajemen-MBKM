const mongoose = require("mongoose");

const formatDate = (date) => {
  if (date instanceof Date) {
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  }
  return null;
};

const logbookSchema = new mongoose.Schema(
  {
    idMahasiswa: {
      type: mongoose.Types.ObjectId,
      ref: "Mahasiswa",
    },
    tanggal: {
      type: Date,
      required: [true, "tanggal harus diisi"],
    },
    jamMulaiKegiatan: {
      type: String,
      required: [true, "Jam Mulai Kegiatan harus diisi"],
    },
    jamAkhirKegiatan: {
      type: String,
      required: [true, "Jam Akhir Kegiatan harus diisi"],
    },
    pemaparanMahasiswa: {
      type: String,
      required: [true, "Pemaparan Mahasiswa harus diisi"],
    },
    feedbackDosen: {
      type: String,
    },
    buktiKegiatan: {
      type: String,
      required: [true, "Bukti Kegiatan harus diisi"],
    },
    status: {
      type: String,
      default: "Diperiksa",
    },
  },
  { timestamps: true }
);

logbookSchema.pre("save", function (next) {
  // Format tanggal date
  if (this.tanggal) {
    this.tanggal = formatDate(this.tanggal);
  }

  next();
});

module.exports = mongoose.model("Logbook", logbookSchema);
