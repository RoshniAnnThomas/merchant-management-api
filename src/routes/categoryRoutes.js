const express = require('express');
const { createCategory } = require('../controllers/categoryController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createCategory);

module.exports = router;
