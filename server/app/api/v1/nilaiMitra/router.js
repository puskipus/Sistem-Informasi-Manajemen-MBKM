const express = require("express");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");
const router = express();
const NilaiMitraController = require("./controller");
const upload = require("../../../middlewares/multer");

router.post(
  "/nilai-mitra",
  authenticateUser,
  authorizeRoles("mahasiswa"),
  upload.single("buktiNilai"),
  NilaiMitraController.createNilaiMitra
);

router.get(
  "/nilai-mitra",
  authenticateUser,
  authorizeRoles("mahasiswa"),
  NilaiMitraController.getAllNilaiMitraMahasiswa
);

router.get(
  "/nilai-mitra/unitmbkm",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  NilaiMitraController.getAllNilaiMitra
);

router.get(
  "/nilai-mitra/:id",
  authenticateUser,
  authorizeRoles("mahasiswa", "unitmbkm"),
  NilaiMitraController.getOneNilaiMitra
);

router.put(
  "/nilai-mitra/:id",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  NilaiMitraController.updateNilaiMitra
);

module.exports = router;
