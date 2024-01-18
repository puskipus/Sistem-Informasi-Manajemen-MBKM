const Tugas = require("../../api/v1/tugas/model");
const { BadRequestError, NotFoundError } = require("../../errors");

const createTugas = async (req) => {
  const { idPenugasan, lampiran } = req.body;

  if (!idPenugasan) throw new BadRequestError("idPenugasan harus diisi");
  if (!req.file) throw new BadRequestError("file harus diisi");

  const result = await Tugas.findOneAndUpdate(
    { idMahasiswa: req.user.userId, idPenugasan: idPenugasan },
    {
      idMahasiswa: req.user.userId,
      idPenugasan: idPenugasan,
      file: req.file ? req.file.filename : null,
      nilai: 0,
    },
    {
      new: true,
      upsert: true,
    }
  );

  return result;
};

const getOneTugas = async (req) => {
  const { id } = req.params;

  const result = await Tugas.findOne({
    idMahasiswa: req.user.userId,
    idPenugasan: id,
  }).select("file updatedAt nilai");

  if (!result) throw new NotFoundError(`Tidak ada tugas dengan id :  ${id}`);

  return result;
};

const getTugasMahasiswaBimbingan = async (req) => {
  const { id } = req.params;

  let result = await Tugas.find({
    idPenugasan: id,
  })
    .populate({
      path: "idMahasiswa",
      select: "nama nim",
      match: {
        dospem: req.user.userId,
      },
    })
    .select("file updatedAt nilai");

  if (!result) throw new NotFoundError(`Tidak ada tugas dengan id :  ${id}`);

  result = result.filter((item) => item.idMahasiswa !== null);

  return result;
};

const getAllTugas = async (req) => {
  const result = await Tugas.find()
    .populate({ path: "idPenugasan", select: "judul" })
    .populate({ path: "idMahasiswa", select: "nama nim" })
    .select("nilai");
  return result;
};

const updateNilai = async (req) => {
  const { id, nilai } = req.body;

  if (!id) throw new BadRequestError(`id tidak boleh kosong`);
  if (isNaN(nilai)) throw new BadRequestError(`nilai tidak boleh kosong`);

  const result = await Tugas.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        nilai: nilai,
      },
    }
  );

  if (!result) throw new NotFoundError(`Tidak ada tugas dengan id :  ${id}`);

  return "berhasil update nilai";
};

module.exports = {
  createTugas,
  getOneTugas,
  getTugasMahasiswaBimbingan,
  updateNilai,
  getAllTugas,
};
