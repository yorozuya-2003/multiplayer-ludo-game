const pool = require("../db");

const create_user = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const query =
      "INSERT INTO ludo.user (name, created_on) VALUES ($1, $2) RETURNING *";
    const values = [req.headers.name, Date.now()];

    const result = await pool.query(query, values);
    await client.query("COMMIT");
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in creating the user: ", error);
    res.status(500).json({ error: error });
  } finally {
    client.release();
  }
};

module.exports = { create_user };
