const express = require("express");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");
const router = express();
const InformasiController = require("./controller");

router.post(
  "/informasi",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  InformasiController.createInformasi
);
router.get("/informasi", authenticateUser, InformasiController.getAllInformasi);
router.get(
  "/informasi/:id",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  InformasiController.getOneInformasi
);
router.put(
  "/informasi/:id",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  InformasiController.updateInformasi
);
router.delete(
  "/informasi/:id",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  InformasiController.deleteInformasi
);

module.exports = router;
