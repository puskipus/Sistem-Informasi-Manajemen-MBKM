const { StatusCodes } = require("http-status-codes");
const {
  createTugas,
  getOneTugas,
  getTugasMahasiswaBimbingan,
  updateNilai,
  getAllTugas,
} = require("../../../services/mongoose/tugas");
const { getAllPenugasan } = require("../../../services/mongoose/penugasan");
const Excel = require("exceljs");

class TugasController {
  async createTugas(req, res, next) {
    try {
      const result = await createTugas(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getOneTugas(req, res, next) {
    try {
      const result = await getOneTugas(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getTugasMahasiswaBimbingan(req, res, next) {
    try {
      const result = await getTugasMahasiswaBimbingan(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllTugas(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = 10;

      const tugas = await getAllTugas();
      const penugasan = await getAllPenugasan(req);

      const groupedByStudent = tugas.reduce((acc, curr) => {
        const studentName = curr.idMahasiswa.nama;

        if (!acc[studentName]) {
          acc[studentName] = [];
        }

        acc[studentName].push({
          Tugas: curr.idPenugasan?.judul,
          "Nilai Tugas": curr.nilai,
        });

        return acc;
      }, {});

      const paginateResults = (results, page, perPage) => {
        const startIndex = (page - 1) * perPage;
        const endIndex = page * perPage;

        const slicedData = Object.fromEntries(
          Object.entries(results).slice(startIndex, endIndex)
        );

        return slicedData;
      };

      const paginatedData = paginateResults(groupedByStudent, page, perPage);

      console.log(paginatedData);

      res.status(StatusCodes.OK).json({
        data: groupedByStudent,
        penugasan: penugasan,
      });
    } catch (err) {
      console.error("Error generating and sending Excel file:", err);
      res.status(500).send("Internal Server Error");
    }
  }

  async updateNilai(req, res, next) {
    try {
      const result = await updateNilai(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllTugasConvert(req, res, next) {
    try {
      const tugas = await getAllTugas(req);
      const penugasan = await getAllPenugasan(req);

      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      const mahasiswaColumns = [
        { header: "Nama", key: "nama", width: 20 },
        { header: "NIM", key: "nim", width: 20 },
      ];

      penugasan.forEach((element) => {
        mahasiswaColumns.push({
          header: element.judul,
          key: element.judul.replace(/\s/g, ""),
          width: 20,
        });
      });

      worksheet.columns = mahasiswaColumns;

      tugas.forEach((tugasData) => {
        const { idMahasiswa, idPenugasan, nilai } = tugasData;
        const studentName = idMahasiswa?.nama;
        const assignmentTitle = idPenugasan?.judul;

        if (studentName && assignmentTitle) {
          const rowData = {
            nama: idMahasiswa.nama,
            nim: idMahasiswa.nim,
          };

          const columnIndex = mahasiswaColumns.findIndex(
            (col) => col.header === assignmentTitle
          );

          if (columnIndex !== -1) {
            rowData[assignmentTitle.replace(/\s/g, "")] = nilai;
          }

          worksheet.addRow(rowData);
        }
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
}

module.exports = new TugasController();
