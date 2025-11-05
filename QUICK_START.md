# 🚀 AI Coding Nexus - Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- AWS Bedrock access configured
- Terminal/Command line access

---

## 1️⃣ Installation

### Clone and Install Dependencies

```bash
# Navigate to project directory
cd /workspaces/codingnexusai

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## 2️⃣ Configuration

### Environment Variables

Configure your AWS Bedrock credentials in the `.env` file:

```env
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
PORT=3001
NODE_ENV=development
```

⚠️ **Important**: Replace `your_access_key_here` and `your_secret_key_here` with your actual AWS credentials.

---

## 3️⃣ Running the Application

### Option A: Development Mode (Recommended)

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm start
```

You should see:
```
🚀 AI Coding Nexus Server running on port 3001
📦 Multi-Agent Orchestration: ENABLED
🤖 Available Agents: 8
```

**Terminal 2 - Start Frontend Client:**
```bash
cd client
npm start
```

The app will automatically open at `http://localhost:3000`

### Option B: Production Build

```bash
# Build the client
cd client
npm run build

# Serve the production build
npx serve -s build -l 3000

# In another terminal, start the server
cd ../server
NODE_ENV=production npm start
```

---

## 4️⃣ Using the Application

### Interface Overview

The application has a **3-pane layout**:

1. **Left Pane**: Chat & Agent Collaboration
2. **Middle Pane**: Code Editor
3. **Right Pane**: AI Tools & Quick Actions

### Quick Actions

#### Generate Code
1. Click on a **Quick Action** button (e.g., "React Component")
2. Enter your requirements in the prompt
3. Wait for the multi-agent system to generate code
4. Code appears in the editor automatically

#### Chat Interface
1. Type your request in the chat input
2. Press Enter or click Send
3. The AI will respond with code and explanations
4. View agent collaboration in real-time

#### Code Tools
- **Debug**: Find and fix issues in your code
- **Explain**: Get detailed code explanations
- **Optimize**: Improve code performance
- **Auto Fix**: Automatically fix common errors

### Available Models

Choose from 27 AI models in the header dropdown:

**Recommended Models:**
- `claude-3.5-sonnet-v2` (Default) - Best overall
- `claude-3.5-haiku` - Fast responses
- `deepseek-v3` - Code-focused
- `qwen3-coder-480b` - Large coding model

---

## 5️⃣ Features

### Multi-Agent System

The application uses **8 specialized agents** working together:

1. **Supervisor** - Coordinates tasks
2. **Code Generator** - Creates code
3. **Testing Agent** - Writes tests
4. **Security Agent** - Checks vulnerabilities
5. **Performance Agent** - Optimizes code
6. **Documentation Agent** - Writes docs
7. **Architect Agent** - Designs systems
8. **Debug Agent** - Fixes bugs

### Code Editor Features

- **Syntax Highlighting** for 8+ languages
- **Auto-completion** and IntelliSense
- **Copy/Download** code easily
- **Fullscreen Mode** for focus
- **Keyboard Shortcuts**:
  - `Ctrl+S` - Save
  - `Ctrl+/` - Comment
  - `Ctrl+F` - Find

### Responsive Design

- **Desktop**: Full 3-pane layout
- **Tablet**: 2-pane layout
- **Mobile**: Single pane with floating tools

---

## 6️⃣ Example Workflows

### Create a React Component

1. Click **"React Component"** in Quick Actions
2. Enter: `a modern login form with email and password`
3. Wait for generation (5-10 seconds)
4. Review the generated code in the editor
5. Copy or download the code

### Debug Code

1. Paste your code in the editor
2. Click **"Debug Code"** in Code Tools
3. Describe the issue
4. Get analysis and fixed code

### Build a Full-Stack App

1. Click **"Full-Stack App"** in Quick Actions
2. Enter: `a todo list application with user authentication`
3. Multi-agent system will:
   - Design architecture
   - Generate frontend code
   - Create backend API
   - Add tests and documentation
4. Review complete application structure

---

## 7️⃣ Troubleshooting

### Server Won't Start

**Check AWS Credentials:**
```bash
cd server
node -e "require('dotenv').config({path:'../.env'}); console.log('Region:', process.env.AWS_REGION)"
```

**Verify Dependencies:**
```bash
cd server
npm install
```

### Client Won't Start

**Clear Cache and Reinstall:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm start
```

### Port Already in Use

**Kill existing processes:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### API Errors

**Test API Connection:**
```bash
curl http://localhost:3001/api/models
```

Should return a list of 27 models.

---

## 8️⃣ Tips & Best Practices

### For Best Results

1. **Be Specific**: Provide detailed requirements
2. **Use Context**: Mention frameworks, libraries, or patterns
3. **Iterate**: Refine generated code with follow-up requests
4. **Review**: Always review generated code before use

### Model Selection

- **Quick Tasks**: Use `claude-3.5-haiku` (fast)
- **Complex Projects**: Use `claude-3.5-sonnet-v2` (best quality)
- **Coding Focus**: Use `deepseek-v3` or `qwen3-coder-480b`
- **Large Context**: Use `llama3.1-405b-instruct`

### Performance Tips

1. Keep prompts concise but detailed
2. Use Quick Actions for common tasks
3. Enable multi-agent for complex projects
4. Close unused browser tabs

---

## 9️⃣ Keyboard Shortcuts

### Global
- `Ctrl+Enter` - Send chat message
- `Esc` - Close modals/panels

### Code Editor
- `Ctrl+S` - Save code
- `Ctrl+/` - Toggle comment
- `Ctrl+F` - Find
- `Ctrl+H` - Find and replace
- `Ctrl+D` - Select next occurrence
- `Alt+Up/Down` - Move line up/down

---

## 🔟 API Usage

### Generate Code Programmatically

```javascript
const axios = require('axios');

const response = await axios.post('http://localhost:3001/api/generate', {
  prompt: 'Create a React button component',
  model: 'claude-3.5-sonnet-v2',
  type: 'component'
});

console.log(response.data.code);
```

### Multi-Agent Orchestration

```javascript
const response = await axios.post('http://localhost:3001/api/multiagent/orchestrate', {
  prompt: 'Build a REST API for user management',
  options: {
    includeTests: true,
    includeSecurity: true,
    includeDocs: true
  }
});

console.log(response.data);
```

---

## 📚 Additional Resources

- **Full Documentation**: See `DEPLOYMENT_SUMMARY.md`
- **API Reference**: Check server endpoints
- **Component Guide**: Review `client/src/components/`
- **Service Documentation**: See `server/services/`

---

## 🎯 Quick Reference

### URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **WebSocket**: ws://localhost:3001

### Default Ports
- Client: 3000
- Server: 3001

### Key Files
- Server Config: `server/.env`
- Client Config: `client/.env`
- Server Entry: `server/index.js`
- Client Entry: `client/src/App.js`

---

## ✅ Verification Checklist

Before using the application, verify:

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (server & client)
- [ ] `.env` file exists with AWS credentials
- [ ] Server starts without errors
- [ ] Client builds successfully
- [ ] Can access http://localhost:3000
- [ ] API responds at http://localhost:3001/api/models
- [ ] Can generate code successfully

---

## 🆘 Getting Help

If you encounter issues:

1. Check the console logs (browser & terminal)
2. Review error messages carefully
3. Verify AWS credentials are correct
4. Ensure all dependencies are installed
5. Try restarting both server and client

---

## 🎉 You're Ready!

The AI Coding Nexus is now running and ready to help you build amazing applications with AI-powered code generation!

**Happy Coding! 🚀**
