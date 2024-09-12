const express = require("express");
const controller = require("../controllers/userController");

const router = express.Router();

router.post("/sign-up", controller.sign_up);
router.post("/sign-in", controller.sign_in);

module.exports = router;
