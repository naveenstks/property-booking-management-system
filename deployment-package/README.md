# Property Booking Management System

A modern, responsive web application for managing weekend property rental bookings. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- **📅 Booking Management**: Add, edit, and delete property bookings
- **📊 Dashboard**: View booking statistics and monthly overview
- **💰 Financial Tracking**: Track booking amounts, advance payments, and remaining balances
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🗓️ Date Validation**: Prevents overlapping bookings and past date selections
- **📋 Booking Details**: Copy booking information to clipboard
- **🎨 Modern UI**: Clean, professional interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   git clone <your-repository>
   cd property-booking-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📦 Deployment

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Deploy automatically

### Option 2: Build for Production
```bash
npm run build
npm start
```

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 🛠️ Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 📱 Screenshots

### Desktop View
- Clean booking form with date pickers
- Comprehensive booking table with actions
- Monthly overview with statistics

### Mobile View
- Fully responsive design
- Touch-friendly interface
- Optimized for small screens

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env.local` and update values:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Customization
- Update colors in `tailwind.config.js`
- Modify components in `src/components/`
- Add features in `src/app/`

## 📊 Data Storage

**Current**: In-memory storage (resets on restart)
**Production**: Consider upgrading to:
- SQLite (simple file-based)
- PostgreSQL (robust)
- Supabase (hosted)

## 🔒 Security Features

- Input validation on all forms
- Date range validation
- Booking overlap prevention
- TypeScript for type safety

## 📋 Booking Information

Each booking includes:
- Check-in and check-out dates
- Customer name and phone
- Booking amount and advance payment
- Number of guests
- Automatic duration calculation

## 🎯 Use Cases

Perfect for:
- Weekend property rentals
- Vacation home management
- Small hotel/B&B operations
- Property management companies
- Individual property owners

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For deployment help or customization:
- Check `DEPLOYMENT_GUIDE.md`
- Review Next.js documentation
- Contact your developer

---

**Built with ❤️ for efficient property management**
