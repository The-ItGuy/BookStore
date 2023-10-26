const express = require('express');
const { authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, getUserById, updateUser } = require('../controllers/userController');
const { auth, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', registerUser);
router.get('/', auth, admin, getUsers);
router.post('/login', authUser);
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.get('/:id', auth, admin, getUserById);
router.put('/:id', auth, admin, updateUser);
router.delete('/:id', auth, admin, deleteUser);

module.exports = router;