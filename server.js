require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const apiRoute = require("./routes");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connection to db established"));

app.use(express.json());

app.use(cors());

app.use("/api/v1", apiRoute);

app.listen(process.env.PORT, () =>
  console.log("server has started at port 3000")
);
