const Informasi = require("../../api/v1/informasi/model");
const { BadRequestError, NotFoundError } = require("../../errors");

const createInformasi = async (req) => {
  const { aktivitas, pelaksana, waktu } = req.body;

  const check = await Informasi.findOne({ aktivitas });
  if (check) throw new BadRequestError("aktivitas sudah ada");

  const result = await Informasi.create({
    aktivitas,
    pelaksana,
    waktu,
  });

  return result;
};

const getAllInformasi = async (req) => {
  const result = await Informasi.find();

  return result;
};

const updateInformasi = async (req) => {
  const { id } = req.params;
  const { aktivitas, pelaksana, waktu } = req.body;

  // cari informasi dengan field aktivitas dan id selain dari yang dikirim dari params
  const check = await Informasi.findOne({
    aktivitas,
    _id: { $ne: id },
  });

  // apa bila check true / data informasi sudah ada maka kita tampilkan error bad request dengan message informasi duplikat
  if (check) throw new BadRequestError("informasi sudah ada");

  const result = await Informasi.findOneAndUpdate({ _id: id }, { aktivitas, pelaksana, waktu }, { new: true, runValidators: true });

  // jika id result false / null maka akan menampilkan error `Tidak ada pembicara dengan id` yang dikirim client
  if (!result) throw new NotFoundError(`Tidak ada informasi dengan id :  ${id}`);

  return result;
};

const getOneInformasi = async (req) => {
  const { id } = req.params;

  const result = await Informasi.findOne({ _id: id }).select("_id aktivitas pelaksana waktu");

  if (!result) throw new NotFoundError(`Tidak ada informasi dengan id :  ${id}`);

  return result;
};

const deleteInformasi = async (req) => {
  const { id } = req.params;

  const result = await Informasi.findOne({
    _id: id,
  });

  if (!result) throw new NotFoundError(`Tidak ada informasi dengan id :  ${id}`);

  await result.deleteOne();

  return result;
};

module.exports = {
  createInformasi,
  getAllInformasi,
  updateInformasi,
  getOneInformasi,
  deleteInformasi,
};
