const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf-controller');

router.post('/generate-pdf', pdfController.generatePdf);
router.get('/document/:id', pdfController.showDocument);

module.exports = router;