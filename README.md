# LegalAI 📄

A comprehensive multilingual legal document analysis application powered by Google Cloud AI technologies. Upload PDF, DOCX, or image files containing legal documents and receive intelligent AI-powered analysis in 50+ languages.

## 🌟 Features

- **Multi-format Support**: Upload PDF, DOCX, or image files
- **AI-Powered Analysis**: Intelligent document processing using Gemini API
- **Multilingual Support**: Analyze documents in 50+ languages
- **Document Extraction**: Extract text from scanned documents using Document AI
- **Real-time Translation**: Translate documents and analysis results
- **Modern UI**: Clean, responsive React interface
- **Secure Processing**: Enterprise-grade security and privacy
- **Rate Limited**: Built-in API rate limiting for scalability

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────────────────────┐
│   React Frontend│────│   Node.js API    │────│   Google Cloud AI              │
│   (Port 3000)   │    │   (Port 3001)    │    │   - Document AI                │
│                 │    │                  │    │   - Vertex AI/ Gemini API      │
│                 │    │                  │    │   - Translation API            │           
└─────────────────┘    └──────────────────┘    └────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Dropzone** - File upload with drag & drop
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Google Cloud AI APIs**:
  - **Document AI** - Text extraction from documents
  - **Gemini API** - Advanced AI analysis and insights
  - **Translation API** - Multi-language support
- **Multer** - File upload handling
- **Express Rate Limit** - API rate limiting
- **Helmet** - Security middleware

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Google Cloud Project** with billing enabled
- **Service Account** with appropriate permissions
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/itsVaibhavSharma/LegalAI.git
cd LegalAI
```

### 2. Google Cloud Setup

#### Create Project and Enable APIs
```bash
# Create new project
gcloud projects create LegalAI-[RANDOM-ID]

# Set as current project
gcloud config set project -[RANDOM-ID]

# Enable required APIs
gcloud services enable documentai.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable translate.googleapis.com
```

#### Create Service Account
```bash
# Create service account
gcloud iam service-accounts create legal-ai-service \
    --description="Service account for Legal Document AI" \
    --display-name="Legal AI Service Account"

# Grant necessary roles
gcloud projects add-iam-policy-binding LegalAI-[PROJECT-ID] \
    --member="serviceAccount:legal-ai-service@LegalAI-[PROJECT-ID].iam.gserviceaccount.com" \
    --role="roles/documentai.editor"

gcloud projects add-iam-policy-binding LegalAI-[PROJECT-ID] \
    --member="serviceAccount:legal-ai-service@LegalAI-[PROJECT-ID].iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding LegalAI-[PROJECT-ID] \
    --member="serviceAccount:legal-ai-service@LegalAI-[PROJECT-ID].iam.gserviceaccount.com" \
    --role="roles/cloudtranslate.user"

# Create and download service account key
gcloud iam service-accounts keys create ./service-account-key.json \
    --iam-account=legal-ai-service@LegalAI-[PROJECT-ID].iam.gserviceaccount.com
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Configure your `.env` file:
```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-google-cloud-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional: Enable debug logging
DEBUG=true
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 5. Run the Application

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 📖 Usage

1. **Upload Document**: Drag and drop or click to upload PDF, DOCX, or image files
2. **Select Analysis Type**: Choose from various legal document analysis options
3. **Choose Language**: Select input and output languages (50+ supported)
4. **Get Analysis**: Receive comprehensive AI-powered legal document analysis
5. **View Results**: Review extracted text, analysis, and translations

## 🌐 Deployment

### Google Cloud Run (Recommended)

#### Backend Deployment
```bash
cd backend
gcloud run deploy legal-ai-backend \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

#### Frontend Deployment
```bash
cd frontend
gcloud run deploy legal-ai-frontend \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars REACT_APP_API_URL=https://your-backend-url
```

### Other Deployment Options
- **Vercel** (Frontend) + **Railway** (Backend)
- **Firebase Hosting** + **Cloud Functions**
- **Docker** containers

## 📊 API Endpoints

### Document Processing
- `POST /api/documents/upload` - Upload and process document
- `POST /api/documents/analyze` - Analyze uploaded document with Gemini API
- `POST /api/documents/translate` - Translate document content

### Health Check
- `GET /health` - API health status

## 🔧 Configuration

### Environment Variables

#### Backend
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
PORT=3001
FRONTEND_URL=https://your-frontend-url
NODE_ENV=production
```

#### Frontend
```env
REACT_APP_API_URL=https://your-backend-url
REACT_APP_ENVIRONMENT=production
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📈 Features Roadmap

- [ ] User Authentication (Firebase Auth)
- [ ] Document History & Storage
- [ ] Batch Processing
- [ ] Custom AI Models
- [ ] API Webhooks
- [ ] Mobile App (React Native)
- [ ] Advanced Analytics Dashboard
- [ ] Document Comparison Tools

## 🔐 Security

- ✅ Rate limiting on API endpoints
- ✅ File type validation and size limits
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Environment variable protection
- ✅ Service account least privilege access

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team Members

* **Vaibhav Sharma** - Team Leader
* **Akshara Rathore** - Member

## 🙏 Acknowledgments

- Google Cloud AI Platform for providing powerful AI APIs
- Gemini API for advanced document analysis capabilities
- React and Node.js communities for excellent frameworks
- Open source contributors and maintainers

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [deployment guide](./DEPLOYMENT.md) for detailed setup instructions
- Review Google Cloud documentation for AI services

## ⚠️ Important Notice

This application processes sensitive legal documents. Ensure proper security measures and compliance with relevant data protection regulations (GDPR, CCPA) before deploying to production.

---

**Built with ❤️ using Google Cloud AI, Gemini API, React, and Node.js**