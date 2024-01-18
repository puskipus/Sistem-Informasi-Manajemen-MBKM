const express = require("express");
const StatusController = require("./controller");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");
const router = express();

router.get(
  "/status",
  authenticateUser,
  authorizeRoles("kaprodi", "unitmbkm"),
  StatusController.getAll
);

module.exports = router;
