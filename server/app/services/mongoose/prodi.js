const Prodi = require("../../api/v1/prodi/model");

const getAll = async (req) => {
  const result = await Prodi.find();

  return result;
};

module.exports = {
  getAll,
};
