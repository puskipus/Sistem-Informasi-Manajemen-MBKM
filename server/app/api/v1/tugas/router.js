const express = require("express");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");
const router = express();
const TugasController = require("./controller");

const upload = require("../../../middlewares/multer");

router.post(
  "/tugas",
  authenticateUser,
  authorizeRoles("mahasiswa"),
  upload.single("file"),
  TugasController.createTugas
);

router.get(
  "/tugas",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  TugasController.getAllTugas
);

router.get(
  "/tugas/convert",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  TugasController.getAllTugasConvert
);

router.get(
  "/tugas/:id",
  authenticateUser,
  authorizeRoles("mahasiswa"),
  TugasController.getOneTugas
);

router.get(
  "/tugas/dospem/:id",
  authenticateUser,
  authorizeRoles("dospem"),
  TugasController.getTugasMahasiswaBimbingan
);

router.put(
  "/tugas/dospem/nilai",
  authenticateUser,
  authorizeRoles("dospem"),
  TugasController.updateNilai
);

module.exports = router;
