const express = require("express");
const AuthController = require("./controller");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");
const router = express();

router.post("/auth/signup", AuthController.signUpMahasiswa);
router.post("/auth/signin", AuthController.signInMahasiswa);
router.post("/admin/auth/signin", AuthController.signInAdmin);
router.post(
  "/admin/auth/signup",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  AuthController.signUpAdmin
);
router.get(
  "/admin/auth/account",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  AuthController.getAllUser
);
router.delete(
  "/admin/auth/account/:role/:id",
  authenticateUser,
  authorizeRoles("unitmbkm"),
  AuthController.deleteAkun
);

router.get("/account", authenticateUser, AuthController.getDetailAccount);
router.put("/account", authenticateUser, AuthController.updatePassword);
router.put("/account/detail", authenticateUser, AuthController.updateDetail);

module.exports = router;
