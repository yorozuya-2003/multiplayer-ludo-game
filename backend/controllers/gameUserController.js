const pool = require("../db");

const create_game_user = async (req, res) => {
  try {
    const query =
      "INSERT INTO game_user (name, created_on) VALUES ($1, $2) RETURNING *";
    const { name } = req.body;
    const values = [name, Date.now()];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

module.exports = { create_game_user };
