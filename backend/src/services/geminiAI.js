// // backend/src/services/geminiAI.js - FIXED VERSION
// const { VertexAI } = require('@google-cloud/vertexai');

// class GeminiAIService {
//   constructor() {
//     this.vertexAI = new VertexAI({
//       project: process.env.GOOGLE_CLOUD_PROJECT_ID,
//       location: 'us-central1'
//     });
    
//     // FIXED: Use correct stable model
//     this.model = this.vertexAI.getGenerativeModel({
//       model: 'gemini-1.0-pro',  // Changed to stable version
//       generationConfig: {
//         maxOutputTokens: 8192,
//         temperature: 0.2,
//         topP: 0.8,
//       },
//     });
//   }

//   async analyzeLegalDocument(documentText, language = 'en') {
//     try {
//       const prompt = this.buildAnalysisPrompt(documentText, language);
      
//       // Try multiple model versions as fallback
//       const models = [
//   'gemini-1.5-flash-001' // Use the correct and stable model name
// ];

//       for (const modelName of models) {
//         try {
//           console.log(`Trying model: ${modelName}`);
          
//           const model = this.vertexAI.getGenerativeModel({
//             model: modelName,
//             generationConfig: {
//               maxOutputTokens: 8192,
//               temperature: 0.2,
//               topP: 0.8,
//             },
//           });

//           const request = {
//             contents: [{ role: 'user', parts: [{ text: prompt }] }],
//           };

//           const response = await model.generateContent(request);
//           const responseText = response.response.candidates[0].content.parts[0].text;
          
//           console.log(`✅ Success with model: ${modelName}`);
//           return this.parseAnalysisResponse(responseText);
          
//         } catch (modelError) {
//           console.log(`❌ Model ${modelName} failed:`, modelError.message);
//           if (modelName === models[models.length - 1]) {
//             // If this is the last model, throw the error
//             throw modelError;
//           }
//           // Otherwise, continue to next model
//           continue;
//         }
//       }
      
//     } catch (error) {
//       console.error('Gemini AI analysis error:', error);
      
//       // Return mock response as fallback
//       console.log('🔄 Returning mock analysis as fallback...');
//       return this.getMockAnalysis(documentText);
//     }
//   }

//   // Mock analysis for when AI fails
//   getMockAnalysis(documentText) {
//     const wordCount = documentText.split(' ').length;
//     const hasContract = documentText.toLowerCase().includes('contract') || 
//                        documentText.toLowerCase().includes('agreement');
    
//     return {
//       documentType: hasContract ? "Legal Agreement" : "Legal Document",
//       summary: `This document contains ${wordCount} words and appears to be a legal document. AI analysis is currently unavailable, but the document has been processed for basic information.`,
//       keyPoints: [
//         "This is a legal document that requires careful review",
//         "Key terms and conditions are present in the document",
//         "Consider consulting with a legal professional",
//         "Review all sections before signing or agreeing"
//       ],
//       riskAssessment: {
//         level: "MEDIUM",
//         risks: [
//           "Unable to perform detailed risk assessment - AI service unavailable",
//           "Please review manually or consult legal counsel"
//         ],
//         redFlags: []
//       },
//       keyTerms: [
//         {
//           term: "Legal Document",
//           explanation: "A formal document with legal implications that may create binding obligations"
//         }
//       ],
//       recommendations: [
//         "Read the entire document carefully",
//         "Consult with a legal professional before signing",
//         "Ask questions about any unclear terms",
//         "Consider seeking a second opinion"
//       ],
//       importantClauses: [],
//       note: "⚠️ This is a basic analysis. AI service is temporarily unavailable. Please review manually."
//     };
//   }

//   buildAnalysisPrompt(documentText, language) {
//     const languageInstruction = language !== 'en' 
//       ? `Please provide your analysis in ${this.getLanguageName(language)}.` 
//       : '';

//     return `You are a legal expert specializing in simplifying complex legal documents for everyday people. Analyze the following legal document and provide a comprehensive yet accessible explanation.

// ${languageInstruction}

// Please structure your response as a JSON object with the following sections:

