// routes/auth.js — aiguillage des URLs d'authentification
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);

module.exports = router;