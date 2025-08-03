# Quick Deployment Instructions

## 🚀 Deploy to Vercel (Easiest)
1. Upload this folder to GitHub
2. Go to vercel.com
3. Import your GitHub repository
4. Deploy automatically!

## 🖥️ Deploy to VPS/Server
1. Upload this folder to your server
2. Run: `npm install`
3. Run: `npm run build`
4. Run: `npm start`
5. Configure reverse proxy (Nginx/Apache)

## 📋 Before Deployment
1. Copy `.env.example` to `.env.local`
2. Update environment variables
3. Test locally: `npm run dev`

## 🔗 Access Your App
- Local: http://localhost:3000
- Production: https://yourdomain.com

For detailed instructions, see DEPLOYMENT_GUIDE.md
