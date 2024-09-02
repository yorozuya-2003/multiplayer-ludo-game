const express = require("express");
const controller = require("../controllers/gameController");

const router = express.Router();

router.post("/", controller.create_game);

module.exports = router;
