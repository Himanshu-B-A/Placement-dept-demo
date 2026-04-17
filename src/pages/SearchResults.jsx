import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSearch, FaEye, FaEdit, FaArrowLeft, FaFileAlt } from 'react-icons/fa';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const searchQuery = searchParams.get('q') || '';
  
  const [patientResults, setPatientResults] = useState([]);
  const [formResults, setFormResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const allForms = [
    'Acne Proforma',
    'Pyoderma Proforma',
    'Venereology Proforma',
    'HIV Manifestations',
    'ADR Report',
    'Herpes Zoster',
    'Superficial Dermatophytic Infections',
    'Atopic Dermatitis',
    'Melasma',
    'Urticaria',
    'Contact Dermatitis',
    'Amyloidosis',
    'Pigmentary Disorders',
    'Psoriasis Assessment',
    'Hair Loss in Females',
    'Hair Loss in Men',
    'Acanthosis Nigricans',
    'Leprosy Case Sheet'
  ];

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      // Search Patients
      const patientsSnapshot = await getDocs(collection(db, 'patients'));
      
      const allPatients = patientsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter patients based on search query
      const filteredPatients = allPatients.filter(patient => {
        const query = searchQuery.toLowerCase();
        return (
          patient.data?.name?.toLowerCase().includes(query) ||
          patient.data?.hospitalId?.toLowerCase().includes(query) ||
          patient.data?.age?.toString().includes(query) ||
          patient.data?.phoneNumber?.includes(query) ||
          patient.createdBy?.toLowerCase().includes(query) ||
          patient.formType?.toLowerCase().includes(query)
        );
      });

      // Apply role-based filtering for patients
      let roleFilteredPatients = filteredPatients;
      if (userRole === 'student') {
        // Students can only see their own records
        roleFilteredPatients = filteredPatients.filter(p => p.createdBy === userRole);
      }
      // Admin, Faculty, HOD can see all records

      // Search Forms
      const filteredForms = allForms.filter(form =>
        form.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setPatientResults(roleFilteredPatients);
      setFormResults(filteredForms);
      setLoading(false);
    } catch (error) {
      console.error('Error searching:', error);
      setLoading(false);
    }
  };

  const getFormRoute = (formType) => {
    const formRoutes = {
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
      'Leprosy Case Sheet': '/forms/leprosy'
    };
    return formRoutes[formType] || '/forms/acne-proforma';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 btn btn-secondary flex items-center space-x-2 inline-flex"
        >
          <FaArrowLeft /> <span>Back</span>
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h2>
          <p className="text-gray-600">
            Found <span className="font-semibold">{patientResults.length + formResults.length}</span> result{patientResults.length + formResults.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Searching...</p>
          </div>
        ) : patientResults.length === 0 && formResults.length === 0 ? (
          <div className="card text-center py-12">
            <FaSearch className="text-gray-300 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No results found for "{searchQuery}"</p>
            <p className="text-gray-400 text-sm">Try searching for a patient name, form type, or medical form</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Form Results */}
            {/* Form Results */}
            {formResults.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <FaFileAlt className="text-green-600" />
                  <span>Medical Forms ({formResults.length})</span>
                </h3>
                
                {/* Desktop Grid View */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formResults.map((form, idx) => (
                    <div key={idx} className="card hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{form}</p>
                          <p className="text-sm text-gray-500 mt-1">Medical Assessment Form</p>
                        </div>
                        <FaFileAlt className="text-green-600 text-2xl ml-2 flex-shrink-0" />
                      </div>
                      <button
                        onClick={() => navigate(`${getFormRoute(form)}`)}
                        className="w-full btn btn-primary"
                      >
                        Open Form
                      </button>
                    </div>
                  ))}
                </div>

                {/* Mobile List View */}
                <div className="md:hidden space-y-3">
                  {formResults.map((form, idx) => (
                    <div key={idx} className="card">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{form}</p>
                          <p className="text-sm text-gray-500">Medical Assessment Form</p>
                        </div>
                        <FaFileAlt className="text-green-600 text-2xl" />
                      </div>
                      <button
                        onClick={() => navigate(`${getFormRoute(form)}`)}
                        className="w-full btn btn-primary"
                      >
                        Open Form
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simplified Patient Search - Just Names and View */}
            {patientResults.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <FaSearch className="text-purple-600" />
                  <span>Patient Search ({patientResults.length})</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {patientResults.map((patient) => (
                    <div key={`quick-${patient.id}`} className="card p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{patient.data?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500 truncate">{patient.data?.hospitalId || 'ID: N/A'}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/patient/${patient.id}`)}
                          className="ml-2 btn btn-primary py-1 px-3 text-sm flex items-center space-x-1 flex-shrink-0"
                          title="View Patient"
                        >
                          <FaEye className="text-xs" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
