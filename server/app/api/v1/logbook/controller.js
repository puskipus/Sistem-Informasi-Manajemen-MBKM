const { StatusCodes } = require("http-status-codes");
const {
  createLogbook,
  getAllLogbook,
  deleteLogbook,
  getLogbookMahasiswa,
  updateStatusLogbook,
  updateFeedbackDosenLogbook,
} = require("../../../services/mongoose/logbook");

class LogbookController {
  async createLogbook(req, res, next) {
    try {
      const result = await createLogbook(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllLogbook(req, res, next) {
    try {
      const result = await getAllLogbook(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getLogbookMahasiswa(req, res, next) {
    try {
      const result = await getLogbookMahasiswa(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteLogbook(req, res, next) {
    try {
      const result = await deleteLogbook(req);
      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateStatusLogbook(req, res, next) {
    try {
      const result = await updateStatusLogbook(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateFeedbackDosenLogbook(req, res, next) {
    try {
      const result = await updateFeedbackDosenLogbook(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new LogbookController();
