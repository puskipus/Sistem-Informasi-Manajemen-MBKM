const express = require("express");
const { authenticateUser } = require("../../../middlewares/auth");
const router = express();
const JenisKegiatan = require("./controller");

router.get("/jeniskegiatan", authenticateUser, JenisKegiatan.getAll);

module.exports = router;
