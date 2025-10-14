# 🚀 RAJ AI Coding Tool - Professional Edition

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock-orange.svg)](https://aws.amazon.com/bedrock/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/raj-ai-coding-tool)
[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success.svg)]()

An **elite AI-powered coding assistant** built with AWS Bedrock (Claude 3.7 Sonnet), featuring **multi-agent orchestration**, real-time code generation, comprehensive testing, security reviews, and a beautiful modern interface.

![RAJ AI Coding Tool](https://via.placeholder.com/1200x600/ffffff/f97316?text=RAJ+AI+Coding+Tool)

## ✨ Features

### 🤖 Multi-Agent Orchestration (NEW!)
- **8 Specialized Agents**: Supervisor, Code Generator, Testing, Security, Performance, Documentation, Architecture, and Debug agents working together
- **Collaborative Intelligence**: Agents share context and build upon each other's work
- **Comprehensive Solutions**: Get code + tests + security review + documentation in one go
- **Quality Assurance**: Supervisor agent performs final validation
- **Real-Time Visualization**: Watch agents collaborate through interactive dashboard
- **📚 [Complete Multi-Agent Guide](./MULTI_AGENT_GUIDE.md)**

### 🤖 AI-Powered Development
- **Code Generation**: Generate React components, API endpoints, database schemas, and full-stack applications
- **Intelligent Debugging**: AI-powered bug detection and automatic fixes
- **Code Explanation**: Get detailed explanations of complex code
- **Optimization**: Improve code performance and readability with AI suggestions
- **Single & Multi-Agent Modes**: Toggle between quick single-agent or comprehensive multi-agent generation

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

### ⚡ Deploy to Vercel (Recommended)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/raj-ai-coding-tool)

1. Click button above
2. Add environment variables (AWS credentials)
3. Deploy! ✅

**Full deployment guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

### 💻 Local Development

#### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **AWS Account** with Bedrock access
- **Git**

#### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/raj-ai-coding-tool.git
cd raj-ai-coding-tool

# 2. Install all dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# 3. Configure environment variables
cp .env.example server/.env
cp client/.env.example client/.env

# Edit server/.env with your AWS credentials
# Edit client/.env if needed (defaults work for local dev)

# 4. Start development servers
npm run dev
```

**Servers will start:**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

#### AWS Bedrock Setup

1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Navigate to "Model access"
3. Enable these models:
   - Claude 3.7 Sonnet
   - Claude 3.5 Sonnet V2
   - Claude 3.5 Haiku
4. Copy your AWS credentials to `server/.env`

**Detailed setup**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📖 Usage

### Generate Code with AI

#### Single Agent Mode (Fast)
1. Open the application at `http://localhost:3000`
2. Type your request in the chat panel:
   - "Create a React login form with validation"
   - "Build a REST API for user management"
   - "Generate a responsive navbar component"
3. The AI will generate code and display it in the editor
4. Preview your code in real-time in the preview panel

#### Multi-Agent Mode (Comprehensive) 🆕
1. Click the **"Multi-Agent"** toggle in the header (turns orange when active)
2. Make your request - agents automatically collaborate to deliver:
   - ✅ Production-ready code
   - ✅ Comprehensive test suite
   - ✅ Security review and fixes
   - ✅ Performance optimizations (optional)
   - ✅ Complete documentation
3. Watch the collaboration in real-time:
   - **Agent Dashboard**: See all 8 agents and their status
   - **Collaboration Timeline**: Track task execution flow
   - **Quality Report**: Review supervisor's final assessment

**Example Multi-Agent Request**:
```
Create a user authentication system with JWT tokens
```
**Result**: Complete auth system with code, tests, security hardening, and docs!

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
- **Agent Dashboard** - Multi-agent visualization (NEW!)
- **Collaboration Timeline** - Real-time agent tracking (NEW!)

### Backend
- **Express.js** - Web framework
- **AWS Bedrock** - AI model access (Claude 3.7 Sonnet, Nova, Haiku)
- **Multi-Agent Orchestrator** - 8 specialized AI agents (NEW!)
- **Agent Supervisor** - Task routing and quality control (NEW!)
- **Knowledge Bases** - Best practices repository (NEW!)
- **CrewAI** - Multi-agent framework
- **WebSocket** - Real-time communication
- **Jest** - Testing framework

## 📂 Project Structure

```
codingnexusai/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── AgentDashboard.js      # Multi-agent dashboard (NEW!)
│   │   │   ├── AgentCollaboration.js  # Collaboration view (NEW!)
│   │   │   ├── ChatPanel.js
│   │   │   ├── CodeEditor.js
│   │   │   ├── Header.js
│   │   │   ├── PreviewPanel.js
│   │   │   └── Sidebar.js
│   │   ├── services/           # API services
│   │   │   └── AIService.js    # Enhanced with multi-agent (NEW!)
│   │   ├── App.js              # Main app component
│   │   ├── App.css             # Component library
│   │   └── index.css           # Design system foundation
│   ├── public/                 # Static assets
│   └── package.json
├── server/                     # Backend Express server
│   ├── services/               # AI and code services
│   │   ├── multiagent.js      # Multi-agent orchestrator (NEW!)
│   │   ├── bedrock.js         # AWS Bedrock integration
│   │   ├── code.js            # Code generation logic
│   │   └── crewai.js          # CrewAI integration
│   ├── __tests__/             # Test files
│   ├── index.js               # Server entry point (enhanced)
│   └── package.json
├── DESIGN_SYSTEM.md           # Complete design documentation
├── TESTING_REPORT.md          # Test coverage report
├── MULTI_AGENT_GUIDE.md       # Multi-agent orchestration guide (NEW!)
└── README.md                  # This file
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

- **AWS Bedrock** - For providing access to Claude 3.7 Sonnet and multi-agent capabilities
- **AWS Solutions Library** - For [Multi-Agent Orchestration Guidance](https://github.com/aws-solutions-library-samples/guidance-for-multi-agent-orchestration-on-aws)
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
