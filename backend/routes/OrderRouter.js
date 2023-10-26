const express = require('express');
const { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered } = require('../controllers/orderController');
const { auth, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, addOrderItems);
router.get('/', auth, admin, getOrders);
router.get('/myorders', auth, getMyOrders);
router.get('/:id', auth, getOrderById);
router.put('/:id/pay', auth, updateOrderToPaid);
router.get('/:id/deliver', auth, admin, updateOrderToDelivered);

module.exports = router;