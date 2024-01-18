const express = require("express");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");
const router = express();
const DaftarMBKMController = require("./controller");

router.post(
  "/daftarmbkm",
  authenticateUser,
  authorizeRoles("mahasiswa"),
  DaftarMBKMController.createDaftarMbkm
);

router.get(
  "/daftarmbkm",
  authenticateUser,
  DaftarMBKMController.getAllDaftarMbkmMahasiswa
);

router.get(
  "/daftarmbkm/kaprodi",
  authenticateUser,
  authorizeRoles("kaprodi"),
  DaftarMBKMController.getAllDaftar
);

router.get(
  "/daftarmbkm/total",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  DaftarMBKMController.getTotalPendaftar
);

router.get(
  "/daftarmbkm/convert",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  DaftarMBKMController.getAllDaftarMbkmConvert
);

router.get(
  "/daftarmbkm/:id",
  authenticateUser,
  DaftarMBKMController.getOneDaftarMbkm
);

router.put(
  "/daftarmbkm/:id",
  authenticateUser,
  authorizeRoles("kaprodi"),
  DaftarMBKMController.updateDaftarMbkm
);

module.exports = router;
