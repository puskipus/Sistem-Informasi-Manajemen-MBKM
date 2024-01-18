const express = require("express");
const ProdiController = require("./controller");

const router = express();

router.get("/prodi", ProdiController.getAllProdi);

module.exports = router;
