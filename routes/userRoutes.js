const express = require("express");
const auth = require("../middlewares/auth");
const { registerUser, authUser, allUsers } = require("../controllers/userControllers"); 

const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/",auth, allUsers);


module.exports = router;
