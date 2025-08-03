@echo off
echo.
echo 🚀 Property Booking Management Setup
echo =====================================
echo.
echo This setup wizard will help you configure your booking management system.
echo You'll need to provide API keys and credentials for:
echo.
echo 1. Airtable Database
echo 2. Authentication System  
echo 3. Application URLs
echo.
echo Let's get started!
echo.

set /p AIRTABLE_API_KEY="📊 Enter your Airtable API Key (from https://airtable.com/account): "
if "%AIRTABLE_API_KEY%"=="" (
    echo ❌ API Key is required!
    pause
    exit /b 1
)

set /p AIRTABLE_BASE_ID="🗄️ Enter your Airtable Base ID (from https://airtable.com/api): "
if "%AIRTABLE_BASE_ID%"=="" (
    echo ❌ Base ID is required!
    pause
    exit /b 1
)

set /p SUPERVISOR_USERNAME="👤 Enter supervisor username (default: supervisor): "
if "%SUPERVISOR_USERNAME%"=="" set SUPERVISOR_USERNAME=supervisor

set /p SUPERVISOR_PASSWORD="🔐 Enter supervisor password (minimum 8 characters): "
if "%SUPERVISOR_PASSWORD%"=="" (
    echo ❌ Password is required!
    pause
    exit /b 1
)

set /p NEXTAUTH_URL="🌐 Enter your application URL (e.g., https://yourdomain.vercel.app): "
if "%NEXTAUTH_URL%"=="" (
    echo ❌ Application URL is required!
    pause
    exit /b 1
)

echo.
echo ⚙️ Generating configuration...

:: Generate a random secret (simplified for batch)
set NEXTAUTH_SECRET=%RANDOM%%RANDOM%%RANDOM%%RANDOM%

:: Create .env.local file
(
echo # Property Booking Management - Environment Configuration
echo # Generated on %date% %time%
echo.
echo # Application URLs
echo NEXTAUTH_URL=%NEXTAUTH_URL%
echo NEXT_PUBLIC_APP_URL=%NEXTAUTH_URL%
echo.
echo # NextAuth Configuration
echo NEXTAUTH_SECRET=%NEXTAUTH_SECRET%
echo.
echo # Supervisor Authentication
echo SUPERVISOR_USERNAME=%SUPERVISOR_USERNAME%
echo SUPERVISOR_PASSWORD=%SUPERVISOR_PASSWORD%
echo.
echo # Airtable Database Configuration
echo AIRTABLE_API_KEY=%AIRTABLE_API_KEY%
echo AIRTABLE_BASE_ID=%AIRTABLE_BASE_ID%
echo.
echo # Instructions:
echo # 1. Keep this file secure and never commit it to version control
echo # 2. For production deployment, set these as environment variables in your hosting platform
echo # 3. Update URLs when deploying to production
) > .env.local

echo.
echo 🎉 Configuration Complete!
echo ==========================
echo.
echo ✅ Environment file created: .env.local
echo ✅ NextAuth secret generated automatically
echo ✅ All credentials configured
echo.
echo 📋 Summary:
echo -----------
echo 🌐 Application URL: %NEXTAUTH_URL%
echo 👤 Supervisor Username: %SUPERVISOR_USERNAME%
echo 🔐 Password: [HIDDEN]
echo 📊 Airtable API Key: [CONFIGURED]
echo 🗄️ Airtable Base ID: [CONFIGURED]
echo.
echo 🚀 Next Steps:
echo --------------
echo 1. Run: npm install
echo 2. Run: npm run dev
echo 3. Visit: %NEXTAUTH_URL%
echo 4. Login with your supervisor credentials
echo.
echo 📚 Documentation:
echo -----------------
echo - AIRTABLE_SETUP.md - Complete Airtable configuration guide
echo - PRODUCTION_DEPLOYMENT.md - Deployment instructions
echo - VERCEL_DEPLOYMENT_FIX.md - Vercel-specific deployment guide
echo.
echo 🔒 Security Notes:
echo ------------------
echo - Your .env.local file contains sensitive information
echo - Never commit .env.local to version control
echo - For production, set these as environment variables in your hosting platform
echo.
echo Happy booking management! 🎯
echo.
pause
