const express = require("express");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");
const router = express();
const LogbookController = require("./controller");
const upload = require("../../../middlewares/multer");

router.post(
  "/logbook",
  authenticateUser,
  authorizeRoles("mahasiswa"),
  upload.single("buktiKegiatan"),
  LogbookController.createLogbook
);

router.get(
  "/logbook",
  authenticateUser,
  authorizeRoles("mahasiswa"),
  LogbookController.getAllLogbook
);

router.put(
  "/logbook",
  authenticateUser,
  authorizeRoles("dospem"),
  LogbookController.updateStatusLogbook
);

router.put(
  "/logbook/feedback",
  authenticateUser,
  authorizeRoles("dospem"),
  LogbookController.updateFeedbackDosenLogbook
);

router.get(
  "/logbook-mahasiswa/:id",
  authenticateUser,
  authorizeRoles("dospem"),
  LogbookController.getLogbookMahasiswa
);

router.delete(
  "/logbook/:id",
  authenticateUser,
  authorizeRoles("mahasiswa", "dospem"),
  LogbookController.deleteLogbook
);

module.exports = router;
