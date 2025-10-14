# ⚡ Setup Instructions

## Complete Guide to Get Started in 5 Minutes

### Option 1: Deploy to Vercel (Fastest - 2 minutes)

1. **Fork this repository** on GitHub

2. **Go to Vercel** → https://vercel.com

3. **Click "New Project"**

4. **Import your forked repository**

5. **Add environment variables** in Vercel dashboard:
   ```
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_here
   REACT_APP_API_URL=https://YOUR-PROJECT.vercel.app/api
   REACT_APP_WS_URL=wss://YOUR-PROJECT.vercel.app
   ```

6. **Click Deploy** ✅

**Done!** Your app is live in 2 minutes.

---

### Option 2: Run Locally (5 minutes)

#### Step 1: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/raj-ai-coding-tool.git
cd raj-ai-coding-tool
```

#### Step 2: Install Dependencies

```bash
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

#### Step 3: Configure AWS

**Create `server/.env`:**
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
PORT=3001
NODE_ENV=development
```

**Create `client/.env`:**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
```

#### Step 4: Enable AWS Bedrock Models

1. Go to AWS Console → Bedrock
2. Click "Model access"
3. Enable:
   - Claude 3.7 Sonnet
   - Claude 3.5 Sonnet V2
   - Claude 3.5 Haiku

#### Step 5: Start Application

```bash
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## Verification Checklist

After setup, verify:

- [ ] Frontend loads at http://localhost:3000
- [ ] No console errors
- [ ] Can type in chat
- [ ] Toggle multi-agent mode works
- [ ] Generate code works (test with: "Create a React button")
- [ ] Code appears in editor
- [ ] Preview shows output
- [ ] All 8 agents visible in dashboard

---

## Troubleshooting

### Error: "AWS Bedrock Access Denied"

**Solution:**
1. Verify AWS credentials in `server/.env`
2. Check IAM user has Bedrock permissions
3. Ensure models are enabled in AWS console

### Error: "Cannot connect to server"

**Solution:**
1. Check if backend is running on port 3001
2. Verify `client/.env` has correct API URL
3. Check firewall settings

### Error: "Module not found"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules client/node_modules server/node_modules
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### Error: "Multi-agent mode not working"

**Solution:**
1. Toggle the multi-agent button in header
2. Check browser console for errors
3. Verify all dependencies installed

---

## Quick Commands

```bash
# Start development
npm run dev

# Build for production
cd client && npm run build

# Deploy to Vercel
vercel

# Run tests
npm test

# Check for errors
npm run lint
```

---

## Need Help?

1. **Check Documentation:**
   - [Main README](./README.md)
   - [Deployment Guide](./DEPLOYMENT.md)
   - [Multi-Agent Guide](./MULTI_AGENT_GUIDE.md)

2. **Common Issues:**
   - AWS credentials → Check `.env` file
   - Server not starting → Check port 3001 is free
   - Build errors → Reinstall dependencies

3. **Still Stuck?**
   - Email: rajshah9305@example.com
   - GitHub Issues: Report bugs

---

## Next Steps

After setup:

1. **Try Multi-Agent Mode:**
   - Toggle the orange "Multi-Agent" button
   - Request: "Create a user authentication system"
   - Watch 8 agents collaborate!

2. **Explore Features:**
   - Code export (download/copy)
   - Live preview
   - Responsive viewport switching
   - Agent collaboration timeline

3. **Customize:**
   - Add your own prompts
   - Adjust agent behavior
   - Modify UI colors

---

**Setup Time:** 2-5 minutes  
**Difficulty:** Beginner-friendly  
**Status:** Production Ready ✅

