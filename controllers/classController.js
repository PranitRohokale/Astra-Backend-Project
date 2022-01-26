const Class = require("../models/class");
const Student = require("../models/student");

exports.createNewClass = async (req, res) => {
  try {
    let { name, description, standard } = req.body;

    if (!(name && description && standard))
      return res
        .status(400)
        .json({ error: "name, description, standard fiels are required" });

    // checking if student is already exits or not
    name = name.toLowerCase();
    const isClassExists = await Class.findOne({ name });
    if (isClassExists)
      return res
        .status(400)
        .json({ error: "This name of provided class is already exits" });

    let newClass = await Class.create({
      name,
      description,
      standard,
    })
      .then((newClass) => newClass)
      .catch((error) => {
        console.log(`${error}`);
        return res.status(400).json({ error });
      });

    res.status(200).json({
      success: true,
      newClass,
    });
  } catch (error) {
    console.log(`ERROR in class creation`);
    console.log(error);
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const allClasses = await Class.find()
      .then((data) => data)
      .catch((error) => {
        console.log(`${error}`);
        return res.status(400).json({ error });
      });

    res.status(200).json({
      NoOfClasses: allClasses.length,
      allClasses,
    });
  } catch (error) {
    console.log("error in getting all classes", error);
  }
};

exports.getClassInfo = (req, res) => {
  res.status(200).json({
    classInfo: req.class,
  });
};

exports.updateClassInfo = async (req, res) => {
  try {
    const { name, description, standard } = req.body;
    const newClass = req.class
    if (!(name && description && standard))
      return res
        .status(400)
        .json({ error: "name, description, standard fiels are required" });

    newClass.name = name;
    newClass.description = description;
    newClass.standard = standard;

    await newClass.save();
    res.status(200).json({
      success: true,
      message: "class Info updated!"
    });
  } catch (error) {
    console.log(`ERROR in updation class`);
    console.log(error);
  }
};

exports.getAllStudentsInClass = async (req, res) => {
  try {
    const allStudentsInClass = await Student.find({ _classId: req.class._id })
      .then((data) => data)
      .catch((error) => {
        console.log(`${error}`);
        return res.status(400).json({ error });
      });

    res.status(200).json({
      noOfStudentsInClass: allStudentsInClass.length,
      allStudentsInClass,
    });
  } catch (error) {
    console.log("error in getting student in class", error);
  }
};
