const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

class DocumentAIService {
  constructor() {
    this.client = new DocumentProcessorServiceClient();
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    this.location = 'us'; // Document AI location
    this.processorId = process.env.DOCUMENT_AI_PROCESSOR_ID || 'default';
  }

  async extractText(file) {
    const { mimetype, buffer, originalname } = file;

    try {
      switch (mimetype) {
        case 'application/pdf':
          return await this.extractFromPDF(buffer);
        
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          return await this.extractFromWord(buffer);
        
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
        case 'image/webp':
          return await this.extractFromImage(buffer, mimetype);
        
        default:
          throw new Error(`Unsupported file type: ${mimetype}`);
      }
    } catch (error) {
      console.error(`Error extracting text from ${originalname}:`, error);
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  }

  async extractFromPDF(buffer) {
    try {
      // First try simple PDF parsing
      const pdfData = await pdfParse(buffer);
      
      if (pdfData.text && pdfData.text.trim().length > 0) {
        return pdfData.text;
      }
      
      // If no text found, use Document AI for OCR
      return await this.processWithDocumentAI(buffer, 'application/pdf');
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  async extractFromWord(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      
      if (result.value && result.value.trim().length > 0) {
        return result.value;
      }
      
      throw new Error('No text content found in Word document');
    } catch (error) {
      console.error('Word extraction error:', error);
      throw new Error('Failed to extract text from Word document');
    }
  }

  async extractFromImage(buffer, mimetype) {
    try {
      return await this.processWithDocumentAI(buffer, mimetype);
    } catch (error) {
      console.error('Image extraction error:', error);
      throw new Error('Failed to extract text from image using OCR');
    }
  }

  async processWithDocumentAI(buffer, mimetype) {
    try {
      const name = `projects/${this.projectId}/locations/${this.location}/processors/${this.processorId}`;
      
      const request = {
        name,
        rawDocument: {
          content: buffer.toString('base64'),
          mimeType: mimetype,
        },
      };

      const [result] = await this.client.processDocument(request);
      const { document } = result;

      if (!document || !document.text) {
        throw new Error('No text extracted from document');
      }

      return document.text;
    } catch (error) {
      console.error('Document AI processing error:', error);
      
      // Fallback: if Document AI fails, try to use a simple OCR approach
      if (mimetype === 'application/pdf') {
        throw new Error('Failed to process PDF with Document AI. The document may be corrupted or contain no readable text.');
      }
      
      throw new Error(`Document AI processing failed: ${error.message}`);
    }
  }

  // Helper method to validate document content
  validateDocumentContent(text) {
    if (!text || typeof text !== 'string') {
      return { isValid: false, error: 'No text content found' };
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return { isValid: false, error: 'Document appears to be empty' };
    }

    if (trimmedText.length < 50) {
      return { isValid: false, error: 'Document content is too short for meaningful analysis' };
    }

    return { isValid: true };
  }
}

module.exports = new DocumentAIService();