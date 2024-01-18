const express = require("express");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");
const router = express();
const DaftarUlangController = require("./controller");
const upload = require("../../../middlewares/multer");

router.post(
  "/daftarulang",
  authenticateUser,
  authorizeRoles("mahasiswa"),
  upload.single("silabus"),
  DaftarUlangController.createDaftarUlang
);

router.get(
  "/daftarulang",
  authenticateUser,
  authorizeRoles("mahasiswa"),
  DaftarUlangController.getAllDaftarUlangMahasiswa
);

router.get(
  "/daftarulang/unitmbkm",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  DaftarUlangController.getAllDaftarUlang
);

router.get(
  "/daftarulang/total",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  DaftarUlangController.getTotalDiterima
);

router.get(
  "/daftarulang/convert",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  DaftarUlangController.getAllDaftarUlangConvert
);

router.get(
  "/daftarulang/:id",
  authenticateUser,
  authorizeRoles("mahasiswa", "unitmbkm"),
  DaftarUlangController.getOneDaftarUlang
);

router.put(
  "/daftarulang/:id",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  DaftarUlangController.updateDaftarUlang
);

module.exports = router;
