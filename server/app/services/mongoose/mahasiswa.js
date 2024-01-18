const DaftarUlang = require("../../api/v1/daftarulang/model");
const Mahasiswa = require("../../api/v1/mahasiswas/model");
const Status = require("../../api/v1/status/model");
const { NotFoundError } = require("../../errors");
//   const { nama = "", email = "", prodi, limit = 10, page = 1 } = req.query;

//   let result = await DaftarUlang.find()
//     .populate({
//       path: "idMahasiswa",
//       select: "nama email",
//       match: {
//         nama: { $regex: nama, $options: "i" },
//         email: { $regex: email, $options: "i" },
//       },
//       populate: [
//         {
//           path: "prodi",
//           select: "nama",
//           match: {
//             _id: prodi,
//           },
//         },
//         {
//           path: "dospem",
//           select: "nama",
//         },
//       ],
//     })
//     .populate({
//       path: "status",
//       match: {
//         $or: [
//           {
//             nama: "Diterima 20 SKS",
//           },
//           {
//             nama: "Diterima kurang 20 SKS",
//           },
//         ],
//       },
//     })
//     .select("updatedAt")
//     .sort("-updatedAt")
//     .limit(limit)
//     .skip(limit * (page - 1));

//   result = result.filter((item) => item.idMahasiswa !== null);
//   result = result.filter((item) => item.idMahasiswa.prodi !== null);
//   result = result.filter((item) => item.status !== null);

//   return result;
// };

const getAllDaftarUlangDisetujui = async (req) => {
  const { nama = "", email = "", prodi, limit = 10, page = 1 } = req.query;

  let result = await DaftarUlang.find()
    .populate({
      path: "idMahasiswa",
      select: "nama email",
      match: {
        nama: { $regex: nama, $options: "i" },
        email: { $regex: email, $options: "i" },
      },
      populate: [
        {
          path: "prodi",
          select: "nama",
          match: {
            _id: prodi,
          },
        },
        {
          path: "dospem",
          select: "nama",
        },
      ],
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
    })
    .select("updatedAt")
    .sort("-updatedAt");

  result = result.filter((item) => item.idMahasiswa !== null);
  result = result.filter((item) => item.idMahasiswa.prodi !== null);
  result = result.filter((item) => item.status !== null);

  const total = result.length;
  const paginatedData = result.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(result.length / limit);

  return {
    result: paginatedData,
    pages: totalPages,
    total: total,
  };
};

const updateDospem = async (req) => {
  const { idDospem, idMahasiswa } = req.body;

  const result = await Mahasiswa.findOneAndUpdate(
    { _id: idMahasiswa },
    {
      $set: {
        dospem: idDospem,
      },
    }
  );

  if (!result)
    throw new NotFoundError(`Tidak ada mahasiswa dengan id :  ${id}`);

  return "berhasil tambah dospem";
};

const getDospemMahasiswa = async (req) => {
  let result = await Mahasiswa.findById({ _id: req.user.userId })
    .populate({
      path: "dospem",
      select: "nama email nip",
      populate: [
        {
          path: "prodi",
          select: "nama",
        },
      ],
    })
    .select("dospem");

  return result;
};

const getMahasiswaBimbingan = async (req) => {
  let result = await DaftarUlang.find()
    .populate({
      path: "idMahasiswa",
      select: "nama email nim noHP semester",
      populate: [
        {
          path: "prodi",
          select: "nama",
        },
        {
          path: "dospem",
          select: "nama",
          match: {
            _id: req.user.userId,
          },
        },
      ],
    })
    .populate({
      path: "status",
      select: "nama",
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
    })
    .populate({
      path: "jenisKegiatan",
      select: "nama",
    })
    .populate({
      path: "jenisPelaksanaan",
      select: "nama",
    })
    .select("namaMitra posisi mulaiKegiatan akhirKegiatan");

  result = result.filter((item) => item.idMahasiswa.dospem !== null);
  result = result.filter((item) => item.status !== null);

  // let result = await Mahasiswa.find({ dospem: req.user.userId })
  //   .populate({
  //     path: "prodi",
  //     select: "nama",
  //   })
  //   .select("nama email nim noHP semester");

  return result;
};

module.exports = {
  getAllDaftarUlangDisetujui,
  updateDospem,
  getDospemMahasiswa,
  getMahasiswaBimbingan,
};
