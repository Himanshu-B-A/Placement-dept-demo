# Firebase Setup - Visual Step-by-Step Guide

## Your Current Firebase Project

✅ **Project ID**: `jjmc-patient-system`  
✅ **Auth Domain**: `jjmc-patient-system.firebaseapp.com`  
✅ **Config Already in App**: `src/config/firebase.js`

---

## QUICK START - 5 MINUTES

### Step 1: Go to Firebase Console
**URL**: https://console.firebase.google.com/

Click on project: **`jjmc-patient-system`**

---

### Step 2: Enable Authentication (2 min)

1. Left sidebar → Click **"Authentication"**
2. Click **"Get Started"** button
3. Click on **"Email/Password"**
4. Toggle **"Enable"** → ON
5. Click **"Save"**

✅ **Done!** Authentication is now enabled

---

### Step 3: Create Firestore Database (2 min)

1. Left sidebar → Click **"Firestore Database"**
2. Click **"Create database"** button
3. Choose: **"Production mode"** → Click **"Next"**
4. Select Region: **`asia-south1`** (for India)
5. Click **"Enable"**

*Wait 1-2 minutes for creation...*

✅ **Done!** Database is created

---

### Step 4: Set Security Rules (1 min)

1. Go to **"Firestore Database"** → **"Rules"** tab
2. Click in the text editor
3. **Select all** (Ctrl+A) and delete
4. **Paste this entire code**:

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

5. Click **"Publish"** button

✅ **Done!** Security rules applied

---

## CREATE ADMIN USER - 5 MINUTES

### Step 5: Create Admin in Authentication

1. Go to **"Authentication"** → **"Users"** tab
2. Click **"Add user"** button
3. Enter exactly:
   - **Email**: `admin@jjmc.com`
   - **Password**: `himu*1bca`
4. Click **"Add user"** button

*A user is created. Now find the UID (long string next to the email)*

**Copy this UID** (you'll need it in next step)

---

### Step 6: Create Admin Profile in Firestore

1. Go to **"Firestore Database"** → **"Data"** tab
2. Click **"Create collection"** button
3. Collection ID: `users` → Click **"Next"**
4. Document ID: **Paste the UID from Step 5** → Click **"Auto ID"**

*Wait, don't auto-generate! Paste your copied UID*

5. Now add fields. Click **"Add field"**:

**Field 1:**
- Name: `email`
- Type: `string`
- Value: `admin@jjmc.com`
- Click Add

**Field 2:**
- Name: `role`
- Type: `string`
- Value: `admin`
- Click Add

**Field 3:**
- Name: `name`
- Type: `string`
- Value: `Admin User`
- Click Add

**Field 4:**
- Name: `createdAt`
- Type: `timestamp`
- Value: [Select today's date]
- Click Add

6. Click **"Save"** button

✅ **Done!** Admin user profile created

---

## TEST YOUR SETUP

### Step 7: Test Login

1. Open your app: **http://localhost:3000/login**
2. Enter:
   - **Email**: `admin@jjmc.com`
   - **Password**: `himu*1bca`
3. Click **"Login"** button

**Expected**: You should see the Admin Dashboard! 🎉

**If error**: 
- Check browser console (F12 → Console)
- Make sure all steps above are completed
- Refresh page and try again

---

## CREATE MORE USERS

### Step 8: Add Student/Faculty Users

1. Click **"Register New User"** on Admin Dashboard
2. Fill form:
   - Name: `Student Name`
   - Email: `student@jjmc.edu`
   - Password: `student123`
   - Role: `student`
3. Click **"Register"**

The system **automatically** creates the profile in Firestore!

Repeat for other roles:
- Faculty: `faculty@jjmc.edu`
- HOD: `hod@jjmc.edu`

---

## FIREBASE CONSOLE NAVIGATION

### Left Sidebar Icons:
```
🔑 Authentication
  └─ Sign-in method
     └─ Email/Password (ENABLE THIS)
  └─ Users (CREATE ADMIN HERE)

🗄️ Firestore Database
  └─ Data (VIEW YOUR DATA)
  └─ Rules (SET SECURITY RULES)

⚙️ Settings
  └─ Project settings (YOUR CONFIG)
```

---

## IMPORTANT STEPS TO VERIFY

| Step | Location | Action |
|------|----------|--------|
| 1 | Auth → Sign-in method | Email/Password = ON ✅ |
| 2 | Firestore → Data | Collection `users` exists ✅ |
| 3 | Firestore → Rules | Rules published ✅ |
| 4 | Auth → Users | `admin@jjmc.com` exists ✅ |
| 5 | Firestore → users collection | Admin document with role=admin ✅ |

---

## IF SOMETHING DOESN'T WORK

### Error: "Invalid email or password"
- ✅ Check email: `admin@jjmc.com` (exact, lowercase)
- ✅ Check password: `himu*1bca` (exact)
- ✅ Refresh page and try again

### Error: "User profile not found"
- ✅ Go to Firestore → Data
- ✅ Find `users` collection
- ✅ Click admin document
- ✅ Check fields: `email`, `role`, `name` all present

### Error: "Firestore offline"
- ✅ Check internet connection
- ✅ Refresh page (Ctrl+R)
- ✅ Clear browser cache
- ✅ Try another browser

### Rules Not Working
- ✅ Go to Firestore → Rules tab
- ✅ Check code is correct
- ✅ Click **"Publish"** (important!)
- ✅ Wait 1-2 minutes for changes

---

## DATABASE STRUCTURE AFTER SETUP

```
Firebase Project: jjmc-patient-system
│
├─ Authentication
│  └─ Users
│     └─ admin@jjmc.com
│        ├─ UID: tGBoDtbALdYOceb0mMuqUdC2C3
│        └─ Password: himu*1bca
│
├─ Firestore Database
│  └─ Collections
│     ├─ users/
│     │  └─ {UID}/
│     │     ├─ email: "admin@jjmc.com"
│     │     ├─ role: "admin"
│     │     ├─ name: "Admin User"
│     │     └─ createdAt: [timestamp]
│     │
│     └─ patients/
│        └─ (auto-created when forms submitted)
│
└─ Security Rules
   └─ (Published and Active)
```

---

## FINAL CHECKLIST

- [ ] Go to Firebase Console
- [ ] Select `jjmc-patient-system` project
- [ ] Enable Email/Password Authentication
- [ ] Create Firestore Database
- [ ] Publish Security Rules
- [ ] Create admin@jjmc.com user in Authentication
- [ ] Create admin profile in Firestore `users` collection
- [ ] Test login with admin credentials
- [ ] See Admin Dashboard
- [ ] Create additional users (optional)

✅ **All Done!** Your app is connected to Firebase! 🎉

---

## NEXT STEPS

1. Go to Admin Dashboard
2. Click **"Manage Patients"** to see patient management
3. Click **"Register New User"** to add staff
4. Have users create patient forms
5. View all data in Firestore Console

**Questions?** Check FIREBASE_COMPLETE_SETUP.md for detailed info

