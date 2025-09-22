const express = require('express');
const router = express.Router();

const documentAIService = require('../services/documentAI');
const geminiAIService = require('../services/geminiAI');
const translationService = require('../services/translation');
const { validateFile, validateLanguage } = require('../utils/validators');

// Process document endpoint
router.post('/analyze', async (req, res) => {
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { language = 'en' } = req.body;
    
    // Validate file and language
    const fileValidation = validateFile(req.file);
    if (!fileValidation.isValid) {
      return res.status(400).json({ error: fileValidation.error });
    }

    const languageValidation = validateLanguage(language);
    if (!languageValidation.isValid) {
      return res.status(400).json({ error: languageValidation.error });
    }

    console.log(`Processing ${req.file.originalname} (${req.file.size} bytes) in ${language}`);

    // Step 1: Extract text from document
    let extractedText;
    try {
      extractedText = await documentAIService.extractText(req.file);
    } catch (error) {
      console.error('Document extraction error:', error);
      return res.status(500).json({ 
        error: 'Failed to extract text from document. Please ensure the file is valid and readable.' 
      });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ 
        error: 'No readable text found in the document. Please check if the file contains text.' 
      });
    }

    // Step 2: Analyze with Gemini AI
    let analysis;
    try {
      analysis = await geminiAIService.analyzeLegalDocument(extractedText, language);
    } catch (error) {
      console.error('AI analysis error:', error);
      return res.status(500).json({ 
        error: 'Failed to analyze document. Please try again.' 
      });
    }

    // Step 3: Translate if needed (only if language is not English)
    let translatedAnalysis = analysis;
    if (language !== 'en') {
      try {
        translatedAnalysis = await translationService.translateAnalysis(analysis, language);
      } catch (error) {
        console.error('Translation error:', error);
        // Continue with English analysis if translation fails
        translatedAnalysis = analysis;
      }
    }

    // Prepare response
    const response = {
      success: true,
      documentInfo: {
        filename: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        language: language
      },
      extractedText: extractedText.substring(0, 500) + '...', // First 500 chars for preview
      analysis: translatedAnalysis,
      processedAt: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Unexpected error in document analysis:', error);
    res.status(500).json({ 
      error: 'An unexpected error occurred. Please try again.' 
    });
  }
});

// Get supported languages
router.get('/languages', async (req, res) => {
  try {
    const languages = await translationService.getSupportedLanguages();
    res.json({ languages });
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch supported languages' 
    });
  }
});

// Document types info
router.get('/supported-types', (req, res) => {
  const supportedTypes = [
    {
      type: 'PDF',
      mimeTypes: ['application/pdf'],
      description: 'Portable Document Format files, including scanned documents'
    },
    {
      type: 'DOCX',
      mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      description: 'Microsoft Word documents (2007 and newer)'
    },
    {
      type: 'DOC',
      mimeTypes: ['application/msword'],
      description: 'Legacy Microsoft Word documents'
    },
    {
      type: 'Images',
      mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      description: 'Image files containing text (OCR will be performed)'
    }
  ];

  res.json({ supportedTypes });
});

module.exports = router;