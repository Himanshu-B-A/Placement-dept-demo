# JJMC Patient Registration System - Setup Guide

## 🚀 Quick Start Guide

Welcome to the JJMC Patient Registration System! This guide will help you set up and run the application on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- A **Firebase account** - [Create one here](https://firebase.google.com/)
- A code editor like **VS Code** (recommended)

---

## 📦 Step 1: Install Dependencies

Open a terminal in the project folder and run:

```powershell
npm install
```

This will install all required packages including React, Firebase, Tailwind CSS, and more.

---

## 🔥 Step 2: Set Up Firebase

### 2.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `jjmc-patient-registration`
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 2.2 Enable Authentication

1. In your Firebase project, go to **Build** → **Authentication**
2. Click "Get Started"
3. Click on **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Click "Save"

### 2.3 Create Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click "Create database"
3. Select "Start in **production mode**"
4. Choose a location (closest to you)
5. Click "Enable"

### 2.4 Update Firestore Rules

In Firestore Database, go to the **Rules** tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write patient data
    match /patients/{patientId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'hod');
    }
  }
}
```

Click **Publish**

### 2.5 Get Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ → **Project settings**
2. Scroll down to "Your apps" section
3. Click the **Web icon** `</>`
4. Register your app with nickname: `JJMC Web App`
5. Copy the `firebaseConfig` object

### 2.6 Create Environment File

1. In your project folder, create a file named `.env`
2. Copy the content from `.env.example` and fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

---

## 👥 Step 3: Create Demo Users in Firebase

Since we need to create users with specific roles, we need to add them manually to Firebase:

### Method 1: Using Firebase Console (Recommended for Demo)

1. Go to **Authentication** → **Users** tab
2. Click "Add user"
3. Create these demo users:

**Admin User:**
- Email: `admin@jjmc.edu`
- Password: `admin123`

**Student User:**
- Email: `student@jjmc.edu`
- Password: `student123`

**Faculty User:**
- Email: `faculty@jjmc.edu`
- Password: `faculty123`

**HOD User:**
- Email: `hod@jjmc.edu`
- Password: `hod123`

### Add User Roles to Firestore

After creating users in Authentication, you need to manually add user documents to Firestore:

1. Go to **Firestore Database**
2. Click "Start collection"
3. Collection ID: `users`
4. For each user you created, add a document:
   - **Document ID**: Copy the UID from Authentication → Users
   - Add fields:
     - `email` (string): The user's email
     - `name` (string): User's full name (e.g., "Admin User")
     - `role` (string): `admin`, `student`, `faculty`, or `hod`
     - `createdAt` (string): Current date/time in ISO format

**Example document for admin:**
```
Document ID: [UID from Authentication]
email: "admin@jjmc.edu"
name: "Admin User"
role: "admin"
createdAt: "2024-01-10T10:00:00.000Z"
```

Repeat for all four users with their respective roles.

---

## 🚀 Step 4: Run the Application

In your terminal, run:

```powershell
npm run dev
```

The application will start at: **http://localhost:3000**

---

## 🎯 Step 5: Login and Test

1. Open your browser and go to `http://localhost:3000`
2. You'll see the login page
3. Try logging in with any of the demo credentials:

```
Admin:   admin@jjmc.edu / admin123
Student: student@jjmc.edu / student123
Faculty: faculty@jjmc.edu / faculty123
HOD:     hod@jjmc.edu / hod123
```

---

## 📱 Features Overview

### Admin Dashboard
- View all users and patient records
- Register new users (students, faculty, HOD, admin)
- Delete patient records
- Full system access

### Student Dashboard
- Create new patient entries (Acne Proforma)
- View their own patient entries
- Cannot edit existing records

### Faculty Dashboard
- View all patient records
- Edit any patient record
- Cannot delete records

### HOD Dashboard
- View all patient records
- Edit any patient record
- View student contribution statistics
- Cannot delete records (only admin can)

### Acne Proforma Form
- Complete medical form based on your provided screenshots
- Includes all sections:
  - Basic patient information
  - History and complaints
  - Physical examination
  - Lesion count tracking
  - Cardiff Acne Disability Index
  - Global Acne Grading System
  - And more...

---

## 🎨 Customization

### Adding More Forms

To add additional forms (you mentioned 22 total):

1. Create a new form component in `src/forms/` (e.g., `PsoriasisForm.jsx`)
2. Add the route in `src/App.jsx`
3. Add the form to the available forms list in `StudentDashboard.jsx`

### Changing Colors

Edit `tailwind.config.js` to change the primary color scheme:

```javascript
colors: {
  primary: {
    // Change these values
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
}
```

---

## 🐛 Troubleshooting

### "Firebase: Error (auth/user-not-found)"
- Make sure you created the user in Firebase Authentication
- Check that email and password are correct

### "Insufficient permissions"
- Verify Firestore security rules are updated
- Make sure the user document exists in Firestore with correct role

### Module not found errors
- Run `npm install` again
- Delete `node_modules` folder and `package-lock.json`, then run `npm install`

### Port already in use
- Change the port in `vite.config.js`:
```javascript
server: {
  port: 3001  // Change to any available port
}
```

---

## 📊 Database Structure

```
Firestore Collections:

users/
  └── {userId}
      ├── email: string
      ├── name: string
      ├── role: "admin" | "student" | "faculty" | "hod"
      └── createdAt: string (ISO date)

patients/
  └── {patientId}
      ├── formType: "Acne Proforma"
      ├── createdBy: string (user email)
      ├── createdAt: string (ISO date)
      ├── lastModifiedBy: string (user email)
      ├── lastModifiedAt: string (ISO date)
      └── data: object (all form fields)
```

---

## 🔒 Security Notes

1. **Never commit `.env` file** to version control (it's in `.gitignore`)
2. For production deployment:
   - Update Firestore rules for stricter security
   - Use environment variables in your hosting platform
   - Enable proper authentication domain in Firebase

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all Firebase configurations are correct
3. Ensure all dependencies are installed
4. Check that you're using Node.js version 16+

---

## 🎉 Next Steps

1. ✅ Test all user roles (admin, student, faculty, HOD)
2. ✅ Create a patient entry as a student
3. ✅ Edit a patient entry as faculty/HOD
4. ✅ View statistics in HOD dashboard
5. 📝 Add your remaining 21 forms following the Acne Proforma template
6. 🎨 Customize colors and branding
7. 🚀 Deploy to production (Vercel, Netlify, Firebase Hosting)

---

## 🌐 Deployment (Optional)

### Deploy to Vercel (Free)

1. Install Vercel CLI:
```powershell
npm i -g vercel
```

2. Run:
```powershell
vercel
```

3. Follow the prompts
4. Add environment variables in Vercel dashboard

### Deploy to Firebase Hosting

1. Install Firebase tools:
```powershell
npm install -g firebase-tools
```

2. Login:
```powershell
firebase login
```

3. Initialize:
```powershell
firebase init hosting
```

4. Build and deploy:
```powershell
npm run build
firebase deploy
```

---

**Congratulations! Your JJMC Patient Registration System is now ready to use! 🎊**
