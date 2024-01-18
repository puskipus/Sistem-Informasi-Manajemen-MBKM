const jenisKegiatan = require("../../api/v1/jenisKegiatan/model");

const getAll = async (req) => {
  const result = await jenisKegiatan.find().select("_id nama");

  return result;
};

module.exports = {
  getAll,
};
