const express = require("express")
const { createNewClass, getAllClasses, getClassInfo, updateClassInfo, getAllStudentsInClass } = require("../controllers/classController")
const { getClassById } = require("../middlewares/class")
const router = express.Router()

//params
router.param("classId",getClassById)

router.route("/class/create").post(createNewClass)
router.route("/allclasses").get(getAllClasses)
router.route("/class/:classId/info").get(getClassInfo)
router.route("/class/:classId/update").put(updateClassInfo)
router.route("/class/:classId/students").get(getAllStudentsInClass)

module.exports = router