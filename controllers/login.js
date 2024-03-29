require("express-async-errors");
const jwt = require("jsonwebtoken");
const express = require("express");

const { SECRET } = require("../utils/config");
const { User, Session } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
  const body = req.body;
  if (!body.username) {
    return res.status(401).json({ error: "invalid username or password" });
  }
  const user = await User.findOne({
    where: { username: body.username },
  });

  const passwordCorrect = body.password === "secret";

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  const session = await Session.findOne({
    where: { userId: user.id }
  })

  if (session) {
    return res
      .status(200)
      .json({
        token: session.token, 
        username: user.username, 
        name: user.name 
      });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  await Session.create({
    token,
    userId: user.id
  })

  res.status(200).json({ token, username: user.username, name: user.name });
});

module.exports = router;
