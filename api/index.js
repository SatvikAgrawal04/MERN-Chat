require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.model.js");
const Message = require("./models/message.model.js");
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

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
        if (err) throw err;
        // console.log(userData);
        resolve(userData);
      });
    } else {
      reject("No token");
    }
  });
}

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.get("/messages/:userid", async (req, res) => {
  const { userid } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserid = userData.userid;
  console.log({ userid, ourUserid });
  const messages = await Message.find({
    senderId: { $in: [userid, ourUserid] },
    recipientId: { $in: [userid, ourUserid] },
  }).sort({ createdAt: 1 });
  // .exec();
  res.status(200).json(messages);
});

app.get("/people", async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
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
    const ifExists = await User.findOne({ username });
    if (ifExists) {
      return res.status(400).json({ message: "Username already exists" });
    }
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
  // Get user data from the cookie
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

  connection.on("message", async (message) => {
    const { recipientId, text, senderId } = JSON.parse(message.toString());
    if (recipientId && text) {
      const messageDoc = await Message.create({
        text,
        recipientId,
        senderId,
      });
      [...wss.clients]
        .filter((client) => client.userid === recipientId)
        .forEach((client) =>
          client.send(
            JSON.stringify({
              text,
              recipientId,
              senderId,
              _id: messageDoc._id,
            })
          )
        );
    }
    // const messageData = JSON.parse(message.toString());
    // const { recipient, text } = messageData;
    // if (recipient && text) {
    //   [...wss.clients]
    //     .filter((c) => c.userid === recipient)
    //     .forEach((c) => c.send(JSON.stringify({ text })));
    // }
  });

  // Inform clients of every online connection when they are connected
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
