const express = require("express");
const auth = require("../middlewares/auth");
const { sendMessage, allMessages } = require("../controllers/messageControllers");

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/:chatId", auth, allMessages);


module.exports = router
