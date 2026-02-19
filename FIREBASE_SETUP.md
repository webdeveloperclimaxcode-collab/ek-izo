# Firebase Authentication Setup

## Installation

1. Install Firebase SDK:
```bash
npm install firebase
```

## Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable **Email/Password** provider
   - Enable **Google** provider
4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click on Web app (</>) icon
   - Copy the firebaseConfig object

## Environment Variables

Create a `.env.local` file in the root directory and add your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Features Implemented

### Authentication Methods
- ✅ Email/Password Registration
- ✅ Email/Password Login
- ✅ Google OAuth Login
- ✅ Logout

### User Management
- ✅ AuthContext for global state management
- ✅ Automatic user sync with PostgreSQL database
- ✅ Users created with `website_user` role
- ✅ Last login tracking

### Security
- ✅ Password validation (minimum 6 characters)
- ✅ Email validation
- ✅ Terms & conditions agreement
- ✅ Error handling and user feedback

## Usage

### In Components

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, loading, signIn, signUp, signInWithGoogle, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) {
    return (
      <div>
        <p>Welcome, {user.displayName || user.email}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <div>Please login</div>;
}
```

### Protected Routes

Create a protected route wrapper:

```tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
}
```

## Database Schema

The Users table in PostgreSQL includes:
- `id`: Firebase UID
- `email`: User email
- `fullName`: User's full name
- `role`: Set to `website_user` for all website registrations
- `status`: Default `active`
- `lastLogin`: Tracks last login time
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

## API Endpoints

### POST /api/auth/sync-user
Syncs Firebase user with PostgreSQL database.

**Request Body:**
```json
{
  "uid": "firebase_user_id",
  "email": "user@example.com",
  "fullName": "John Doe",
  "photoURL": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* user object */ },
  "message": "User created" | "User updated"
}
```

## Testing

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `/register` to create a new account
3. Navigate to `/login` to sign in
4. Check Firebase Console > Authentication to see registered users
5. Check your PostgreSQL database to verify user sync

## Troubleshooting

### Firebase errors
- Make sure all environment variables are set correctly
- Verify Firebase project settings
- Check that Email/Password and Google providers are enabled

### Database sync issues
- Verify DATABASE_URL is correct
- Run Prisma migrations: `npx prisma migrate dev`
- Check API logs for sync errors

## Next Steps

- Add password reset functionality
- Add email verification
- Add user profile page
- Add role-based access control
- Add session management
