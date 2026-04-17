# Admin Patient Management Guide

## Firebase Setup Complete ✅

Follow the **QUICK_FIREBASE_SETUP.md** file for step-by-step Firebase configuration.

---

## Admin Features Added

### 1. **Patient Management Page**
Admin can now manage all patient records from a dedicated page:
- **View all patients** across the system
- **Search patients** by name, hospital ID, or creator
- **Filter by form type** (Acne, Psoriasis, etc.)
- **Delete patient records** with confirmation
- **View patient details** 

### 2. **How to Access**
1. Login as admin: `admin@jjmc.com` / `himu*1bca`
2. Click **"Manage Patients"** button on Admin Dashboard
3. Or navigate to: `http://localhost:3000/admin/patients`

### 3. **Admin Dashboard Updated**
- Added **"Manage Patients"** button next to "Register New User"
- Shows quick stats: Total Users, Total Patients, Forms Available
- User registration form for creating new accounts

---

## Patient Management Features

### Search & Filter
- **Search Bar**: Find patients by name, hospital ID, or creator email
- **Form Type Filter**: Filter by specific medical forms (Acne, Psoriasis, etc.)

### Actions
- **View**: See full patient record with print option
- **Delete**: Remove patient record (with confirmation)

### Statistics
- Total patient records
- Number of unique form types
- Records created this month

---

## Admin Roles & Permissions

| Action | Admin | Faculty | HOD | Student |
|--------|-------|---------|-----|---------|
| Register Users | ✅ | ❌ | ❌ | ❌ |
| View All Patients | ✅ | ✅ | ✅ | ❌ |
| Edit All Patients | ✅ | ✅ | ✅ | ❌ |
| Delete Patients | ✅ | ❌ | ❌ | ❌ |
| Create Patient Forms | ✅ | ✅ | ✅ | ✅ |

---

## User Management

### Create New Users (Admin Only)
1. On Admin Dashboard, click **"Register New User"**
2. Fill form:
   - **Full Name**: User's name
   - **Email**: User's email
   - **Password**: Temporary password
   - **Role**: Select from Admin, Student, Faculty, HOD
3. Click **"Register"**
4. Share credentials with user

### Available Roles
- **Admin**: Full system access, can manage users and patients
- **Student**: Can create patient forms only
- **Faculty**: Can create, view, and edit patient forms
- **HOD**: Can create, view, edit forms, and monitor student activity

---

## API/Database Structure

### Patients Collection
```
patients/{patientId}
  ├── formType: string (e.g., "Acne Proforma")
  ├── createdBy: string (creator's email)
  ├── createdAt: timestamp
  ├── lastModifiedBy: string
  ├── lastModifiedAt: timestamp
  └── data: object (form data)
```

### Users Collection
```
users/{userId}
  ├── email: string
  ├── role: string (admin|student|faculty|hod)
  ├── name: string
  ├── createdAt: timestamp
  └── createdBy: string
```

---

## Security Rules

All database access is controlled by Firestore Security Rules:
- Users can only view their own profile
- Only admins can create/delete users
- Students can only create forms
- Faculty/HOD can edit all forms
- Only admins can delete patient records

---

## Troubleshooting

### Can't see "Manage Patients" button?
- Make sure you're logged in as admin
- Check Firestore security rules are published

### Can't delete patient records?
- Only admins have delete permission
- Check Firebase rules: `allow delete: if role == 'admin'`

### Patients not showing up?
- Ensure patient records have valid `formType` field
- Check Firestore database has `patients` collection

---

## Next Steps

1. ✅ Follow QUICK_FIREBASE_SETUP.md
2. ✅ Create Firebase project and admin user
3. ✅ Test login with admin credentials
4. ✅ Go to Admin Dashboard → Manage Patients
5. ✅ Create student/faculty/hod accounts
6. ✅ Have users create patient forms
7. ✅ Manage records from admin panel

🎉 You're all set!
