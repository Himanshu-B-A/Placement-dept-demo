# Complete Firebase Setup - Step by Step

## Phase 1: Create Firebase Project

### Step 1: Go to Firebase Console
1. Open browser and go to: **https://console.firebase.google.com/**
2. Sign in with your Google account (create one if needed)

### Step 2: Create New Project
1. Click **"Add Project"** button (or **"Create a project"**)
2. Enter Project Name: **`JJMC-Patient-System`**
3. Click **"Continue"**
4. Disable **"Enable Google Analytics"** (optional)
5. Click **"Create Project"**
6. Wait 30 seconds for project to be created
7. Click **"Continue"** when done

---

## Phase 2: Get Firebase Credentials

### Step 3: Add Web App to Project
1. In Firebase Console, click the **Web icon** `</>`
2. Enter App nickname: **`JJMC Web`**
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. **Copy the Firebase Config** shown:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Step 4: Update Firebase Config in Your App
1. Open file: **`src/config/firebase.js`**
2. Replace the `firebaseConfig` object with your copied config
3. Save the file

**Example:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "jjmc-patient-system.firebaseapp.com",
  projectId: "jjmc-patient-system",
  storageBucket: "jjmc-patient-system.appspot.com",
  messagingSenderId: "126023575961",
  appId: "1:126023575961:web:9e22d055efc47cec338b08"
};
```

---

## Phase 3: Enable Authentication

### Step 5: Set Up Email/Password Authentication
1. In Firebase Console, click **"Authentication"** (left sidebar)
2. Click **"Get Started"**
3. Click on **"Email/Password"**
4. Toggle **"Enable"** switch to ON
5. Click **"Save"**

✅ Authentication is now enabled!

---

## Phase 4: Create Firestore Database

### Step 6: Create Firestore Database
1. In Firebase Console, click **"Firestore Database"** (left sidebar)
2. Click **"Create database"**
3. Choose **"Production mode"**
4. Click **"Next"**
5. Select Region: **`asia-south1`** (for India, adjust if needed)
6. Click **"Enable"**

Wait 1-2 minutes for database to be created...

✅ Firestore Database is now created!

---

## Phase 5: Set Security Rules

### Step 7: Configure Firestore Security Rules
1. Go to **Firestore Database** → **"Rules"** tab
2. Delete all existing text
3. Paste this complete ruleset:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - control user data access
    match /users/{userId} {
      // User can read own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Only admins can write user data
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Patients collection - control patient record access
    match /patients/{patientId} {
      // All authenticated users can read patient records
      allow read: if request.auth != null;
      
      // All authenticated users can create new records
      allow create: if request.auth != null;
      
      // Admins, Faculty, HOD, or creator can update
      allow update: if request.auth != null && 
                      (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'faculty', 'hod'] ||
                       resource.data.createdBy == request.auth.uid);
      
      // Only admins can delete
      allow delete: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

4. Click **"Publish"**

✅ Security rules are now applied!

---

## Phase 6: Create Admin User in Firebase

### Step 8: Create Admin User Account
1. Go to **Authentication** → **"Users"** tab
2. Click **"Add user"** button
3. Enter:
   - **Email**: `admin@jjmc.com`
   - **Password**: `himu*1bca`
4. Click **"Add user"**

You'll see the user created. Now copy the **UID** (long string):

Example UID: `tGBoDtbALdYOceb0mMuqUdC2C3`

✅ Admin user account created!

---

## Phase 7: Create Admin User Profile in Firestore

### Step 9: Add Admin User Document to Firestore
1. Go to **Firestore Database** → **"Data"** tab
2. Click **"Create collection"**
3. Collection ID: **`users`**
4. Click **"Next"**
5. Document ID: **Paste the UID from Step 8**
6. Click **"Auto ID"** - NO, paste your UID!

### Step 10: Add User Fields
Click **"Add field"** and enter:

| Field Name | Type | Value |
|-----------|------|-------|
| `email` | string | `admin@jjmc.com` |
| `role` | string | `admin` |
| `name` | string | `Admin User` |
| `createdAt` | timestamp | [Click and select today's date] |

7. Click **"Save"**

✅ Admin profile created in Firestore!

---

## Phase 8: Test the Setup

### Step 11: Test Login
1. Go to your app: **http://localhost:3000/login**
2. Enter credentials:
   - **Email**: `admin@jjmc.com`
   - **Password**: `himu*1bca`
3. Click **"Login"**

**Expected Results:**
- ✅ You should be redirected to Admin Dashboard
- ✅ Your email shows in top-right corner
- ✅ Role shows as "Administrator"

If you get errors:
- Check browser console (F12 → Console tab)
- Verify all Firebase credentials are correct
- Make sure security rules are published

---

## Phase 9: Create Additional Users (Optional)

### Step 12: Create Student/Faculty Users
1. On Admin Dashboard, click **"Register New User"**
2. Fill form:
   - **Full Name**: `John Student`
   - **Email**: `student@jjmc.edu`
   - **Password**: `student123`
   - **Role**: `student`
3. Click **"Register"**

Repeat for:
- **Faculty**: `faculty@jjmc.edu` / `faculty123`
- **HOD**: `hod@jjmc.edu` / `hod123`

The system will automatically create their profiles in Firestore!

---

## Verification Checklist

- [ ] Firebase project created
- [ ] Web app registered in Firebase
- [ ] Firebase config updated in `src/config/firebase.js`
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Security rules published
- [ ] Admin user created in Authentication
- [ ] Admin user profile created in Firestore
- [ ] Login test successful
- [ ] App redirects to Admin Dashboard

---

## Common Issues & Solutions

### Issue 1: "Invalid email or password" error
**Solution:**
- Check email exactly: `admin@jjmc.com` (lowercase)
- Check password exactly: `himu*1bca`
- Make sure user exists in Firebase Authentication

### Issue 2: "User profile not found" error
**Solution:**
- Admin user needs profile in Firestore `users` collection
- Create document with UID as ID
- Add fields: `email`, `role`, `name`

### Issue 3: "Failed to get document because client is offline"
**Solution:**
- Check internet connection
- Refresh page (Ctrl+R)
- Clear browser cache
- Check Firestore rules are published

### Issue 4: Can't see Firestore data
**Solution:**
- Go to Firestore Database → Data tab
- Make sure `users` collection exists
- Make sure documents have correct fields

### Issue 5: Rules not working
**Solution:**
- Go to Firestore → Rules tab
- Check "Publish" button was clicked
- Wait 1-2 minutes for changes to take effect
- Refresh app

---

## Firebase Project Structure

After completing setup, your Firebase will have:

```
JJMC-Patient-System
├── Authentication
│   └── Users
│       └── admin@jjmc.com (UID: tGBoDtbALdYOceb0mMuqUdC2C3)
│
├── Firestore Database
│   ├── Collections
│   │   ├── users/
│   │   │   └── tGBoDtbALdYOceb0mMuqUdC2C3/
│   │   │       ├── email: "admin@jjmc.com"
│   │   │       ├── role: "admin"
│   │   │       └── name: "Admin User"
│   │   │
│   │   └── patients/
│   │       └── (will be auto-created when forms submitted)
│   │
│   └── Rules (security)
│
└── Settings
    └── Project ID: "jjmc-patient-system"
```

---

## Quick Reference

| What | Where | How |
|-----|-------|-----|
| Edit Firebase Config | `src/config/firebase.js` | Update apiKey, authDomain, etc. |
| Enable Auth | Firebase Console | Authentication → Enable Email/Password |
| Create DB | Firebase Console | Firestore → Create database |
| Update Rules | Firebase Console | Firestore → Rules → Publish |
| Create Admin | Firebase Console | Authentication → Add user |
| Add Admin Profile | Firebase Console | Firestore → Create collection `users` |
| Test Login | App | http://localhost:3000/login |
| View Data | Firebase Console | Firestore → Data tab |
| Check Errors | Browser | F12 → Console tab |

---

## Next Steps

1. ✅ Complete Phase 1-7 above
2. ✅ Test login (Phase 8)
3. ✅ Create more users (Phase 9)
4. ✅ Have users create patient forms
5. ✅ View data in Firestore Console
6. ✅ Access Patient Management from Admin Dashboard

**Questions?** Check the troubleshooting section or review Firebase documentation at: https://firebase.google.com/docs

🚀 You're ready to go!
