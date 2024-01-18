const Mahasiswa = require("../../api/v1/mahasiswas/model");
const Role = require("../../api/v1/roles/model");
const Unitmbkm = require("../../api/v1/unitmbkm/model");
const Kaprodi = require("../../api/v1/kaprodi/model");
const Dospem = require("../../api/v1/dospem/model");
const Prodi = require("../../api/v1/prodi/model");
const {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} = require("../../errors");
const { createJWT, createTokenMahasiswa } = require("../../utils");
const { createTokenAdmin } = require("../../utils/createToken");

const signUpMahasiswa = async (req) => {
  const { nama, email, password, prodi, nim, noHP, semester } = req.body;

  const role = await Role.findOne({ nama: "mahasiswa" });

  const result = await Mahasiswa.create({
    nama,
    email,
    password,
    nim,
    role: role._id,
    prodi,
    noHP,
    semester,
  });

  const token = createJWT({ payload: createTokenMahasiswa(result, role.nama) });
  return { token, role: "mahasiswa", nama: result.nama };
};

const signInMahasiswa = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Masukkan email dan password");
  }

  const result = await Mahasiswa.findOne({ email: email }).populate({
    path: "role",
    select: "nama",
  });

  if (!result) {
    throw new UnauthorizedError("email atau password salah");
  }

  const isPasswordCorrect = await result.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("email atau password salah");
  }
  const token = createJWT({
    payload: createTokenMahasiswa(result, result.role.nama),
  });

  return { token, role: "mahasiswa", nama: result.nama };
};

const signInAdmin = async (role, req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Masukkan email dan password");
  }

  let result, token;
  switch (role) {
    case "unitmbkm":
      result = await Unitmbkm.findOne({ email });
      break;
    case "kaprodi":
      result = await Kaprodi.findOne({ email });
      break;
    case "dospem":
      result = await Dospem.findOne({ email });
      break;
    default:
      throw new BadRequestError("Role tidak valid");
  }

  if (!result) {
    throw new UnauthorizedError("Email atau password salah");
  }

  const isPasswordCorrect = await result.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Email atau password salah");
  }

  switch (role) {
    case "unitmbkm":
      token = createJWT({ payload: createTokenAdmin(result, role) });
      break;
    case "kaprodi":
      token = createJWT({ payload: createTokenAdmin(result, role) });
      break;
    case "dospem":
      token = createJWT({ payload: createTokenAdmin(result, role) });
      break;
  }

  return { token, role, nama: result.nama };
};

const signUpAdmin = async (role, userData) => {
  const roleName = role.toLowerCase();
  const roleDocument = await Role.findOne({ nama: roleName });

  if (!roleDocument) {
    throw new Error("Invalid role provided");
  }

  let result;
  switch (roleName) {
    case "unitmbkm":
      result = await Unitmbkm.create({ ...userData, role: roleDocument._id });
      break;
    case "kaprodi":
      result = await Kaprodi.create({ ...userData, role: roleDocument._id });
      break;
    case "dospem":
      result = await Dospem.create({ ...userData, role: roleDocument._id });
      break;
    default:
      throw new Error("Invalid role provided");
  }

  const token = createJWT({ payload: createTokenAdmin(result, roleName) });
  return { token, role: roleName, nama: result.nama };
};

const getAllUser = async (req) => {
  const { role, nama, email, prodi, limit = 10, page = 1 } = req.query;
  let condition = {};

  if (role) {
    condition = { ...condition, role: role };
  }

  if (nama) {
    condition = { ...condition, nama: { $regex: nama, $options: "i" } };
  }

  if (email) {
    condition = { ...condition, email: { $regex: email, $options: "i" } };
  }

  if (prodi) {
    condition = { ...condition, prodi: prodi };
  }

  const dospem = await Dospem.find(condition)
    .select("-password")
    .populate({ path: "role", select: "nama" })
    .populate({
      path: "prodi",
      select: "nama",
    });

  const unitmbkm = await Unitmbkm.find(condition)
    .select("-password")
    .populate({ path: "role", select: "nama" });

  const kaprodi = await Kaprodi.find(condition)
    .select("-password")
    .populate({ path: "role", select: "nama" })
    .populate({
      path: "prodi",
      select: "nama",
    });

  const mahasiswa = await Mahasiswa.find(condition)
    .select("-password")
    .populate({ path: "role", select: "nama" })
    .populate({
      path: "prodi",
      select: "nama",
    });

  const countDospem = await Dospem.countDocuments(condition);
  const countUnitmbkm = await Unitmbkm.countDocuments(condition);
  const countKaprodi = await Kaprodi.countDocuments(condition);
  const countMahasiswa = await Mahasiswa.countDocuments(condition);
  const total = countDospem + countUnitmbkm + countKaprodi + countMahasiswa;

  const mergedResults = [...dospem, ...unitmbkm, ...kaprodi, ...mahasiswa];
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = mergedResults.slice(startIndex, endIndex);

  return { result: paginatedResults, pages: Math.ceil(total / limit), total };
};

