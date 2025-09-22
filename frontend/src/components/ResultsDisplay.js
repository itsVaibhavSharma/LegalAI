import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  Download,
  Share2,
  Info,
  Lightbulb,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

const ResultsDisplay = ({ result, onNewAnalysis, getRiskLevelIcon }) => {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    keyPoints: true,
    risks: true,
    terms: false,
    clauses: false,
    recommendations: true
  });

  const [showFullText, setShowFullText] = useState(false);

  if (!result) return null;

  // Handle error state
  if (result.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass p-8 rounded-3xl text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Analysis Failed</h2>
          <p className="text-red-300 mb-6">{result.message}</p>
          <button
            onClick={onNewAnalysis}
            className="btn-primary"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  const { analysis, documentInfo } = result;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Legal Document Analysis',
          text: `Analysis of ${documentInfo.filename}: ${analysis.summary}`,
        });
      } else {
        // Fallback: copy to clipboard
        const shareText = `Legal Document Analysis\n\nDocument: ${documentInfo.filename}\nSummary: ${analysis.summary}`;
        await navigator.clipboard.writeText(shareText);
        toast.success('Analysis copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share analysis');
    }
  };

  const handleDownload = () => {
    const analysisData = {
      document: documentInfo,
      analysis: analysis,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(analysisData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-analysis-${documentInfo.filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Analysis downloaded!');
  };

  const getRiskLevelColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'LOW': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'HIGH': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const SectionHeader = ({ title, icon, isExpanded, onToggle, count }) => (
    <motion.button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {count && (
          <span className="px-2 py-1 bg-purple-500/30 text-purple-200 text-xs rounded-full">
            {count}
          </span>
        )}
      </div>
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="h-5 w-5 text-purple-300" />
      </motion.div>
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <motion.button
          onClick={onNewAnalysis}
          className="btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Analyze New Document
        </motion.button>
        
        <div className="flex space-x-3">
          <motion.button
            onClick={handleShare}
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </motion.button>
          <motion.button
            onClick={handleDownload}
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </motion.button>
        </div>
      </div>

      {/* Document Info Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{documentInfo.filename}</h2>
              <p className="text-purple-300">
                {analysis.documentType} • {(documentInfo.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getRiskLevelColor(analysis.riskAssessment?.level)}`}>
              {getRiskLevelIcon(analysis.riskAssessment?.level)}
              <span className="ml-2 font-medium">{analysis.riskAssessment?.level || 'UNKNOWN'} RISK</span>
            </div>
            <p className="text-xs text-purple-400 mt-1">
              <Clock className="inline h-3 w-3 mr-1" />
              {new Date(result.processedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Document Preview Toggle */}
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
          >
            {showFullText ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="text-sm">{showFullText ? 'Hide' : 'Show'} Document Preview</span>
          </button>
          
          <AnimatePresence>
            {showFullText && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-slate-800/50 rounded-xl text-sm text-purple-200 max-h-40 overflow-y-auto"
              >
                {result.extractedText}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Analysis Sections */}
      <div className="space-y-6">
        {/* Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <SectionHeader
            title="Document Summary"
            icon={<BookOpen className="h-5 w-5 text-blue-400" />}
            isExpanded={expandedSections.summary}
            onToggle={() => toggleSection('summary')}
          />
          
          <AnimatePresence>
            {expandedSections.summary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-6"
              >
                <p className="text-purple-100 leading-relaxed">{analysis.summary}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Key Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <SectionHeader
            title="Key Points"
            icon={<Target className="h-5 w-5 text-green-400" />}
            isExpanded={expandedSections.keyPoints}
            onToggle={() => toggleSection('keyPoints')}
            count={analysis.keyPoints?.length}
          />
          
          <AnimatePresence>
            {expandedSections.keyPoints && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-6"
              >
                <div className="space-y-3">
                  {analysis.keyPoints?.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-green-400 text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-purple-100">{point}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Risk Assessment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <SectionHeader
            title="Risk Assessment"
            icon={<Shield className="h-5 w-5 text-yellow-400" />}
            isExpanded={expandedSections.risks}
            onToggle={() => toggleSection('risks')}
          />
          
          <AnimatePresence>
            {expandedSections.risks && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-6 space-y-4"
              >
                {/* Risk Level */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-purple-200">Overall Risk Level:</span>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getRiskLevelColor(analysis.riskAssessment?.level)}`}>
                    {getRiskLevelIcon(analysis.riskAssessment?.level)}
                    <span className="ml-2 font-medium">{analysis.riskAssessment?.level || 'UNKNOWN'}</span>
                  </div>
                </div>

                {/* Risks */}
                {analysis.riskAssessment?.risks && analysis.riskAssessment.risks.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
                      Potential Risks
                    </h4>
                    <div className="space-y-2">
                      {analysis.riskAssessment.risks.map((risk, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
                        >
                          <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <p className="text-yellow-100">{risk}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Red Flags */}
                {analysis.riskAssessment?.redFlags && analysis.riskAssessment.redFlags.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <XCircle className="h-4 w-4 mr-2 text-red-400" />
                      Red Flags
                    </h4>
                    <div className="space-y-2">
                      {analysis.riskAssessment.redFlags.map((flag, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                        >
                          <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <p className="text-red-100">{flag}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <SectionHeader
            title="Recommendations"
            icon={<Lightbulb className="h-5 w-5 text-purple-400" />}
            isExpanded={expandedSections.recommendations}
            onToggle={() => toggleSection('recommendations')}
            count={analysis.recommendations?.length}
          />
          
          <AnimatePresence>
            {expandedSections.recommendations && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 pb-6"
              >
                <div className="space-y-3">
                  {analysis.recommendations?.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl"
                    >
                      <Lightbulb className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-purple-100">{recommendation}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Key Terms */}
        {analysis.keyTerms && analysis.keyTerms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <SectionHeader
              title="Key Terms Explained"
              icon={<Info className="h-5 w-5 text-blue-400" />}
              isExpanded={expandedSections.terms}
              onToggle={() => toggleSection('terms')}
              count={analysis.keyTerms.length}
            />
            
            <AnimatePresence>
              {expandedSections.terms && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {analysis.keyTerms.map((term, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <h5 className="font-medium text-blue-300 mb-2">{term.term}</h5>
                        <p className="text-purple-200 text-sm">{term.explanation}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Important Clauses */}
        {analysis.importantClauses && analysis.importantClauses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <SectionHeader
              title="Important Clauses"
              icon={<FileText className="h-5 w-5 text-orange-400" />}
              isExpanded={expandedSections.clauses}
              onToggle={() => toggleSection('clauses')}
              count={analysis.importantClauses.length}
            />
            
            <AnimatePresence>
              {expandedSections.clauses && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="space-y-4">
                    {analysis.importantClauses.map((clause, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="font-medium text-orange-300">{clause.clause}</h5>
                          {clause.location && (
                            <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded">
                              {clause.location}
                            </span>
                          )}
                        </div>
                        <p className="text-purple-200 text-sm mb-2">{clause.importance}</p>
                        <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                          <p className="text-orange-100 text-sm">
                            <span className="font-medium">Plain language: </span>
                            {clause.plainLanguage}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="glass p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5"
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-200">
            <p className="font-medium mb-1">Important Notice</p>
            <p>
              This analysis is generated by AI and provided for informational purposes only. 
              It should not be considered as legal advice. Always consult with a qualified 
              legal professional before making important decisions based on legal documents.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultsDisplay;