const status = require("../api/v1/status/model");

var data = [
  new status({ nama: "Diproses" }),
  new status({ nama: "Diterima 20 SKS" }),
  new status({ nama: "Diterima kurang 20 SKS" }),
  new status({ nama: "Ditolak" }),
];

const statusSeed = async () => {
  try {
    const collectionExists = await status.exists();
    if (!collectionExists) {
      await status.deleteMany();
      await status.insertMany(data);
      console.log("status successfully seeded");
    }
  } catch (err) {
    console.error("Error seeding data:", err);
  }
};

module.exports = statusSeed;
