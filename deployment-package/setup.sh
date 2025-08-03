#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "🚀 Property Booking Management Setup"
echo "====================================="
echo ""
echo "This setup wizard will help you configure your booking management system."
echo "You'll need to provide API keys and credentials for:"
echo ""
echo "1. Airtable Database"
echo "2. Authentication System"
echo "3. Application URLs"
echo ""
echo "Let's get started!"
echo -e "${NC}"

# Function to read input with validation
read_input() {
    local prompt="$1"
    local var_name="$2"
    local required="$3"
    local validation="$4"
    local default_value="$5"
    
    while true; do
        echo -n -e "${YELLOW}$prompt${NC}"
        read input
        
        # Use default if empty and default provided
        if [[ -z "$input" && -n "$default_value" ]]; then
            input="$default_value"
        fi
        
        # Check if required
        if [[ "$required" == "true" && -z "$input" ]]; then
            echo -e "${RED}❌ This field is required. Please try again.${NC}"
            echo ""
            continue
        fi
        
        # Validate input
        case "$validation" in
            "airtable_key")
                if [[ ! "$input" =~ ^key ]]; then
                    echo -e "${RED}❌ API key should start with 'key'. Please try again.${NC}"
                    echo ""
                    continue
                fi
                ;;
            "airtable_base")
                if [[ ! "$input" =~ ^app ]]; then
                    echo -e "${RED}❌ Base ID should start with 'app'. Please try again.${NC}"
                    echo ""
                    continue
                fi
                ;;
            "password")
                if [[ ${#input} -lt 8 ]]; then
                    echo -e "${RED}❌ Password must be at least 8 characters. Please try again.${NC}"
                    echo ""
                    continue
                fi
                ;;
            "url")
                if [[ ! "$input" =~ ^https?:// ]]; then
                    echo -e "${RED}❌ URL must start with http:// or https://. Please try again.${NC}"
                    echo ""
                    continue
                fi
                ;;
        esac
        
        # Set the variable
        eval "$var_name='$input'"
        echo -e "${GREEN}✅ Saved!${NC}"
        echo ""
        break
    done
}

# Collect all inputs
read_input "📊 Enter your Airtable API Key (from https://airtable.com/account): " "AIRTABLE_API_KEY" "true" "airtable_key"
read_input "🗄️ Enter your Airtable Base ID (from https://airtable.com/api): " "AIRTABLE_BASE_ID" "true" "airtable_base"
read_input "👤 Enter supervisor username (default: supervisor): " "SUPERVISOR_USERNAME" "false" "" "supervisor"
read_input "🔐 Enter supervisor password (minimum 8 characters): " "SUPERVISOR_PASSWORD" "true" "password"
read_input "🌐 Enter your application URL (e.g., https://yourdomain.vercel.app): " "NEXTAUTH_URL" "true" "url"

echo -e "${BLUE}⚙️ Generating configuration...${NC}"

# Generate a secure NextAuth secret
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)

# Set additional variables
NEXT_PUBLIC_APP_URL="$NEXTAUTH_URL"

# Create .env.local file
cat > .env.local << EOF
# Property Booking Management - Environment Configuration
# Generated on $(date)

# Application URLs
NEXTAUTH_URL=$NEXTAUTH_URL
NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# NextAuth Configuration
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Supervisor Authentication
SUPERVISOR_USERNAME=$SUPERVISOR_USERNAME
SUPERVISOR_PASSWORD=$SUPERVISOR_PASSWORD

# Airtable Database Configuration
AIRTABLE_API_KEY=$AIRTABLE_API_KEY
AIRTABLE_BASE_ID=$AIRTABLE_BASE_ID

# Instructions:
# 1. Keep this file secure and never commit it to version control
# 2. For production deployment, set these as environment variables in your hosting platform
# 3. Update URLs when deploying to production
EOF

echo ""
echo -e "${GREEN}🎉 Configuration Complete!${NC}"
echo "=========================="
echo ""
echo -e "${GREEN}✅ Environment file created: .env.local${NC}"
echo -e "${GREEN}✅ NextAuth secret generated automatically${NC}"
echo -e "${GREEN}✅ All credentials configured${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo "-----------"
echo -e "🌐 Application URL: ${NEXTAUTH_URL}"
echo -e "👤 Supervisor Username: ${SUPERVISOR_USERNAME}"
echo -e "🔐 Password: $(echo "$SUPERVISOR_PASSWORD" | sed 's/./*/g')"
echo -e "📊 Airtable API Key: ${AIRTABLE_API_KEY:0:8}..."
echo -e "🗄️ Airtable Base ID: ${AIRTABLE_BASE_ID:0:8}..."
echo ""
echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo "--------------"
echo "1. Run: npm install"
echo "2. Run: npm run dev"
echo "3. Visit: $NEXTAUTH_URL"
echo "4. Login with your supervisor credentials"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "-----------------"
echo "- AIRTABLE_SETUP.md - Complete Airtable configuration guide"
echo "- PRODUCTION_DEPLOYMENT.md - Deployment instructions"
echo "- VERCEL_DEPLOYMENT_FIX.md - Vercel-specific deployment guide"
echo ""
echo -e "${RED}🔒 Security Notes:${NC}"
echo "------------------"
echo "- Your .env.local file contains sensitive information"
echo "- Never commit .env.local to version control"
echo "- For production, set these as environment variables in your hosting platform"
echo ""
echo -e "${GREEN}Happy booking management! 🎯${NC}"
