const Class = require("../models/class")

exports.getClassById = (req, res, next, id) => {
    Class
      .findById(id)
      .then((classData) => {
        if (!classData)
          return res.status(401).json({
            error: "Class was not found in DB",
          });
        req.class = classData;
        // console.log(classData);
        next();
      })
      .catch((error) => {
        return res.status(401).json({
          error,
          message: "Class was not found in DB",
        });
      });
  };