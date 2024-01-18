const DaftarMbkm = require("../../api/v1/daftarmbkm/model");
const { BadRequestError, NotFoundError } = require("../../errors");

const createDaftarMbkm = async (req) => {
  const { ipk, sksLulus, mitra, matkulWajib } = req.body;
  const { userId } = req.user;

  const result = await DaftarMbkm.create({
    ipk,
    sksLulus,
    mitra,
    matkulWajib,
    idMahasiswa: userId,
  });

  return result;
};

const getAllDaftarMbkmMahasiswa = async (req) => {
  const { userId } = req.user;

  const result = await DaftarMbkm.find({ idMahasiswa: userId }).select(
    "createdAt"
  );
  return result;
};

const getAllDaftar = async (req) => {
  const { nama = "", email = "", prodi, limit = 10, page = 1 } = req.query;

  let result = await DaftarMbkm.find()
    .populate({
      path: "idMahasiswa",
      select: "nama email",
      match: {
        nama: { $regex: nama, $options: "i" },
        email: { $regex: email, $options: "i" },
      },
      populate: {
        path: "prodi",
        select: "nama",
        match: {
          _id: prodi,
        },
      },
    })
    .select("createdAt")
    .sort("-createdAt");

  result = result.filter((item) => item.idMahasiswa !== null);
  result = result.filter((item) => item.idMahasiswa.prodi !== null);

  const total = result.length;
  const paginatedData = result.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(result.length / limit);

  return {
    result: paginatedData,
    pages: totalPages,
    total: total,
  };
};

const getTotalPendaftar = async (req) => {
  let result = await DaftarMbkm.find()
    .populate({
      path: "idMahasiswa",
      select: "nama email",
      populate: {
        path: "prodi",
        select: "nama",
      },
    })
    .populate({
      path: "mitra.jenisKegiatan",
      select: "nama",
    });

  const uniqueNames = new Set();

  result.forEach((item) => {
    uniqueNames.add(item.idMahasiswa.nama);
  });

  const tifCount = new Set();
  const tekomCount = new Set();
  const siCount = new Set();
  const tiCount = new Set();
  const ptiCount = new Set();

  result.forEach((item) => {
    switch (item.idMahasiswa.prodi.nama) {
      case "Teknik Informatika":
        tifCount.add(item.idMahasiswa.nama);
        break;
      case "Teknik Komputer":
        tekomCount.add(item.idMahasiswa.nama);
        break;
      case "Sistem Informasi":
        siCount.add(item.idMahasiswa.nama);
        break;
      case "Teknologi Informasi":
        tiCount.add(item.idMahasiswa.nama);
        break;
      case "Pendidikan Teknologi Informasi":
        ptiCount.add(item.idMahasiswa.nama);
        break;
      default:
        break;
    }
  });

  const dsi = siCount.size + tiCount.size + ptiCount.size;
  const dtif = tifCount.size + tekomCount.size;

  let bangkit = 0,
    stupen = 0,
    magang = 0,
    mitraFilkom = 0;

  result.forEach((item) => {
    item.mitra.forEach((mitra) => {
      switch (mitra.jenisKegiatan.nama) {
        case "Bangkit Academy":
          bangkit++;
          break;
        case "Studi Independen":
          stupen++;
          break;
        case "Magang Merdeka":
          magang++;
          break;
        case "Magang Mitra FILKOM":
          mitraFilkom++;
          break;
        default:
          break;
      }
    });
  });

  return {
    totalPendaftar: uniqueNames.size,
    tif: tifCount.size,
    tekom: tekomCount.size,
    si: siCount.size,
    ti: tiCount.size,
    pti: ptiCount.size,
    dsi: dsi,
    dtif: dtif,
    bangkit: bangkit,
    stupen: stupen,
    magang: magang,
    mitraFilkom: mitraFilkom,
  };
};

const getAllDaftarMbkmConvert = async (req) => {
  const result = await DaftarMbkm.find()
    .populate({ path: "mitra.status", select: "nama" })
    .populate({ path: "mitra.jenisKegiatan", select: "nama" })
    .populate({
      path: "idMahasiswa",
      select: "nama email nim semester noHP",
      populate: {
        path: "prodi",
        select: "nama",
      },
    });
  return result;
};

const getOneDaftarMbkm = async (req) => {
  const { id } = req.params;

  const result = await DaftarMbkm.findOne({ _id: id })
    .populate({
      path: "idMahasiswa",
      select: "nama email nim semester noHP",
      populate: {
        path: "prodi",
        select: "nama",
      },
    })
    .populate({ path: "mitra.status", select: "nama" })
    .populate({ path: "mitra.jenisKegiatan", select: "nama" });
  if (!result)
    throw new NotFoundError(`Tidak ada daftar mbkm dengan id :  ${id}`);

  return result;
};

const updateDaftarMbkm = async (req) => {
  const { id } = req.params;
  const { updateStatus } = req.body;

  const check = await DaftarMbkm.findOne({
    _id: { $ne: id },
  });

  if (!check) throw new BadRequestError("Pengajuan persetujuan tidak ada");

  for (const item of updateStatus) {
    try {
      const result = await DaftarMbkm.findOneAndUpdate(
        { _id: id, "mitra._id": item.id },
        {
          $set: {
            "mitra.$.status": item.status,
            "mitra.$.catatan": item.catatan,
          },
        }
      );
      if (!result) {
        throw new Error(`Update failed for item with ID: ${item.id}`);
      }
    } catch (error) {
      console.error(`Error updating item with ID ${item.id}:`, error);
      throw error;
    }
  }

  return "berhasil update";
};

module.exports = {
  createDaftarMbkm,
  getAllDaftarMbkmMahasiswa,
  getAllDaftar,
  getOneDaftarMbkm,
  updateDaftarMbkm,
  getTotalPendaftar,
  getAllDaftarMbkmConvert,
};
