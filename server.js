const express = require("express");
const bodyParser = require("body-parser"); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const auth = require("./controllers/authorization");

const db = knex({
  // connect to your own database here:
  client: "pg",
  connection: process.env.POSTGRES_URI,
}); // res.json({
//   name: "suraj",
//   age: 23,
//   rollNo: 91700103194,
// });

const app = express();

app.use(cors());
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((users) => {
      console.log(users);
      return res.status(200).json(users);
    });

  // res.json({
  //   name: "suraj",
  //   age: 23,
  //   rollNo: 91700103194,
  // });
  // res.send(db.users, "hello");
});
app.post("/signin", signin.signinAuthentication(db, bcrypt));

app.post("/register", (req, res) => {
  register.registerAuthentication(req, res, db, bcrypt);
});
app.get("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.post("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

app.put("/image", auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(5000, () => {
  console.log("app is running on port 5000");
});
