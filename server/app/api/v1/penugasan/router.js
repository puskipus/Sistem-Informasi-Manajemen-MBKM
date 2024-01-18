const express = require("express");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");
const router = express();
const PenugasanController = require("./controller");

const upload = require("../../../middlewares/multer");

router.post(
  "/penugasan",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  upload.single("lampiran"),
  PenugasanController.createPenugasan
);

router.get("/penugasan", authenticateUser, PenugasanController.getAllPenugasan);

router.get(
  "/penugasan/:id",
  authenticateUser,
  PenugasanController.getOnePenugasan
);

router.get(
  "/penugasan/download/:filename",
  authenticateUser,
  PenugasanController.download
);
router.put(
  "/penugasan/:id",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  upload.single("lampiran"),
  PenugasanController.updatePenugasan
);

router.delete(
  "/penugasan/:id",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  PenugasanController.deletePenugasan
);

module.exports = router;
