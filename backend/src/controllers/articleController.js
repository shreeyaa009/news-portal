const pool = require("../config/database");

// CREATE ARTICLE
const createArticle = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      image_url,
      category_id,
      author_id,
      status = "draft",
    } = req.body;

    const publishedAt =
      status === "published" ? new Date() : null;

    const result = await pool.query(
      `INSERT INTO articles
      (title, slug, excerpt, content, image_url, category_id, author_id, status, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        title,
        slug,
        excerpt,
        content,
        image_url,
        category_id,
        author_id,
        status,
        publishedAt,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create article error:", error.message);

    res.status(500).json({
      message: "Failed to create article",
      error: error.message,
    });
  }
};

// GET ALL PUBLISHED ARTICLES
const getArticles = async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    let query = `
      SELECT
        articles.*,
        categories.name AS category_name
      FROM articles
      LEFT JOIN categories
        ON articles.category_id = categories.id
      WHERE articles.status = 'published'
    `;

    const values = [];

    if (category) {
      values.push(category);
      query += ` AND categories.slug = $${values.length}`;
    }

    if (search) {
      values.push(`%${search}%`);
      query += ` AND (
        articles.title ILIKE $${values.length}
        OR articles.excerpt ILIKE $${values.length}
        OR articles.content ILIKE $${values.length}
      )`;
    }

    if (sort === "popular") {
      query += " ORDER BY articles.views DESC";
    } else {
      query += " ORDER BY articles.published_at DESC";
    }

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error("Get articles error:", error.message);

    res.status(500).json({
      message: "Failed to get articles",
      error: error.message,
    });
  }
};

// GET ALL ARTICLES FOR ADMIN
const getAllArticles = async (req, res) => {
  try {
    const { status, category, search, sort } = req.query;

    let query = `
      SELECT
        articles.*,
        categories.name AS category_name,
        users.name AS author_name
      FROM articles
      LEFT JOIN categories
        ON articles.category_id = categories.id
      LEFT JOIN users
        ON articles.author_id = users.id
      WHERE 1=1
    `;

    const values = [];

    // Filter by status
    if (status) {
      values.push(status);
      query += ` AND articles.status = $${values.length}`;
    }

    // Filter by category
    if (category) {
      values.push(category);
      query += ` AND categories.slug = $${values.length}`;
    }

    // Search
    if (search) {
      values.push(`%${search}%`);
      query += ` AND (
        articles.title ILIKE $${values.length}
        OR articles.excerpt ILIKE $${values.length}
        OR articles.content ILIKE $${values.length}
      )`;
    }

    // Sorting
    if (sort === "popular") {
      query += " ORDER BY articles.views DESC";
    } else {
      query += " ORDER BY articles.created_at DESC";
    }

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error("Get all articles error:", error.message);

    res.status(500).json({
      message: "Failed to get all articles",
      error: error.message,
    });
  }
};

// GET ONE ARTICLE
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        articles.*,
        categories.name AS category_name
       FROM articles
       LEFT JOIN categories
         ON articles.category_id = categories.id
       WHERE articles.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get article error:", error.message);

    res.status(500).json({
      message: "Failed to get article",
      error: error.message,
    });
  }
};

// UPDATE ARTICLE
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      excerpt,
      content,
      image_url,
      category_id,
      status,
    } = req.body;

    const publishedAt =
      status === "published" ? new Date() : null;

    const result = await pool.query(
      `UPDATE articles
       SET
         title = $1,
         slug = $2,
         excerpt = $3,
         content = $4,
         image_url = $5,
         category_id = $6,
         status = $7,
         published_at = $8,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        title,
        slug,
        excerpt,
        content,
        image_url,
        category_id,
        status,
        publishedAt,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update article error:", error.message);

    res.status(500).json({
      message: "Failed to update article",
      error: error.message,
    });
  }
};

// DELETE ARTICLE
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM articles WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.json({
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Delete article error:", error.message);

    res.status(500).json({
      message: "Failed to delete article",
      error: error.message,
    });
  }
};

module.exports = {
  createArticle,
  getArticles,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};