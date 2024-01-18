const { StatusCodes } = require("http-status-codes");
const {
  createDaftarUlang,
  getAllDaftarUlangMahasiswa,
  getOneDaftarUlang,
  getAllDaftarUlang,
  updateDaftarUlang,
  getTotalDiterima,
  getAllDaftarUlangConvert,
} = require("../../../services/mongoose/daftarulang");
const Excel = require("exceljs");

class DaftarUlangController {
  async createDaftarUlang(req, res, next) {
    try {
      const result = await createDaftarUlang(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllDaftarUlangMahasiswa(req, res, next) {
    try {
      const result = await getAllDaftarUlangMahasiswa(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getOneDaftarUlang(req, res, next) {
    try {
      const result = await getOneDaftarUlang(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllDaftarUlang(req, res, next) {
    try {
      const result = await getAllDaftarUlang(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getTotalDiterima(req, res, next) {
    try {
      const result = await getTotalDiterima(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllDaftarUlangConvert(req, res, next) {
    try {
      const result = await getAllDaftarUlangConvert(req);

      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      worksheet.columns = [
        { header: "Nama", key: "nama", width: 20 },
        { header: "Email", key: "email", width: 20 },
        { header: "NIM", key: "nim", width: 20 },
        { header: "Prodi", key: "prodi", width: 20 },
        { header: "No HP", key: "noHP", width: 20 },
        { header: "Semester", key: "semester", width: 20 },
        { header: "Jenis Kegiatan", key: "jenisKegiatan", width: 20 },
        { header: "Jenis Pelaksanaan", key: "jenisPelaksanaan", width: 20 },
        { header: "Nama Mitra", key: "namaMitra", width: 20 },
        { header: "Posisi", key: "posisi", width: 20 },
        { header: "Mulai Kegiatan", key: "mulaiKegiatan", width: 20 },
        { header: "Akhir Kegiatan", key: "akhirKegiatan", width: 20 },
        { header: "Status", key: "status", width: 20 },
        { header: "Catatan", key: "catatan", width: 20 },
      ];

      result.forEach((data) => {
        const row = {
          nama: data.idMahasiswa.nama,
          email: data.idMahasiswa.email,
          nim: data.idMahasiswa.nim,
          prodi: data.idMahasiswa.prodi.nama,
          noHP: data.idMahasiswa.noHP,
          semester: data.idMahasiswa.semester,
          jenisKegiatan: data.jenisKegiatan.nama,
          jenisPelaksanaan: data.jenisPelaksanaan.nama,
          namaMitra: data.namaMitra,
          posisi: data.posisi,
          mulaiKegiatan: data.mulaiKegiatan,
          akhirKegiatan: data.akhirKegiatan,
          status: data.status.nama,
          catatan: data.catatan ? data.catatan : "",
        };
        worksheet.addRow(row);
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", 'attachment; filename="data.xlsx"');

      await workbook.xlsx.write(res);
    } catch (err) {
      console.error("Error generating and sending Excel file:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  async updateDaftarUlang(req, res, next) {
    try {
      const result = await updateDaftarUlang(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DaftarUlangController();
