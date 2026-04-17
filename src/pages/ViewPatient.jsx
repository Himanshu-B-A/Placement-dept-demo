import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaArrowLeft, FaEdit, FaPrint } from 'react-icons/fa';

const ViewPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || userRole === 'admin';
  const canPrint = userRole === 'faculty' || userRole === 'hod' || userRole === 'admin';

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const docRef = doc(db, 'patients', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPatient({
          id: docSnap.id,
          ...data
        });
      } else {
        alert('Patient record not found');
        navigate(-1);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      alert('Error loading patient data');
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-600">Patient not found</p>
        </div>
      </div>
    );
  }

  const data = patient.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
        {/* Header Actions */}
        <div className="mb-6 flex justify-between items-center print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <FaArrowLeft /> <span>Back</span>
          </button>
          <div className="space-x-3">
            {canPrint && (
              <button
                onClick={handlePrint}
                className="btn btn-secondary flex items-center space-x-2 inline-flex"
              >
                <FaPrint /> <span>Print</span>
              </button>
            )}
            {canEdit && (
              <button
                onClick={() => navigate(`/forms/acne-proforma/${id}`)}
                className="btn btn-primary flex items-center space-x-2 inline-flex"
              >
                <FaEdit /> <span>Edit Record</span>
              </button>
            )}
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-lg shadow-md p-8 print:shadow-none">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-primary-600 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Department of Dermatology, Venereology & Leprosy
            </h1>
            <h2 className="text-lg text-gray-600">J.J.M.M. Medical College, Davangere - 577 004</h2>
            <h3 className="text-xl font-semibold text-primary-600 mt-2">ACNE PROFORMA</h3>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg print:bg-white">
            <div>
              <p className="text-sm text-gray-600">Created By:</p>
              <p className="font-medium">{patient.createdBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created At:</p>
              <p className="font-medium">{new Date(patient.createdAt).toLocaleString()}</p>
            </div>
            {patient.lastModifiedBy && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Last Modified By:</p>
                  <p className="font-medium">{patient.lastModifiedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Modified At:</p>
                  <p className="font-medium">{new Date(patient.lastModifiedAt).toLocaleString()}</p>
                </div>
              </>
            )}
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Hospital ID:</p>
                <p className="font-medium">{data.hospitalId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name:</p>
                <p className="font-medium">{data.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age:</p>
                <p className="font-medium">{data.age || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sex:</p>
                <p className="font-medium">{data.sex || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone:</p>
                <p className="font-medium">{data.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Occupation:</p>
                <p className="font-medium">{data.occupation || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Presenting Complaints */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Presenting Complaints</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Skin Lesions Over:</p>
                <p className="font-medium">{data.skinLesionsOver || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Scarring Over Face:</p>
                <p className="font-medium">{data.scarringOverFace || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">History of Presenting Complaints</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Duration:</p>
                <p className="font-medium">{data.duration || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Age of Onset:</p>
                <p className="font-medium">{data.ageOfOnset || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nature of Skin:</p>
                <p className="font-medium">{data.natureOfSkin || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Physical Examination */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">General Physical Examination</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">BP:</p>
                <p className="font-medium">{data.bp || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pulse:</p>
                <p className="font-medium">{data.pulse || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Height:</p>
                <p className="font-medium">{data.height || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Weight:</p>
                <p className="font-medium">{data.weight || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Acne Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Extent and Distribution of Acne Lesions</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Site:</p>
                <p className="font-medium">{data.site || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lesions Type:</p>
                <p className="font-medium">{data.lesionsType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Grade of Acne:</p>
                <p className="font-medium">{data.gradeOfAcne || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Cardiff Index */}
          {data.cardiffIndex && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Cardiff Acne Disability Index</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Q1:</strong> {data.cardiffIndex.q1 || 'Not answered'}</p>
                <p><strong>Q2:</strong> {data.cardiffIndex.q2 || 'Not answered'}</p>
                <p><strong>Q3:</strong> {data.cardiffIndex.q3 || 'Not answered'}</p>
                <p><strong>Q4:</strong> {data.cardiffIndex.q4 || 'Not answered'}</p>
                <p><strong>Q5:</strong> {data.cardiffIndex.q5 || 'Not answered'}</p>
              </div>
            </div>
          )}

          {/* Global Acne Grading */}
          {data.globalGradingSystem && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Global Acne Grading System</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Forehead:</p>
                  <p className="font-medium">{data.globalGradingSystem.forehead || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Right Cheek:</p>
                  <p className="font-medium">{data.globalGradingSystem.rightCheek || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Left Cheek:</p>
                  <p className="font-medium">{data.globalGradingSystem.leftCheek || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Nose:</p>
                  <p className="font-medium">{data.globalGradingSystem.nose || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Chin:</p>
                  <p className="font-medium">{data.globalGradingSystem.chin || '0'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Chest/Upper Back:</p>
                  <p className="font-medium">{data.globalGradingSystem.chestUpperBack || '0'}</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded">
                <p className="text-sm"><strong>Global Score:</strong> {data.globalScore || 'Not calculated'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPatient;
