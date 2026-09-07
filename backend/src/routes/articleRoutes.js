const express = require("express");

const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getAllArticles,
} = require("../controllers/articleController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Public routes
router.get("/", getArticles);
router.get("/all", protect, adminOnly, getAllArticles);
router.get("/:id", getArticleById);

// Admin routes
router.post("/", protect, adminOnly, createArticle);
router.put("/:id", protect, adminOnly, updateArticle);
router.delete("/:id", protect, adminOnly, deleteArticle);

module.exports = router;