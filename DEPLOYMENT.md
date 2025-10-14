# 🚀 Deployment Guide

## Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- AWS Bedrock access configured

### Step 1: Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Production-ready RAJ AI Coding Tool"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/raj-ai-coding-tool.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Add environment variables:
   - `AWS_REGION` = us-east-1
   - `AWS_ACCESS_KEY_ID` = your_key
   - `AWS_SECRET_ACCESS_KEY` = your_secret
   - `REACT_APP_API_URL` = https://YOUR-PROJECT.vercel.app/api
   - `REACT_APP_WS_URL` = wss://YOUR-PROJECT.vercel.app
6. Click "Deploy"

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
```

### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add the following:

**Production Variables:**
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
NODE_ENV=production
REACT_APP_API_URL=https://your-project.vercel.app/api
REACT_APP_WS_URL=wss://your-project.vercel.app
```

### Step 4: Verify Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Test multi-agent mode
3. Test code generation
4. Verify all features work

---

## Local Development

### Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/raj-ai-coding-tool.git
cd raj-ai-coding-tool

# Install dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..

# Copy environment files
cp .env.example server/.env
cp client/.env.example client/.env

# Edit .env files with your AWS credentials
```

### Configure AWS Credentials

Edit `server/.env`:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_actual_aws_key
AWS_SECRET_ACCESS_KEY=your_actual_aws_secret
PORT=3001
NODE_ENV=development
```

Edit `client/.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
```

### Run Development Server

```bash
# From project root
npm run dev

# This starts both:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:3001
```

### Build for Production

```bash
# Build frontend
cd client
npm run build

# The build folder contains production-ready static files
```

---

## AWS Bedrock Setup

### Required Models

Enable these models in AWS Bedrock console:

1. **Claude 3.7 Sonnet** (us.anthropic.claude-3-7-sonnet-20250219-v1:0)
2. **Claude 3.5 Sonnet V2** (us.anthropic.claude-3-5-sonnet-20241022-v2:0)
3. **Claude 3.5 Sonnet** (us.anthropic.claude-3-5-sonnet-20240620-v1:0)
4. **Claude 3.5 Haiku** (us.anthropic.claude-3-5-haiku-20241022-v1:0)

### Steps:

1. Go to AWS Console → Bedrock
2. Navigate to "Model access"
3. Click "Modify model access"
4. Enable the above models
5. Wait for approval (usually instant)

### IAM Permissions

Your AWS credentials need these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/*"
      ]
    }
  ]
}
```

---

## Troubleshooting

### Issue: AWS Credentials Error

**Solution**: 
1. Verify environment variables are set correctly
2. Check AWS IAM permissions
3. Ensure Bedrock models are enabled in your region

### Issue: WebSocket Connection Failed

**Solution**:
1. Check CORS settings in `server/index.js`
2. Verify WebSocket URL in client `.env`
3. Ensure server is running

### Issue: Build Fails on Vercel

**Solution**:
1. Check all environment variables are set
2. Verify `vercel.json` configuration
3. Check build logs for specific errors

### Issue: Multi-Agent Not Working

**Solution**:
1. Toggle multi-agent mode in header
2. Check browser console for errors
3. Verify AWS Bedrock connectivity

---

## Environment Variables Reference

### Server (.env)
| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| AWS_REGION | Yes | us-east-1 | AWS region for Bedrock |
| AWS_ACCESS_KEY_ID | Yes | AKIAIOSFODNN7EXAMPLE | AWS access key |
| AWS_SECRET_ACCESS_KEY | Yes | wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY | AWS secret key |
| PORT | No | 3001 | Server port (default: 3001) |
| NODE_ENV | No | production | Environment mode |

### Client (.env)
| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| REACT_APP_API_URL | Yes | https://your-app.vercel.app/api | Backend API URL |
| REACT_APP_WS_URL | Yes | wss://your-app.vercel.app | WebSocket URL |

---

## Production Checklist

Before deploying to production:

- [ ] AWS Bedrock models enabled
- [ ] Environment variables configured
- [ ] Build succeeds locally
- [ ] All features tested
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] CORS configured for production domain
- [ ] Error logging configured
- [ ] Analytics added (optional)

---

## Monitoring & Logs

### Vercel Logs

Access logs in Vercel Dashboard:
1. Go to your project
2. Click "Deployments"
3. Click on a deployment
4. View "Functions" and "Runtime Logs"

### Error Tracking

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- [Google Analytics](https://analytics.google.com) for usage stats

---

## Updating Deployment

### Automatic Deployment

Every push to `main` branch triggers automatic deployment on Vercel.

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys
```

### Manual Deployment

```bash
# Using Vercel CLI
vercel --prod
```

---

## Custom Domain

### Add Custom Domain in Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Vercel automatically provisions SSL

### Update Environment Variables

After adding custom domain, update:
```env
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_WS_URL=wss://yourdomain.com
```

---

## Support

### Documentation
- [Main README](./README.md)
- [Multi-Agent Guide](./MULTI_AGENT_GUIDE.md)
- [Enterprise Features](./ENTERPRISE_FEATURES.md)

### Help
- GitHub Issues: Report bugs
- Email: rajshah9305@example.com

---

## Cost Estimate

### Vercel (Free Tier)
- ✅ Free for personal projects
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Custom domains

### AWS Bedrock
- **Pay per use**: ~$0.003 per 1K input tokens, ~$0.015 per 1K output tokens
- **Estimated**: $10-50/month for moderate use
- **Multi-agent**: Uses more tokens but delivers comprehensive results

---

**Status**: ✅ Production Ready  
**Deployment Time**: ~5 minutes  
**Maintenance**: Minimal  

Happy Deploying! 🚀

