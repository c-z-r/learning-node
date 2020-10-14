const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const userController = require("../controllers/user");

router.get("/:userId/status", userController.getStatus);
router.patch("/status", isAuth, userController.updateStatus);

module.exports = router;
