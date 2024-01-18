const express = require("express");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");
const router = express();
const MahasiswaController = require("./controller");
const upload = require("../../../middlewares/multer");

router.get(
  "/bagidospem",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  MahasiswaController.getAllDaftarUlangDisetujui
);

router.get(
  "/dospem-mahasiswa",
  authenticateUser,
  authorizeRoles("mahasiswa"),
  MahasiswaController.getDospemMahasiswa
);

router.get(
  "/mahasiswa-bimbingan",
  authenticateUser,
  authorizeRoles("dospem"),
  MahasiswaController.getMahasiswaBimbingan
);

router.put(
  "/bagidospem",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  MahasiswaController.updateDospem
);

module.exports = router;
