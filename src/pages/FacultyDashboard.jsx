import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import {
  FaFileAlt, FaEye, FaEdit, FaPlus, FaChartBar, FaCalendarAlt, FaPrint, FaDownload
} from 'react-icons/fa';

const FORM_ROUTES = {
  'Acne Proforma': '/forms/acne-proforma',
  'Pyoderma Proforma': '/forms/pyoderma-proforma',
  'Venereology Proforma': '/forms/venereology-proforma',
  'HIV Manifestations': '/forms/hiv-manifestations',
  'ADR Report': '/forms/adr-report',
  'Herpes Zoster': '/forms/herpes-zoster',
  'Superficial Dermatophytic Infections': '/forms/dermatophytic-infections',
  'Atopic Dermatitis': '/forms/atopic-dermatitis',
  'Melasma': '/forms/melasma',
  'Urticaria': '/forms/urticaria-proforma',
  'Contact Dermatitis': '/forms/contact-dermatitis',
  'Amyloidosis': '/forms/amyloidosis',
  'Pigmentary Disorders': '/forms/pigmentary-disorders',
  'Psoriasis Assessment': '/forms/psoriasis-assessment',
  'Hair Loss in Females': '/forms/hair-loss-females',
  'Hair Loss in Men': '/forms/hair-loss-men',
  'Acanthosis Nigricans': '/forms/acanthosis-nigricans',
  'Leprosy Case Sheet': '/forms/leprosy',
  'Study of Hirsutism in Females': '/forms/hirsutism-females'
};

const AVAILABLE_FORMS = Object.entries(FORM_ROUTES).map(([name, route]) => ({ name, route }));

const FacultyDashboard = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('records');
  const navigate = useNavigate();

  useEffect(() => { fetchAllPatients(); }, []);

  const fetchAllPatients = async () => {
    try {
      const snap = await getDocs(collection(db, 'patients'));
      setAllPatients(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const thisMonth = allPatients.filter(p => {
    const d = new Date(p.createdAt); const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).length;

  const handlePrint = (patient) => {
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>Patient - ${patient.data?.name || patient.data?.hospitalId}</title>
      <style>body{font-family:Arial,sans-serif;padding:20px;} h2{color:#1e40af;} table{width:100%;border-collapse:collapse;margin-top:12px;} td,th{border:1px solid #d1d5db;padding:10px;} th{background:#eff6ff;font-weight:600;}</style>
      </head><body>
      <h2>JJMMC — Dermatology Department</h2>
      <table>
        <tr><th>Hospital ID</th><td>${patient.data?.hospitalId || 'N/A'}</td></tr>
        <tr><th>Patient Name</th><td>${patient.data?.name || 'N/A'}</td></tr>
        <tr><th>Form Type</th><td>${patient.formType || 'N/A'}</td></tr>
        <tr><th>Created By</th><td>${patient.createdBy || 'N/A'}</td></tr>
        <tr><th>Date</th><td>${new Date(patient.createdAt).toLocaleString()}</td></tr>
      </table>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  const handleDownloadCSV = () => {
    const headers = ['Hospital ID', 'Patient Name', 'Form Type', 'Created By', 'Created At'];
    const rows = allPatients.map(p => [
      p.data?.hospitalId || 'N/A', p.data?.name || 'N/A', p.formType || 'N/A',
      p.createdBy || 'N/A', new Date(p.createdAt).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `jjmmc-patients-${new Date().toISOString().slice(0,10)}.csv`
    });
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              <FaChartBar className="text-blue-500" /> Faculty Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Create and manage patient records</p>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-teal-700 bg-teal-100 hover:bg-teal-200 transition-all"
          >
            <FaDownload /> Download CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Records', value: allPatients.length, color: 'from-blue-500 to-blue-600', icon: <FaFileAlt className="text-white/30 text-4xl" /> },
            { label: 'This Month', value: thisMonth, color: 'from-pink-500 to-rose-500', icon: <FaCalendarAlt className="text-white/30 text-4xl" /> },
            { label: 'Can Edit', value: allPatients.length, color: 'from-purple-500 to-purple-600', icon: <FaEdit className="text-white/30 text-4xl" /> },
            { label: 'Form Types', value: AVAILABLE_FORMS.length, color: 'from-teal-500 to-teal-600', icon: <FaPlus className="text-white/30 text-4xl" /> }
          ].map((s, i) => (
            <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 shadow-lg hover:-translate-y-1 transition-all duration-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs font-medium mb-1">{s.label}</p>
                  <p className="text-3xl font-bold text-white">{loading ? '—' : s.value}</p>
                </div>
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-blue-100 w-fit">
          {[
            { id: 'records', label: 'Patient Records', icon: <FaFileAlt /> },
            { id: 'forms', label: 'Enter New Form', icon: <FaPlus /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow'
                  : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Patient Records */}
        {activeTab === 'records' && (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-blue-50">
              <h2 className="text-lg font-bold text-gray-800">All Patient Records</h2>
              <p className="text-sm text-gray-500">View, edit and print patient entries</p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-10 h-10 border-4 border-blue-300 border-t-pink-400 rounded-full animate-spin"></div>
              </div>
            ) : allPatients.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FaFileAlt className="text-5xl mx-auto mb-3 text-gray-200" />
                <p>No patient records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-pink-50">
                    <tr>
                      {['Hospital ID', 'Patient Name', 'Form Type', 'Created By', 'Date', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allPatients.slice().reverse().map((patient) => (
                      <tr key={patient.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-5 py-3 text-sm font-semibold text-gray-900">{patient.data?.hospitalId || 'N/A'}</td>
                        <td className="px-5 py-3 text-sm text-gray-700">{patient.data?.name || 'N/A'}</td>
                        <td className="px-5 py-3 text-sm text-gray-500">{patient.formType}</td>
                        <td className="px-5 py-3 text-xs text-gray-500">{patient.createdBy}</td>
                        <td className="px-5 py-3 text-xs text-gray-500">{new Date(patient.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => navigate(`/patient/${patient.id}`)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs font-semibold"
                            >
                              <FaEye /> View
                            </button>
                            <button
                              onClick={() => navigate(`${FORM_ROUTES[patient.formType] || '/forms/acne-proforma'}/${patient.id}`)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-xs font-semibold"
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handlePrint(patient)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-xs font-semibold"
                            >
                              <FaPrint /> Print
                            </button>
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

        {/* Enter New Form */}
        {activeTab === 'forms' && (
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FaPlus className="text-pink-500" /> Create New Patient Entry
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AVAILABLE_FORMS.map((form, i) => (
                <button
                  key={i}
                  onClick={() => navigate(form.route)}
                  className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-pink-50 hover:from-blue-100 hover:to-pink-100 border border-blue-100 hover:border-pink-200 rounded-xl transition-all group text-left"
                >
                  <span className="text-sm font-semibold text-gray-700">{form.name}</span>
                  <FaPlus className="text-pink-400 group-hover:text-pink-600 flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
