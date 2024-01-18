const jenisPelaksanaan = require("../api/v1/jenisPelaksanaan/model");

var data = [new jenisPelaksanaan({ nama: "Online" }), new jenisPelaksanaan({ nama: "Onsite" }), new jenisPelaksanaan({ nama: "Hybrid" })];

const jenisPelaksanaanSeed = async () => {
  try {
    const collectionExists = await jenisPelaksanaan.exists();
    if (!collectionExists) {
      await jenisPelaksanaan.deleteMany();
      await jenisPelaksanaan.insertMany(data);
      console.log("jenisPelaksanaan successfully seeded");
    }
  } catch (err) {
    console.error("Error seeding data:", err);
  }
};

module.exports = jenisPelaksanaanSeed;
