const { StatusCodes } = require("http-status-codes");
const { getAll } = require("../../../services/mongoose/jenisPelaksanaan");

class JenisPelaksanaanController {
  async getAll(req, res, next) {
    try {
      const result = await getAll(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new JenisPelaksanaanController();
