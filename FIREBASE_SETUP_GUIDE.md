# Firebase Setup Guide for JJMC Patient Registration System

## Prerequisites
- Google Account
- Node.js installed on your system

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or "Create a Project"
3. Enter project name: `JJMC-Patient-System` (or your preferred name)
4. Disable Google Analytics (optional, or enable if you want analytics)
5. Click "Create Project"

## Step 2: Register Your Web App

1. In Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `JJMC Web App`
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **IMPORTANT**: Copy the Firebase configuration object shown. It looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 3: Enable Authentication

1. In Firebase Console sidebar, click **"Authentication"**
2. Click "Get Started"
3. Go to "Sign-in method" tab
4. Enable **"Email/Password"** provider
5. Click "Save"

## Step 4: Create Firestore Database

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click "Create database"
3. **Start in Production Mode** (we'll set rules later)
4. Choose your Cloud Firestore location (e.g., `asia-south1` for India)
5. Click "Enable"

## Step 5: Set Firestore Security Rules

1. Go to "Firestore Database" → "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only authenticated users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Patients collection - role-based access
    match /patients/{patientId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'faculty', 'hod'];
      allow delete: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

3. Click "Publish"

## Step 6: Create Admin User Manually

1. Go to **"Authentication"** → **"Users"** tab
2. Click **"Add user"**
3. Enter:
   - **Email**: `admin@jjmc.com` (or your preferred admin email)
   - **Password**: `himu*1bca`
4. Click "Add user"
5. **Copy the User UID** shown in the users list

## Step 7: Add Admin Data to Firestore

1. Go to **"Firestore Database"** → **"Data"** tab
2. Click **"Start collection"**
3. Collection ID: `users`
4. Click "Next"
5. Document ID: **Paste the User UID from Step 6**
6. Add fields:
   - **Field**: `email` | **Type**: string | **Value**: `admin@jjmc.com`
   - **Field**: `role` | **Type**: string | **Value**: `admin`
   - **Field**: `name` | **Type**: string | **Value**: `Admin User`
   - **Field**: `createdAt` | **Type**: timestamp | **Value**: (current timestamp)
7. Click "Save"

## Step 8: Update Your Project Configuration

1. Open `c:\Users\himub\Desktop\JJMC\src\config\firebase.js`
2. Replace the `firebaseConfig` object with YOUR configuration from Step 2
3. Save the file

## Step 9: Environment Variables (Optional - Recommended)

For better security, use environment variables:

1. Create `.env` file in project root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

2. Add `.env` to `.gitignore`:
```
.env
.env.local
```

3. Use in `firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Step 10: Test Your Connection

1. Start your development server:
```bash
npm run dev
```

2. Open the application
3. Login with:
   - **Email**: `admin@jjmc.com`
   - **Password**: `himu*1bca`
4. If successful, you'll be redirected to the admin dashboard

## Common Issues & Solutions

### Issue: "Firebase: Error (auth/configuration-not-found)"
**Solution**: Make sure you've enabled Email/Password authentication in Step 3

### Issue: "Missing or insufficient permissions"
**Solution**: Check Firestore rules in Step 5 and ensure admin user document exists in Step 7

### Issue: "Firebase: Error (auth/network-request-failed)"
**Solution**: Check your internet connection and Firebase project status

## Firebase Console Quick Links

After setup, bookmark these:
- **Project Dashboard**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/overview
- **Authentication**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication/users
- **Firestore Database**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore

## Support

For Firebase documentation:
- Firebase Docs: https://firebase.google.com/docs
- Firestore Docs: https://firebase.google.com/docs/firestore
- Firebase Auth: https://firebase.google.com/docs/auth

---

**Note**: Replace `YOUR_PROJECT_ID` with your actual Firebase project ID throughout this guide.
