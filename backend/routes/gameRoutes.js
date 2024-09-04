const express = require("express");
const controller = require("../controllers/gameController");

const router = express.Router();

router.post("/", controller.create_game);
router.get("/state", controller.get_game_state);
router.get("/roll-dice", controller.roll_dice);
router.post("/move-coin", controller.move_coin);

module.exports = router;
