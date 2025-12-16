const Card = require("../models/Card");

/**
 * Create a new card
 * - User must be authenticated
 * - level is required (1–10)
 * - createdBy: "user"
 * - createdByUser: userId
 */
exports.createCard = async (req, res) => {
  try {
    const { front, back, explanation, level } = req.body;

    // basic validation
    if (!front || !back || level === undefined) {
      return res.status(400).json({
        message: "Front, back and level are required"
      });
    }

    if (level < 1 || level > 10) {
      return res.status(400).json({
        message: "Level must be between 1 and 10"
      });
    }

    const card = new Card({
      front,
      back,
      explanation,
      level,
      createdBy: "user",
      createdByUser: req.userId
    });

    await card.save();

    res.status(201).json({
      message: "Card created successfully",
      card
    });
  } catch (error) {
    console.error("Create card error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all cards available for the user
 * - system cards
 * - cards created by this user
 */
exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({
      $or: [
        { createdBy: "system" },
        { createdByUser: req.userId }
      ]
    }).sort({ createdAt: -1 });

    res.json(cards);
  } catch (error) {
    console.error("Get cards error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
