const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const config = require("./config/keys");

const db = knex({
  client: "pg",
  connection: {
    host: config.HostID,
    user: config.UserID,
    password: config.PassWord,
    database: config.DataBase,
  },
});

const app = express();

app.use(cors());

app.use(bodyParser.json());

// app.get("/", (req, res) => {
//     db.select("*")
//     .from("users")
//     .then((data) => {
//         res.json(data);
//     })
//     .catch((err) => res.json("empty credentials"));
//     // res.send(database.users);
// });

app.post("/api/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.json("unable to get user"));
      } else {
        res.json("wrong credentials");
      }
    })
    .catch((err) => res.json("wrong credentials"));
});

app.post("/api/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.json("unable to register"));
});

app.get("/api/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.json("Not found");
      }
    })
    .catch((err) => res.json("error getting user"));
});

app.put("/api/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.json("unable to get entries"));
});

if (process.env.NODE_ENV === "production") {
  // js and css files
  app.use(express.static("client/build"));

  // index.html for all page routes
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);