const Course = require("../models/course");

exports.createCourse = async (req, res) => {
  try {
    let { name, description, credit } = req.body;

    if (!(name && description && credit)) {
      return res.status(400).json({ error: "All fields are required" });
    }
    name = name.toLowerCase();

    const isCourseExists = await Course.findOne({ name });
    if (isCourseExists)
      return res
        .status(400)
        .json({ error: "Course alredy exits with this name id" });

    let newCourse = await Course.create({
      name,
      description,
      credit,
    })
      .then((newCourse) => newCourse)
      .catch((error) => {
        console.log(`${error}`);
        return res.status(400).json({ error });
      });

    res.status(200).json({
      success: true,
      newCourse,
    });
  } catch (error) {
    console.log("error in creation of course");
  }
};
exports.getAllCourses = async (req, res) => {
  const allCourses = await Course.findOne();

  res.status(200).json({
    numberOfTotalCourse: allCourses ? allCourses.length : 0,
    allCourses,
  });
};
exports.getCourse = (req, res) => {
  const courseInfo = req.course;

  res.status(200).json({
    courseInfo,
  });
};

exports.updateCourse = async (req, res) => {
  try {
    let { name, description, credit } = req.body;

    if (!(name && description && credit)) {
      return res.status(400).json({ error: "All fields are required" });
    }
    name = name.toLowerCase();

    req.course.name = name;
    req.course.description = description;
    req.course.credit = credit;

    // const newUpdatedCourse = await Course.findByIdAndUpdate(
    //   req.course._id,
    //   req.course
    // )
    //   .then((data) => data)
    //   .catch((err) => console.log(err));

    const course = req.course;
    await course.save();

    res.status(200).json({
      success: true,
      newUpdatedCourse : course,
    });
    console.log("sending");
  } catch (error) {
    console.log("error in Updation of course");
  }
};
