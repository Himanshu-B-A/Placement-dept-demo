import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import CSVUploadModal from '../components/CSVUploadModal';
import {
  FaUsers, FaFileAlt, FaUserPlus, FaTrash, FaEye, FaList,
  FaFileImport, FaCheckCircle, FaTimesCircle, FaPrint, FaDownload,
  FaSearch, FaFilter, FaChartBar, FaExclamationTriangle, FaTimes,
  FaUserTimes, FaUserEdit, FaShieldAlt
} from 'react-icons/fa';

/* ─── Toast ─────────────────────────────────────────────── */
const Toast = ({ toasts, dismiss }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
    {toasts.map(t => (
      <div
        key={t.id}
        className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-medium pointer-events-auto
          animate-[slideIn_0.3s_ease-out] ${
          t.type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
          t.type === 'error'   ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                 'bg-gradient-to-r from-blue-500 to-indigo-500'
        }`}
      >
        {t.type === 'success' ? <FaCheckCircle /> : t.type === 'error' ? <FaTimesCircle /> : <FaShieldAlt />}
        <span>{t.message}</span>
        <button onClick={() => dismiss(t.id)} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
          <FaTimes className="w-3 h-3" />
        </button>
      </div>
    ))}
  </div>
);

/* ─── Confirm Modal ──────────────────────────────────────── */
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', danger = true, loading = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-[scaleIn_0.2s_ease-out]">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-100' : 'bg-blue-100'}`}>
          <FaExclamationTriangle className={`text-2xl ${danger ? 'text-red-500' : 'text-blue-500'}`} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h3>
        <p className="text-gray-500 text-center text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 ${
              danger
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deleting...
              </span>
            ) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Role badge helper ──────────────────────────────────── */
const RoleBadge = ({ role }) => {
  const cfg = {
    admin:   'bg-purple-100 text-purple-700 border border-purple-200',
    hod:     'bg-blue-100 text-blue-700 border border-blue-200',
    faculty: 'bg-pink-100 text-pink-700 border border-pink-200',
    student: 'bg-green-100 text-green-700 border border-green-200',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${cfg[role] || 'bg-gray-100 text-gray-600'}`}>
      {role?.toUpperCase()}
    </span>
  );
};

/* ─── Stat Card ──────────────────────────────────────────── */
const StatCard = ({ label, value, color, icon, sub }) => (
  <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-default`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/75 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-4xl font-black text-white">{value}</p>
        {sub && <p className="text-white/60 text-xs mt-1">{sub}</p>}
      </div>
      <div className="opacity-25 text-4xl">{icon}</div>
    </div>
  </div>
);

/* ─── Animated counter ───────────────────────────────────── */
let toastId = 0;

/* ════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
═══════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const [patients, setPatients]           = useState([]);
  const [users, setUsers]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [toasts, setToasts]               = useState([]);
  const [activeTab, setActiveTab]         = useState('users');

  // Search / filter
  const [userSearch, setUserSearch]       = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [patientSearch, setPatientSearch] = useState('');

  // Confirm modal
  const [confirm, setConfirm] = useState({ open: false, title: '', message: '', onConfirm: null, loading: false });

  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', role: 'student' });

  const { register, currentUser } = useAuth();
  const navigate = useNavigate();

  /* Toast helpers */
  const toast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const dismissToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  /* Confirm modal helper */
  const openConfirm = ({ title, message, onConfirm, confirmLabel = 'Delete', danger = true }) =>
    setConfirm({ open: true, title, message, onConfirm, confirmLabel, danger, loading: false });
  const closeConfirm = () => setConfirm(c => ({ ...c, open: false, loading: false }));

  /* ── Fetch ── */
  const fetchData = useCallback(async () => {
    try {
      const [pSnap, uSnap] = await Promise.all([
        getDocs(collection(db, 'patients')),
        getDocs(collection(db, 'users'))
      ]);
      setPatients(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      toast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Register user ── */
  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    const result = await register(newUser.email, newUser.password, newUser.name, newUser.role);
    setRegisterLoading(false);
    if (result.success) {
      toast(`✓ User "${newUser.name}" created successfully!`);
      setShowRegisterForm(false);
      setNewUser({ email: '', password: '', name: '', role: 'student' });
      fetchData();
    } else {
      toast(result.error, 'error');
    }
  };

  /* ── Delete user (Firestore only) ── */
  const handleDeleteUser = (user) => {
    if (user.email === currentUser?.email) {
      toast('You cannot delete your own account', 'error');
      return;
    }
    openConfirm({
      title: 'Remove User',
      message: `Are you sure you want to remove "${user.name || user.email}" (${user.role?.toUpperCase()})? They will lose access immediately.`,
      confirmLabel: 'Remove User',
      onConfirm: async () => {
        setConfirm(c => ({ ...c, loading: true }));
        try {
          await deleteDoc(doc(db, 'users', user.id));
          toast(`User "${user.name || user.email}" removed`);
          fetchData();
          closeConfirm();
        } catch (err) {
          console.error(err);
          toast('Failed to remove user', 'error');
          setConfirm(c => ({ ...c, loading: false }));
        }
      }
    });
  };

  /* ── Delete patient ── */
  const handleDeletePatient = (patient) => {
    openConfirm({
      title: 'Delete Patient Record',
      message: `Delete record for "${patient.data?.name || patient.data?.hospitalId || 'this patient'}"? This action cannot be undone.`,
      confirmLabel: 'Delete Record',
      onConfirm: async () => {
        setConfirm(c => ({ ...c, loading: true }));
        try {
          await deleteDoc(doc(db, 'patients', patient.id));
          toast('Patient record deleted');
          fetchData();
          closeConfirm();
        } catch (err) {
          toast('Failed to delete record', 'error');
          setConfirm(c => ({ ...c, loading: false }));
        }
      }
    });
  };

  /* ── Print patient ── */
  const handlePrintPatient = (patient) => {
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Patient</title>
      <style>body{font-family:Arial,sans-serif;padding:24px}h2{color:#1d4ed8}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{border:1px solid #d1d5db;padding:10px}th{background:#eff6ff;font-weight:600;text-align:left}</style>
      </head><body>
      <h2>JJMMC — Dermatology Department</h2>
      <table>
        <tr><th>Hospital ID</th><td>${patient.data?.hospitalId||'N/A'}</td></tr>
        <tr><th>Patient Name</th><td>${patient.data?.name||'N/A'}</td></tr>
        <tr><th>Form Type</th><td>${patient.formType||'N/A'}</td></tr>
        <tr><th>Created By</th><td>${patient.createdBy||'N/A'}</td></tr>
        <tr><th>Created At</th><td>${new Date(patient.createdAt).toLocaleString()}</td></tr>
      </table></body></html>`);
    w.document.close(); w.print();
  };

  /* ── Download CSV ── */
  const handleDownloadCSV = () => {
    const headers = ['Hospital ID','Patient Name','Form Type','Created By','Created At'];
    const rows = patients.map(p => [p.data?.hospitalId||'N/A',p.data?.name||'N/A',p.formType||'N/A',p.createdBy||'N/A',new Date(p.createdAt).toLocaleDateString()]);
    const csv = [headers,...rows].map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
    Object.assign(document.createElement('a'),{
      href: URL.createObjectURL(new Blob([csv],{type:'text/csv'})),
      download:`jjmmc-patients-${new Date().toISOString().slice(0,10)}.csv`
    }).click();
    toast('Patient list downloaded');
  };

  /* ── Filtered lists ── */
  const filteredUsers = users.filter(u => {
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const q = userSearch.toLowerCase();
    const matchSearch = !q || (u.name||'').toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const filteredPatients = patients.filter(p => {
    const q = patientSearch.toLowerCase();
    return !q || (p.data?.name||'').toLowerCase().includes(q) ||
      (p.data?.hospitalId||'').toLowerCase().includes(q) ||
      (p.formType||'').toLowerCase().includes(q) ||
      (p.createdBy||'').toLowerCase().includes(q);
  });

  /* ── Stats ── */
  const thisMonth = patients.filter(p => {
    const d = new Date(p.createdAt), n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).length;

  const roleCounts = users.reduce((acc, u) => { acc[u.role] = (acc[u.role]||0)+1; return acc; }, {});

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <Navbar />
      <Toast toasts={toasts} dismiss={dismissToast} />
      <ConfirmModal
        isOpen={confirm.open}
        onClose={closeConfirm}
        onConfirm={confirm.onConfirm}
        title={confirm.title}
        message={confirm.message}
        confirmLabel={confirm.confirmLabel}
        danger={confirm.danger !== false}
        loading={confirm.loading}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ── */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Full control over users, patients and system</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowRegisterForm(v => !v)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white shadow transition-all
                ${showRegisterForm
                  ? 'bg-gray-400 hover:bg-gray-500'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}`}
            >
              <FaUserPlus /> {showRegisterForm ? 'Cancel' : 'Add User'}
            </button>
            <button
              onClick={() => setShowCSVUpload(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all"
            >
              <FaFileImport /> Bulk CSV
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-teal-700 bg-teal-100 hover:bg-teal-200 transition-all"
            >
              <FaDownload /> Export
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Users"    value={loading ? '—' : users.length}    color="from-blue-500 to-blue-600"     icon={<FaUsers />}    sub={`${roleCounts.faculty||0} faculty · ${roleCounts.hod||0} HOD`} />
          <StatCard label="Total Patients" value={loading ? '—' : patients.length} color="from-pink-500 to-rose-500"     icon={<FaFileAlt />}  sub="All records" />
          <StatCard label="This Month"     value={loading ? '—' : thisMonth}       color="from-purple-500 to-purple-600" icon={<FaChartBar />} sub="New entries" />
          <StatCard label="Students"       value={loading ? '—' : roleCounts.student||0} color="from-teal-500 to-teal-600" icon={<FaUsers />} sub={`${roleCounts.admin||0} admin`} />
        </div>

        {/* ── Register Form ── */}
        {showRegisterForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-6 animate-[fadeIn_0.3s_ease-out]">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaUserPlus className="text-blue-500" /> Register New User
            </h3>
            <form onSubmit={handleRegisterUser}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[
                  { label: 'Full Name', type: 'text',     key: 'name',     placeholder: 'Dr. Jane Smith' },
                  { label: 'Email',     type: 'email',    key: 'email',    placeholder: 'jane@jjmmc.com' },
                  { label: 'Password', type: 'password', key: 'password', placeholder: '••••••••' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} required
                      value={newUser[f.key]}
                      onChange={e => setNewUser({ ...newUser, [f.key]: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50/30 text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['student','faculty','hod','admin'].map(r => (
                      <button key={r} type="button"
                        onClick={() => setNewUser({ ...newUser, role: r })}
                        className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                          newUser.role === r
                            ? r === 'admin'   ? 'bg-purple-500 text-white border-purple-500' :
                              r === 'hod'     ? 'bg-blue-500 text-white border-blue-500' :
                              r === 'faculty' ? 'bg-pink-500 text-white border-pink-500' :
                                                'bg-green-500 text-white border-green-500'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={registerLoading}
                  className="px-8 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 disabled:opacity-50 shadow transition-all"
                >
                  {registerLoading ? 'Creating...' : 'Create User'}
                </button>
                <button type="button" onClick={() => setShowRegisterForm(false)}
                  className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit">
          {[
            { id: 'users',    label: `Users (${users.length})`,    icon: <FaUsers /> },
            { id: 'patients', label: `Patients (${patients.length})`, icon: <FaFileAlt /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════ TAB: USERS ═══════ */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">

            {/* Table header + search */}
            <div className="px-6 py-4 border-b border-blue-50 flex flex-wrap items-center gap-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 flex-1">
                <FaUsers className="text-blue-500" /> Registered Users
              </h3>

              {/* Role filter pills */}
              <div className="flex gap-2 flex-wrap">
                {['all','admin','hod','faculty','student'].map(r => (
                  <button key={r} onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                      userRoleFilter === r
                        ? r === 'admin'   ? 'bg-purple-500 text-white border-purple-500' :
                          r === 'hod'     ? 'bg-blue-500 text-white border-blue-500' :
                          r === 'faculty' ? 'bg-pink-500 text-white border-pink-500' :
                          r === 'student' ? 'bg-green-500 text-white border-green-500' :
                                            'bg-gray-700 text-white border-gray-700'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {r === 'all' ? `All (${users.length})` :
                      `${r.toUpperCase()} (${roleCounts[r]||0})`}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input type="text" placeholder="Search users..."
                  value={userSearch} onChange={e => setUserSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50/30 w-48"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-blue-300 border-t-pink-400 rounded-full animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FaUsers className="text-5xl mx-auto mb-3 text-gray-200" />
                <p>No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-pink-50">
                    <tr>
                      {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0 ${
                              user.role === 'admin'   ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                              user.role === 'hod'     ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                              user.role === 'faculty' ? 'bg-gradient-to-br from-pink-400 to-pink-600' :
                                                        'bg-gradient-to-br from-green-400 to-green-600'
                            }`}>
                              {(user.name || user.email || '?')[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{user.name || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-6 py-4">
                          {user.email !== currentUser?.email ? (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:text-red-700 text-xs font-bold transition-all opacity-0 group-hover:opacity-100 border border-red-100"
                            >
                              <FaUserTimes /> Remove
                            </button>
                          ) : (
                            <span className="text-xs text-gray-300 italic">You</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══════ TAB: PATIENTS ═══════ */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">

            <div className="px-6 py-4 border-b border-pink-50 flex flex-wrap items-center gap-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 flex-1">
                <FaFileAlt className="text-pink-500" /> Patient Records
                <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-0.5 rounded-full">{filteredPatients.length}</span>
              </h3>
              <button
                onClick={() => navigate('/admin/patients')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 text-sm transition-all border border-pink-100"
              >
                <FaList /> Manage All
              </button>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input type="text" placeholder="Search patients..."
                  value={patientSearch} onChange={e => setPatientSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-pink-50/30 w-48"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-pink-300 border-t-blue-400 rounded-full animate-spin" />
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FaFileAlt className="text-5xl mx-auto mb-3 text-gray-200" />
                <p>{patientSearch ? 'No matching records' : 'No patient records found'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-pink-50 to-blue-50">
                    <tr>
                      {['Hospital ID','Patient Name','Form Type','Created By','Date','Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredPatients.slice().reverse().map(patient => (
                      <tr key={patient.id} className="hover:bg-pink-50/20 transition-colors group">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{patient.data?.hospitalId||'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">{patient.data?.name||'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-100">
                            {patient.formType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">{patient.createdBy}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">{new Date(patient.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => navigate(`/patient/${patient.id}`)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs font-bold transition-all"
                            ><FaEye /> View</button>
                            <button onClick={() => handlePrintPatient(patient)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-xs font-bold transition-all"
                            ><FaPrint /> Print</button>
                            <button onClick={() => handleDeletePatient(patient)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 text-xs font-bold transition-all opacity-0 group-hover:opacity-100 border border-red-100"
                            ><FaTrash /> Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      <CSVUploadModal
        isOpen={showCSVUpload}
        onClose={() => setShowCSVUpload(false)}
        onSuccess={(successCount, total) => {
          toast(`Uploaded ${successCount} of ${total} users successfully`);
          fetchData();
          setShowCSVUpload(false);
        }}
      />

      <style>{`
        @keyframes slideIn  { from { opacity:0; transform:translateX(24px) } to { opacity:1; transform:translateX(0) } }
        @keyframes scaleIn  { from { opacity:0; transform:scale(0.92) } to { opacity:1; transform:scale(1) } }
        @keyframes fadeIn   { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
