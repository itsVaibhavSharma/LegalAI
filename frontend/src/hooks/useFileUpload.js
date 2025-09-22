import { useState, useCallback } from 'react';
import { apiService } from '../utils/api';
import toast from 'react-hot-toast';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const validateFile = useCallback((file) => {
    // File size validation (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 50MB limit. Please choose a smaller file.');
    }

    // File type validation
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        'Unsupported file type. Please upload PDF, DOCX, DOC, or image files (JPEG, PNG, GIF, WEBP).'
      );
    }

    // File name validation
    if (!file.name || file.name.trim().length === 0) {
      throw new Error('Invalid file name.');
    }

    // Check for potentially dangerous file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
    const filename = file.name.toLowerCase();
    
    for (const ext of dangerousExtensions) {
      if (filename.endsWith(ext)) {
        throw new Error('File type not allowed for security reasons.');
      }
    }

    return true;
  }, []);

  const uploadFile = useCallback(async (file, language = 'en') => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Validate file before upload
      validateFile(file);

      // Create form data
      const formData = new FormData();
      formData.append('document', file);
      formData.append('language', language);

      // Show initial progress
      setUploadProgress(10);
      
      toast.loading('Uploading document...', { id: 'upload-toast' });

      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 90) {
            return prev + Math.random() * 10;
          }
          return prev;
        });
      }, 500);

      try {
        // Upload file and analyze
        const result = await apiService.analyzeDocument(formData);
        
        // Clear progress interval
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Show success message
        toast.success('Document analyzed successfully!', { id: 'upload-toast' });

        // Validate the response
        if (!result || !result.analysis) {
          throw new Error('Invalid response from server. Please try again.');
        }

        return result;

      } catch (uploadError) {
        clearInterval(progressInterval);
        throw uploadError;
      }

    } catch (err) {
      console.error('File upload error:', err);
      
      let errorMessage = 'Upload failed. Please try again.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.code === 'TIMEOUT_ERROR') {
        errorMessage = 'Upload timed out. Please try again with a smaller file.';
      }

      setError(errorMessage);
      toast.error(errorMessage, { id: 'upload-toast' });
      throw new Error(errorMessage);

    } finally {
      setIsUploading(false);
      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 2000);
    }
  }, [validateFile]);

  const resetUploadState = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
  }, []);

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    error,
    resetUploadState
  };
};