const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const error = "Auth token not provided.";
    console.error(error);
    return res.status(400).json({ error: error });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user_id = user["id"]["id"];
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      res.status(400).json({ error: "TOKEN_EXPIRED" });
      return;
    }
    res.status(400).json({ error: error });
  }
};

module.exports = validateToken;
