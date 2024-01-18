const { StatusCodes } = require("http-status-codes");
const {
  signUpMahasiswa,
  signInMahasiswa,
  signInAdmin,
  getAllUser,
  detailAccount,
  updatePassword,
  updateDetail,
  deleteAkun,
  signUpAdmin,
  getDetailAccount,
} = require("../../../services/mongoose/auth");

class AuthController {
  async signUpMahasiswa(req, res, next) {
    try {
      const result = await signUpMahasiswa(req);

      res.status(StatusCodes.CREATED).json({
        authenticated: true,
        message: "Signup berhasil",
        role: "mahasiswa",
        nama: result.nama,
        token: result.token,
      });
    } catch (err) {
      next(err);
    }
  }

  async signInMahasiswa(req, res, next) {
    try {
      const result = await signInMahasiswa(req);

      res.status(StatusCodes.OK).json({
        authenticated: true,
        message: "Signup berhasil",
        role: "mahasiswa",
        nama: result.nama,
        token: result.token,
      });
    } catch (err) {
      next(err);
    }
  }

  async signInAdmin(req, res, next) {
    try {
      const { role } = req.body;

      if (!role) {
        res.status(StatusCodes.BAD_REQUEST).json({
          msg: "role wajib diisi",
        });
      }

      const result = await signInAdmin(role, req);
      res.status(StatusCodes.OK).json({
        authenticated: true,
        msg: "Signup berhasil",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async signUpAdmin(req, res, next) {
    try {
      const { role } = req.body;
      if (!role) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "role wajib diisi",
        });
      }

      const result = await signUpAdmin(role, req.body);

      res.status(StatusCodes.OK).json({
        message: "Signup berhasil",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllUser(req, res, next) {
    try {
      const result = await getAllUser(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getDetailAccount(req, res, next) {
    try {
      const result = await getDetailAccount(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updatePassword(req, res, next) {
    try {
      const result = await updatePassword(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateDetail(req, res, next) {
    try {
      const result = await updateDetail(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteAkun(req, res, next) {
    try {
      const result = await deleteAkun(req);

      res.status(StatusCodes.OK).json({
        message: "delete berhasil",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
