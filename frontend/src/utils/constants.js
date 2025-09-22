// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  TIMEOUT: 120000, // 2 minutes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // Base delay in ms
};

// File Upload Configuration
export const FILE_CONFIG = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png', '.gif', '.webp'],
  DANGEROUS_EXTENSIONS: ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js', '.jar'],
};

// Supported Languages (fallback list)
export const DEFAULT_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹' },
  { code: 'mt', name: 'Maltese', flag: '🇲🇹' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵' },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰' }
];

// Risk Level Configuration
export const RISK_LEVELS = {
  LOW: {
    color: 'green',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    description: 'Minimal risk - Standard terms and conditions'
  },
  MEDIUM: {
    color: 'yellow',
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    description: 'Moderate risk - Some terms require attention'
  },
  HIGH: {
    color: 'red',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    description: 'High risk - Potentially unfavorable terms'
  },
  UNKNOWN: {
    color: 'gray',
    bgColor: 'bg-gray-500/20',
    textColor: 'text-gray-400',
    borderColor: 'border-gray-500/30',
    description: 'Risk level could not be determined'
  }
};

// Document Types
export const DOCUMENT_TYPES = {
  RENTAL_AGREEMENT: 'Rental Agreement',
  LOAN_CONTRACT: 'Loan Contract',
  TERMS_OF_SERVICE: 'Terms of Service',
  PRIVACY_POLICY: 'Privacy Policy',
  EMPLOYMENT_CONTRACT: 'Employment Contract',
  SERVICE_AGREEMENT: 'Service Agreement',
  PURCHASE_AGREEMENT: 'Purchase Agreement',
  NDA: 'Non-Disclosure Agreement',
  LICENSE_AGREEMENT: 'License Agreement',
  UNKNOWN: 'Legal Document'
};

// Error Messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds 50MB limit. Please choose a smaller file.',
  INVALID_FILE_TYPE: 'Unsupported file type. Please upload PDF, DOCX, DOC, or image files.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  INVALID_RESPONSE: 'Invalid response from server. Please try again.',
  ANALYSIS_FAILED: 'Document analysis failed. Please try again.',
  TRANSLATION_FAILED: 'Translation failed. Showing results in English.',
  DANGEROUS_FILE: 'File type not allowed for security reasons.',
  EMPTY_FILE: 'File appears to be empty or corrupted.',
  NO_TEXT_FOUND: 'No readable text found in the document.',
  PROCESSING_ERROR: 'Error processing document. Please ensure the file is valid.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully!',
  ANALYSIS_COMPLETE: 'Document analyzed successfully!',
  FILE_DOWNLOADED: 'Analysis downloaded!',
  LINK_COPIED: 'Link copied to clipboard!',
  ANALYSIS_SHARED: 'Analysis shared successfully!'
};

// Loading Messages
export const LOADING_MESSAGES = [
  'Extracting text from document...',
  'Analyzing legal content with AI...',
  'Identifying key terms and clauses...',
  'Assessing potential risks...',
  'Generating plain language summary...',
  'Preparing your analysis...'
];

// Application Metadata
export const APP_CONFIG = {
  NAME: 'LegalAI',
  DESCRIPTION: 'Demystify Legal Documents with AI',
  VERSION: '1.0.0',
  AUTHOR: 'Google Cloud AI Team',
  SUPPORT_EMAIL: 'support@legalai.com',
  PRIVACY_POLICY_URL: '/privacy',
  TERMS_OF_SERVICE_URL: '/terms',
  GITHUB_URL: 'https://github.com/your-org/legal-document-ai'
};

// Feature Flags
export const FEATURES = {
  DOCUMENT_SHARING: true,
  DOWNLOAD_ANALYSIS: true,
  MULTIPLE_LANGUAGES: true,
  OFFLINE_MODE: false,
  DARK_MODE: true,
  ANALYTICS: false,
  BETA_FEATURES: false
};

// Animation Durations (in seconds)
export const ANIMATIONS = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
  PAGE_TRANSITION: 0.4,
  HOVER: 0.15,
  LOADING: 2.0
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Color Palette
export const COLORS = {
  PRIMARY: {
    50: '#f0f9ff',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    900: '#3730a3'
  },
  SECONDARY: {
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490'
  },
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  SELECTED_LANGUAGE: 'legalai_selected_language',
  THEME_PREFERENCE: 'legalai_theme',
  RECENT_ANALYSES: 'legalai_recent_analyses',
  USER_PREFERENCES: 'legalai_user_preferences'
};

// Default Values
export const DEFAULTS = {
  LANGUAGE: 'en',
  THEME: 'dark',
  MAX_RECENT_ANALYSES: 10,
  ANALYSIS_EXPIRY_DAYS: 7
};

export default {
  API_CONFIG,
  FILE_CONFIG,
  DEFAULT_LANGUAGES,
  RISK_LEVELS,
  DOCUMENT_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  APP_CONFIG,
  FEATURES,
  ANIMATIONS,
  BREAKPOINTS,
  COLORS,
  STORAGE_KEYS,
  DEFAULTS
};