const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs/promises');
const config = require('../config/config');
const pdfGenerator = require('../lib/pdf-generator');

class PdfService {
  constructor() {
    this.initializeUploadsDir();
  }

  async initializeUploadsDir() {
    try {
      await fs.access(config.uploadsDir); 
    } catch {
      await fs.mkdir(config.uploadsDir, { recursive: true }); 
    }
  }

  async generateDocument(data, baseUrl) {
    const documentId = uuidv4(); 
    const pdfPath = path.join(config.uploadsDir, `${documentId}.pdf`);
    
    const htmlContent = await this.generateHTML(data, documentId);

    await pdfGenerator.generatePDF(htmlContent, pdfPath);
    
    return {
      documentId,
      pdfUrl: `${baseUrl}/downloads/${documentId}.pdf`,
      htmlUrl: `${baseUrl}/document/${documentId}`
    };
  }

  async generateHTML(data, documentId) {

    const templatePath = path.join(__dirname, '../templates/document.html');
    const template = await fs.readFile(templatePath, 'utf-8');

    return template
      .replace('{{documentId}}', documentId)
      .replace('{{content}}', JSON.stringify(data, null, 2))
      .replace('{{timestamp}}', new Date().toLocaleString());
  }
}

module.exports = new PdfService();
