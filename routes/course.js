const express = require("express")
const { createCourse, getAllCourses, getCourse,updateCourse, removeCourse } = require("../controllers/courseController")
const {getCourseById} = require("../middlewares/course")
const router = express.Router()

//params
router.param("courseId",getCourseById)

//routes
router.route("/course/create").post(createCourse)
router.route("/courses/all").get(getAllCourses)
router.route("/course/:courseId/info").get(getCourse)
router.route("/course/:courseId/update").put(updateCourse)
router.route("/course/:courseId/delete").delete(removeCourse)

module.exports = router