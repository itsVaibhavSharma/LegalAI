import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Brain, FileSearch, Sparkles } from 'lucide-react';

const LoadingSpinner = ({ size = 'medium', message, showSteps = true }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const steps = [
    {
      icon: <FileSearch className="h-6 w-6" />,
      label: "Extracting text from document",
      delay: 0
    },
    {
      icon: <Brain className="h-6 w-6" />,
      label: "Analyzing legal content with AI",
      delay: 2
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      label: "Generating plain language summary",
      delay: 4
    }
  ];

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main Spinner */}
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Outer ring */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-4 border-purple-500/20`}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner spinning element */}
        <motion.div
          className={`absolute inset-2 ${size === 'large' ? 'inset-3' : 'inset-2'} rounded-full border-4 border-transparent border-t-purple-500 border-r-blue-500`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
        </motion.div>

        {/* Pulsing glow effect */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-purple-500/20`}
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Message */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white font-medium text-center"
        >
          {message}
        </motion.p>
      )}

      {/* Processing Steps */}
      {showSteps && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md space-y-4"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay }}
              className="flex items-center space-x-4 p-4 glass rounded-xl"
            >
              <motion.div
                className="flex-shrink-0 p-2 bg-purple-500/20 rounded-lg"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: step.delay 
                }}
              >
                {step.icon}
              </motion.div>
              
              <div className="flex-1">
                <p className="text-purple-200 text-sm">{step.label}</p>
                
                {/* Progress dots */}
                <div className="flex space-x-1 mt-2">
                  {[...Array(3)].map((_, dotIndex) => (
                    <motion.div
                      key={dotIndex}
                      className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: step.delay + (dotIndex * 0.2)
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + Math.sin(i) * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Simple spinner variant for smaller uses
export const SimpleSpinner = ({ className = "" }) => (
  <motion.div
    className={`inline-block ${className}`}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <Loader2 className="h-5 w-5" />
  </motion.div>
);

// Pulse loader variant
export const PulseLoader = ({ className = "" }) => (
  <div className={`flex space-x-2 ${className}`}>
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-purple-500 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.2
        }}
      />
    ))}
  </div>
);

export default LoadingSpinner;