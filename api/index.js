require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.model.js");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

try {
  mongoose.connect(process.env.MONGODB_URI);
} catch (error) {
  if (error) throw error;
}
const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(cookieParser());
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

app.get("/profile", async (req, res) => {
  // const { token } = req.cookies;
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
      if (err) throw err;
      console.log(userData);
      res.json({
        userData,
      });
    });
  } else {
    res.status(401).json("No token");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    jwt.sign(
      {
        userid: user._id,
        username,
      },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).status(200).json({
          id: user._id,
          message: "Login successful",
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Something Went Wrong during login" });
    return;
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    jwt.sign({ userid: user._id, username }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).status(201).json({
        id: user._id,
      });
    });
    console.log(user);
  } catch (error) {
    if (error) throw error;
    res.status(500).json({ message: "Something went wrong" });
  }
});

console.log(`listening on http://localhost:${process.env.PORT}`);
app.listen(process.env.PORT);
