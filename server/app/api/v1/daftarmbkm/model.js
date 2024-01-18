const mongoose = require("mongoose");
const Status = require("../status/model");

const getStatus = async (nama) => {
  const status = await Status.findOne({ nama: nama });
  return status._id;
};

const mitraSchema = new mongoose.Schema({
  jenisKegiatan: {
    type: mongoose.Types.ObjectId,
    ref: "JenisKegiatan",
    required: [true, "jenis kegiatan harus diisi"],
  },
  namaMitra: {
    type: String,
    required: [true, "nama mitra harus diisi"],
  },
  posisi: {
    type: String,
    required: [true, "posisi harus diisi"],
  },
  link: {
    type: String,
    required: [true, "link web mbkm harus diisi"],
  },
  catatan: {
    type: String,
  },
  status: {
    type: mongoose.Types.ObjectId,
    ref: "Status",
  },
});

mitraSchema.pre("save", async function (next) {
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

const daftarMbkmSchema = new mongoose.Schema(
  {
    ipk: {
      type: Number,
      required: [true, "ipk harus diisi"],
    },
    sksLulus: {
      type: Number,
      required: [true, "sks lulus harus diisi"],
    },
    matkulWajib: {
      type: String,
    },
    mitra: {
      type: [mitraSchema],
    },
    idMahasiswa: {
      type: mongoose.Types.ObjectId,
      ref: "Mahasiswa",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DaftarMbkm", daftarMbkmSchema);
