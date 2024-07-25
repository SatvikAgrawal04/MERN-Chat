require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.model.js");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const ws = require("ws");

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

//AUTHENTICATION
app.get("/profile", async (req, res) => {
  // const { token } = req.cookies;
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
      if (err) throw err;
      res.json({
        userData,
      });
    });
  } else {
    res.status(401).json("No token");
  }
});

//LOGIN API
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

//REGISTER API
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
  } catch (error) {
    if (error) throw error;
    res.status(500).json({ message: "Something went wrong" });
  }
});

console.log(`listening on http://localhost:${process.env.PORT}`);
const server = app.listen(process.env.PORT);

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.replace("token=", "");
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
          if (err) throw err;
          const { userid, username } = userData;
          connection.userid = userid;
          connection.username = username;
        });
      }
    }
  }

  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => ({
          userid: c.userid,
          username: c.username,
        })),
      })
    );
  });
});
