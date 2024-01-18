const { StatusCodes } = require("http-status-codes");
const path = require("path");
const {
  createDaftarMbkm,
  getAllDaftarMbkmMahasiswa,
  getOneDaftarMbkm,
  getAllDaftar,
  updateDaftarMbkm,
  getTotalPendaftar,
  getAllDaftarMbkmConvert,
} = require("../../../services/mongoose/daftarmbkm");
const Excel = require("exceljs");

class DaftarMBKMController {
  async createDaftarMbkm(req, res, next) {
    try {
      const result = await createDaftarMbkm(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllDaftarMbkmMahasiswa(req, res, next) {
    try {
      const result = await getAllDaftarMbkmMahasiswa(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getTotalPendaftar(req, res, next) {
    try {
      const result = await getTotalPendaftar(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllDaftarMbkmConvert(req, res, next) {
    try {
      const result = await getAllDaftarMbkmConvert(req);

      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      const mahasiswaColumns = [
        { header: "Nama", key: "nama", width: 20 },
        { header: "IPK", key: "ipk", width: 20 },
        { header: "SKS Lulus", key: "sksLulus", width: 20 },
        { header: "Matkul Wajib", key: "matkulWajib", width: 20 },
        { header: "Email", key: "email", width: 20 },
        { header: "NIM", key: "nim", width: 20 },
        { header: "Prodi", key: "prodi", width: 20 },
        { header: "No HP", key: "noHP", width: 20 },
        { header: "Semester", key: "semester", width: 20 },
      ];

      const mitraColumns = Array.from({ length: 11 * 5 }, (_, i) => ({
        header: `Mitra ${Math.floor(i / 5) + 1} - ${
          ["Nama Mitra", "Posisi", "Link", "Status", "Catatan"][i % 5]
        }`,
        key: `mitra_${Math.floor(i / 5) + 1}_${
          ["namaMitra", "posisi", "link", "status", "catatan"][i % 5]
        }`,
        width: 20,
      }));

      worksheet.columns = [...mahasiswaColumns, ...mitraColumns];

      result.forEach((data) => {
        const row = {
          nama: data.idMahasiswa.nama,
          ipk: data.ipk,
          sksLulus: data.sksLulus,
          matkulWajib: data.matkulWajib,
          email: data.idMahasiswa.email,
          nim: data.idMahasiswa.nim,
          prodi: data.idMahasiswa.prodi.nama,
          noHP: data.idMahasiswa.noHP,
          semester: data.idMahasiswa.semester,
        };

        data.mitra.forEach((mitra, index) => {
          const mitraDetails = {
            [`mitra_${index + 1}_namaMitra`]: mitra.namaMitra || "",
            [`mitra_${index + 1}_posisi`]: mitra.posisi || "",
            [`mitra_${index + 1}_link`]: mitra.link || "",
            [`mitra_${index + 1}_status`]: mitra.status?.nama || "",
            [`mitra_${index + 1}_catatan`]: mitra.catatan || "",
          };

          Object.assign(row, mitraDetails);
        });

        worksheet.addRow(row);
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", 'attachment; filename="data.xlsx"');

      await workbook.xlsx.write(res);
    } catch (err) {
      console.error("Error generating and sending Excel file:", err);
      res.status(500).send("Internal Server Error");
    }
  }

  async getAllDaftar(req, res, next) {
    try {
      const result = await getAllDaftar(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getOneDaftarMbkm(req, res, next) {
    try {
      const result = await getOneDaftarMbkm(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateDaftarMbkm(req, res, next) {
    try {
      const result = await updateDaftarMbkm(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DaftarMBKMController();
