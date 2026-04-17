# Quick Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter: `JJMC-Patient-System`
4. Click **"Create Project"**

---

## Step 2: Enable Authentication

1. Click **"Authentication"** in left sidebar
2. Click **"Get Started"**
3. Click **"Email/Password"**
4. Toggle **"Enable"** and click **"Save"**

---

## Step 3: Create Admin User

1. Go to **Authentication** → **Users** tab
2. Click **"Add User"**
3. Enter:
   - **Email**: `admin@jjmc.com`
   - **Password**: `himu*1bca`
4. Click **"Add User"**
5. **Copy the UID** (shown in user list)

---

## Step 4: Create Firestore Database

1. Click **"Firestore Database"** in left sidebar
2. Click **"Create Database"**
3. Select **"Production Mode"**
4. Choose region: `asia-south1` (for India)
5. Click **"Enable"**

---

## Step 5: Set Firestore Rules

1. Go to **Firestore** → **Rules** tab
2. Replace with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /patients/{patientId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                      (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'faculty', 'hod'] ||
                       resource.data.createdBy == request.auth.uid);
      allow delete: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

3. Click **"Publish"**

---

## Step 6: Create Admin User Document

1. Go to **Firestore** → **Data** tab
2. Click **"Start Collection"**
3. Collection ID: `users`
4. Document ID: **Paste the UID from Step 3**
5. Add fields:
   - `email` (string): `admin@jjmc.com`
   - `role` (string): `admin`
   - `name` (string): `Admin User`
   - `createdAt` (timestamp): current date

6. Click **"Save"**

---

## Step 7: Update Config

Your `src/config/firebase.js` already has the credentials. You're all set! 🎉

---

## Test Login

- Email: `admin@jjmc.com`
- Password: `himu*1bca`

The system will auto-create your profile!
