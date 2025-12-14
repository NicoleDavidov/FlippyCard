const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    userId: req.userId
  });
});

module.exports = router;
