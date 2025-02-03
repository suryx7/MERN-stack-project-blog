const express = require('express');
const multer = require("multer");
const path = require("path");

const { createPost, updatePost, getPosts, getPostById, DeletePost } = require('../controllers/postController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "file") {
      cb(null, "uploads/files/"); 
    } else if (file.fieldname === "logofile") {
      cb(null, "uploads/logos/"); 
    } else {
      cb(null, "uploads/"); 
    }
  },
});

// Accept all file types by removing the fileFilter
const uploadMiddleware = multer({
  storage: storage,
  // fileFilter: fileFilter, // No filter for file types
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit (optional, adjust as needed)
});


router.post(
  '/',
  authMiddleware,
  uploadMiddleware.fields([
    { name: 'file', maxCount: 1 },
    { name: 'logofile', maxCount: 1 }, 
  ]),
  createPost
);
router.put(
  '/:id',
  authMiddleware,
  uploadMiddleware.fields([
    { name: 'file', maxCount: 1 }, 
    { name: 'logofile', maxCount: 1 },
  ]),
  updatePost
);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.delete('/:id', DeletePost);

module.exports = router;