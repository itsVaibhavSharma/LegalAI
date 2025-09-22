import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, FileText, Image, AlertCircle, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const FileUploader = ({ onFileUpload, isUploading, progress }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      let errorMessage = 'File not accepted';
      
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        errorMessage = 'File is too large. Maximum size is 50MB.';
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        errorMessage = 'Invalid file type. Please upload PDF, DOCX, DOC, or image files.';
      }
      
      toast.error(errorMessage);
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      toast.success('File selected successfully!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    disabled: isUploading
  });

  const handleUpload = () => {
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  const getFileIcon = (file) => {
    if (!file) return <File className="h-8 w-8" />;
    
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-400" />;
    } else if (file.type.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-400" />;
    } else {
      return <FileText className="h-8 w-8 text-green-400" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <motion.div
        {...getRootProps()}
        className={`
          dropzone relative overflow-hidden
          ${isDragActive ? 'active' : ''}
          ${isDragReject ? 'rejected' : ''}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        whileHover={!isUploading ? { scale: 1.02 } : {}}
        whileTap={!isUploading ? { scale: 0.98 } : {}}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Upload className={`h-12 w-12 ${isDragActive ? 'text-purple-300' : 'text-purple-400'}`} />
          </motion.div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              {isDragActive ? 'Drop your document here' : 'Upload Legal Document'}
            </h3>
            <p className="text-purple-200 mb-4">
              Drag and drop your file here, or click to browse
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 text-xs text-purple-300">
              <span className="px-2 py-1 bg-purple-500/20 rounded-md">PDF</span>
              <span className="px-2 py-1 bg-purple-500/20 rounded-md">DOCX</span>
              <span className="px-2 py-1 bg-purple-500/20 rounded-md">DOC</span>
              <span className="px-2 py-1 bg-purple-500/20 rounded-md">Images</span>
            </div>
            
            <p className="text-xs text-purple-400 mt-2">
              Maximum file size: 50MB
            </p>
          </div>
        </div>

        {/* Background animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-purple-600/0 shimmer"></div>
        </div>
      </motion.div>

      {/* Selected File Display */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  {getFileIcon(selectedFile)}
                </div>
                <div>
                  <h4 className="font-medium text-white truncate max-w-xs">
                    {selectedFile.name}
                  </h4>
                  <p className="text-sm text-purple-300">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              
              {!isUploading && (
                <button
                  onClick={clearFile}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Progress bar */}
            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-purple-300">Uploading...</span>
                  <span className="text-purple-300">{Math.round(progress)}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Button */}
      <AnimatePresence>
        {selectedFile && !isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <motion.button
              onClick={handleUpload}
              className="btn-primary group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
              Analyze Document
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass p-4 rounded-xl"
      >
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-purple-200">
            <p className="font-medium text-white mb-1">Tips for best results:</p>
            <ul className="space-y-1 text-xs">
              <li>• Ensure text is clearly readable and not too blurry</li>
              <li>• For scanned documents, use high-quality scans</li>
              <li>• Supported languages: English, Spanish, French, German, and 40+ more</li>
              <li>• Processing typically takes 30-60 seconds</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FileUploader;