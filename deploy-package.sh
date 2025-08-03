#!/bin/bash

# Property Booking Management - Deployment Package Script
# This script creates a deployment-ready package

echo "🚀 Creating deployment package for Property Booking Management..."

# Create deployment directory
mkdir -p deployment-package

# Copy essential files
echo "📁 Copying essential files..."
cp -r src deployment-package/
cp -r public deployment-package/
cp package.json deployment-package/
cp package-lock.json deployment-package/
cp next.config.ts deployment-package/
cp tsconfig.json deployment-package/
cp postcss.config.mjs deployment-package/
cp components.json deployment-package/
cp .env.example deployment-package/
cp README.md deployment-package/
cp DEPLOYMENT_GUIDE.md deployment-package/
cp .gitignore deployment-package/

# Create deployment instructions
cat > deployment-package/QUICK_DEPLOY.md << 'EOF'
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
EOF

echo "✅ Deployment package created in 'deployment-package' folder"
echo ""
echo "📦 Package contents:"
echo "   ├── src/ (all source code)"
echo "   ├── public/ (static assets)"
echo "   ├── package.json"
echo "   ├── README.md"
echo "   ├── DEPLOYMENT_GUIDE.md"
echo "   ├── QUICK_DEPLOY.md"
echo "   └── configuration files"
echo ""
echo "🎯 Next steps:"
echo "1. Zip the 'deployment-package' folder"
echo "2. Upload to your hosting provider"
echo "3. Follow QUICK_DEPLOY.md instructions"
echo ""
echo "🌟 Recommended: Deploy to Vercel for easiest setup!"
