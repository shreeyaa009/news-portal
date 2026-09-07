const pool = require("../config/database");

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get categories error:", error.message);

    res.status(500).json({
      message: "Failed to get categories",
      error: error.message,
    });
  }
};

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const result = await pool.query(
      `INSERT INTO categories (name, slug)
       VALUES ($1, $2)
       RETURNING *`,
      [name, slug]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create category error:", error.message);

    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
};