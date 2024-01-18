const { StatusCodes } = require("http-status-codes");
const { getAll } = require("../../../services/mongoose/jenisKegiatan");

class JenisKegiatanController {
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

module.exports = new JenisKegiatanController();
