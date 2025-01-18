const pdfService = require('../services/pdf-service');

class PdfController {
  async generatePdf(req, res) {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const result = await pdfService.generateDocument(req.body, baseUrl);
      
      res.json({
        success: true,
        message: 'PDF generated successfully',
        ...result
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating PDF',
        error: error.message
      });
    }
  }

  showDocument(req, res) {
    const htmlContent = pdfService.generateHTML(req.query, req.params.id);
    res.send(htmlContent);
  }
}

module.exports = new PdfController();