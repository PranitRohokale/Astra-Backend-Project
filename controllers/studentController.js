const Student = require("../models/student");
const Class = require("../models/class");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, lastname, password, email, standard } = req.body;

    if (!(name && lastname && email && password && standard))
      return res.status(400).json({ error: "All fiels are required" });

    // checking if student is already exits or not
    const isStudentExists = await Student.findOne({ email });
    if (isStudentExists)
      return res
        .status(400)
        .json({ error: "Student alredy exits with this email id" });

    //encrypttion of password
    const encryptPassword = await bcrypt.hash(password, 10);

    let newStudent = await Student.create({
      name,
      lastname,
      password: encryptPassword,
      standard,
      email: email.toLowerCase(),
    })
      .then((newStudent) => newStudent)
      .catch((error) => {
        console.log(`${error}`);
        return res.status(400).json({ error });
      });

    //creation of token
    const token = jwt.sign({ id: newStudent._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    //setting token in cookies
    const options = {
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      _id: newStudent._id,
      token,
      email,
      name,
      lastname,
      standard,
    });
  } catch (error) {
    console.log(`ERROR in signup`);
    console.log(error);
  }
};

exports.signin = async (req, res) => {
  try {
    // console.log(req.cookies.token);
    // console.log(JSON.stringify(req.headers));
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ error: "All fields required!" });
    }

    // check user existance
    let isStudentExists = await Student.findOne({ email });

    if (!isStudentExists)
      return res.status(400).json({ error: "Account is not Exists" });

    //validate password
    if (!(await bcrypt.compare(password, isStudentExists.password))) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    //creation of token
    const token = jwt.sign(
      { id: isStudentExists._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1hr",
      }
    );
    //setting token in cookies
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    isStudentExists.password = undefined; //hiding pass
    res.status(200).cookie("token", token, options).json({
      token,
      student: isStudentExists,
    });
  } catch (error) {
    console.log(`ERROR in signin`);
    console.log(error);
  }
};

exports.logout = (req, res) => {
  res
    .status(200)
    .clearCookie("token")
    .json({ message: "Logout successfullt!" });
};

exports.getStudentInfo = async (req, res) => {
  res.status(200).json({
    student: req.profile,
  });
};

exports.updateStudentInfo = async (req, res) => {
  try {
    const { name, lastname, standard } = req.body;

    if (!(name && lastname && standard))
      return res
        .status(400)
        .json({ error: "name, lastname, standard fiels are required" });

    req.profile.name = name;
    req.profile.lastname = lastname;
    req.profile.standard = standard;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.profile._id,
      req.profile
    )
      .then((data) => data)
      .catch((error) => console.log(error));

    res.status(200).json({
      success: true,
      message: "Info updated!",
    });
  } catch (error) {
    console.log(`ERROR in updation`);
    console.log(error);
  }
};

exports.enrollClass = async (req, res) => {
  try {
    const Student = req.profile;
    const Class = req.class;

    Student._classId = Class._id;
    await Student.save();
    Class.incrementStudent();
    await Class.save();
    res.status(200).json({
      success: true,
      message: "New Class Entrolled",
      enrolledClassInfo: Class,
    });
  } catch (error) {
    console.log("error in enrolling new class", error);
  }
};

exports.unEnrollClass = async (req, res) => {
  try {
    const Student = req.profile;
    const classId = req._classId;
    if (!classId)
      return res.status(400).json({ message: "haven't entrolled any class" });

    const isClassExits = await Class.findById(classId)
      .then((data) => data)
      .catch((error) => console.log(error));
    if (!isClassExits)
      return res.status(401).json({ message: "Class is No more available" });

    Student._classId = null;
    await Student.save();
    isClassExits.decrementStudent();
    await isClassExits.save();

    res.status(200).json({
      success: true,
      message: " unEntrolled class Sccessfully!",
    });
  } catch (error) {
    console.log("error in unEnrolling  class", error);
  }
};

exports.getMyClass = async (req, res) => {
  try {
    const classId = req.profile._classId;
    console.log(classId);

    if (classId == undefined) {
      return res
        .status(2001)
        .json({ message: "opps! you haven't enroll in any class" });
    }
    const isClassExits = await Class.findById(classId)
    res.status(200).json({ yourClassInfo: isClassExits });
  } catch (error) {
    console.log("error in getting myclass", error);
  }
};
