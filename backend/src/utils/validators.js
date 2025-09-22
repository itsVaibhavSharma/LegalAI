const translationService = require('../services/translation');

// File validation
function validateFile(file) {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size exceeds 50MB limit' };
  }

  // Check file type
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return { 
      isValid: false, 
      error: `Unsupported file type: ${file.mimetype}. Supported types: PDF, DOCX, DOC, JPEG, PNG, GIF, WEBP` 
    };
  }

  // Check filename
  if (!file.originalname || file.originalname.trim().length === 0) {
    return { isValid: false, error: 'Invalid filename' };
  }

  // Check for potentially malicious file extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
  const filename = file.originalname.toLowerCase();
  
  for (const ext of dangerousExtensions) {
    if (filename.endsWith(ext)) {
      return { isValid: false, error: 'File type not allowed for security reasons' };
    }
  }

  return { isValid: true };
}

// Language validation
function validateLanguage(languageCode) {
  if (!languageCode || typeof languageCode !== 'string') {
    return { isValid: false, error: 'Language code is required' };
  }

  const code = languageCode.trim().toLowerCase();
  
  if (code.length < 2 || code.length > 5) {
    return { isValid: false, error: 'Invalid language code format' };
  }

  // Check if it's a valid language code
  if (!translationService.isValidLanguageCode(code)) {
    return { isValid: false, error: `Unsupported language code: ${code}` };
  }

  return { isValid: true };
}

// Request validation
function validateAnalysisRequest(req) {
  const errors = [];

  // Validate file
  const fileValidation = validateFile(req.file);
  if (!fileValidation.isValid) {
    errors.push(fileValidation.error);
  }

  // Validate language if provided
  if (req.body.language) {
    const languageValidation = validateLanguage(req.body.language);
    if (!languageValidation.isValid) {
      errors.push(languageValidation.error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Sanitize text content
function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Remove potentially harmful scripts and HTML
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

// Validate extracted text
function validateExtractedText(text) {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'No text content found' };
  }

  const cleanText = sanitizeText(text);
  
  if (cleanText.length === 0) {
    return { isValid: false, error: 'Document appears to be empty' };
  }

  if (cleanText.length < 50) {
    return { isValid: false, error: 'Document content is too short for meaningful analysis (minimum 50 characters)' };
  }

  // Check for reasonable text content (not just symbols or numbers)
  const letterCount = (cleanText.match(/[a-zA-Z]/g) || []).length;
  const letterRatio = letterCount / cleanText.length;
  
  if (letterRatio < 0.3) {
    return { 
      isValid: false, 
      error: 'Document does not appear to contain sufficient readable text content' 
    };
  }

  return { isValid: true, text: cleanText };
}

// Rate limiting helper
function createRateLimitKey(req) {
  // Create a rate limit key based on IP and user agent
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'unknown';
  
  return `${ip}:${Buffer.from(userAgent).toString('base64').substring(0, 10)}`;
}

// General input sanitization
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }

  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

module.exports = {
  validateFile,
  validateLanguage,
  validateAnalysisRequest,
  validateExtractedText,
  sanitizeText,
  sanitizeInput,
  createRateLimitKey
};