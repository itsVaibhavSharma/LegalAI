// src/utils/fileHandler.js
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class FileHandler {
  constructor() {
    this.tempDir = path.join(__dirname, '../../temp');
    this.maxFileAge = 3600000; // 1 hour in milliseconds
    
    // Ensure temp directory exists
    this.ensureTempDir();
    
    // Clean up old files periodically
    setInterval(() => this.cleanupTempFiles(), 300000); // Every 5 minutes
  }

  async ensureTempDir() {
    try {
      await fs.access(this.tempDir);
    } catch {
      await fs.mkdir(this.tempDir, { recursive: true });
    }
  }

  // Generate a secure filename
  generateSecureFilename(originalName) {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    
    // Sanitize the base name
    const sanitizedBaseName = baseName
      .replace(/[^a-zA-Z0-9\-_]/g, '_')
      .substring(0, 50);
    
    return `${timestamp}_${randomBytes}_${sanitizedBaseName}${extension}`;
  }

  // Save uploaded file temporarily
  async saveTemporaryFile(fileBuffer, originalName) {
    const filename = this.generateSecureFilename(originalName);
    const filepath = path.join(this.tempDir, filename);
    
    await fs.writeFile(filepath, fileBuffer);
    
    return {
      filepath,
      filename,
      cleanup: () => this.deleteFile(filepath)
    };
  }

  // Delete a specific file
  async deleteFile(filepath) {
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error(`Error deleting file ${filepath}:`, error);
    }
  }

  // Clean up old temporary files
  async cleanupTempFiles() {
    try {
      const files = await fs.readdir(this.tempDir);
      const now = Date.now();
      
      for (const file of files) {
        const filepath = path.join(this.tempDir, file);
        const stats = await fs.stat(filepath);
        
        if (now - stats.birthtime.getTime() > this.maxFileAge) {
          await this.deleteFile(filepath);
        }
      }
    } catch (error) {
      console.error('Error cleaning up temp files:', error);
    }
  }

  // Get file info
  async getFileInfo(filepath) {
    try {
      const stats = await fs.stat(filepath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        exists: true
      };
    } catch {
      return { exists: false };
    }
  }

  // Validate file path (security check)
  validateFilePath(filepath) {
    const resolvedPath = path.resolve(filepath);
    const tempDirResolved = path.resolve(this.tempDir);
    
    // Ensure the file is within the temp directory
    return resolvedPath.startsWith(tempDirResolved);
  }
}

module.exports = new FileHandler();

// .env.example file content:
/*
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-google-cloud-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json

# Document AI Configuration (optional - will use default processor if not specified)
DOCUMENT_AI_PROCESSOR_ID=your-document-ai-processor-id

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Optional: Enable debug logging
DEBUG=true
*/