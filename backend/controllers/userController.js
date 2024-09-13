const dotenv = require("dotenv");
dotenv.config();

const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// jwt tokens
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "6h" });
};

const sign_up = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // checking headers
    const reqUsername = req.headers.username;
    const reqPassword = req.headers.password;

    if (!reqUsername || !reqPassword) {
      await client.query("ROLLBACK");
      const error = "Fields must not be empty.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    // checking if user already exists
    const matchingUsernames = await client.query(
      "SELECT username FROM ludo.user where username=$1",
      [reqUsername]
    );
    if (matchingUsernames.rowCount != 0) {
      await client.query("ROLLBACK");
      const error = "Username already exists.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    if (reqUsername.length < 6) {
      await client.query("ROLLBACK");
      const error = "Username should be atleast 6 characters long.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    // if (!validator.isStrongPassword(reqPassword)) {
    if (reqPassword.length < 8) {
      await client.query("ROLLBACK");
      const error = "Weak password.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(reqPassword, salt);

    const user = await client.query(
      "INSERT INTO ludo.user (username, password, created_on) VALUES ($1, $2, $3) returning *",
      [reqUsername, hashedPassword, Date.now()]
    );
    const token = generateToken({ id: user.rows[0] });

    await client.query("COMMIT");

    res.status(201).json({
      id: user.rows[0].id,
      username: user.rows[0].username,
      token: token,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in user sign-up: ", error);
    res.status(500).json({ error: error });
  } finally {
    client.release();
  }
};

const sign_in = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // checking headers
    const reqUsername = req.headers.username;
    const reqPassword = req.headers.password;

    if (!reqUsername || !reqPassword) {
      await client.query("ROLLBACK");
      const error = "Fields must not be empty.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    // checking if user exists
    const matchingUsers = await client.query(
      "SELECT * FROM ludo.user where username=$1",
      [reqUsername]
    );
    if (matchingUsers.rowCount === 0) {
      await client.query("ROLLBACK");
      const error = "Username does not exist.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      reqPassword,
      matchingUsers.rows[0].password
    );

    if (!passwordMatch) {
      await client.query("ROLLBACK");
      const error = "Password does not match.";
      console.error(error);
      res.status(400).json({ error: error });
      return;
    }

    const token = generateToken({ id: matchingUsers.rows[0].id });

    await client.query("COMMIT");
    res.status(201).json({
      id: matchingUsers.rows[0].id,
      username: matchingUsers.rows[0].username,
      token: token,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error in user sign-in: ", error);
    res.status(500).json({ error: error });
  } finally {
    client.release();
  }
};

module.exports = { sign_up, sign_in };
