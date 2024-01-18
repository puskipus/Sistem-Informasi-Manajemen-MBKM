const NilaiMitra = require("../../api/v1/nilaiMitra/model");
const { BadRequestError, NotFoundError } = require("../../errors");

const createNilaiMitra = async (req) => {
  const { namaMitra, posisi, buktiNilai } = req.body;
  const { userId } = req.user;

  const result = await NilaiMitra.create({
    namaMitra,
    posisi,
    buktiNilai: req.file ? req.file.filename : null,
    idMahasiswa: userId,
  });

  return result;
};

const getAllNilaiMitraMahasiswa = async (req) => {
  const { userId } = req.user;

  const result = await NilaiMitra.find({ idMahasiswa: userId })
    .populate({ path: "status", select: "nama" })
    .select("namaMitra posisi createdAt");
  return result;
};

const getOneNilaiMitra = async (req) => {
  const { id } = req.params;

  const result = await NilaiMitra.findOne({ _id: id }).populate({
    path: "idMahasiswa",
    select: "nama email nim semester noHP",
    populate: {
      path: "prodi",
      select: "nama",
    },
  });
  if (!result)
    throw new NotFoundError(`Tidak ada nilai mitra dengan id :  ${id}`);

  return result;
};

const getAllNilaiMitra = async (req) => {
  const { nama = "", email = "", prodi, limit = 10, page = 1 } = req.query;

  let result = await NilaiMitra.find()
    .populate({
      path: "idMahasiswa",
      select: "nama email",
      match: {
        nama: { $regex: nama, $options: "i" },
        email: { $regex: email, $options: "i" },
      },
      populate: {
        path: "prodi",
        select: "nama",
        match: {
          _id: prodi,
        },
      },
    })
    .select("createdAt")
    .sort("-updatedAt");

  result = result.filter((item) => item.idMahasiswa !== null);
  result = result.filter((item) => item.idMahasiswa.prodi !== null);

  const total = result.length;
  const paginatedData = result.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(result.length / limit);

  return {
    result: paginatedData,
    pages: totalPages,
    total: total,
  };
};

const updateNilaiMitra = async (req) => {
  const { id } = req.params;
  const { status, catatan } = req.body;

  const result = await NilaiMitra.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: status,
        catatan: catatan,
      },
    }
  );

  if (!result)
    throw new NotFoundError(`Tidak ada nilai mitra dengan id :  ${id}`);

  return result;
};

module.exports = {
  createNilaiMitra,
  getAllNilaiMitraMahasiswa,
  getOneNilaiMitra,
  getAllNilaiMitra,
  updateNilaiMitra,
};
