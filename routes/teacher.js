const express = require("express");
const {
  signup,
  signin,
  getTeacherInfo,
} = require("../controllers/teacherController");
const {
  getTeacherById,
  isSignedIn,
  isAutheticated,
} = require("../middlewares/teacher");
const router = express.Router();

//params
router.param("teacherId", getTeacherById);

//routs
router.route("/teacher/signup").post(signup);
router.route("/teacher/signin").post(signin);
router
  .route("/teacher/:teacherId/info")
  .get(isSignedIn, isAutheticated, getTeacherInfo);

module.exports = router;
