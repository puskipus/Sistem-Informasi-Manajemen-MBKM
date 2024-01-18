const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "nama status harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Status", statusSchema);
