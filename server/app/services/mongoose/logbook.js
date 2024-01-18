const Logbook = require("../../api/v1/logbook/model");
const { NotFoundError } = require("../../errors");

const createLogbook = async (req) => {
  const {
    tanggal,
    jamMulaiKegiatan,
    jamAkhirKegiatan,
    pemaparanMahasiswa,
    // feedbackDosen,
  } = req.body;
  const { userId } = req.user;

  const result = await Logbook.create({
    idMahasiswa: userId,
    tanggal,
    jamMulaiKegiatan,
    jamAkhirKegiatan,
    pemaparanMahasiswa,
    // feedbackDosen,
    buktiKegiatan: req.file ? req.file.filename : null,
  });

  return result;
};

const getAllLogbook = async (req) => {
  const { userId } = req.user;

  const result = await Logbook.find({ idMahasiswa: userId });

  return result;
};

const getLogbookMahasiswa = async (req) => {
  const { id } = req.params;

  const result = await Logbook.find({ idMahasiswa: id });

  return result;
};

const deleteLogbook = async (req) => {
  const { id } = req.params;

  const result = await Logbook.findOneAndDelete({
    _id: id,
  });

  if (!result) throw new NotFoundError(`Tidak ada logbook dengan id :  ${id}`);

  return result;
};

const updateStatusLogbook = async (req) => {
  const { status, id } = req.body;

  const result = await Logbook.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: status,
      },
    }
  );

  if (!result) throw new NotFoundError(`Tidak ada logbook dengan id :  ${id}`);

  return result;
};

const updateFeedbackDosenLogbook = async (req) => {
  const { feedbackDosen, id } = req.body;

  const result = await Logbook.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        feedbackDosen: feedbackDosen,
      },
    }
  );

  if (!result) throw new NotFoundError(`Tidak ada logbook dengan id :  ${id}`);

  return result;
};

module.exports = {
  createLogbook,
  getAllLogbook,
  deleteLogbook,
  getLogbookMahasiswa,
  updateStatusLogbook,
  updateFeedbackDosenLogbook,
};
