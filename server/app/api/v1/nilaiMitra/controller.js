const { StatusCodes } = require("http-status-codes");
const {
  createNilaiMitra,
  getAllNilaiMitraMahasiswa,
  getOneNilaiMitra,
  getAllNilaiMitra,
  updateNilaiMitra,
} = require("../../../services/mongoose/nilaiMitra");

class NilaiMitraController {
  async createNilaiMitra(req, res, next) {
    try {
      const result = await createNilaiMitra(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllNilaiMitraMahasiswa(req, res, next) {
    try {
      const result = await getAllNilaiMitraMahasiswa(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getOneNilaiMitra(req, res, next) {
    try {
      const result = await getOneNilaiMitra(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllNilaiMitra(req, res, next) {
    try {
      const result = await getAllNilaiMitra(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateNilaiMitra(req, res, next) {
    try {
      const result = await updateNilaiMitra(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NilaiMitraController();
