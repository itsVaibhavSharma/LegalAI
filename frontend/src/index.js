// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center max-w-md">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-purple-200 mb-6">
              We apologize for the inconvenience. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize React app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Performance monitoring (optional)
if (process.env.NODE_ENV === 'production') {
  // Add performance monitoring here if needed
  console.log('LegalAI v1.0.0 - Production Build');
}

// Service worker registration (optional)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// /* 
// =================
// public/index.html
// =================
// */
// const indexHtml = `<!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8" />
//     <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <meta name="theme-color" content="#8b5cf6" />
    
//     <!-- SEO Meta Tags -->
//     <meta name="description" content="Demystify complex legal documents with AI. Upload contracts, agreements, and legal documents to get clear, accessible explanations in your preferred language." />
//     <meta name="keywords" content="legal documents, AI analysis, contract review, legal tech, document analysis" />
//     <meta name="author" content="LegalAI Team" />
    
//     <!-- Open Graph Meta Tags -->
//     <meta property="og:title" content="LegalAI - Demystify Legal Documents" />
//     <meta property="og:description" content="Upload legal documents and get clear, AI-powered explanations in plain language." />
//     <meta property="og:type" content="website" />
//     <meta property="og:url" content="https://your-domain.com" />
//     <meta property="og:image" content="%PUBLIC_URL%/og-image.png" />
    
//     <!-- Twitter Card Meta Tags -->
//     <meta name="twitter:card" content="summary_large_image" />
//     <meta name="twitter:title" content="LegalAI - Demystify Legal Documents" />
//     <meta name="twitter:description" content="Upload legal documents and get clear, AI-powered explanations in plain language." />
//     <meta name="twitter:image" content="%PUBLIC_URL%/twitter-image.png" />
    
//     <!-- Apple Touch Icon -->
//     <link rel="apple-touch-icon" href="%PUBLIC_URL%/apple-touch-icon.png" />
    
//     <!-- Manifest for PWA -->
//     <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    
//     <!-- Preconnect to improve performance -->
//     <link rel="preconnect" href="https://fonts.googleapis.com">
//     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
//     <!-- Critical CSS for Inter font -->
//     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
//     <!-- Prevent FOUC (Flash of Unstyled Content) -->
//     <style>
//       body {
//         font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
//         background: #0f172a;
//         color: #f1f5f9;
//         margin: 0;
//         padding: 0;
//         overflow-x: hidden;
//       }
      
//       /* Loading spinner for initial load */
//       .initial-loading {
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         z-index: 9999;
//       }
      
//       .initial-loading .spinner {
//         width: 50px;
//         height: 50px;
//         border: 4px solid rgba(139, 92, 246, 0.3);
//         border-top: 4px solid #8b5cf6;
//         border-radius: 50%;
//         animation: spin 1s linear infinite;
//       }
      
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
      
//       /* Hide loading when React app loads */
//       #root:not(:empty) + .initial-loading {
//         display: none;
//       }
//     </style>
    
//     <title>LegalAI - Demystify Legal Documents with AI</title>
//   </head>
//   <body>
//     <noscript>
//       <div style="text-align: center; padding: 50px; background: #0f172a; color: #f1f5f9; min-height: 100vh;">
//         <h1>JavaScript Required</h1>
//         <p>LegalAI requires JavaScript to function. Please enable JavaScript in your browser and refresh this page.</p>
//       </div>
//     </noscript>
    
//     <!-- React app root -->
//     <div id="root"></div>
    
//     <!-- Initial loading indicator -->
//     <div class="initial-loading">
//       <div>
//         <div class="spinner"></div>
//         <p style="margin-top: 20px; color: #8b5cf6; font-weight: 500;">Loading LegalAI...</p>
//       </div>
//     </div>
    
//     <!-- PWA Install Prompt (optional) -->
//     <div id="pwa-install-prompt" style="display: none;">
//       <!-- PWA install banner can be added here -->
//     </div>
    
//     <!-- Performance monitoring script (optional) -->
//     <script>
//       // Basic performance monitoring
//       if (typeof performance !== 'undefined' && performance.mark) {
//         performance.mark('app-start');
//         window.addEventListener('load', () => {
//           performance.mark('app-loaded');
//           performance.measure('app-load-time', 'app-start', 'app-loaded');
//         });
//       }
      
//       // Error tracking
//       window.addEventListener('error', (event) => {
//         console.error('Global error:', event.error);
//         // You can send errors to your monitoring service here
//       });
      
//       window.addEventListener('unhandledrejection', (event) => {
//         console.error('Unhandled promise rejection:', event.reason);
//         // You can send errors to your monitoring service here
//       });
//     </script>
//   </body>
// </html>`;

// /* 
// =================
// public/manifest.json
// =================
// */
// const manifest = {
//   "short_name": "LegalAI",
//   "name": "LegalAI - Demystify Legal Documents",
//   "description": "Upload legal documents and get clear, AI-powered explanations in plain language.",
//   "icons": [
//     {
//       "src": "favicon.ico",
//       "sizes": "64x64 32x32 24x24 16x16",
//       "type": "image/x-icon"
//     },
//     {
//       "src": "icon-192.png",
//       "type": "image/png",
//       "sizes": "192x192"
//     },
//     {
//       "src": "icon-512.png",
//       "type": "image/png",
//       "sizes": "512x512"
//     }
//   ],
//   "start_url": ".",
//   "display": "standalone",
//   "theme_color": "#8b5cf6",
//   "background_color": "#0f172a",
//   "orientation": "portrait-primary",
//   "categories": ["productivity", "utilities", "business"],
//   "lang": "en-US"
// };

// console.log('Frontend setup complete. Remember to:');
// console.log('1. Add the index.html content to public/index.html');
// console.log('2. Add the manifest.json content to public/manifest.json');
// console.log('3. Add appropriate favicon and icon files to public/');
// console.log('4. Configure environment variables in .env');

// export { indexHtml, manifest };