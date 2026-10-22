const express = require("express");

const {
  login,
  getCurrentAdmin,
  logout,
} = require("../controllers/authController");

const requireAuth = require("../middleware/requireAunthentication");

const router = express.Router();

router.post("/login", login);

router.get("/me", requireAuth, getCurrentAdmin);

router.post("/logout", logout);

module.exports = router;