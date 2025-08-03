#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
🚀 Property Booking Management Setup
=====================================

This setup wizard will help you configure your booking management system.
You'll need to provide API keys and credentials for:

1. Airtable Database
2. Authentication System
3. Application URLs

Let's get started!
`);

const questions = [
  {
    key: 'AIRTABLE_API_KEY',
    question: '📊 Enter your Airtable API Key (from https://airtable.com/account): ',
    required: true,
    validate: (value) => value.startsWith('key') ? null : 'API key should start with "key"'
  },
  {
    key: 'AIRTABLE_BASE_ID',
    question: '🗄️ Enter your Airtable Base ID (from https://airtable.com/api): ',
    required: true,
    validate: (value) => value.startsWith('app') ? null : 'Base ID should start with "app"'
  },
  {
    key: 'SUPERVISOR_USERNAME',
    question: '👤 Enter supervisor username (default: supervisor): ',
    required: false,
    default: 'supervisor'
  },
  {
    key: 'SUPERVISOR_PASSWORD',
    question: '🔐 Enter supervisor password (minimum 8 characters): ',
    required: true,
    validate: (value) => value.length >= 8 ? null : 'Password must be at least 8 characters'
  },
  {
    key: 'NEXTAUTH_URL',
    question: '🌐 Enter your application URL (e.g., https://yourdomain.vercel.app): ',
    required: true,
    validate: (value) => value.startsWith('http') ? null : 'URL must start with http:// or https://'
  }
];

let answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    generateConfig();
    return;
  }

  const q = questions[index];
  const prompt = q.question;

  rl.question(prompt, (answer) => {
    const value = answer.trim() || q.default || '';
    
    if (q.required && !value) {
      console.log('❌ This field is required. Please try again.\n');
      askQuestion(index);
      return;
    }

    if (q.validate && value) {
      const error = q.validate(value);
      if (error) {
        console.log(`❌ ${error}. Please try again.\n`);
        askQuestion(index);
        return;
      }
    }

    answers[q.key] = value;
    console.log('✅ Saved!\n');
    askQuestion(index + 1);
  });
}

function generateConfig() {
  // Generate a secure NextAuth secret
  const nextAuthSecret = crypto.randomBytes(32).toString('base64');
  answers.NEXTAUTH_SECRET = nextAuthSecret;
  answers.NEXT_PUBLIC_APP_URL = answers.NEXTAUTH_URL;

  // Create .env.local file
  const envContent = `# Property Booking Management - Environment Configuration
# Generated on ${new Date().toISOString()}

# Application URLs
NEXTAUTH_URL=${answers.NEXTAUTH_URL}
NEXT_PUBLIC_APP_URL=${answers.NEXT_PUBLIC_APP_URL}

# NextAuth Configuration
NEXTAUTH_SECRET=${answers.NEXTAUTH_SECRET}

# Supervisor Authentication
SUPERVISOR_USERNAME=${answers.SUPERVISOR_USERNAME}
SUPERVISOR_PASSWORD=${answers.SUPERVISOR_PASSWORD}

# Airtable Database Configuration
AIRTABLE_API_KEY=${answers.AIRTABLE_API_KEY}
AIRTABLE_BASE_ID=${answers.AIRTABLE_BASE_ID}

# Instructions:
# 1. Keep this file secure and never commit it to version control
# 2. For production deployment, set these as environment variables in your hosting platform
# 3. Update URLs when deploying to production
`;

  fs.writeFileSync('.env.local', envContent);

  console.log(`
🎉 Configuration Complete!
==========================

✅ Environment file created: .env.local
✅ NextAuth secret generated automatically
✅ All credentials configured

📋 Summary:
-----------
🌐 Application URL: ${answers.NEXTAUTH_URL}
👤 Supervisor Username: ${answers.SUPERVISOR_USERNAME}
🔐 Password: ${'*'.repeat(answers.SUPERVISOR_PASSWORD.length)}
📊 Airtable API Key: ${answers.AIRTABLE_API_KEY.substring(0, 8)}...
🗄️ Airtable Base ID: ${answers.AIRTABLE_BASE_ID.substring(0, 8)}...

🚀 Next Steps:
--------------
1. Run: npm install
2. Run: npm run dev
3. Visit: ${answers.NEXTAUTH_URL}
4. Login with your supervisor credentials

📚 Documentation:
-----------------
- AIRTABLE_SETUP.md - Complete Airtable configuration guide
- PRODUCTION_DEPLOYMENT.md - Deployment instructions
- VERCEL_DEPLOYMENT_FIX.md - Vercel-specific deployment guide

🔒 Security Notes:
------------------
- Your .env.local file contains sensitive information
- Never commit .env.local to version control
- For production, set these as environment variables in your hosting platform

Happy booking management! 🎯
`);

  rl.close();
}

// Start the setup process
askQuestion(0);
