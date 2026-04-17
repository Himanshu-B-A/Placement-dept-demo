import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaTrash, FaEye, FaEdit, FaSearch } from 'react-icons/fa';

const PatientManagement = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterForm, setFilterForm] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { userRole } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (userRole && userRole !== 'admin') {
      navigate('/login');
    }
  }, [userRole, navigate]);

  useEffect(() => {
    fetchAllPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [allPatients, searchTerm, filterForm]);

  const fetchAllPatients = async () => {
    try {
      const patientsSnapshot = await getDocs(collection(db, 'patients'));
      
      const patientsData = patientsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllPatients(patientsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      alert('Error loading patient records');
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = allPatients;

    // Filter by form type
    if (filterForm !== 'all') {
      filtered = filtered.filter(p => p.formType === filterForm);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(p =>
        p.data?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.data?.hospitalId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPatients(filtered);
  };

  const handleDeletePatient = async (patientId) => {
    try {
      await deleteDoc(doc(db, 'patients', patientId));
      alert('Patient record deleted successfully');
      setDeleteConfirm(null);
      fetchAllPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Error deleting patient record');
    }
  };

  const getFormTypes = () => {
    const formTypes = [...new Set(allPatients.map(p => p.formType))];
    return formTypes.sort();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h2>
          <p className="text-gray-600">View, edit, and delete patient records</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-gray-500 text-sm">Total Records</p>
            <p className="text-3xl font-bold text-gray-900">{allPatients.length}</p>
          </div>
          
          <div className="card">
            <p className="text-gray-500 text-sm">Form Types</p>
            <p className="text-3xl font-bold text-gray-900">{getFormTypes().length}</p>
          </div>
          
          <div className="card">
            <p className="text-gray-500 text-sm">This Month</p>
            <p className="text-3xl font-bold text-gray-900">
              {allPatients.filter(p => {
                const created = new Date(p.createdAt);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Search Patient</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, hospital ID, or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="label">Filter by Form Type</label>
              <select
                value={filterForm}
                onChange={(e) => setFilterForm(e.target.value)}
                className="input"
              >
                <option value="all">All Forms</option>
                {getFormTypes().map(formType => (
                  <option key={formType} value={formType}>{formType}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Patient Records Table */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Patient Records</h3>
          
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading records...</p>
          ) : filteredPatients.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No patient records found.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {patient.data?.hospitalId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {patient.data?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {patient.formType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {patient.createdBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                          <button
                            onClick={() => navigate(`/patient/${patient.id}`)}
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1"
                            title="View"
                          >
                            <FaEye /> <span>View</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(patient.id)}
                            className="text-red-600 hover:text-red-800 inline-flex items-center space-x-1"
                            title="Delete"
                          >
                            <FaTrash /> <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Hospital ID</p>
                      <p className="font-semibold">{patient.data?.hospitalId || 'N/A'}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Patient Name</p>
                      <p className="font-semibold">{patient.data?.name || 'N/A'}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Form Type</p>
                      <p className="font-semibold">{patient.formType}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Created By</p>
                      <p className="font-semibold">{patient.createdBy}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/patient/${patient.id}`)}
                        className="flex-1 btn btn-secondary flex items-center justify-center space-x-1"
                      >
                        <FaEye /> <span>View</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(patient.id)}
                        className="flex-1 btn btn-danger flex items-center justify-center space-x-1"
                      >
                        <FaTrash /> <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Patient Record?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePatient(deleteConfirm)}
                className="flex-1 btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
