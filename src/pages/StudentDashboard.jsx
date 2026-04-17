import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaPlus, FaFileAlt, FaEye, FaSearch, FaCalendarAlt } from 'react-icons/fa';

const availableForms = [
  { id: 1, name: 'Acne Proforma', route: '/forms/acne-proforma', description: 'Complete acne examination and disability index', color: 'from-blue-50 to-blue-100' },
  { id: 2, name: 'Pyoderma Proforma', route: '/forms/pyoderma-proforma', description: 'Clinico bacteriological study in pyoderma', color: 'from-pink-50 to-pink-100' },
  { id: 3, name: 'Venereology Proforma', route: '/forms/venereology-proforma', description: 'STD/Venereology assessment and history', color: 'from-purple-50 to-purple-100' },
  { id: 4, name: 'HIV Manifestations', route: '/forms/hiv-manifestations', description: 'Mucocutaneous manifestations of HIV', color: 'from-red-50 to-red-100' },
  { id: 5, name: 'ADR Report', route: '/forms/adr-report', description: 'Adverse Drug Reaction reporting form', color: 'from-orange-50 to-orange-100' },
  { id: 6, name: 'Herpes Zoster', route: '/forms/herpes-zoster', description: 'Herpes Zoster examination and assessment', color: 'from-yellow-50 to-yellow-100' },
  { id: 7, name: 'Dermatophytic Infections', route: '/forms/dermatophytic-infections', description: 'Superficial dermatophytic infections study', color: 'from-green-50 to-green-100' },
  { id: 8, name: 'Atopic Dermatitis', route: '/forms/atopic-dermatitis', description: 'Clinical study of atopic dermatitis', color: 'from-teal-50 to-teal-100' },
  { id: 9, name: 'Melasma', route: '/forms/melasma', description: 'Melasma assessment and examination', color: 'from-indigo-50 to-indigo-100' },
  { id: 10, name: 'Urticaria Proforma', route: '/forms/urticaria-proforma', description: 'Urticaria assessment and UAS scoring', color: 'from-blue-50 to-pink-50' },
  { id: 11, name: 'Contact Dermatitis', route: '/forms/contact-dermatitis', description: 'Contact dermatitis proforma', color: 'from-cyan-50 to-cyan-100' },
  { id: 12, name: 'Amyloidosis', route: '/forms/amyloidosis', description: 'Amyloidosis proforma', color: 'from-rose-50 to-rose-100' },
  { id: 13, name: 'Pigmentary Disorders', route: '/forms/pigmentary-disorders', description: 'Pigmentary disorders assessment', color: 'from-violet-50 to-violet-100' },
  { id: 14, name: 'Psoriasis Assessment', route: '/forms/psoriasis-assessment', description: 'National Psoriasis Registry form', color: 'from-fuchsia-50 to-fuchsia-100' },
  { id: 15, name: 'Hair Loss in Females', route: '/forms/hair-loss-females', description: 'Clinical and diagnostic study on hair loss in females', color: 'from-pink-50 to-purple-50' },
  { id: 16, name: 'Hair Loss in Men', route: '/forms/hair-loss-men', description: 'Hair loss proforma for men', color: 'from-blue-50 to-indigo-50' },
  { id: 17, name: 'Acanthosis Nigricans', route: '/forms/acanthosis-nigricans', description: 'Acanthosis Nigricans proforma', color: 'from-amber-50 to-amber-100' },
  { id: 18, name: 'Leprosy Case Sheet', route: '/forms/leprosy', description: 'Leprosy Case Sheet', color: 'from-lime-50 to-lime-100' },
  { id: 19, name: 'Study of Hirsutism in Females', route: '/forms/hirsutism-females', description: 'Epidemiology, diagnosis and management of hirsutism', color: 'from-sky-50 to-sky-100' },
  { id: 20, name: 'General Dermatology', route: '#', description: 'Coming soon...', disabled: true, color: 'from-gray-50 to-gray-100' },
];

const StudentDashboard = () => {
  const [myPatients, setMyPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (currentUser) fetchMyPatients(); }, [currentUser]);

  const fetchMyPatients = async () => {
    try {
      const q = query(collection(db, 'patients'), where('createdBy', '==', currentUser.email));
      const snap = await getDocs(q);
      setMyPatients(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const thisMonth = myPatients.filter(p => {
    const d = new Date(p.createdAt); const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Welcome back! Create and view your patient entries.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'My Entries', value: myPatients.length, color: 'from-blue-500 to-blue-600', icon: <FaFileAlt className="text-white/30 text-4xl" /> },
            { label: 'This Month', value: thisMonth, color: 'from-pink-500 to-rose-500', icon: <FaCalendarAlt className="text-white/30 text-4xl" /> },
            { label: 'Available Forms', value: availableForms.filter(f => !f.disabled).length, color: 'from-purple-500 to-purple-600', icon: <FaPlus className="text-white/30 text-4xl" /> }
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

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 mb-8">
          <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FaSearch className="text-blue-500" /> Search Patients
          </h3>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search by patient name, hospital ID, or form type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm bg-blue-50/30"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-sm transition-all"
            >
              Search
            </button>
          </form>
        </div>

        {/* Available Forms */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaPlus className="text-pink-500" /> Create New Entry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableForms.map((form) => (
              <div
                key={form.id}
                className={`bg-gradient-to-br ${form.color} border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${!form.disabled ? 'hover:-translate-y-1 cursor-pointer' : 'opacity-60'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-bold text-gray-800">{form.name}</h4>
                  <FaFileAlt className="text-blue-400 text-lg flex-shrink-0 ml-2" />
                </div>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{form.description}</p>
                <button
                  onClick={() => !form.disabled && navigate(form.route)}
                  disabled={form.disabled}
                  className={`w-full py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                    form.disabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-pink-500 text-white hover:from-blue-600 hover:to-pink-600 shadow'
                  }`}
                >
                  {form.disabled ? 'Coming Soon' : 'Create Entry'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* My Entries */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-50">
            <h3 className="text-lg font-bold text-gray-800">My Patient Entries</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-300 border-t-pink-400 rounded-full animate-spin"></div>
            </div>
          ) : myPatients.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="text-5xl mx-auto mb-3 text-gray-200" />
              <p className="text-gray-500 text-sm">No patient entries found.</p>
              <p className="text-gray-400 text-xs mt-1">Use the forms above to create a new entry.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-pink-50">
                    <tr>
                      {['Hospital ID', 'Form Type', 'Created At', 'Last Modified', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {myPatients.slice().reverse().map((patient) => (
                      <tr key={patient.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{patient.data?.hospitalId || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{patient.formType}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(patient.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {patient.lastModifiedAt ? new Date(patient.lastModifiedAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => navigate(`/patient/${patient.id}`)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs font-semibold"
                          >
                            <FaEye /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-50">
                {myPatients.slice().reverse().map((patient) => (
                  <div key={patient.id} className="p-4 hover:bg-blue-50/20">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{patient.data?.hospitalId || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{new Date(patient.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-medium">{patient.formType}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/patient/${patient.id}`)}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-pink-500"
                    >
                      <FaEye /> View Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
