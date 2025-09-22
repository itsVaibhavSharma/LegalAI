import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check, Search } from 'lucide-react';

const LanguageSelector = ({ languages, selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Filter languages based on search term
  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected language name
  const getSelectedLanguageName = () => {
    const selected = languages.find(lang => lang.code === selectedLanguage);
    return selected ? selected.name : 'English';
  };

  const handleLanguageSelect = (languageCode) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (event, languageCode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageSelect(languageCode);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-purple-200 mb-2">
        <Globe className="inline h-4 w-4 mr-2" />
        Select Language for Explanation
      </label>
      
      {/* Selector Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-4 py-3 
          bg-white/10 border border-white/20 rounded-xl text-left
          hover:bg-white/15 focus:outline-none focus:ring-2 
          focus:ring-purple-500 focus:border-transparent
          transition-all duration-200
          ${isOpen ? 'ring-2 ring-purple-500 bg-white/15' : ''}
        `}
        whileTap={{ scale: 0.98 }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {selectedLanguage.toUpperCase()}
              </span>
            </div>
          </div>
          <span className="text-white font-medium">
            {getSelectedLanguageName()}
          </span>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-purple-300" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl max-h-80 overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search languages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50">
              {filteredLanguages.length > 0 ? (
                <div className="py-2">
                  {filteredLanguages.map((language) => (
                    <motion.button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      onKeyDown={(e) => handleKeyDown(e, language.code)}
                      className={`
                        w-full px-4 py-3 text-left flex items-center justify-between
                        hover:bg-purple-500/20 focus:bg-purple-500/20 
                        focus:outline-none transition-colors duration-150
                        ${selectedLanguage === language.code ? 'bg-purple-600/30 text-white' : 'text-purple-100'}
                      `}
                      whileHover={{ x: 4 }}
                      role="option"
                      aria-selected={selectedLanguage === language.code}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                          ${selectedLanguage === language.code 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-white/10 text-purple-300'
                          }
                        `}>
                          {language.code.toUpperCase().substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium">{language.name}</div>
                          <div className="text-xs text-purple-400">{language.code}</div>
                        </div>
                      </div>
                      
                      {selectedLanguage === language.code && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="h-4 w-4 text-purple-400" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-purple-300">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No languages found</p>
                  <p className="text-sm text-purple-400">Try a different search term</p>
                </div>
              )}
            </div>

            {/* Popular Languages Quick Access */}
            {searchTerm === '' && (
              <div className="border-t border-white/10 p-3">
                <p className="text-xs text-purple-400 mb-2 font-medium">Popular:</p>
                <div className="flex flex-wrap gap-2">
                  {['en', 'es', 'fr', 'de', 'zh', 'ja'].map((code) => {
                    const lang = languages.find(l => l.code === code);
                    if (!lang) return null;
                    
                    return (
                      <motion.button
                        key={code}
                        onClick={() => handleLanguageSelect(code)}
                        className={`
                          px-3 py-1 text-xs rounded-md transition-colors
                          ${selectedLanguage === code
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/10 text-purple-300 hover:bg-purple-500/20'
                          }
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {lang.name}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;