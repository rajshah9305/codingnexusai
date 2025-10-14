# 🚀 AI Coding Nexus

Next-generation AI coding platform powered by AWS Bedrock and CrewAI for multi-agent orchestration.

## ✨ Features

### 🤖 AI-Powered Code Generation
- **Multi-Model Support**: Claude 3, Titan, Jurassic-2, Command via AWS Bedrock
- **Full-Stack Generation**: Complete applications with frontend, backend, and database
- **Component Generation**: React components, API endpoints, database models
- **Smart Context**: Understands your codebase and generates relevant code

### 🛠️ Advanced Development Tools
- **Real-Time Preview**: Live code preview with responsive viewport testing
- **Intelligent Debugging**: AI-powered error detection and fixing
- **Code Explanation**: Detailed code analysis and documentation
- **Auto-Complete**: Context-aware code suggestions
- **Code Optimization**: Performance and quality improvements

### 🏗️ Multi-Agent Architecture
- **Solution Architect**: Designs scalable application architecture
- **Frontend Developer**: Creates modern, responsive interfaces
- **Backend Developer**: Builds robust server-side applications
- **DevOps Engineer**: Handles deployment and infrastructure

### 🎨 Modern Interface
- **Monaco Editor**: Professional code editing experience
- **Split View**: Code editor and live preview side-by-side
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes for long coding sessions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- AWS Account with Bedrock access
- AWS CLI configured or environment variables set

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd ai-coding-nexus
npm run install-all
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your AWS credentials
```

3. **Start Development**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🔧 Configuration

### AWS Bedrock Setup
1. Enable AWS Bedrock in your AWS account
2. Request access to the AI models you want to use:
   - Anthropic Claude 3 Sonnet/Haiku
   - Amazon Titan Text
   - AI21 Jurassic-2
   - Cohere Command

3. Set up your AWS credentials:
```bash
# Option 1: AWS CLI
aws configure

# Option 2: Environment Variables
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1
```

### Environment Variables
```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Client Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
```

## 📖 Usage Guide

### Code Generation
1. **Quick Actions**: Use sidebar buttons for common tasks
   - React Component
   - API Endpoint  
   - Database Model
   - Full-Stack App

2. **Chat Interface**: Natural language code requests
   ```
   "Create a user authentication system with JWT"
   "Build a todo app with React and Express"
   "Generate a responsive navbar component"
   ```

3. **Model Selection**: Choose the best AI model for your task
   - **Claude 3 Sonnet**: Best for complex, high-quality code
   - **Claude 3 Haiku**: Fast responses for simple tasks
   - **Titan Text**: Good balance of speed and quality
   - **Jurassic-2**: Creative solutions and explanations

### Development Tools
- **Debug**: Describe issues to get AI-powered solutions
- **Explain**: Get detailed explanations of any code
- **Optimize**: Improve performance and code quality
- **Fix**: Automatically resolve common errors

### Live Preview
- **Real-Time Updates**: See changes as you type
- **Responsive Testing**: Test mobile, tablet, desktop views
- **External Preview**: Open in new tab for full testing

## 🏗️ Architecture

### Frontend (React)
```
client/
├── src/
│   ├── components/          # React components
│   │   ├── Header.js       # Top navigation
│   │   ├── Sidebar.js      # AI tools sidebar
│   │   ├── CodeEditor.js   # Monaco editor
│   │   ├── PreviewPanel.js # Live preview
│   │   └── ChatPanel.js    # AI chat interface
│   ├── services/
│   │   └── AIService.js    # API communication
│   └── App.js              # Main application
```

### Backend (Node.js/Express)
```
server/
├── services/
│   ├── bedrock.js          # AWS Bedrock integration
│   ├── crewai.js           # Multi-agent orchestration
│   └── code.js             # Code processing utilities
└── index.js                # Express server
```

### Key Technologies
- **Frontend**: React 18, Monaco Editor, Tailwind CSS, Framer Motion
- **Backend**: Express.js, WebSocket, AWS SDK
- **AI**: AWS Bedrock, CrewAI
- **Development**: Hot reload, real-time preview, error handling

## 🔌 API Reference

### Generate Code
```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "Create a React login form",
  "model": "claude-3-sonnet",
  "type": "component"
}
```

### Debug Code
```http
POST /api/generate
Content-Type: application/json

{
  "code": "const x = undefined.property",
  "prompt": "TypeError: Cannot read property",
  "model": "claude-3-sonnet", 
  "type": "debug"
}
```

### Get Models
```http
GET /api/models
```

### WebSocket Events
```javascript
// Code preview updates
ws.send(JSON.stringify({
  type: 'code_preview',
  code: 'console.log("Hello World")'
}));

// Live editing
ws.send(JSON.stringify({
  type: 'live_edit',
  changes: { line: 1, column: 5, newText: 'const' }
}));
```

## 🚀 Deployment

### Production Build
```bash
# Build client
cd client && npm run build

# Start production server
cd ../server && npm start
```

### AWS Deployment
The application is designed for easy AWS deployment:
- **Frontend**: S3 + CloudFront
- **Backend**: EC2, ECS, or Lambda
- **Database**: RDS, DynamoDB
- **AI**: AWS Bedrock (already integrated)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- AWS Bedrock for AI model access
- CrewAI for multi-agent orchestration
- Monaco Editor for the code editing experience
- React and the amazing open-source community

---

**Built with ❤️ for the developer community**

Transform your coding experience with the power of AI. Generate, debug, and optimize code like never before.