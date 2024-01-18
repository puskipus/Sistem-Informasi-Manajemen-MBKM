const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const mahasiswaSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "nama harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email harus diisi"],
    },
    password: {
      type: String,
      required: [true, "password harus diisi"],
      minlength: [6, "panjang password minimal 6"],
    },
    nim: {
      type: String,
      required: [true, "nim harus diisi"],
      validate: {
        validator: function (v) {
          return v.length === 15;
        },
        message: (props) => `masukkan format nim dengan benar`,
      },
    },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
      required: [true, "role harus diisi"],
    },
    prodi: {
      type: mongoose.Types.ObjectId,
      ref: "Prodi",
      required: [true, "prodi harus diisi"],
    },
    noHP: {
      type: String,
      required: [true, "No HP harus diisi"],
      validate: {
        validator: function (v) {
          return v.length >= 10 && v.length <= 15;
        },
        message: (props) => `Masukkan format nomor handphone dengan benar`,
      },
    },
    semester: {
      type: String,
      required: [true, "semester harus diisi"],
    },
    dospem: {
      type: mongoose.Types.ObjectId,
      ref: "Dospem",
    },
  },
  { timestamps: true }
);

mahasiswaSchema.pre("save", async function (next) {
  const User = this;
  if (User.isModified("password")) {
    User.password = await bcrypt.hash(User.password, 12);
  }
  next();
});

mahasiswaSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Mahasiswa", mahasiswaSchema);
