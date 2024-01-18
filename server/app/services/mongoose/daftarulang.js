const DaftarUlang = require("../../api/v1/daftarulang/model");
const { BadRequestError, NotFoundError } = require("../../errors");

const createDaftarUlang = async (req) => {
  const {
    jenisKegiatan,
    jenisPelaksanaan,
    namaMitra,
    posisi,
    silabus,
    mulaiKegiatan,
    akhirKegiatan,
  } = req.body;
  const { userId } = req.user;

  const result = await DaftarUlang.create({
    jenisKegiatan,
    jenisPelaksanaan,
    namaMitra,
    posisi,
    silabus: req.file ? req.file.filename : null,
    mulaiKegiatan,
    akhirKegiatan,
    idMahasiswa: userId,
  });

  return result;
};

const getAllDaftarUlangMahasiswa = async (req) => {
  const { userId } = req.user;

  const result = await DaftarUlang.find({ idMahasiswa: userId })
    .populate({ path: "status", select: "nama" })
    .select("namaMitra posisi createdAt");
  return result;
};

const getOneDaftarUlang = async (req) => {
  const { id } = req.params;

  const result = await DaftarUlang.findOne({ _id: id })
    .populate({ path: "jenisKegiatan", select: "nama" })
    .populate({ path: "jenisPelaksanaan", select: "nama" })
    .populate({
      path: "idMahasiswa",
      select: "nama email nim semester noHP",
      populate: {
        path: "prodi",
        select: "nama",
      },
    })
    .populate({ path: "status", select: "nama" });
  if (!result)
    throw new NotFoundError(`Tidak ada daftar ulang dengan id :  ${id}`);

  return result;
};

const getAllDaftarUlang = async (req) => {
  const { nama = "", email = "", prodi, limit = 10, page = 1 } = req.query;

  let result = await DaftarUlang.find()
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
    .sort("-updatedAt");

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

const updateDaftarUlang = async (req) => {
  const { id } = req.params;
  const { status, catatan } = req.body;

  // cari Penugasan dengan field judul dan id selain dari yang dikirim dari params
  const check = await DaftarUlang.findOne({
    _id: { $ne: id },
  });

  // apa bila check true / data Penugasan sudah ada maka kita tampilkan error bad request dengan message Penugasan duplikat
  if (!check) throw new BadRequestError("Pengajuan pendataan tidak ada");

  const result = await DaftarUlang.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: status,
        catatan: catatan,
      },
    }
  );

  if (!result)
    throw new NotFoundError(`Tidak ada daftar ulang dengan id :  ${id}`);

  return result;
};

const getTotalDiterima = async (req) => {
  let result = await DaftarUlang.find()
    .populate({
      path: "idMahasiswa",
      select: "nama email",
      populate: {
        path: "prodi",
        select: "nama",
      },
    })
    .populate({
      path: "jenisKegiatan",
      select: "nama",
    })
    .populate({
      path: "status",
      match: {
        $or: [
          {
            nama: "Diterima 20 SKS",
          },
          {
            nama: "Diterima kurang 20 SKS",
          },
        ],
      },
    });

  result = result.filter((item) => item.status !== null);

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
    switch (item.jenisKegiatan.nama) {
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

const getAllDaftarUlangConvert = async (req) => {
  const result = await DaftarUlang.find()
    .populate({ path: "status", select: "nama" })
    .populate({ path: "jenisKegiatan", select: "nama" })
    .populate({ path: "jenisPelaksanaan", select: "nama" })
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

module.exports = {
  createDaftarUlang,
  getAllDaftarUlangMahasiswa,
  getOneDaftarUlang,
  getAllDaftarUlang,
  updateDaftarUlang,
  getTotalDiterima,
  getAllDaftarUlangConvert,
};
