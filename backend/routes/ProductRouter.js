const express = require('express');
const { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts } = require('../controllers/productController');
const { auth, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/top', getTopProducts);
router.post('/', auth, admin, createProduct);
router.get('/:id', getProductById);
router.delete('/:id', auth, admin, deleteProduct);
router.put('/:id', auth, admin, updateProduct);
router.post('/:id/reviews', auth, createProductReview);

module.exports = router;