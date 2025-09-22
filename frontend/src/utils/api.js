import axios from 'axios';
import { API_CONFIG } from './constants';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and auth
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Add timestamp to requests for cache busting
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle network errors
    if (!error.response) {
      error.code = 'NETWORK_ERROR';
      error.message = 'Network error. Please check your connection.';
    }
    // Handle timeout errors
    else if (error.code === 'ECONNABORTED') {
      error.code = 'TIMEOUT_ERROR';
      error.message = 'Request timed out. Please try again.';
    }
    // Handle server errors
    else if (error.response.status >= 500) {
      error.message = 'Server error. Please try again later.';
    }
    // Handle client errors
    else if (error.response.status >= 400) {
      error.message = error.response.data?.error || 'Request failed.';
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Analyze document
  async analyzeDocument(formData) {
    try {
      // Special handling for file uploads
      const response = await apiClient.post('/api/documents/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes for document processing
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      return response.data;
    } catch (error) {
      console.error('Document analysis failed:', error);
      
      // Handle specific error cases
      if (error.response?.status === 413) {
        throw new Error('File too large. Maximum size is 50MB.');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.error || 'Invalid file or request.');
      } else if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }
      
      throw error;
    }
  },

  // Get supported languages
  async getSupportedLanguages() {
    try {
      const response = await apiClient.get('/api/documents/languages');
      return response.data.languages || [];
    } catch (error) {
      console.error('Failed to fetch supported languages:', error);
      
      // Return default languages if API fails
      return [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ar', name: 'Arabic' },
        { code: 'hi', name: 'Hindi' }
      ];
    }
  },

  // Get supported file types
  async getSupportedFileTypes() {
    try {
      const response = await apiClient.get('/api/documents/supported-types');
      return response.data.supportedTypes || [];
    } catch (error) {
      console.error('Failed to fetch supported file types:', error);
      
      // Return default supported types
      return [
        {
          type: 'PDF',
          mimeTypes: ['application/pdf'],
          description: 'Portable Document Format files'
        },
        {
          type: 'DOCX',
          mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          description: 'Microsoft Word documents'
        },
        {
          type: 'Images',
          mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          description: 'Image files (OCR will be performed)'
        }
      ];
    }
  },

  // Upload with retry logic
  async uploadWithRetry(formData, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Upload attempt ${attempt}/${maxRetries}`);
        return await this.analyzeDocument(formData);
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (error.response?.status >= 400 && error.response?.status < 500) {
          throw error;
        }
        
        // Don't retry if it's the last attempt
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
};

// Utility functions for API responses
export const apiUtils = {
  // Check if response indicates success
  isSuccessResponse(response) {
    return response && response.success === true;
  },

  // Extract error message from response
  getErrorMessage(error) {
    if (error.response?.data?.error) {
      return error.response.data.error;
    } else if (error.message) {
      return error.message;
    } else {
      return 'An unexpected error occurred';
    }
  },

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Validate analysis response structure
  validateAnalysisResponse(response) {
    if (!response) {
      throw new Error('Empty response received');
    }

    if (!response.analysis) {
      throw new Error('No analysis data in response');
    }

    const required = ['documentType', 'summary', 'keyPoints', 'riskAssessment'];
    const missing = required.filter(field => !response.analysis[field]);
    
    if (missing.length > 0) {
      console.warn('Missing fields in analysis:', missing);
    }

    return true;
  },

  // Create download blob from response data
  createDownloadBlob(data, filename, type = 'application/json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
};

export default apiService;