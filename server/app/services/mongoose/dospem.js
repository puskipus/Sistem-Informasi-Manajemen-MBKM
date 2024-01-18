const DaftarUlang = require("../../api/v1/daftarulang/model");
const Dospem = require("../../api/v1/dospem/model");
const { BadRequestError, NotFoundError } = require("../../errors");

const getAllDospemByName = async (req) => {
  const { nama } = req.query;

  if (!nama) throw new BadRequestError("Nama tidak boleh kosong");

  let result = await Dospem.find({ nama: { $regex: nama, $options: "i" } })
    .populate({
      path: "prodi",
      select: "nama",
    })
    .select("nama");

  return result;
};

module.exports = {
  getAllDospemByName,
};
