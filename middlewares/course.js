const Course = require("../models/course");

exports.getCourseById = (req, res, next, id) => {
    Course
      .findById(id)
      .then((course) => {
        if (!course)
          return res.status(401).json({
            error: "course was not found in DB",
          });
        req.course = course;
        console.log(req.course);
        next();
      })
      .catch((error) => {
        return res.status(401).json({
          error,
          message: "course was not found in DB",
        });
      });
  };