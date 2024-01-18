const express = require("express");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");
const router = express();
const DospemController = require("./controller");
const upload = require("../../../middlewares/multer");

router.get(
  "/dospem",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  DospemController.getAllDospemByName
);

module.exports = router;
