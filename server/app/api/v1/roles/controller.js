const { StatusCodes } = require("http-status-codes");
const { getAll } = require("../../../services/mongoose/role");

class RoleController {
  async getAllRole(req, res, next) {
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

module.exports = new RoleController();
