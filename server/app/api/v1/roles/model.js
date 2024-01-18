const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "nama role harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
