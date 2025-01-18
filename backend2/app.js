const express = require('express');
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs/promises');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4002;

app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
(async () => {
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir);
  }
})();

const generateHTML = (data) => {
  const uuid = uuidv4();
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Document</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 min-h-screen">
        <div class="container mx-auto px-4 py-8">
            <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                <div class="border-b pb-4 mb-4">
                    <h1 class="text-3xl font-bold text-gray-800">Generated Document</h1>
                    <p class="text-gray-600">ID: ${uuid}</p>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-gray-50 p-4 rounded-md">
                        <h2 class="text-xl font-semibold text-gray-700 mb-2">Document Details</h2>
                        <pre class="text-sm text-gray-600 whitespace-pre-wrap">
                            ${JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                    
                    <div class="flex items-center justify-between mt-6">
                        <span class="text-sm text-gray-500">Generated at: ${new Date().toLocaleString()}</span>
                        <span class="px-4 py-2 bg-green-500 text-white rounded-md">Success</span>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

async function generatePDF(html, outputPath) {
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

app.post('/api/generate-pdf', async (req, res) => {
  try {
    
    const documentId = uuidv4();
    const pdfPath = path.join(uploadsDir, `${documentId}.pdf`);
    
    
    const htmlContent = generateHTML(req.body);
    
    // Generate PDF
    await generatePDF(htmlContent, pdfPath);
    
    
    const pdfUrl = `${req.protocol}://${req.get('host')}/downloads/${documentId}.pdf`;
    const htmlUrl = `${req.protocol}://${req.get('host')}/document/${documentId}`;
    
    // Return success response
    res.json({
      success: true,
      message: 'PDF generated successfully',
      documentId: documentId,
      pdfUrl: pdfUrl,
      htmlUrl: htmlUrl
    });
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF',
      error: error.message
    });
  }
});

app.use('/downloads', express.static(uploadsDir));

app.get('/document/:id', (req, res) => {
  const htmlContent = generateHTML(req.query);
  res.send(htmlContent);
});

async function cleanupOldFiles() {
  try {
    const files = await fs.readdir(uploadsDir);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = await fs.stat(filePath);
      
      
      if (now - stats.mtime.getTime() > 3600000) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.error('Cleanup Error:', error);
  }
}

// Run cleanup every hour
setInterval(cleanupOldFiles, 3600000);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});