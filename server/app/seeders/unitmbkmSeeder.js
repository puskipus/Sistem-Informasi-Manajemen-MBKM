const Unitmbkm = require("../api/v1/unitmbkm/model");
const Role = require("../api/v1/roles/model");

const unitmbkmSeed = async () => {
  const role = await Role.findOne({ nama: "unitmbkm" });
  if (role === null) {
    console.log("role tidak ada");
  }

  var data = [new Unitmbkm({ nama: "superadminUnitMBKM", email: "admin@Unitmbkm.com", password: "adminunitmbkm291", role: role._id })];

  try {
    const collectionExists = await Unitmbkm.exists();
    if (!collectionExists) {
      await Unitmbkm.deleteMany();
      await Unitmbkm.create(data);
    }
  } catch (err) {
    console.error("Error seeding data:", err);
  }
};

module.exports = unitmbkmSeed;