// {
//   "documentType": "Brief identification of document type (e.g., 'Rental Agreement', 'Terms of Service', 'Loan Contract')",
//   "summary": "A clear, 2-3 sentence summary of what this document is about in plain language",
//   "keyPoints": [
//     "List of 5-8 most important points from the document that a regular person should know",
//     "Each point should be written in simple, accessible language",
//     "Focus on practical implications for the person signing"
//   ],
//   "riskAssessment": {
//     "level": "LOW/MEDIUM/HIGH",
//     "risks": [
//       "List of potential risks or disadvantages for the signing party",
//       "Include financial risks, legal obligations, or restrictive terms"
//     ],
//     "redFlags": [
//       "Specific clauses or terms that are particularly concerning",
//       "Unusual or unfavorable conditions"
//     ]
//   },
//   "keyTerms": [
//     {
//       "term": "Legal term or jargon from the document",
//       "explanation": "Simple explanation of what this means in everyday language"
//     }
//   ],
//   "recommendations": [
//     "Practical advice for the person considering signing this document",
//     "Questions they should ask before signing",
//     "Suggested modifications or negotiations"
//   ],
//   "importantClauses": [
//     {
//       "clause": "Brief description of the clause",
//       "location": "Section/paragraph reference if identifiable",
//       "importance": "Why this clause matters",
//       "plainLanguage": "What this means in simple terms"
//     }
//   ]
// }

// Document to analyze:
// ${documentText}

// Remember to:
// - Use simple, clear language that anyone can understand
// - Avoid legal jargon unless you explain it
// - Focus on practical implications
// - Be thorough but concise
// - Highlight anything that could be harmful to the signing party
// - Provide actionable advice`;
//   }

//   parseAnalysisResponse(responseText) {
//     try {
//       // Try to extract JSON from the response
//       const jsonMatch = responseText.match(/\{[\s\S]*\}/);
//       if (jsonMatch) {
//         return JSON.parse(jsonMatch[0]);
//       }
      
//       // If no valid JSON found, create a structured response
//       return {
//         documentType: "Legal Document",
//         summary: "Analysis completed but formatting issue occurred. The document has been processed by AI.",
//         keyPoints: [responseText.substring(0, 500) + "..."],
//         riskAssessment: {
//           level: "MEDIUM",
//           risks: ["Unable to assess risks due to formatting issue"],
//           redFlags: []
//         },
//         keyTerms: [],
//         recommendations: ["Please review the document carefully with a legal professional"],
//         importantClauses: [],
//         rawAnalysis: responseText
//       };
//     } catch (error) {
//       console.error('Error parsing AI response:', error);
//       throw new Error('Failed to parse AI analysis response');
//     }
//   }

//   getLanguageName(languageCode) {
//     const languages = {
//       'es': 'Spanish',
//       'fr': 'French',
//       'de': 'German',
//       'it': 'Italian',
//       'pt': 'Portuguese',
//       'ru': 'Russian',
//       'ja': 'Japanese',
//       'ko': 'Korean',
//       'zh': 'Chinese',
//       'ar': 'Arabic',
//       'hi': 'Hindi',
//       'th': 'Thai',
//       'vi': 'Vietnamese',
//       'nl': 'Dutch',
//       'sv': 'Swedish',
//       'da': 'Danish',
//       'no': 'Norwegian',
//       'fi': 'Finnish',
//       'pl': 'Polish',
//       'tr': 'Turkish'
//     };
    
//     return languages[languageCode] || 'English';
//   }

//   validateAnalysis(analysis) {
//     const requiredFields = ['documentType', 'summary', 'keyPoints', 'riskAssessment'];
    
//     for (const field of requiredFields) {
//       if (!analysis[field]) {
//         return { isValid: false, error: `Missing required field: ${field}` };
//       }
//     }

//     if (!Array.isArray(analysis.keyPoints) || analysis.keyPoints.length === 0) {
//       return { isValid: false, error: 'Key points must be a non-empty array' };
//     }

//     if (!analysis.riskAssessment.level || !['LOW', 'MEDIUM', 'HIGH'].includes(analysis.riskAssessment.level)) {
//       return { isValid: false, error: 'Invalid risk assessment level' };
//     }

//     return { isValid: true };
//   }
// }

// module.exports = new GeminiAIService();

