const jenisKegiatan = require("../api/v1/jenisKegiatan/model");

var data = [
  new jenisKegiatan({ nama: "Bangkit Academy" }),
  new jenisKegiatan({ nama: "Studi Independen" }),
  new jenisKegiatan({ nama: "Magang Merdeka" }),
  new jenisKegiatan({ nama: "Magang Mitra FILKOM" }),
];

const jenisKegiatanSeed = async () => {
  try {
    const collectionExists = await jenisKegiatan.exists();
    if (!collectionExists) {
      await jenisKegiatan.deleteMany();
      await jenisKegiatan.insertMany(data);
      console.log("jenisKegiatan successfully seeded");
    }
  } catch (err) {
    console.error("Error seeding data:", err);
  }
};

module.exports = jenisKegiatanSeed;
