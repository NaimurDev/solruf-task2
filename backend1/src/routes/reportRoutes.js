const express = require('express');
const router = express.Router();
const { saveAndForward, getReport } = require('../controllers/reportController');

router.post('/save-and-forward', saveAndForward);
router.get('/reports/:id', getReport);

module.exports = router;