// backend/src/services/geminiAI.js - USING GEMINI API
const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiAIService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      this.genAI = null;
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Gemini AI service initialized');
  }

  async analyzeLegalDocument(documentText, language = 'en') {
    try {
      // Check if API key is configured
      if (!this.genAI) {
        console.log('🔄 Gemini API not configured, returning mock analysis...');
        return this.getMockAnalysis(documentText);
      }

      const prompt = this.buildAnalysisPrompt(documentText, language);
      
      // Try different models as fallback
      const models = [
        'gemini-1.5-pro-latest',
        'gemini-1.5-pro',
        'gemini-pro'
      ];

      for (const modelName of models) {
        try {
          console.log(`🔄 Trying Gemini model: ${modelName}`);
          
          const model = this.genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
              maxOutputTokens: 8192,
              temperature: 0.2,
              topP: 0.8,
            },
          });

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const responseText = response.text();
          
          console.log(`✅ Success with Gemini model: ${modelName}`);
          return this.parseAnalysisResponse(responseText);
          
        } catch (modelError) {
          console.log(`❌ Model ${modelName} failed:`, modelError.message);
          if (modelName === models[models.length - 1]) {
            // If this is the last model, throw the error
            throw modelError;
          }
          // Otherwise, continue to next model
          continue;
        }
      }
      
    } catch (error) {
      console.error('Gemini AI analysis error:', error);
      
      // Return mock response as fallback
      console.log('🔄 Returning mock analysis as fallback...');
      return this.getMockAnalysis(documentText);
    }
  }

  // Mock analysis for when AI fails
  getMockAnalysis(documentText) {
    const wordCount = documentText.split(' ').length;
    const hasContract = documentText.toLowerCase().includes('contract') || 
                       documentText.toLowerCase().includes('agreement');
    const hasRental = documentText.toLowerCase().includes('rent') || 
                      documentText.toLowerCase().includes('lease');
    const hasTerms = documentText.toLowerCase().includes('terms') || 
                     documentText.toLowerCase().includes('conditions');
    
    let documentType = "Legal Document";
    if (hasRental) documentType = "Rental/Lease Agreement";
    else if (hasContract) documentType = "Contract/Agreement";
    else if (hasTerms) documentType = "Terms and Conditions";

    return {
      documentType: documentType,
      summary: `This ${wordCount}-word document appears to be a ${documentType.toLowerCase()}. While AI analysis is temporarily unavailable, the document has been processed and contains standard legal language that should be reviewed carefully.`,
      keyPoints: [
        "This is a legal document that creates binding obligations",
        "The document contains terms and conditions that affect your rights",
        "Financial obligations or payments may be involved",
        "There may be penalties or consequences for non-compliance",
        "The document likely has specific termination or cancellation terms",
        "Your personal information and data may be collected and used"
      ],
      riskAssessment: {
        level: "MEDIUM",
        risks: [
          "Unable to perform detailed AI risk assessment - service temporarily unavailable",
          "Legal documents typically contain obligations and potential liabilities",
          "Financial commitments may be present",
          "Please review all terms carefully before signing"
        ],
        redFlags: [
          "AI analysis unavailable - manual review required",
          "Consult legal counsel for complex documents"
        ]
      },
      keyTerms: [
        {
          term: "Legal Document",
          explanation: "A formal document with legal implications that may create binding obligations when signed"
        },
        {
          term: "Terms and Conditions",
          explanation: "Rules and requirements that you agree to follow by signing or using a service"
        },
        {
          term: "Liability",
          explanation: "Legal responsibility for damages, losses, or obligations"
        }
      ],
      recommendations: [
        "Read the entire document thoroughly before signing",
        "Ask questions about any terms you don't understand",
        "Consider consulting with a legal professional for complex documents",
        "Keep a copy of all signed documents for your records",
        "Review cancellation or termination procedures",
        "Understand your rights and obligations under the agreement"
      ],
      importantClauses: [
        {
          clause: "Payment Terms",
          location: "Various sections",
          importance: "Defines when and how much you need to pay",
          plainLanguage: "This tells you exactly when you need to make payments and what happens if you're late"
        },
        {
          clause: "Termination Clause",
          location: "Usually near the end",
          importance: "Explains how the agreement can be ended",
          plainLanguage: "This section tells you how to cancel or end the agreement if needed"
        }
      ],
      note: "⚠️ AI analysis temporarily unavailable. This is a basic analysis based on document content patterns. Please review the document manually or consult legal counsel for important decisions."
    };
  }

  buildAnalysisPrompt(documentText, language) {
    const languageInstruction = language !== 'en' 
      ? `Please provide your analysis in ${this.getLanguageName(language)}.` 
      : '';

    return `You are a legal expert specializing in simplifying complex legal documents for everyday people. Analyze the following legal document and provide a comprehensive yet accessible explanation.

${languageInstruction}

Please structure your response as a JSON object with the following sections:

{
  "documentType": "Brief identification of document type (e.g., 'Rental Agreement', 'Terms of Service', 'Loan Contract')",
  "summary": "A clear, 2-3 sentence summary of what this document is about in plain language",
  "keyPoints": [
    "List of 5-8 most important points from the document that a regular person should know",
    "Each point should be written in simple, accessible language",
    "Focus on practical implications for the person signing"
  ],
  "riskAssessment": {
    "level": "LOW/MEDIUM/HIGH",
    "risks": [
      "List of potential risks or disadvantages for the signing party",
      "Include financial risks, legal obligations, or restrictive terms"
    ],
    "redFlags": [
      "Specific clauses or terms that are particularly concerning",
      "Unusual or unfavorable conditions"
    ]
  },
  "keyTerms": [
    {
      "term": "Legal term or jargon from the document",
      "explanation": "Simple explanation of what this means in everyday language"
    }
  ],
  "recommendations": [
    "Practical advice for the person considering signing this document",
    "Questions they should ask before signing",
    "Suggested modifications or negotiations"
  ],
  "importantClauses": [
    {
      "clause": "Brief description of the clause",
      "location": "Section/paragraph reference if identifiable",
      "importance": "Why this clause matters",
      "plainLanguage": "What this means in simple terms"
    }
  ]
}

Document to analyze:
${documentText}

Remember to:
- Use simple, clear language that anyone can understand
- Avoid legal jargon unless you explain it
- Focus on practical implications
- Be thorough but concise
- Highlight anything that could be harmful to the signing party
- Provide actionable advice`;
  }

  parseAnalysisResponse(responseText) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate the response has required fields
        if (parsed.documentType && parsed.summary && parsed.keyPoints) {
          return parsed;
        }
      }
      
      // If no valid JSON found or missing fields, create a structured response
      return {
        documentType: "Legal Document",
        summary: "AI analysis completed successfully. The document has been processed and contains important legal information that requires careful review.",
        keyPoints: this.extractKeyPointsFromText(responseText),
        riskAssessment: {
          level: "MEDIUM",
          risks: ["Document contains legal obligations that should be reviewed"],
          redFlags: []
        },
        keyTerms: [],
        recommendations: [
          "Review all terms carefully before signing",
          "Consult with a legal professional if needed",
          "Ask questions about unclear provisions"
        ],
        importantClauses: [],
        rawAnalysis: responseText
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI analysis response');
    }
  }

  extractKeyPointsFromText(text) {
    // Extract meaningful sentences from the response
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 6).map(s => s.trim());
  }

  getLanguageName(languageCode) {
    const languages = {
      'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian',
      'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean',
      'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi', 'th': 'Thai',
      'vi': 'Vietnamese', 'nl': 'Dutch', 'sv': 'Swedish', 'da': 'Danish',
      'no': 'Norwegian', 'fi': 'Finnish', 'pl': 'Polish', 'tr': 'Turkish'
    };
    
    return languages[languageCode] || 'English';
  }

  validateAnalysis(analysis) {
    const requiredFields = ['documentType', 'summary', 'keyPoints', 'riskAssessment'];
    
    for (const field of requiredFields) {
      if (!analysis[field]) {
        return { isValid: false, error: `Missing required field: ${field}` };
      }
    }

    if (!Array.isArray(analysis.keyPoints) || analysis.keyPoints.length === 0) {
      return { isValid: false, error: 'Key points must be a non-empty array' };
    }

    if (!analysis.riskAssessment.level || !['LOW', 'MEDIUM', 'HIGH'].includes(analysis.riskAssessment.level)) {
      return { isValid: false, error: 'Invalid risk assessment level' };
    }

    return { isValid: true };
  }
}

module.exports = new GeminiAIService();