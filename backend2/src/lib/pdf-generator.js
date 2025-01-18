const puppeteer = require('puppeteer');

class PdfGenerator {
  async generatePDF(html, outputPath) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });
      
      await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        printBackground: true
      });
    } finally {
      await browser.close();
    }
  }
}

module.exports = new PdfGenerator();