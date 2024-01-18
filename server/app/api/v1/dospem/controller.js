const { StatusCodes } = require("http-status-codes");
const { getAllDospemByName } = require("../../../services/mongoose/dospem");

class DospemController {
  async getAllDospemByName(req, res, next) {
    try {
      const result = await getAllDospemByName(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DospemController();
