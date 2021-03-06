const expressJwt = require("express-jwt");
const Teacher = require("../models/teacher");
const jwt = require("jsonwebtoken")

exports.getTeacherById = (req, res, next, id) => {
    Teacher
      .findById(id)
      .then((profile) => {
        if (!profile)
          return res.status(401).json({
            error: "Teacher was not found in DB",
          });
        req.profile = profile;
        console.log(req.profile);
        next();
      })
      .catch((error) => {
        return res.status(401).json({
          error,
          message: "Teacher was not found in DB",
        });
      });
  };

// exports.isSignedIn = expressJwt({
//   secret: process.env.JWT_SECRET,
//   algorithms: ["HS256"],
//   requestProperty: "auth", //this add the auth property into the request & auth conatin the _id which is exactly same as db _id
// });

exports.isSignedIn = (req, res, next) => {
  // console.log(req.cookies);
  const token =
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(403).send("token is missing");
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decode);
    req.auth = decode;
    // bring in info from DB
    return next();
  } catch (error) {
    console.log(error)
    return res.status(401).send("Invalid Token");
  }
};

exports.isAutheticated = (req, res, next) => {
  const check = req.auth && req.profile && req.profile._id == req.auth.id;
  // checking token payload id with provided id which document available in db
  // console.log("auth" , req.auth,req.profile._id == req.auth.id,req.profile,check);
  if (!check) return res.status(403).json({ error: "Access Denied!" });
  next();
};
