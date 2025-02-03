const express = require('express');
const mongoose = require('mongoose');
const { searchPosts } = require('../controllers/postController');
const { sendMassage } = require('../controllers/userController');
const router = express.Router();


router.get("/", searchPosts);
router.post("/", sendMassage);

module.exports = router;
