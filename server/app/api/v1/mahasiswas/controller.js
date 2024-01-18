const { StatusCodes } = require("http-status-codes");
const {
  getAllDaftarUlangDisetujui,
  updateDospem,
  getDospemMahasiswa,
  getMahasiswaBimbingan,
} = require("../../../services/mongoose/mahasiswa");

class MahasiswaController {
  async getAllDaftarUlangDisetujui(req, res, next) {
    try {
      const result = await getAllDaftarUlangDisetujui(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getDospemMahasiswa(req, res, next) {
    try {
      const result = await getDospemMahasiswa(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMahasiswaBimbingan(req, res, next) {
    try {
      const result = await getMahasiswaBimbingan(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateDospem(req, res, next) {
    try {
      const result = await updateDospem(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MahasiswaController();
