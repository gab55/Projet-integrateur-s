const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const User = require("../models/User");

router.post("/", verifyToken, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { pushToken: req.body.token });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;