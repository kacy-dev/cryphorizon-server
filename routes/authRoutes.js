const express = require("express");
const {
  registerUser,
  verifyOTP,
  loginUser,
  getUsers,
  registerAdmin,
  loginAdmin,
  getUpline,
  deleteManyUsers,
  deleteSingleUser,
  getUserById,
  editUser,
  getNewestUsers,
  getReferredUsers,
  editAdminPassword,
} = require("../controllers/authContoller");
const upload = require("../config/cloudinary");

const router = express.Router();

router.post("/register", upload.single("profile_img"), registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.get("/users", getUsers);
router.get("/users/latest", getNewestUsers);
router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.put("/admin/edit-password", editAdminPassword); // Add this route
router.delete("/users/delete-many", deleteManyUsers);
router.delete("/users/:id", deleteSingleUser);
router.get("/users/:id", getUserById);
router.get("/users/:id/referred-users", getReferredUsers);
router.get("/users/upline", getUpline);
router.put("/users/:id", editUser);

module.exports = router;
