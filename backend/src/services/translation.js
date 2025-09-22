const { Translate } = require('@google-cloud/translate').v2;

class TranslationService {
  constructor() {
    this.translate = new Translate({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
    });
  }

  async getSupportedLanguages() {
    try {
      const [languages] = await this.translate.getLanguages();
      
      // Filter and format common languages for legal documents
      const commonLanguages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'zh', name: 'Chinese (Simplified)' },
        { code: 'zh-TW', name: 'Chinese (Traditional)' },
        { code: 'ar', name: 'Arabic' },
        { code: 'hi', name: 'Hindi' },
        { code: 'th', name: 'Thai' },
        { code: 'vi', name: 'Vietnamese' },
        { code: 'nl', name: 'Dutch' },
        { code: 'sv', name: 'Swedish' },
        { code: 'da', name: 'Danish' },
        { code: 'no', name: 'Norwegian' },
        { code: 'fi', name: 'Finnish' },
        { code: 'pl', name: 'Polish' },
        { code: 'tr', name: 'Turkish' },
        { code: 'he', name: 'Hebrew' },
        { code: 'cs', name: 'Czech' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'ro', name: 'Romanian' },
        { code: 'bg', name: 'Bulgarian' },
        { code: 'hr', name: 'Croatian' },
        { code: 'sk', name: 'Slovak' },
        { code: 'sl', name: 'Slovenian' },
        { code: 'et', name: 'Estonian' },
        { code: 'lv', name: 'Latvian' },
        { code: 'lt', name: 'Lithuanian' },
        { code: 'mt', name: 'Maltese' },
        { code: 'id', name: 'Indonesian' },
        { code: 'ms', name: 'Malay' },
        { code: 'tl', name: 'Filipino' },
        { code: 'sw', name: 'Swahili' },
        { code: 'fa', name: 'Persian' },
        { code: 'ur', name: 'Urdu' },
        { code: 'bn', name: 'Bengali' },
        { code: 'gu', name: 'Gujarati' },
        { code: 'ta', name: 'Tamil' },
        { code: 'te', name: 'Telugu' },
        { code: 'kn', name: 'Kannada' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'mr', name: 'Marathi' },
        { code: 'ne', name: 'Nepali' },
        { code: 'si', name: 'Sinhala' }
      ];

      return commonLanguages;
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      // Return default languages if API fails
      return [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'ar', name: 'Arabic' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ru', name: 'Russian' }
      ];
    }
  }

  async translateAnalysis(analysis, targetLanguage) {
    if (targetLanguage === 'en') {
      return analysis;
    }

    try {
      // Translate each field that contains user-facing text
      const fieldsToTranslate = [
        'summary',
        'keyPoints',
        'recommendations'
      ];

      const translatedAnalysis = { ...analysis };

      // Translate simple string fields
      for (const field of fieldsToTranslate) {
        if (analysis[field]) {
          if (Array.isArray(analysis[field])) {
            translatedAnalysis[field] = await this.translateArray(analysis[field], targetLanguage);
          } else {
            translatedAnalysis[field] = await this.translateText(analysis[field], targetLanguage);
          }
        }
      }

      // Translate risk assessment
      if (analysis.riskAssessment) {
        translatedAnalysis.riskAssessment = {
          ...analysis.riskAssessment,
          risks: await this.translateArray(analysis.riskAssessment.risks || [], targetLanguage),
          redFlags: await this.translateArray(analysis.riskAssessment.redFlags || [], targetLanguage)
        };
      }

      // Translate key terms
      if (analysis.keyTerms && Array.isArray(analysis.keyTerms)) {
        translatedAnalysis.keyTerms = await Promise.all(
          analysis.keyTerms.map(async (term) => ({
            term: term.term, // Keep original term
            explanation: await this.translateText(term.explanation, targetLanguage)
          }))
        );
      }

      // Translate important clauses
      if (analysis.importantClauses && Array.isArray(analysis.importantClauses)) {
        translatedAnalysis.importantClauses = await Promise.all(
          analysis.importantClauses.map(async (clause) => ({
            clause: await this.translateText(clause.clause, targetLanguage),
            location: clause.location, // Keep location reference
            importance: await this.translateText(clause.importance, targetLanguage),
            plainLanguage: await this.translateText(clause.plainLanguage, targetLanguage)
          }))
        );
      }

      return translatedAnalysis;
    } catch (error) {
      console.error('Translation error:', error);
      // Return original analysis if translation fails
      return analysis;
    }
  }

  async translateText(text, targetLanguage) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return text;
    }

    try {
      const [translation] = await this.translate.translate(text, targetLanguage);
      return translation;
    } catch (error) {
      console.error(`Error translating text to ${targetLanguage}:`, error);
      return text; // Return original text if translation fails
    }
  }

  async translateArray(array, targetLanguage) {
    if (!Array.isArray(array) || array.length === 0) {
      return array;
    }

    try {
      const translations = await Promise.all(
        array.map(item => this.translateText(item, targetLanguage))
      );
      return translations;
    } catch (error) {
      console.error(`Error translating array to ${targetLanguage}:`, error);
      return array;
    }
  }

  // Helper method to detect language of text
  async detectLanguage(text) {
    try {
      const [detection] = await this.translate.detect(text);
      return {
        language: detection.language,
        confidence: detection.confidence
      };
    } catch (error) {
      console.error('Language detection error:', error);
      return { language: 'unknown', confidence: 0 };
    }
  }

  // Validate language code
  isValidLanguageCode(languageCode) {
    // Basic validation for common language codes
    const validCodes = [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'zh-TW',
      'ar', 'hi', 'th', 'vi', 'nl', 'sv', 'da', 'no', 'fi', 'pl', 'tr',
      'he', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt',
      'mt', 'id', 'ms', 'tl', 'sw', 'fa', 'ur', 'bn', 'gu', 'ta', 'te',
      'kn', 'ml', 'mr', 'ne', 'si'
    ];
    
    return validCodes.includes(languageCode);
  }
}

module.exports = new TranslationService();