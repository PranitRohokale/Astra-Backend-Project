const mongoose = require("mongoose");

const { DATABASE_URL } = process.env;

exports.dbConnect = () => {
  mongoose
    .connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() =>
      console.log(`Database connected Successfully!`)
    )
    .catch((err) => {
      console.log(`Error in database connecting..`);
      process.exit(1);
    });
};
