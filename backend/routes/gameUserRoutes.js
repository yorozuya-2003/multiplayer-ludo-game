const express = require("express");
const controller = require("../controllers/gameUserController");

const router = express.Router();

router.post("/", controller.create_game_user);

module.exports = router;
