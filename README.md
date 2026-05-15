# SlotShare - Parking Space Management System

A full-stack web application for managing and booking parking spaces in Cebu City.

## Features

### User Features
- **Browse Spaces**: Search and browse available parking spaces
- **Book Spaces**: Book parking slots with date, time, and duration selection
- **My Bookings**: View and manage bookings with status filtering
- **List Your Space**: Submit parking spaces for rent
- **Profile Management**: Edit personal and vehicle information

### Admin Features
- **User Management**: CRUD operations for all users
- **User Statistics**: Overview of user activity and status
- **Search & Filter**: Find users by name, email, status, or role
- **Status Control**: Activate, deactivate, or suspend user accounts
- **Audit Logging**: Track admin actions

## Tech Stack

### Frontend
- React.js with Vite
- CSS3 with custom design system
- Fetch API for backend communication
- JWT authentication

### Backend
- Node.js with Express.js
- MySQL database
- bcryptjs for password hashing
- JSON Web Tokens (JWT) for authentication
- CORS enabled for cross-origin requests

## Database Schema

The application uses MySQL with the following tables:
- `users` - User accounts with role-based access (admin/user)
- `listings` - Parking space listings
- `bookings` - Booking records
- `audit_log` - Admin action logs

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server
- npm or yarn

### 1. Database Setup

1. Start your MySQL server
2. Run the database schema:

```bash
mysql -u root -p < database/schema.sql
```

Or manually execute the SQL in `database/schema.sql`

### 3. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment (edit server/.env)
# - Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

# Start the server
npm run dev
```

The API will be available at `http://localhost:5000`

### 4. Frontend Setup

```bash
# In the root directory (not server/)
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port shown)

## Default Credentials

### Admin Account
- Email: `admin@slotshare.com`
- Password: `admin123`

### User Account
- Email: `user@slotshare.com`
- Password: `password`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users (Admin Only)
- `GET /api/users` - List all users (with pagination, search, filters)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/password` - Update user password
- `GET /api/users/stats/summary` - Get user statistics

## Demo Mode

If the backend server is not running, the application will fall back to demo mode with sample data. This allows testing the UI without setting up the database.

## Project Structure

```
SlotShare/
├── src/
│   ├── components/
│   │   ├── Icons.jsx
│   │   ├── Modal.jsx
│   │   ├── Sidebar.jsx
│   │   └── Toast.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── BrowseSpaces.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ListYourSpace.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MyBookings.jsx
│   │   ├── Profile.jsx
│   │   ├── SignupPage.jsx
│   │   └── UserDashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── server/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── users.js
│   ├── .env
│   ├── index.js
│   └── package.json
├── database/
│   └── schema.sql
└── package.json
```

## License

MIT License