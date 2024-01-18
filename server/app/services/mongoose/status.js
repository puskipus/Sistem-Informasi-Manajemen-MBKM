const Status = require("../../api/v1/status/model");

const getAll = async (req) => {
  const result = await Status.find();

  return result;
};

module.exports = {
  getAll,
};
