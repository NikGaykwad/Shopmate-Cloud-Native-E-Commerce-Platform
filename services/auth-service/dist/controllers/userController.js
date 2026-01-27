"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultAddress = exports.deleteAddress = exports.updateAddress = exports.addAddress = exports.getAddresses = exports.updateProfile = exports.getProfile = void 0;
const db_1 = require("../config/db");
// ==========================================
// PROFILE MANAGEMENT
// ==========================================
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const result = yield (0, db_1.query)('SELECT id, email, full_name, phone_number, role, created_at FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { full_name, phone_number } = req.body;
    try {
        const result = yield (0, db_1.query)('UPDATE users SET full_name = COALESCE($1, full_name), phone_number = COALESCE($2, phone_number) WHERE id = $3 RETURNING id, email, full_name, phone_number, role', [full_name, phone_number, userId]);
        res.json({ message: 'Profile updated successfully', user: result.rows[0] });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateProfile = updateProfile;
// ==========================================
// ADDRESS MANAGEMENT
// ==========================================
const getAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const result = yield (0, db_1.query)('SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC', [userId]);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAddresses = getAddresses;
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { full_name, phone_number, address_line, city, state, pincode, country, is_default } = req.body;
    if (!full_name || !phone_number || !address_line || !city || !state || !pincode || !country) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        yield (0, db_1.query)('BEGIN');
        // If this is set as default, unset other defaults
        if (is_default) {
            yield (0, db_1.query)('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
        }
        // If it's the first address, make it default automatically
        const countRes = yield (0, db_1.query)('SELECT COUNT(*) FROM addresses WHERE user_id = $1', [userId]);
        const isFirst = parseInt(countRes.rows[0].count) === 0;
        const setAsDefault = is_default || isFirst;
        const result = yield (0, db_1.query)(`INSERT INTO addresses 
            (user_id, full_name, phone_number, address_line, city, state, pincode, country, is_default) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`, [userId, full_name, phone_number, address_line, city, state, pincode, country, setAsDefault]);
        yield (0, db_1.query)('COMMIT');
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        yield (0, db_1.query)('ROLLBACK');
        console.error('Error adding address:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addAddress = addAddress;
const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { id } = req.params;
    const { full_name, phone_number, address_line, city, state, pincode, country, is_default } = req.body;
    try {
        const check = yield (0, db_1.query)('SELECT * FROM addresses WHERE id = $1 AND user_id = $2', [id, userId]);
        if (check.rows.length === 0)
            return res.status(404).json({ message: 'Address not found' });
        yield (0, db_1.query)('BEGIN');
        if (is_default) {
            yield (0, db_1.query)('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
        }
        const result = yield (0, db_1.query)(`UPDATE addresses SET 
            full_name = $1, phone_number = $2, address_line = $3, city = $4, state = $5, pincode = $6, country = $7, is_default = COALESCE($8, is_default)
            WHERE id = $9 AND user_id = $10 
            RETURNING *`, [full_name, phone_number, address_line, city, state, pincode, country, is_default, id, userId]);
        yield (0, db_1.query)('COMMIT');
        res.json(result.rows[0]);
    }
    catch (error) {
        yield (0, db_1.query)('ROLLBACK');
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateAddress = updateAddress;
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const result = yield (0, db_1.query)('DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
        if (result.rows.length === 0)
            return res.status(404).json({ message: 'Address not found' });
        res.json({ message: 'Address deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteAddress = deleteAddress;
const setDefaultAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        yield (0, db_1.query)('BEGIN');
        yield (0, db_1.query)('UPDATE addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
        const result = yield (0, db_1.query)('UPDATE addresses SET is_default = TRUE WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
        if (result.rows.length === 0) {
            yield (0, db_1.query)('ROLLBACK');
            return res.status(404).json({ message: 'Address not found' });
        }
        yield (0, db_1.query)('COMMIT');
        res.json(result.rows[0]);
    }
    catch (error) {
        yield (0, db_1.query)('ROLLBACK');
        console.error('Error setting default address:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.setDefaultAddress = setDefaultAddress;
