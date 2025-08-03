# 🚀 Interactive Setup Guide

## 🎯 Quick Start with Interactive Setup

Your property booking management system now includes **interactive setup scripts** that will prompt you for all required credentials and automatically configure your environment.

## 📋 What You'll Need

Before running the setup, gather these credentials:

### 1. Airtable Database
- **API Key**: Get from [airtable.com/account](https://airtable.com/account)
- **Base ID**: Get from [airtable.com/api](https://airtable.com/api) (select your base)

### 2. Authentication
- **Supervisor Username**: Choose a username (default: supervisor)
- **Supervisor Password**: Choose a secure password (minimum 8 characters)

### 3. Application URL
- **Local Development**: `http://localhost:3000`
- **Production**: Your actual domain (e.g., `https://yourdomain.vercel.app`)

## 🖥️ Setup Options

### Option 1: Node.js Setup (Recommended)
```bash
npm run setup
```

### Option 2: Cross-Platform Scripts

#### Windows Users:
```cmd
setup.bat
```

#### macOS/Linux Users:
```bash
chmod +x setup.sh
./setup.sh
```

## 📝 Step-by-Step Setup Process

### 1. Run the Setup Script
Choose your preferred method above and run the setup script.

### 2. Follow the Interactive Prompts
The script will ask for:

```
🚀 Property Booking Management Setup
=====================================

📊 Enter your Airtable API Key: keyXXXXXXXXXXXXXX
🗄️ Enter your Airtable Base ID: appXXXXXXXXXXXXXX
👤 Enter supervisor username: supervisor
🔐 Enter supervisor password: ********
🌐 Enter your application URL: https://yourdomain.vercel.app
```

### 3. Automatic Configuration
The script will:
- ✅ Validate all inputs
- ✅ Generate secure NextAuth secret
- ✅ Create `.env.local` file
- ✅ Display configuration summary

### 4. Start Development
```bash
npm install
npm run dev
```

## 🔧 What Gets Configured

### Environment Variables Created:
```env
# Application URLs
NEXTAUTH_URL=https://yourdomain.vercel.app
NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app

# NextAuth Configuration (auto-generated)
NEXTAUTH_SECRET=automatically-generated-secure-key

# Supervisor Authentication
SUPERVISOR_USERNAME=supervisor
SUPERVISOR_PASSWORD=your-secure-password

# Airtable Database Configuration
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

## ✅ Validation Features

The setup script includes smart validation:

### Airtable API Key
- ✅ Must start with "key"
- ✅ Required field

### Airtable Base ID
- ✅ Must start with "app"
- ✅ Required field

### Password
- ✅ Minimum 8 characters
- ✅ Required field

### Application URL
- ✅ Must start with http:// or https://
- ✅ Required field

## 🚀 After Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access Your Application
Visit the URL you configured (e.g., `http://localhost:3000`)

### 4. Login
Use the supervisor credentials you set during setup.

## 🔒 Security Features

### Automatic Security
- ✅ **Secure Secret Generation**: Cryptographically secure NextAuth secret
- ✅ **Input Validation**: All inputs validated before saving
- ✅ **Hidden Passwords**: Passwords masked during input
- ✅ **File Permissions**: .env.local created with appropriate permissions

### Security Best Practices
- 🔐 **Never commit .env.local** to version control
- 🔐 **Use strong passwords** (minimum 8 characters)
- 🔐 **Rotate credentials** regularly in production
- 🔐 **Use HTTPS** in production

## 🌐 Production Deployment

### For Vercel:
1. Run setup with your production URL
2. Push code to GitHub
3. Connect to Vercel
4. Add environment variables in Vercel dashboard
5. Deploy

### Environment Variables for Production:
Copy these from your generated `.env.local` to your hosting platform:
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `SUPERVISOR_USERNAME`
- `SUPERVISOR_PASSWORD`
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `NEXT_PUBLIC_APP_URL`

## 🛠️ Troubleshooting

### Setup Script Won't Run
**Windows**: Ensure you have Node.js installed
**macOS/Linux**: Make sure script is executable: `chmod +x setup.sh`

### Invalid API Key/Base ID
- Double-check from Airtable dashboard
- Ensure you're copying the full key/ID
- API key should start with "key"
- Base ID should start with "app"

### Authentication Not Working
- Verify all environment variables are set
- Check that NEXTAUTH_URL matches your actual URL
- Ensure NEXTAUTH_SECRET is properly generated

### Airtable Connection Failed
- Verify API key has proper permissions
- Check that Base ID is correct
- Ensure Airtable base has the correct table structure

## 📞 Support

If you encounter issues:

1. **Check the generated .env.local** file for correct values
2. **Review the setup output** for any error messages
3. **Consult the documentation** files included in the package
4. **Verify Airtable setup** using `AIRTABLE_SETUP.md`

## 🎉 Success!

After successful setup, you'll have:
- ✅ **Fully configured environment**
- ✅ **Secure authentication system**
- ✅ **Airtable database integration**
- ✅ **Production-ready configuration**

Your property booking management system is ready to use! 🚀

## 📚 Additional Resources

- **`AIRTABLE_SETUP.md`** - Detailed Airtable configuration
- **`PRODUCTION_DEPLOYMENT.md`** - Deployment instructions
- **`VERCEL_DEPLOYMENT_FIX.md`** - Vercel-specific fixes
- **`ENHANCED_FEATURES_SUMMARY.md`** - Feature overview

Happy booking management! 🎯
