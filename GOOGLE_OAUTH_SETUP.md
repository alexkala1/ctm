# Google OAuth Setup Guide

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)

## 2. Set Environment Variables

Add these to your `.env` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id-from-console"
GOOGLE_CLIENT_SECRET="your-google-client-secret-from-console"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"

# Other required variables
JWT_SECRET="your-jwt-secret-key"
DATABASE_URL="your-database-url"
```

## 3. Test the Setup

1. Start the development server: `npm run dev`
2. Go to `/auth/login` or `/auth/register`
3. Click "Sign up with Google" or "Sign in with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to your app

## 4. User Approval Workflow

- New users created via Google OAuth will have status `PENDING`
- Admin needs to approve users manually in the database
- Once approved, users can sign in normally

## 5. Production Setup

For production, update:

- `GOOGLE_REDIRECT_URI` to your production domain
- `AUTH_ORIGIN` to your production domain
- Ensure HTTPS is enabled

