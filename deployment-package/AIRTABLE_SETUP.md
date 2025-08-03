# Airtable Database Setup Guide

## 🗄️ Setting Up Airtable Database

### Step 1: Create Airtable Account
1. Go to [airtable.com](https://airtable.com)
2. Sign up for a free account
3. Create a new workspace

### Step 2: Create Bookings Base
1. Click "Create a base"
2. Choose "Start from scratch"
3. Name your base: "Property Bookings"

### Step 3: Configure Bookings Table
1. Rename the default table to "Bookings"
2. Create the following fields:

| Field Name | Field Type | Settings |
|------------|------------|----------|
| checkinDate | Date | Date only |
| checkoutDate | Date | Date only |
| customerName | Single line text | Required |
| customerPhone | Phone number | Required |
| bookingAmount | Currency | USD, 2 decimal places |
| advanceAmount | Currency | USD, 2 decimal places |
| numberOfGuests | Number | Integer, minimum 1 |
| createdAt | Date | Include time |

### Step 4: Get API Credentials

#### Get API Key:
1. Go to [airtable.com/account](https://airtable.com/account)
2. Click "Generate API key"
3. Copy your API key

#### Get Base ID:
1. Go to [airtable.com/api](https://airtable.com/api)
2. Select your "Property Bookings" base
3. Copy the Base ID from the URL or documentation

### Step 5: Configure Environment Variables
1. Copy `.env.example` to `.env.local`
2. Update the Airtable credentials:
```env
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

## 🔐 Authentication Setup

### Step 1: Configure Supervisor Credentials
In your `.env.local` file, set:
```env
SUPERVISOR_USERNAME=supervisor
SUPERVISOR_PASSWORD=your-secure-password-here
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
```

### Step 2: Generate NextAuth Secret
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

### Step 3: Update Production URLs
For production deployment, update:
```env
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🧪 Testing the Setup

### Test Airtable Connection:
1. Start your development server: `npm run dev`
2. Try creating a booking
3. Check your Airtable base to see if the record appears

### Test Authentication:
1. Go to `/auth/signin`
2. Use your supervisor credentials
3. You should be redirected to the main dashboard

## 📊 Airtable Features

### Advantages:
- ✅ **Visual Interface**: View and edit bookings in Airtable
- ✅ **Collaboration**: Multiple people can access the data
- ✅ **Backup**: Automatic cloud backup
- ✅ **Export**: Easy data export to Excel/CSV
- ✅ **Mobile App**: Airtable mobile app access
- ✅ **API**: Robust API for integrations

### Free Plan Limits:
- 1,200 records per base
- 2GB attachment space
- Revision history (2 weeks)

### Paid Plans:
- **Plus ($10/month)**: 5,000 records, 5GB storage
- **Pro ($20/month)**: 50,000 records, 20GB storage

## 🔧 Customization Options

### Add More Fields:
You can add additional fields to track:
- Property location
- Special requests
- Payment status
- Check-in/out times
- Cleaning fees

### Views in Airtable:
Create different views for:
- Upcoming bookings
- Current month
- Overdue payments
- Guest count analysis

### Automations:
Set up Airtable automations for:
- Email confirmations
- Payment reminders
- Calendar sync

## 🚨 Security Best Practices

1. **API Key Security**:
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **Access Control**:
   - Limit Airtable base access
   - Use strong supervisor passwords
   - Enable 2FA on Airtable account

3. **Data Backup**:
   - Regular exports
   - Multiple admin access
   - Document recovery procedures

## 📞 Support

### Airtable Resources:
- [Airtable Support](https://support.airtable.com)
- [API Documentation](https://airtable.com/api)
- [Community Forum](https://community.airtable.com)

### Common Issues:
1. **API Key Invalid**: Check key format and permissions
2. **Base ID Wrong**: Verify from Airtable API docs
3. **Field Names**: Must match exactly (case-sensitive)
4. **Rate Limits**: Airtable has API rate limits

Your booking system now has enterprise-grade database storage with Airtable! 🎉
