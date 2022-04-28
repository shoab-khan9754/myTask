const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

const app = express();

app.use(cors());

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(allowCrossDomain);
// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);
 // load routes files

const users = require("./routes/api/users");
const products=require("./routes/api/products");
const sell = require("./routes/api/sellProduct")
// Routes
app.use("/api/users", users);
app.use('/api/products',products);
app.use('/api/sellProduct', sell);

app.use(express.static("public"));

// const port = process.env.PORT || 5000;

// app.listen(port, () => console.log(`Server up and running on port ${port} !`));

const port = 4000;

app.listen(port, "localhost", () =>
  console.log(`Server up and running on port ${port} !`)
);
