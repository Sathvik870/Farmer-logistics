const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(protect);
router.route('/')
  .get(getAllProducts)
  .post(upload.single('productImage'),createProduct);

router.route('/:id')
  .put(upload.single('productImage'),updateProduct)
  .delete(deleteProduct);

module.exports = router;