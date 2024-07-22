require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.model.js");
const jwt = require("jsonwebtoken");
const cors = require("cors");

try {
  mongoose.connect(process.env.MONGODB_URI);
} catch (error) {
  if (error) throw error;
}
const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.create({ username, password });
    jwt.sign(
      { userid: user._id },
      jwtSecret,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).status(201).json({
          id: user._id,
        });
      }
    );
    console.log(user);
  } catch (error) {
    if (error) throw error;
    res.status(500).json({ message: "Something went wrong" });
  }
});

console.log(`listening on http://localhost:${process.env.PORT}`);
app.listen(process.env.PORT);
