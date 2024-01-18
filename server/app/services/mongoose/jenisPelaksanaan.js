const JenisPelaksanaan = require("../../api/v1/jenisPelaksanaan/model");

const getAll = async (req) => {
  const result = await JenisPelaksanaan.find().select("_id nama");

  return result;
};

module.exports = {
  getAll,
};
