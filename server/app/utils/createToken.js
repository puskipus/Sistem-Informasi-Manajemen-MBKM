const createTokenMahasiswa = (user, roleName) => {
  return {
    userId: user._id,
    role: roleName,
    nama: user.nama,
    email: user.email,
  };
};

const createTokenAdmin = (user, roleName) => {
  return {
    userId: user._id,
    role: roleName,
    nama: user.nama,
    email: user.email,
  };
};

module.exports = { createTokenMahasiswa, createTokenAdmin };
