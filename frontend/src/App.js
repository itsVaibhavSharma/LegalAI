import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Shield, FileText, Globe, Sparkles, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

import FileUploader from './components/FileUploader';
import LanguageSelector from './components/LanguageSelector';
import LoadingSpinner from './components/LoadingSpinner';
import ResultsDisplay from './components/ResultsDisplay';
import { useFileUpload } from './hooks/useFileUpload';
import { apiService } from './utils/api';

import './index.css';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { uploadFile, isUploading, uploadProgress } = useFileUpload();

  // Fetch supported languages on component mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languages = await apiService.getSupportedLanguages();
        setSupportedLanguages(languages);
      } catch (error) {
        console.error('Failed to fetch supported languages:', error);
        // Set default languages if API fails
        setSupportedLanguages([
          { code: 'en', name: 'English' },
          { code: 'es', name: 'Spanish' },
          { code: 'fr', name: 'French' },
          { code: 'de', name: 'German' },
          { code: 'zh', name: 'Chinese' }
        ]);
      }
    };

    fetchLanguages();
  }, []);

  const handleFileUpload = async (file) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await uploadFile(file, selectedLanguage);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResult({
        error: true,
        message: error.message || 'Failed to analyze document. Please try again.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
  };

  const getRiskLevelIcon = (level) => {
    switch (level?.toUpperCase()) {
      case 'LOW':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'MEDIUM':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'HIGH':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertTriangle className="text-gray-500" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-600 to-slate-800">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #475569'
          }
        }}
      />
      
      {/* Header */}
      <header className="relative overflow-hidden bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="h-10 w-10 text-purple-400" />
                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">LegalAI</h1>
                <p className="text-purple-300 text-sm">Demystify Legal Documents</p>
              </div>
            </div>
            
            <motion.div 
              className="flex items-center space-x-2 text-white/80"
              whileHover={{ scale: 1.05 }}
            >
              <Globe size={16} />
              <span className="text-sm">Powered by Google Cloud AI</span>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!analysisResult ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center space-y-6">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-bold text-white"
                >
                  Understand Your Legal Documents
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-purple-200 max-w-3xl mx-auto"
                >
                  Upload your contracts, agreements, or terms of service and get clear, 
                  accessible explanations in your preferred language. Protect yourself 
                  from hidden risks and make informed decisions.
                </motion.p>
              </div>

              {/* Features */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-3 gap-6 mb-12"
              >
                {[
                  {
                    icon: <FileText className="h-8 w-8 text-blue-400" />,
                    title: "Multi-Format Support",
                    description: "PDF, DOCX, DOC, and image files with OCR"
                  },
                  {
                    icon: <Globe className="h-8 w-8 text-green-400" />,
                    title: "50+ Languages",
                    description: "Get explanations in your preferred language"
                  },
                  {
                    icon: <Shield className="h-8 w-8 text-purple-400" />,
                    title: "Risk Assessment",
                    description: "Identify potential risks and red flags"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      {feature.icon}
                      <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-purple-200">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Upload Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 space-y-6"
              >
                <LanguageSelector
                  languages={supportedLanguages}
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />
                
                <FileUploader
                  onFileUpload={handleFileUpload}
                  isUploading={isAnalyzing}
                  progress={uploadProgress}
                />

                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <LoadingSpinner />
                    <div className="text-center">
                      <p className="text-white font-medium">Analyzing your document...</p>
                      <p className="text-purple-300 text-sm">This may take a few moments</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ResultsDisplay
                result={analysisResult}
                onNewAnalysis={handleNewAnalysis}
                getRiskLevelIcon={getRiskLevelIcon}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-purple-300">
            <p className="text-sm">
              ⚠️ This tool provides AI-generated analysis for informational purposes only. 
              Always consult with a qualified legal professional for important decisions.
            </p>
            <p className="text-xs mt-2 text-purple-400">
              Built with Google Cloud AI • Secure & Private Processing
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;