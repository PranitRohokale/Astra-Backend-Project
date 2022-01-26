const express = require("express");
const router = express.Router();

//importing 
const { getStudentInfo,updateStudentInfo, signup, signin, enrollClass, unEnrollClass, getMyClass } = require("../controllers/studentController");
const { getStudentById, isSignedIn, isAutheticated } = require("../middlewares/student");
const {getClassById} = require("../middlewares/class")

router.param("studentId",getStudentById)
router.param("classId",getClassById)

router.route("/student/signup").post(signup);
router.route("/student/signin").post(signin);
router.route("/student/:studentId/info").get( isSignedIn, isAutheticated , getStudentInfo);
router.route("/student/:studentId/update").put( isSignedIn, isAutheticated , updateStudentInfo);
router.route("/student/:studentId/myclass").get( isSignedIn, isAutheticated , getMyClass);

//enroll class
router.route("/student/:studentId/class/:classId/enroll").patch( isSignedIn, isAutheticated , enrollClass);
router.route("/student/:studentId/class/unenroll").patch( isSignedIn, isAutheticated , unEnrollClass);

module.exports = router;
