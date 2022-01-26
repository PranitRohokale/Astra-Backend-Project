const express = require("express");
const cookieParser = require("cookie-parser")
require("./config/db").dbConnect();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

//importng routes
const studentRoute = require("./routes/student");
const classRoute = require("./routes/class");
const teacherRoute = require("./routes/teacher");
const courseRoute = require("./routes/course");

const app = express();

//middleware to hadle json data
app.use(express.json());
app.use(cookieParser())

//swagger doc route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//routers
app.use("/api/v1", studentRoute);
app.use("/api/v1", classRoute);
app.use("/api/v1", teacherRoute);
app.use("/api/v1", courseRoute);

app.get("/", (req, res) => res.status(200).send("welcome Dude!"));

module.exports = app;
