const Card = require("../models/Card");
const AppError = require("../utils/AppError");

/**
 * Create a new card
 * - Auth required
 * - level: 1–10
 * - createdBy: user
 */
exports.createCard = async (req, res, next) => {
  try {
    const { front, back, explanation, level } = req.body;

    if (!front || !back || level === undefined) {
      return next(
        new AppError("Front, back and level are required", 400)
      );
    }

    if (level < 1 || level > 10) {
      return next(
        new AppError("Level must be between 1 and 10", 400)
      );
    }

    const card = await Card.create({
      front,
      back,
      explanation,
      level,
      createdBy: "user",
      createdByUser: req.userId
    });

    res.status(201).json({
      message: "Card created successfully",
      card
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all cards available for the user
 * - system cards
 * - user cards
 */
exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({
      $or: [
        { createdBy: "system" },
        { createdByUser: req.userId }
      ]
    }).sort({ createdAt: -1 });

    res.json(cards);
  } catch (error) {
    next(error);
  }
};
