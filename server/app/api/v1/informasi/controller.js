const { StatusCodes } = require("http-status-codes");
const {
  createInformasi,
  getAllInformasi,
  getOneInformasi,
  updateInformasi,
  deleteInformasi,
} = require("../../../services/mongoose/informasi");

class InformasiController {
  async createInformasi(req, res, next) {
    try {
      const result = await createInformasi(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllInformasi(req, res, next) {
    try {
      const result = await getAllInformasi(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getOneInformasi(req, res, next) {
    try {
      const result = await getOneInformasi(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateInformasi(req, res, next) {
    try {
      const result = await updateInformasi(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteInformasi(req, res, next) {
    try {
      const result = await deleteInformasi(req);
      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InformasiController();
