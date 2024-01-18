const express = require("express");
const { authenticateUser } = require("../../../middlewares/auth");
const router = express();
const JenisPelaksanaan = require("./controller");

router.get("/jenispelaksanaan", authenticateUser, JenisPelaksanaan.getAll);

module.exports = router;
