const pool = require("../db");

const create_user = async (req, res) => {
  try {
    const query =
      "INSERT INTO ludo.user (name, created_on) VALUES ($1, $2) RETURNING *";
    const values = [req.headers.name, Date.now()];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error in creating the user: ", error);
    res.status(500).json({ error: error });
  }
};

module.exports = { create_user };
