const express = require("express");
const controller = require("../controllers/gameController");
const requireAuth = require("../requireAuth");

const router = express.Router();

router.post("/", requireAuth, controller.create_game);
router.get("/state", requireAuth, controller.get_game_state);
router.get("/roll-dice", requireAuth, controller.roll_dice);
router.post("/move-coin", requireAuth, controller.move_coin);
router.get("/rankings", controller.get_game_rankings);

module.exports = router;
