# 🚀 RAJ AI Coding Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock-orange.svg)](https://aws.amazon.com/bedrock/)

An **elite AI-powered coding assistant** built with AWS Bedrock (Claude 3.7 Sonnet), featuring real-time code generation, debugging, and a beautiful modern interface.

![RAJ AI Coding Tool](https://via.placeholder.com/1200x600/ffffff/f97316?text=RAJ+AI+Coding+Tool)

## ✨ Features

### 🤖 AI-Powered Development
- **Code Generation**: Generate React components, API endpoints, database schemas, and full-stack applications
- **Intelligent Debugging**: AI-powered bug detection and automatic fixes
- **Code Explanation**: Get detailed explanations of complex code
- **Optimization**: Improve code performance and readability with AI suggestions

### 🎨 Elite Design System
- **Minimal & Clean**: White background, black text, strategic orange accents
- **Fully Responsive**: Flawless experience across all devices (mobile, tablet, desktop)
- **AAA Accessibility**: Perfect color contrast ratios and keyboard navigation
- **Smooth Animations**: 60fps micro-interactions and transitions
- **Component Library**: Unified design system with buttons, inputs, cards, badges, and more

### 🛠️ Developer Experience
- **Monaco Editor**: Professional code editing with syntax highlighting
- **Live Preview**: Real-time HTML/CSS/JS preview with responsive viewport switching
- **WebSocket Support**: Instant updates and real-time collaboration
- **Multi-Language**: JavaScript, TypeScript, Python, Java, HTML, CSS, JSON, Markdown
- **Quick Actions**: One-click templates for common development tasks

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────┬──────────────┬─────────────────────┐ │
│  │   Header     │  Chat Panel  │    Code Editor      │ │
│  │  - Model     │  - AI Chat   │    - Monaco         │ │
│  │  - Layout    │  - History   │    - Syntax HL      │ │
│  ├──────────────┼──────────────┼─────────────────────┤ │
│  │   Sidebar    │Live Preview  │  Design System      │ │
│  │  - Tools     │  - Viewport  │    - Components     │ │
│  │  - Actions   │  - Refresh   │    - Typography     │ │
│  └──────────────┴──────────────┴─────────────────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/WebSocket
┌─────────────────────┴───────────────────────────────────┐
│                  Backend (Express)                       │
│  ┌──────────────┬──────────────┬─────────────────────┐ │
│  │   Routes     │  Services    │    Integrations     │ │
│  │  - /generate │  - Bedrock   │    - AWS Bedrock    │ │
│  │  - /debug    │  - Code Gen  │    - Claude 3.7     │ │
│  │  - /preview  │  - CrewAI    │    - WebSocket      │ │
│  └──────────────┴──────────────┴─────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **AWS Account** with Bedrock access
- **AWS CLI** configured with credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rajshah9305/codingnexusai.git
cd codingnexusai
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

3. **Configure AWS credentials**

Create a `.env` file in the `server` directory:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
PORT=3001
```

4. **Start the servers**

```bash
# From project root
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### Alternative: Start Separately

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

## 📖 Usage

### Generate Code with AI

1. Open the application at `http://localhost:3000`
2. Type your request in the chat panel:
   - "Create a React login form with validation"
   - "Build a REST API for user management"
   - "Generate a responsive navbar component"
3. The AI will generate code and display it in the editor
4. Preview your code in real-time in the preview panel

### Quick Actions

Use the sidebar for common tasks:
- **React Component**: Generate modern React components
- **API Endpoint**: Create Express.js endpoints
- **Database Model**: Generate database schemas
- **Full-Stack App**: Build complete applications

### Debug Code

1. Click "Debug Code" in the sidebar
2. Describe the issue you're experiencing
3. AI will analyze and provide fixes

### Optimize Code

1. Click "Optimize" in the sidebar
2. AI will improve performance and readability

## 🎨 Design System

### Color Palette
- **Primary**: `#f97316` (Orange)
- **Background**: `#ffffff` (White)
- **Text**: `#000000` (Black)
- **Borders**: `#e5e7eb` (Gray-200)

### Typography Scale
- **Headings**: 30px, 24px, 20px, 18px (Bold)
- **Body**: 16px, 14px, 12px
- **Line Heights**: 1.25 (tight), 1.5 (normal), 1.625 (relaxed)

### Components
- Buttons: Primary, Secondary, Ghost, Icon
- Inputs: Text, Select, Textarea
- Cards: Standard, Hover, with Header/Body/Footer
- Badges: Primary, Secondary, Success, Error

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for complete documentation.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 📦 Build for Production

```bash
# Build frontend
cd client
npm run build

# Build output will be in client/build/
```

Deploy the `client/build` directory to any static hosting service (Netlify, Vercel, S3, etc.)

## 🔧 Tech Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Utility-first CSS
- **Monaco Editor** - VS Code-powered code editor
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications
- **WebSocket** - Real-time updates

### Backend
- **Express.js** - Web framework
- **AWS Bedrock** - AI model access
- **Claude 3.7 Sonnet** - Latest Claude model
- **CrewAI** - Multi-agent orchestration
- **WebSocket** - Real-time communication
- **Jest** - Testing framework

## 📂 Project Structure

```
codingnexusai/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── App.js         # Main app component
│   │   ├── App.css        # Component library
│   │   └── index.css      # Design system foundation
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Backend Express server
│   ├── services/          # AI and code services
│   │   ├── bedrock.js    # AWS Bedrock integration
│   │   ├── code.js       # Code generation logic
│   │   └── crewai.js     # CrewAI integration
│   ├── __tests__/        # Test files
│   ├── index.js          # Server entry point
│   └── package.json
├── DESIGN_SYSTEM.md      # Complete design documentation
├── TESTING_REPORT.md     # Test coverage report
└── README.md             # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AWS Bedrock** - For providing access to Claude 3.7 Sonnet
- **Anthropic** - For creating Claude AI
- **Monaco Editor** - For the excellent code editor
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

For support, email rajshah9305@example.com or open an issue on GitHub.

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐!

---

**Built with ❤️ by Raj Shah**

[View Demo](http://localhost:3000) | [Report Bug](https://github.com/rajshah9305/codingnexusai/issues) | [Request Feature](https://github.com/rajshah9305/codingnexusai/issues)
