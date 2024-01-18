const mongoose = require("mongoose");
const Status = require("../status/model");

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

const getStatus = async (nama) => {
  const status = await Status.findOne({ nama: nama });
  return status._id;
};

const daftarUlangSchema = new mongoose.Schema(
  {
    jenisKegiatan: {
      type: mongoose.Types.ObjectId,
      ref: "JenisKegiatan",
      required: [true, "jenis kegiatan harus diisi"],
    },
    jenisPelaksanaan: {
      type: mongoose.Types.ObjectId,
      ref: "JenisPelaksanaan",
      required: [true, "jenis pelaksanaan harus diisi"],
    },
    namaMitra: {
      type: String,
      required: [true, "nama mitra harus diisi"],
    },
    posisi: {
      type: String,
      required: [true, "posisi harus diisi"],
    },
    mulaiKegiatan: {
      type: Date,
      required: [true, "mulai kegiatan harus diisi"],
    },
    akhirKegiatan: {
      type: Date,
      required: [true, "akhir kegiatan harus diisi"],
    },
    silabus: {
      type: String,
    },
    status: {
      type: mongoose.Types.ObjectId,
      ref: "Status",
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

daftarUlangSchema.pre("save", function (next) {
  // Format mulaiKegiatan date
  if (this.mulaiKegiatan) {
    this.mulaiKegiatan = formatDate(this.mulaiKegiatan);
  }

  // Format akhirKegiatan date
  if (this.akhirKegiatan) {
    this.akhirKegiatan = formatDate(this.akhirKegiatan);
  }

  next();
});

daftarUlangSchema.pre("save", async function (next) {
  if (!this.status) {
    try {
      const defaultStatusId = await getStatus("Diproses");
      this.status = defaultStatusId;
    } catch (error) {
      // Handle error fetching default status
      console.error("Error fetching default status:", error);
    }
  }
  next();
});

module.exports = mongoose.model("DaftarUlang", daftarUlangSchema);
