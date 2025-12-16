const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { createCard, getCards } = require("../controllers/card.controller");

router.post("/", authMiddleware, createCard);
router.get("/", authMiddleware, getCards);

module.exports = router;