const getDetailAccount = async (req) => {
  const { role, userId } = req.user;

  let result;
  switch (role) {
    case "unitmbkm":
      result = await Unitmbkm.findOne({ _id: userId }).select(
        "-password -role"
      );
      break;
    case "kaprodi":
      result = await Kaprodi.findOne({ _id: userId })
        .select("-password -role")
        .populate({
          path: "prodi",
          select: "nama",
        });
      break;
    case "dospem":
      result = await Dospem.findOne({ _id: userId })
        .select("-password -role")
        .populate({
          path: "prodi",
          select: "nama",
        });
      break;
    case "mahasiswa":
      result = await Mahasiswa.findOne({ _id: userId })
        .select("-password -role")
        .populate({
          path: "prodi",
          select: "nama",
        });
      break;
    default:
      throw new BadRequestError("Role tidak valid");
  }

  if (!result) {
    throw new UnauthorizedError("Data akun tidak ada");
  }

  return result;
};

const updatePassword = async (req) => {
  const { role, userId } = req.user;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Masukkan password lama dan password baru");
  }

  let result;
  switch (role) {
    case "unitmbkm":
      result = await Unitmbkm.findOne({ _id: userId });
      break;
    case "kaprodi":
      result = await Kaprodi.findOne({ _id: userId });
      break;
    case "dospem":
      result = await Dospem.findOne({ _id: userId });
      break;
    case "mahasiswa":
      result = await Mahasiswa.findOne({ _id: userId });
      break;
    default:
      throw new BadRequestError("Role tidak valid");
  }

  if (!result) {
    throw new UnauthorizedError("akun tidak ada");
  }

  const isPasswordCorrect = await result.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("password lama salah");
  }

  if (isPasswordCorrect) {
    if (newPassword.length < 6) {
      throw new BadRequestError("Panjang password minimal 6 karakter");
    }

    result.password = newPassword;

    await result.save();
  }

  console.log(result);

  return result;
};

const updateDetail = async (req) => {
  const { role, userId } = req.user;
  let { nama, nim, nip, semester, prodi, noHP } = req.body;
  console.log(prodi);

  if (prodi) {
    prodi = await Prodi.findOne({ nama: prodi });
  }

  console.log(prodi);

  let result;
  switch (role) {
    case "unitmbkm":
      result = await Unitmbkm.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            nama: nama,
          },
        }
      );
      break;
    case "kaprodi":
      result = await Kaprodi.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            nama: nama,
            prodi: prodi._id,
            nip: nip,
          },
        }
      );
      break;
    case "dospem":
      result = await Dospem.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            nama: nama,
            prodi: prodi._id,
            nip: nip,
          },
        }
      );
      break;
    case "mahasiswa":
      result = await Mahasiswa.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            nama: nama,
            semester: semester,
            prodi: prodi._id,
            nim: nim,
            noHP: noHP,
          },
        }
      );
      break;
    default:
      throw new BadRequestError("Role tidak valid");
  }

  if (!result) {
    throw new UnauthorizedError("akun tidak ada");
  }

  return result;
};

const deleteAkun = async (req) => {
  const { role, id } = req.params;
  const roleName = role.toLowerCase();
  const roleDocument = await Role.findOne({ nama: roleName });

  if (!roleDocument) {
    throw new Error("Invalid role provided");
  }

  let result;
  switch (roleName) {
    case "unitmbkm":
      result = await Unitmbkm.findOne({
        _id: id,
      });
      break;
    case "kaprodi":
      result = await Kaprodi.findOne({
        _id: id,
      });
      break;
    case "dospem":
      result = await Dospem.findOne({
        _id: id,
      });
      break;
    case "mahasiswa":
      result = await Mahasiswa.findOne({
        _id: id,
      });
      break;
    default:
      throw new Error("Invalid role provided");
  }

  if (!result) throw new NotFoundError(`Tidak ada akun dengan id :  ${id}`);

  await result.deleteOne();

  return { result };
};

module.exports = {
  signUpMahasiswa,
  signInMahasiswa,
  signUpAdmin,
  signInAdmin,
  getAllUser,
  deleteAkun,
  getDetailAccount,
  updatePassword,
  updateDetail,
};
