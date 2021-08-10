const mongoose = require("mongoose");
const { DATABASE_URL } = require("./config");

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection is successful."))
  .catch((error) => console.log(error));
