// import package
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var app = express();

// import router
const authRouter = require("./app/api/v1/auth/router");
const prodiRouter = require("./app/api/v1/prodi/router");
const roleRouter = require("./app/api/v1/roles/router");
const informasiRouter = require("./app/api/v1/informasi/router");
const penugasanRouter = require("./app/api/v1/penugasan/router");
const daftarMbkmRouter = require("./app/api/v1/daftarmbkm/router");
const jenisKegiatanRouter = require("./app/api/v1/jenisKegiatan/router");
const jenisPelaksanaanRouter = require("./app/api/v1/jenisPelaksanaan/router");
const statusRouter = require("./app/api/v1/status/router");
const daftarUlangRouter = require("./app/api/v1/daftarulang/router");
const mahasiswaRouter = require("./app/api/v1/mahasiswas/router");
const dospemRouter = require("./app/api/v1/dospem/router");
const tugasRouter = require("./app/api/v1/tugas/router");
const logbookRouter = require("./app/api/v1/logbook/router");
const nilaiMitraRouter = require("./app/api/v1/nilaiMitra/router");

// use package
app.use(cors({ origin: "*", credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//seeder
const seed = require("./app/seeders");
seed.prodiSeed();
seed.roleSeed();
seed.unitmbkmSeed();
seed.jenisKegiatanSeed();
seed.jenisPelaksanaanSeed();
seed.statusSeed();

// import middleware
const notFoundMiddleware = require("./app/middlewares/not-found");
const handleErrorMiddleware = require("./app/middlewares/handler-error");

// use router
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to api semina",
  });
});

const v1 = "/api/v1";
app.use(`${v1}`, authRouter);
app.use(`${v1}`, prodiRouter);
app.use(`${v1}`, roleRouter);
app.use(`${v1}`, informasiRouter);
app.use(`${v1}`, penugasanRouter);
app.use(`${v1}`, daftarMbkmRouter);
app.use(`${v1}`, jenisKegiatanRouter);
app.use(`${v1}`, jenisPelaksanaanRouter);
app.use(`${v1}`, statusRouter);
app.use(`${v1}`, daftarUlangRouter);
app.use(`${v1}`, mahasiswaRouter);
app.use(`${v1}`, dospemRouter);
app.use(`${v1}`, tugasRouter);
app.use(`${v1}`, logbookRouter);
app.use(`${v1}`, nilaiMitraRouter);

// middleware
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

module.exports = app;
