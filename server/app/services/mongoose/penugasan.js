const Penugasan = require("../../api/v1/penugasan/model");
const { BadRequestError, NotFoundError } = require("../../errors");

const createPenugasan = async (req) => {
  const { judul, lampiran, petunjuk, tenggat } = req.body;

  const check = await Penugasan.findOne({ judul });
  if (check) throw new BadRequestError("penugasan sudah ada");

  const result = await Penugasan.create({
    judul,
    lampiran: req.file ? req.file.filename : null,
    petunjuk,
    tenggat,
  });

  return result;
};

const getAllPenugasan = async (req) => {
  const result = await Penugasan.find().select("judul tenggat");

  return result;
};

const updatePenugasan = async (req) => {
  const { id } = req.params;
  const { judul, lampiran, petunjuk, tenggat } = req.body;

  // cari Penugasan dengan field judul dan id selain dari yang dikirim dari params
  const check = await Penugasan.findOne({
    judul,
    _id: { $ne: id },
  });

  // apa bila check true / data Penugasan sudah ada maka kita tampilkan error bad request dengan message Penugasan duplikat
  if (check) throw new BadRequestError("Penugasan sudah ada");

  const result = await Penugasan.findOneAndUpdate(
    { _id: id },
    {
      judul,
      lampiran: req.file ? req.file.filename : lampiran,
      petunjuk,
      tenggat,
    },
    { new: true, runValidators: true }
  );

  // jika id result false / null maka akan menampilkan error `Tidak ada pembicara dengan id` yang dikirim client
  if (!result)
    throw new NotFoundError(`Tidak ada Penugasan dengan id :  ${id}`);

  return result;
};

const getOnePenugasan = async (req) => {
  const { id } = req.params;

  const result = await Penugasan.findOne({ _id: id });

  if (!result)
    throw new NotFoundError(`Tidak ada Penugasan dengan id :  ${id}`);

  return result;
};

const deletePenugasan = async (req) => {
  const { id } = req.params;

  const result = await Penugasan.findOne({
    _id: id,
  });

  if (!result)
    throw new NotFoundError(`Tidak ada Penugasan dengan id :  ${id}`);

  await result.deleteOne();

  return result;
};

module.exports = {
  createPenugasan,
  getAllPenugasan,
  updatePenugasan,
  getOnePenugasan,
  deletePenugasan,
};
