"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// Profile Routes
router.get('/profile', authMiddleware_1.authenticate, userController_1.getProfile);
router.put('/profile', authMiddleware_1.authenticate, userController_1.updateProfile);
// Address Routes
router.get('/addresses', authMiddleware_1.authenticate, userController_1.getAddresses);
router.post('/addresses', authMiddleware_1.authenticate, userController_1.addAddress);
router.put('/addresses/:id', authMiddleware_1.authenticate, userController_1.updateAddress);
router.delete('/addresses/:id', authMiddleware_1.authenticate, userController_1.deleteAddress);
router.put('/addresses/:id/default', authMiddleware_1.authenticate, userController_1.setDefaultAddress);
exports.default = router;
