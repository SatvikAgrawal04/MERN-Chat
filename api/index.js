require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.model.js");
const jwt = require("jsonwebtoken");

mongoose.connect(process.env.MONGODB_URI);
const jwtSecret = process.env.JWT_SECRET;
const app = express();

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.create({ username, password });
  jwt.sign(
    { userid: user._id },
    jwtSecret,
    { expiresIn: "1d" },
    (err, token) => {
      if (err) throw err;
      res.cookie("token", token).status(201).json("ok");
    }
  );
});

console.log(`listening on http://localhost:${process.env.PORT}`);
app.listen(process.env.PORT);
