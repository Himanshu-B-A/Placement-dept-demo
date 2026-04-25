import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Import Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import HODDashboard from './pages/HODDashboard';
import AcneProforma from './forms/AcneProforma';
import PyodermaProforma from './forms/PyodermaProforma';
import VenereologyProforma from './forms/VenereologyProforma';
import HIVManifestationsProforma from './forms/HIVManifestationsProforma';
import ADRReportingForm from './forms/ADRReportingForm';
import HerpesZosterProforma from './forms/HerpesZosterProforma';
import SuperficialDermatophyticInfections from './forms/SuperficialDermatophyticInfections';
import AtopicDermatitisForm from './forms/AtopicDermatitisForm';
import MelasmaForm from './forms/MelasmaForm';
import UrticariaProforma from './forms/UrticariaProforma';
import ContactDermatitisForm from './forms/ContactDermatitisForm';
import AmyloidosisForm from './forms/AmyloidosisForm';
import PigmentaryDisordersForm from './forms/PigmentaryDisordersForm';
import PsoriasisForm from './forms/PsoriasisForm';
import HairLossFemalesForm from './forms/HairLossFemalesForm';
import HairLossMenForm from './forms/HairLossMenForm';
import AcanthosisNigricansForm from './forms/AcanthosisNigricansForm';
import LeprosyForm from './forms/LeprosyForm';
import HirsutusmFemalesForm from './forms/HirsutusmFemalesForm';
import ViewPatient from './pages/ViewPatient';
import PatientManagement from './pages/PatientManagement';
import SearchResults from './pages/SearchResults';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/student/*" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/faculty/*" 
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/hod/*" 
            element={
              <ProtectedRoute allowedRoles={['hod']}>
                <HODDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/acne-proforma" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <AcneProforma />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/acne-proforma/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <AcneProforma />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/pyoderma-proforma" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <PyodermaProforma />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/pyoderma-proforma/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <PyodermaProforma />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/venereology-proforma" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <VenereologyProforma />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/venereology-proforma/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <VenereologyProforma />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/hiv-manifestations" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <HIVManifestationsProforma />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/hiv-manifestations/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <HIVManifestationsProforma />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/herpes-zoster" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <HerpesZosterProforma />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/herpes-zoster/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <HerpesZosterProforma />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/dermatophytic-infections" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <SuperficialDermatophyticInfections />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/dermatophytic-infections/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <SuperficialDermatophyticInfections />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/atopic-dermatitis" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <AtopicDermatitisForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/atopic-dermatitis/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <AtopicDermatitisForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/melasma" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <MelasmaForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/melasma/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <MelasmaForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/urticaria-proforma" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <UrticariaProforma />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/urticaria-proforma/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <UrticariaProforma />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/contact-dermatitis" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <ContactDermatitisForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/contact-dermatitis/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <ContactDermatitisForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/amyloidosis" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <AmyloidosisForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/amyloidosis/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <AmyloidosisForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/pigmentary-disorders" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <PigmentaryDisordersForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/pigmentary-disorders/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <PigmentaryDisordersForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/psoriasis-assessment" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <PsoriasisForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/psoriasis-assessment/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <PsoriasisForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/hair-loss-females" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <HairLossFemalesForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/hair-loss-females/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <HairLossFemalesForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/hair-loss-men" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <HairLossMenForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/hair-loss-men/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <HairLossMenForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/acanthosis-nigricans" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <AcanthosisNigricansForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/acanthosis-nigricans/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <AcanthosisNigricansForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/leprosy" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <LeprosyForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/leprosy/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <LeprosyForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/hirsutism-females" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <HirsutusmFemalesForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/hirsutism-females/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <HirsutusmFemalesForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/adr-report" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <ADRReportingForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/forms/adr-report/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod']}>
                <ADRReportingForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/patient/:id" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod', 'admin']}>
                <ViewPatient />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/patients" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PatientManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/search" 
            element={
              <ProtectedRoute allowedRoles={['student', 'faculty', 'hod', 'admin']}>
                <SearchResults />
              </ProtectedRoute>
            } 
          />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
