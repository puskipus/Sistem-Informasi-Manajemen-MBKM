const Role = require("../../api/v1/roles/model");

const getAll = async (req) => {
  const result = await Role.find();

  return result;
};

module.exports = {
  getAll,
};
