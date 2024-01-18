const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const unitmbkmSchema = new mongoose.Schema(
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
    role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
      required: [true, "role harus diisi"],
    },
  },
  { timestamps: true }
);

unitmbkmSchema.pre("save", async function (next) {
  const User = this;
  if (User.isModified("password")) {
    User.password = await bcrypt.hash(User.password, 12);
  }
  next();
});

unitmbkmSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Unitmbkm", unitmbkmSchema);
