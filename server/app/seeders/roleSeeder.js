const Role = require("../api/v1/roles/model");

var data = [new Role({ nama: "mahasiswa" }), new Role({ nama: "unitmbkm" }), new Role({ nama: "dospem" }), new Role({ nama: "kaprodi" })];

const roleSeed = async () => {
  try {
    const collectionExists = await Role.exists();
    if (!collectionExists) {
      await Role.deleteMany();
      await Role.insertMany(data);
      console.log("Role successfully seeded");
    }
  } catch (err) {
    console.error("Error seeding data:", err);
  }
};

module.exports = roleSeed;
