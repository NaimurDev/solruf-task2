const express = require('express');
const config = require('./src/config/config');
const pdfRoutes = require('./src/routes/pdf-routes');
const fileCleanup = require('./src/lib/file-cleanup');

const app = express();

app.use(express.json());
app.use('/downloads', express.static(config.uploadsDir));
app.use('/api', pdfRoutes);

fileCleanup.startCleanupSchedule();

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});