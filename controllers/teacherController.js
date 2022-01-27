const Teacher = require("../models/teacher");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, lastname, password, email } = req.body;

    if (!(name && lastname && email && password))
      return res.status(400).json({ error: "All fiels are required" });

    // checking if student is already exits or not
    const isTeacherExists = await Teacher.findOne({ email });
    if (isTeacherExists)
      return res
        .status(400)
        .json({ error: "Teacher alredy exits with this email id" });

    //encrypttion of password
    const encryptPassword = await bcrypt.hash(password, 10);

    let newTeacher = await Teacher.create({
      name,
      lastname,
      password: encryptPassword,
      email: email.toLowerCase(),
    })
      .then((newTeacher) => newTeacher)
      .catch((error) => {
        console.log(`${error}`);
        return res.status(400).json({ error });
      });

    //creation of token
    const token = jwt.sign({ id: newTeacher._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    //setting token in cookies
    const options = {
      expires: new Date(Date.now() + 1*24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      token,
      newTeacher,
    });
  } catch (error) {
    console.log(`ERROR in signup`);
    console.log(error);
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ error: "All fields required!" });
    }

    // check user existance
    let isTeacherExists = await Teacher.findOne({ email });

    if (!isTeacherExists)
      return res.status(400).json({ error: "Account is not Exists" });

    //validate password
    if (!(await bcrypt.compare(password, isTeacherExists.password))) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    //creation of token
    const token = jwt.sign(
      { id: isTeacherExists._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1hr",
      }
    );
    //setting token in cookies
    const options = {
      expires: new Date(Date.now() + 1 *24* 60 * 60 * 1000),
      httpOnly: true,
    };
    isTeacherExists.password = undefined; //hiding pass
    res.status(200).cookie("token", token, options).json({
      token,
      Teacher: isTeacherExists,
    });
  } catch (error) {
    console.log(`ERROR in signin`);
    console.log(error);
  }
};

exports.getTeacherInfo = async (req, res) => {
    res.status(200).json({
      Teacher: req.profile,
    });
  };

  exports.removeTeacher = async (req, res) => {
    try {
      await Teacher.findByIdAndRemove(req.profile._id)
        .then((data) => {
          return res.status(200).json({
            success: true,
            message: `${req.profile.name} Teacher removed successfully!`,
          });
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log("error in removing Teacher");
    }
  };