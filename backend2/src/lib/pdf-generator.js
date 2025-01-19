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
          bottom: '40px',
          left: '20px'
        },
        printBackground: true,
        displayHeaderFooter: true,
        footerTemplate: `
          <div style="width: 100%; font-size: 10px; padding: 10px 20px; text-align: center;">
            <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
            <span style="margin-left: 20px">© 2025 Solruf. All Rights Reserved.</span>
          </div>
        `
      });
    } finally {
      await browser.close();
    }
  }
}

module.exports = new PdfGenerator();