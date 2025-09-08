# QR Profile App Integration

The QR Profile app has been successfully integrated into the MakeCU Next.js application. The QR app runs as a separate Express server alongside the Next.js frontend.

## Architecture

- **Frontend**: Next.js app running on port 3000 (routes under `/qr`)
- **Backend**: Express server running on port 3001 (API routes under `/api/qr`)
- **Database**: SQLite database for user profiles and saves
- **Authentication**: Google OAuth and GitHub OAuth via Passport.js
- **File Uploads**: Multer for resume uploads
- **Styling**: Integrated with the existing Tailwind CSS design system

## Setup & Installation

1. **Install dependencies**:
   ```bash
   cd og_app/make-cu
   npm install
   ```

2. **Environment Configuration**:
   Make sure your `.env` file contains:
   ```
   SESSION_SECRET=your-session-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ADMIN_EMAILS=admin@example.com,another-admin@example.com
   FRONTEND_URL=http://localhost:3000
   QR_SERVER_PORT=3001
   ```

3. **Run the application**:
   ```bash
   # Run both Next.js and Express server
   npm run dev:all
   
   # Or run them separately:
   npm run dev        # Next.js frontend (port 3000)
   npm run qr-server  # Express backend (port 3001)
   ```

## QR App Routes

### Frontend Routes (Next.js)
- `/qr` - QR app home page
- `/qr/login` - Login page with OAuth
- `/qr/register` - Registration page
- `/qr/dashboard` - User dashboard with profile management
- `/qr/admin` - Admin dashboard (for admin users)
- `/qr/u/[uuid]` - Public profile view

### Backend API Routes (Express)
- `GET /api/qr/auth/check` - Check authentication status
- `GET /api/qr/auth/google` - Google OAuth login
- `GET /api/qr/auth/github` - GitHub OAuth login
- `POST /api/qr/logout` - Logout user
- `GET /api/qr/dashboard` - Get dashboard data
- `POST /api/qr/profile` - Update user profile
- `GET /api/qr/admin` - Get admin dashboard data
- `GET /api/qr/u/:uuid` - Get public profile
- `POST /api/qr/save/:uuid` - Save a profile
- `GET /api/qr/resume/:uuid` - Download resume file

## Features

✅ **User Authentication**: Google and GitHub OAuth integration
✅ **Profile Management**: Name and resume upload
✅ **QR Code Generation**: Automatic QR code creation for profiles
✅ **Profile Sharing**: Public profile pages with unique UUIDs
✅ **Save Profiles**: Users can save other people's profiles
✅ **Admin Dashboard**: Admin users can view stats and manage users
✅ **File Upload**: Resume upload with PDF/DOC/DOCX support
✅ **Responsive Design**: Mobile-friendly interface
✅ **Modern Styling**: Integrated with MakeCU's glassmorphism design

## Design Integration

The QR app seamlessly integrates with the existing MakeCU design:
- **Color Scheme**: Uses the same blue gradient (`#01206a` to white)
- **Typography**: Inter and Orbitron fonts
- **Effects**: Glassmorphism cards with backdrop blur
- **Animations**: Consistent hover effects and transitions
- **Layout**: Responsive design matching the main app

## Database

The app uses SQLite with the following main tables:
- `users` - User accounts and profiles
- `saves` - Saved profile relationships

## File Structure

```
og_app/make-cu/
├── app/qr/                    # QR app frontend pages
│   ├── page.tsx              # Home page
│   ├── login/page.tsx        # Login page
│   ├── register/page.tsx     # Register page
│   ├── dashboard/page.tsx    # Dashboard page
│   ├── admin/page.tsx        # Admin dashboard
│   └── u/[uuid]/page.tsx     # Profile view page
├── qr-server.js              # Express backend server
├── data-sqlite.js            # Database functions
├── firebase.js               # Firebase config (if used)
├── data/                     # SQLite database files
└── public/uploads/           # Uploaded resume files
```

## Testing

1. Start both servers: `npm run dev:all`
2. Visit `http://localhost:3000/qr`
3. Test OAuth login with Google or GitHub
4. Upload a resume and generate QR code
5. Test profile sharing and saving functionality
6. Test admin features (if admin email configured)

## Production Deployment

For production:
1. Update `FRONTEND_URL` in environment variables
2. Set `NODE_ENV=production`
3. Configure HTTPS and update cookie settings
4. Set up proper file storage for uploads
5. Configure production database (PostgreSQL recommended)

The QR Profile app is now fully integrated and ready to use! 🎉