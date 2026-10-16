const express = require("express");
const router = express.Router();

const { getAdminEmail } = require("../controllers/authController");

router.post("/email", getAdminEmail);

module.exports = router;