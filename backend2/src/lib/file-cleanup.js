const fs = require('fs/promises');
const path = require('path');
const config = require('../config/config');

class FileCleanup {
  async cleanupOldFiles() {
    try {
      const files = await fs.readdir(config.uploadsDir);
      const now = Date.now();
      
      for (const file of files) {
        const filePath = path.join(config.uploadsDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > config.fileMaxAge) {
          await fs.unlink(filePath);
        }
      }
    } catch (error) {
      console.error('Cleanup Error:', error);
    }
  }

  startCleanupSchedule() {
    setInterval(() => this.cleanupOldFiles(), config.cleanupInterval);
  }
}

module.exports = new FileCleanup();