# Firebase Authentication Integration

This document explains how Firebase Authentication has been integrated into the SkillStream application.

## Overview

SkillStream now uses Firebase Authentication for secure user management, replacing the previous mock authentication system. This provides:

- **Email/Password Authentication**: Users can sign up and log in with email and password
- **Google OAuth**: One-click sign-in with Google accounts
- **Persistent Sessions**: Automatic session management across page refreshes
- **Firestore Integration**: User profiles stored in Cloud Firestore
- **Real-time Auth State**: Automatic UI updates based on authentication status

## Firebase Configuration

### Setup

1. **Firebase Project**: Created at [Firebase Console](https://console.firebase.google.com/)
   - Project ID: `skillstream-eba33`
   - Authentication enabled for Email/Password and Google providers

2. **Configuration File**: `config/firebase.ts`
   ```typescript
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   import { getFirestore } from "firebase/firestore";
   
   const firebaseConfig = {
     apiKey: "AIzaSyCGhU7BuG8osULs9DgpmwzTGQURVaeG3rg",
     authDomain: "skillstream-eba33.firebaseapp.com",
     projectId: "skillstream-eba33",
     // ... other config
   };
   
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```

## Authentication Service

Located in `services/authService.ts`, this module provides all authentication operations:

### Available Functions

- **`signUpWithEmail(email, password, name, role, department)`**
  - Creates a new Firebase user
  - Stores user profile in Firestore
  - Returns User object

- **`signInWithEmail(email, password)`**
  - Authenticates existing user
  - Fetches user profile from Firestore
  - Returns User object

- **`signInWithGoogle()`**
  - Opens Google OAuth popup
  - Creates profile for new users
  - Returns User object

- **`logOut()`**
  - Signs out current user
  - Clears authentication state

- **`getUserProfile(uid)`**
  - Fetches user data from Firestore
  - Returns User object or null

- **`updateUserProfile(uid, updates)`**
  - Updates user profile in Firestore
  - Accepts partial User object

- **`onAuthChange(callback)`**
  - Listens for authentication state changes
  - Callback receives Firebase User or null

## Data Structure

### User Profile (Firestore)

Stored in `users/{uid}` collection:

```typescript
{
  id: string;              // Firebase UID
  name: string;            // Display name
  email: string;           // Email address
  role: 'Employee' | 'Admin';
  department: string;
  learningPreference: 'Visual' | 'Audio' | 'Text';
  streak: number;          // Learning streak days
  xp: number;              // Experience points
  avgScore: number;        // Average quiz score
  hoursLearned: number;    // Total learning hours
}
```

## Application Integration

### AppContext Updates

The `context/AppContext.tsx` has been updated to:

1. **Listen to Auth State**:
   ```typescript
   useEffect(() => {
     const unsubscribe = onAuthChange(async (firebaseUser) => {
       if (firebaseUser) {
         const userProfile = await getUserProfile(firebaseUser.uid);
         setCurrentUser(userProfile);
       } else {
         setCurrentUser(null);
       }
     });
     return () => unsubscribe();
   }, []);
   ```

2. **Async Authentication Methods**:
   - `login(email, password)` - Now async, uses Firebase
   - `signup(name, email, password, role, department)` - Creates Firebase user
   - `loginWithGoogle()` - Google OAuth integration
   - `logout()` - Signs out from Firebase

3. **Profile Updates**:
   - `updateUser(updates)` - Persists to Firestore

### Login Page (`pages/Login.tsx`)

- Email and password input fields
- Google sign-in button with branded styling
- Error handling and display
- Loading states during authentication
- Automatic navigation on successful login

### Signup Page (`pages/Signup.tsx`)

- Full name, email, password fields
- Role selection (Employee/Admin)
- Department input
- Google sign-up option
- Password validation (minimum 6 characters)
- Error handling

## Security Considerations

### Current Implementation

✅ **Implemented**:
- Firebase Authentication handles password hashing
- HTTPS-only authentication endpoints
- Secure token-based sessions
- Google OAuth 2.0 integration

⚠️ **To Be Implemented**:
- **Firestore Security Rules**: Currently using default rules (development mode)
- **Environment Variables**: Firebase config should be moved to `.env` files
- **Email Verification**: Not yet implemented
- **Password Reset**: UI exists but needs backend integration

### Recommended Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admins can read all users
    match /users/{userId} {
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }
  }
}
```

## Testing

### Test Accounts

You can create test accounts through the signup page or use Google sign-in.

### Manual Testing Checklist

- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign in with Google
- [ ] Sign out
- [ ] Session persistence (refresh page while logged in)
- [ ] Profile updates persist to Firestore
- [ ] Error handling for invalid credentials
- [ ] Error handling for duplicate emails

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/popup-blocked)"**
   - Solution: Allow popups for localhost in browser settings

2. **"Firebase: Error (auth/email-already-in-use)"**
   - Solution: User already exists, use login instead

3. **"Firebase: Error (auth/weak-password)"**
   - Solution: Password must be at least 6 characters

4. **Firestore permission denied**
   - Solution: Update Firestore security rules (see Security section)

### Debug Mode

Enable Firebase debug logging:
```typescript
import { getAuth } from 'firebase/auth';
import { enableLogging } from 'firebase/firestore';

enableLogging(true);
```

## Next Steps

1. **Implement Firestore Security Rules** (High Priority)
2. **Add Email Verification Flow**
3. **Implement Password Reset Functionality**
4. **Move Firebase Config to Environment Variables**
5. **Add Backend Firebase Admin SDK Integration**
6. **Implement Role-Based Access Control (RBAC)**
7. **Add Multi-Factor Authentication (MFA)**

## Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)
