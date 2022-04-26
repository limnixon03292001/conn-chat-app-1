const express = require("express");
const auth = require("../middlewares/auth");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatControllers");

const router = express.Router();

router.post("/", auth, accessChat);
router.get("/", auth, fetchChats);
router.post("/group", auth, createGroupChat);
router.put("/rename", auth, renameGroup);
router.put("/groupadd", auth, addToGroup);
router.put("/groupremove", auth, removeFromGroup);

module.exports = router