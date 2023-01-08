require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const UserModel = require("./models/user");
const { formatDate } = require("./utils");

const app = express();

app.use(cors());

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res, next) => {
  const user = new UserModel({
    username: req.body.username,
  });

  user.save((error, savedUser) => {
    if (error) {
      return next({ message: error });
    }

    return res.json({
      username: savedUser.username,
      _id: savedUser._id,
    });
  });
});

app.get("/api/users", (req, res, next) => {
  UserModel.find({}, "username _id", (error, users) => {
    if (error) {
      return next({ message: error });
    }

    return res.json(users);
  });
});

app.post("/api/users/:_id/exercises", (req, res, next) => {
  const { _id } = req.params;

  UserModel.findById(_id, (error, user) => {
    if (error) {
      return next({ message: error });
    }

    if (!user) {
      return next({ message: "No user" });
    }

    const { description } = req.body;

    duration = parseInt(req.body.duration);
    date = req.body.date ? new Date(req.body.date) : new Date();

    const exercise = {
      description,
      duration,
      date,
    };

    user.exercises.push(exercise);

    user.save((error, savedUser) => {
      if (error) {
        return next({ message: error });
      }

      const { username, _id } = savedUser;

      res.json({
        username,
        _id,
        ...exercise,
        date: formatDate(exercise.date),
      });
    });
  });
});

app.get("/api/users/:_id/logs", (req, res, next) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  UserModel.find(
    {
      _id,
    },
    (error, users) => {
      if (error) {
        return next({ message: error });
      }

      if (!users) {
        return next({ message: "No user" });
      }

      const user = users[0];

      res.json({
        username: user.username,
        count: user.exercises.length,
        _id,
        log: user.exercises.map((exercise) => ({
          description: exercise.description,
          duration: exercise.duration,
          date: formatDate(exercise.date),
        })),
      });
    }
  );
});

app.use((err, req, res, next) => {
  if (err) {
    return res.json({ error: err.message });
  }
});

const start = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB database successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB database", error);
  }

  const listener = app.listen(3000, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
  });
};

start();
