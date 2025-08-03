# Property Booking Management - Deployment Guide

## 🚀 Deployment Options

Your Next.js property booking management application can be deployed in several ways. Here are the most popular options:

### Option 1: Vercel (Recommended - Easiest)
**Best for:** Quick deployment, automatic scaling, zero configuration

1. **Prepare for deployment:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Import your project repository
   - Vercel will automatically detect it's a Next.js app
   - Deploy with one click!

3. **Custom domain:** Add your domain in Vercel dashboard

### Option 2: Netlify
**Best for:** Static hosting with serverless functions

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder or connect GitHub
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

### Option 3: Traditional Web Hosting (cPanel/Shared Hosting)
**Best for:** Existing web hosting providers

⚠️ **Important:** Most shared hosting doesn't support Node.js applications. You'll need:
- VPS (Virtual Private Server)
- Dedicated server
- Hosting that supports Node.js

### Option 4: VPS/Cloud Server (DigitalOcean, AWS, etc.)
**Best for:** Full control, custom configurations

1. **Server setup:**
   ```bash
   # Install Node.js and npm
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   npm install -g pm2
   ```

2. **Deploy application:**
   ```bash
   # Upload your code to server
   git clone your-repository
   cd your-app
   npm install
   npm run build
   
   # Start with PM2
   pm2 start npm --name "booking-app" -- start
   pm2 startup
   pm2 save
   ```

3. **Configure Nginx (reverse proxy):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 📦 Pre-Deployment Checklist

### 1. Update Package.json
```json
{
  "name": "property-booking-management",
  "version": "1.0.0",
  "description": "Weekend property booking management system",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 2. Environment Variables
Create `.env.local` for local development and configure production environment variables:

```env
# Add any API keys or configuration here
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Database Consideration
⚠️ **Current limitation:** Your app uses in-memory storage which resets on server restart.

**For production, consider:**
- **SQLite** (file-based, simple)
- **PostgreSQL** (robust, scalable)
- **MongoDB** (document-based)
- **Supabase** (hosted PostgreSQL)

### 4. Build and Test
```bash
# Test production build locally
npm run build
npm start
```

## 🔧 Production Optimizations

### 1. Add Database Integration
Replace the in-memory store with a real database:

```typescript
// Example with SQLite
import Database from 'better-sqlite3';
const db = new Database('bookings.db');

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    checkinDate TEXT,
    checkoutDate TEXT,
    customerName TEXT,
    customerPhone TEXT,
    bookingAmount REAL,
    advanceAmount REAL,
    numberOfGuests INTEGER,
    createdAt TEXT
  )
`);
```

### 2. Add Authentication (Optional)
For supervisor-only access:
```bash
npm install next-auth
```

### 3. Add Data Backup
```bash
# Automated backup script
#!/bin/bash
cp bookings.db backups/bookings-$(date +%Y%m%d).db
```

## 📁 Files to Include in Deployment

### Essential Files:
- `src/` (all source code)
- `public/` (static assets)
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `tailwind.config.js`
- `postcss.config.mjs`

### Files to Exclude (.gitignore):
```
node_modules/
.next/
.env.local
*.log
.DS_Store
```

## 🌐 Domain Setup

1. **Purchase domain** from registrar (GoDaddy, Namecheap, etc.)
2. **Configure DNS:**
   - Point A record to your server IP
   - Or use CNAME for Vercel/Netlify
3. **SSL Certificate:**
   - Automatic with Vercel/Netlify
   - Use Let's Encrypt for VPS

## 📱 Mobile Optimization

Your app is already mobile-responsive with Tailwind CSS!

## 🔒 Security Considerations

1. **HTTPS only** in production
2. **Input validation** (already implemented)
3. **Rate limiting** for API endpoints
4. **Regular backups**

## 📞 Support

If you need help with deployment, consider:
1. **Vercel** - Easiest option with great documentation
2. **VPS setup** - More control but requires technical knowledge
3. **Managed hosting** - Services like Railway, Render, or Heroku

Choose the option that best fits your technical comfort level and budget!
