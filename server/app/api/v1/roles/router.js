const express = require("express");
const RoleController = require("./controller");
const router = express();

router.get("/role", RoleController.getAllRole);

module.exports = router;
