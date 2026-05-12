const express = require('express');

const { adminDashboard } = require('../controllers/DashController');
const { authenticateToken, authorizeRoles } = require('../middleware/authmiddleware');


const router = express.Router();

router.get('/admin', authenticateToken, authorizeRoles('admin'), adminDashboard);

module.exports = router;