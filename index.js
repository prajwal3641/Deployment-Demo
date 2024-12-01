const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

const app = express();

dotenv.config();

let PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  `Server is up and running on port ${PORT}`;
});

app.post("/user/generateToken", (req, res) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: 12,
    username: "prajwal@31",
  };
  const token = jwt.sign(data, jwtSecretKey);
  res.send(token);
});

app.get("/user/validateToken", (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey);
    // we are verifying with the jwt secret key !!
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return res.send("token verified successfully");
    } else {
      return res.status(401).send(error);
    }
  } catch (error) {
    return res.status(401).send(error);
  }
});
