const Prodi = require("../api/v1/prodi/model");

var data = [
  new Prodi({ nama: "Teknik Informatika" }),
  new Prodi({ nama: "Teknik Komputer" }),
  new Prodi({ nama: "Sistem Informasi" }),
  new Prodi({ nama: "Teknologi Informasi" }),
  new Prodi({ nama: "Pendidikan Teknologi Informasi" }),
];

const prodiSeed = async () => {
  try {
    const collectionExists = await Prodi.exists();
    if (!collectionExists) {
      await Prodi.deleteMany();
      await Prodi.insertMany(data);
    }
  } catch (err) {
    console.error("Error seeding data:", err);
  }
};

module.exports = prodiSeed;
