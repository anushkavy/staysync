# StaySync 🏠

**Smart Hostel & PG Management System for seamless room booking, meal planning, and maintenance tracking**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.17-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [User Roles](#user-roles)
- [Application Flow](#application-flow)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

StaySync is a comprehensive hostel and PG (Paying Guest) management system designed to streamline operations for both property owners and residents. The platform provides an intuitive interface for managing room bookings, meal planning, maintenance requests, and overall facility administration.

### Key Benefits

- **For Owners**: Efficient property management, room allocation, meal planning, and maintenance tracking
- **For Residents**: Easy room booking, meal planning, maintenance requests, and profile management
- **For Both**: Real-time updates, seamless communication, and organized facility management

## ✨ Features

### 🏠 For Property Owners
- **Hostel Registration**: Complete hostel setup with room types and pricing
- **Room Management**: Track room availability, occupancy, and pricing
- **Meal Management**: Plan and manage meal services for residents
- **Maintenance Management**: Handle maintenance requests and track completion status
- **Dashboard Analytics**: Overview of property performance and statistics

### 👤 For Residents
- **Profile Management**: Complete user profile setup and management
- **Room Booking**: Browse and book available rooms
- **Meal Planning**: View and plan meal preferences
- **Maintenance Requests**: Submit and track maintenance requests
- **Dashboard**: Personal dashboard with booking history and current status

### 🔐 Authentication & Security
- **Dual User Types**: Separate authentication flows for owners and residents
- **Profile Completion**: Guided onboarding process for new users
- **Local Storage**: Client-side data persistence for demo purposes

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16.0.1](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/)
- **UI Library**: [React 19.2.0](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4.1.17](https://tailwindcss.com/)
- **Icons**: [@untitledui/icons](https://www.untitledui.com/icons)

### Development Tools
- **Linting**: ESLint with Next.js configuration
- **PostCSS**: For CSS processing
- **TypeScript**: Full type safety throughout the application

### Deployment
- **Platform**: [Vercel](https://vercel.com/)
- **Build System**: Next.js built-in build system
- **Environment**: Production-ready deployment

## 📁 Project Structure

```
staysync/
├── app/                          # Next.js App Router directory
│   ├── addhostel/               # Hostel registration page
│   │   └── page.tsx
│   ├── assets/                  # Static assets
│   │   └── utensils.svg
│   ├── createprofile/           # Resident profile creation
│   │   └── page.tsx
│   ├── dashboard/               # Resident dashboard
│   │   └── page.tsx
│   ├── login/                   # Authentication pages
│   │   ├── owner/               # Owner login
│   │   ├── resident/            # Resident login
│   │   └── page.tsx             # Main login page
│   ├── owner-dashboard/         # Owner dashboard
│   │   └── page.tsx
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Home page
├── public/                      # Static files
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── styles/                      # Additional stylesheets
│   ├── globals.css
│   ├── theme.css
│   └── typography.css
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

### Key Directories Explained

#### `/app` - Application Pages
- **`addhostel/`**: Hostel registration and setup for property owners
- **`createprofile/`**: Profile completion flow for new residents
- **`dashboard/`**: Main resident dashboard with room booking, meal planning, and maintenance
- **`login/`**: Authentication system with separate flows for owners and residents
- **`owner-dashboard/`**: Property management dashboard for hostel owners

#### `/public` - Static Assets
Contains SVG icons and static files served directly by Next.js

#### `/styles` - Styling
- Global CSS files and theme configurations
- Tailwind CSS integration with custom color schemes

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (or yarn/pnpm equivalent)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anushkavy/staysync.git
   cd staysync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint
```
## 👥 User Roles

### 🏢 Property Owner
**Registration Flow:**
1. Login/Register as Owner → `/login/owner`
2. Complete Hostel Setup → `/addhostel`
3. Access Owner Dashboard → `/owner-dashboard`

**Capabilities:**
- Manage hostel information and room types
- Track room occupancy and availability
- Handle meal management for residents
- Process maintenance requests
- View analytics and reports

### 🏠 Resident
**Registration Flow:**
1. Login/Register as Resident → `/login/resident`
2. Complete Profile → `/createprofile`
3. Access Resident Dashboard → `/dashboard`

**Capabilities:**
- Book available rooms
- Plan meal preferences
- Submit maintenance requests
- View booking history
- Manage personal profile

## 🔄 Application Flow

### Authentication System
The application uses a dual authentication system with separate flows for property owners and residents:

1. **Home Page** (`/`) - Landing page with role selection
2. **Owner Flow**: Login → Hostel Setup → Owner Dashboard
3. **Resident Flow**: Login → Profile Creation → Resident Dashboard

### Dashboard Features
- **Room Management**: Real-time room availability and booking system
- **Meal Planning**: Integrated meal management with preferences
- **Maintenance Tracking**: Request submission and status tracking
- **User Management**: Profile and account management

### Data Flow
- **Local Storage**: Currently uses browser local storage for data persistence
- **State Management**: React state management for UI interactions
- **Form Handling**: TypeScript-based form validation and submission

## 🌐 Deployment

The application is deployed on **Vercel** with automatic deployments from the main branch.

### Deployment Configuration
- **Platform**: Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x

### Environment Setup
The application uses local storage for data persistence in the current implementation. For production use, consider integrating with:
- Database (PostgreSQL, MongoDB, etc.)
- Authentication service (Auth0, Firebase Auth, etc.)
- File storage (AWS S3, Cloudinary, etc.)

## 🎨 Design System

### Color Palette
- **Primary**: `#1b4332` (Dark Green)
- **Secondary**: `#a1cca5` (Light Green)
- **Background**: `#eff1ed` (Light Gray-Green)
- **Accent**: `#fefae0` (Cream)

### Typography
- **Primary Font**: Geist Sans
- **Monospace Font**: Geist Mono

### UI Components
- Consistent button styles with hover states
- Form inputs with validation styling
- Card-based layout for content sections
- Responsive navigation with tab-based interfaces
## 🤝 Contributing

We welcome contributions to StaySync! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain consistent code formatting
- Add appropriate comments for complex logic
- Test your changes thoroughly

### Code Style
- Use meaningful variable and function names
- Follow React best practices and hooks patterns
- Implement proper error handling
- Ensure responsive design across devices
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🚀 Future Enhancements

### Planned Features
- **Database Integration**: Replace local storage with a proper database
- **Real-time Notifications**: WebSocket integration for live updates
- **Payment Integration**: Online payment system for room bookings
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Detailed reporting and analytics dashboard
- **Multi-language Support**: Internationalization for global use

### Technical Improvements
- **API Development**: RESTful API with proper authentication
- **Testing Suite**: Unit and integration tests
- **Performance Optimization**: Code splitting and lazy loading
- **SEO Optimization**: Meta tags and structured data
- **PWA Features**: Offline functionality and push notifications

## 📞 Support

For questions, issues, or feature requests:

- **GitHub Issues**: [Create an issue](https://github.com/anushkavy/staysync/issues)
- **Email**: Contact the development team
- **Documentation**: Check this README for detailed information

---

**Built with ❤️ using Next.js, React, and TypeScript**

*StaySync - Making hostel and PG management effortless for everyone.*
