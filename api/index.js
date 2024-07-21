const express = require("express");
require("dotenv").config();
const app = express();

app.get("/test", (req, res) => {
  res.json("test ok");
});
console.log(`listening on http://localhost:${process.env.PORT}`);
app.listen(process.env.PORT);
