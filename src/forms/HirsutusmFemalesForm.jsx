import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const HirsutusmFemalesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    date: '',
    ipNo: '',
    name: '',
    age: '',
    dateOfRecording: '',
    address: '',
    phNo: '',
    occupation: '',
    
    // Presenting Complaints
    presentingComplaints: '',
    history: '',
    duration: '',
    distribution: '',
    
    // Accompanying Diseases or Symptoms
    accompanyingDiseases: {
      acne: false,
      dm: false,
      stress: false,
      skinTag: false,
      acanthosisNigricans: false,
      hairFall: false,
      thyroid: false,
      menstruation: false,
      obesity: false,
      hoLocalApplications: false,
      corticosteroids: false,
      hoOralDrugsOcps: false,
      obstetricHistory: false
    },
    
    // Infertility
    infertility: '',
    
    // Family History
    familyHistory: '',
    
    // Physical and Topical Measures
    physicalMeasures: {
      plucking: false,
      shaving: false,
      bleaching: false,
      waxing: false,
      depilatoryCream: false
    },
    
    // Past History
    pastHistory: '',
    
    // Examination
    examination: '',
    
    // Blood Investigation
    bloodInvestigation: {
      testosterone: '',
      lh: '',
      fsh: '',
      serumProlactin: '',
      dheasLevel: '',
      t3: '',
      t4: '',
      tsh: '',
      fastingGlucose: '',
      fastingLipidProfile: '',
      others: ''
    },
    
    // Treatment Modality
    treatmentModality: {
      oralDrugs: '',
      topical: '',
      interventionalIpl: ''
    },
    
    // Follow-up
    followUp: []
  });

  useEffect(() => {
    if (id) {
      fetchPatientData();
    } else {
      setEditMode(true);
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const patientDoc = demoMode
        ? await mockDb.getDoc(mockDoc('patients', id))
        : await getDoc(doc(db, 'patients', id));

      if (patientDoc.exists()) {
        const data = patientDoc.data();
        if (data.data) {
          setFormData(data.data);
        }
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (category, field) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field]
      }
    }));
  };

  const handleBloodInvestigationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      bloodInvestigation: {
        ...prev.bloodInvestigation,
        [field]: value
      }
    }));
  };

  const handleTreatmentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      treatmentModality: {
        ...prev.treatmentModality,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert('Please enter patient name');
      return;
    }

    setLoading(true);
    try {
      const patientData = {
        formType: 'Study of Hirsutism in Females',
        createdBy: currentUser?.email || 'demo-user',
        createdAt: id ? formData.createdAt : new Date().toISOString(),
        lastModifiedAt: new Date().toISOString(),
        data: formData
      };

      if (demoMode) {
        if (id) {
          mockDb.updateDoc(mockDoc('patients', id), patientData);
        } else {
          const newId = `patient-${Date.now()}`;
          mockDb.setDoc(mockDoc('patients', newId), patientData);
          alert('Patient record saved successfully!');
          navigate(`/patient/${newId}`);
        }
      } else {
        if (id) {
          await updateDoc(doc(db, 'patients', id), patientData);
        } else {
          const newDocRef = doc(db, 'patients', `${currentUser.uid}-${Date.now()}`);
          await setDoc(newDocRef, patientData);
          alert('Patient record saved successfully!');
          navigate(`/patient/${newDocRef.id}`);
        }
      }
      setEditMode(false);
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Error saving form. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <FaArrowLeft /> <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Study of Hirsutism in Females</h1>
          </div>
          {canEdit && editMode && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary flex items-center space-x-2"
            >
              <FaSave /> <span>{loading ? 'Saving...' : 'Save'}</span>
            </button>
          )}
        </div>

        {/* Basic Information Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Patient Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IP No.</label>
              <input
                type="text"
                name="ipNo"
                value={formData.ipNo}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Recording</label>
              <input
                type="date"
                name="dateOfRecording"
                value={formData.dateOfRecording}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone No.</label>
              <input
                type="tel"
                name="phNo"
                value={formData.phNo}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Presenting Complaints */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Presenting Complaints</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Presenting Complaints</label>
              <textarea
                name="presentingComplaints"
                value={formData.presentingComplaints}
                onChange={handleInputChange}
                disabled={!editMode}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">History</label>
              <textarea
                name="history"
                value={formData.history}
                onChange={handleInputChange}
                disabled={!editMode}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distribution</label>
                <input
                  type="text"
                  name="distribution"
                  value={formData.distribution}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Accompanying Diseases */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Accompanying Diseases or Symptoms</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(formData.accompanyingDiseases).map(key => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={formData.accompanyingDiseases[key]}
                  onChange={() => handleCheckboxChange('accompanyingDiseases', key)}
                  disabled={!editMode}
                  className="w-4 h-4"
                />
                <label htmlFor={key} className="ml-2 text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Blood Investigation */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Blood Investigation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Testosterone</label>
              <input
                type="text"
                value={formData.bloodInvestigation.testosterone}
                onChange={(e) => handleBloodInvestigationChange('testosterone', e.target.value)}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LH</label>
              <input
                type="text"
                value={formData.bloodInvestigation.lh}
                onChange={(e) => handleBloodInvestigationChange('lh', e.target.value)}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FSH</label>
              <input
                type="text"
                value={formData.bloodInvestigation.fsh}
                onChange={(e) => handleBloodInvestigationChange('fsh', e.target.value)}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serum Prolactin</label>
              <input
                type="text"
                value={formData.bloodInvestigation.serumProlactin}
                onChange={(e) => handleBloodInvestigationChange('serumProlactin', e.target.value)}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DHEAS Level</label>
              <input
                type="text"
                value={formData.bloodInvestigation.dheasLevel}
                onChange={(e) => handleBloodInvestigationChange('dheasLevel', e.target.value)}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TSH</label>
              <input
                type="text"
                value={formData.bloodInvestigation.tsh}
                onChange={(e) => handleBloodInvestigationChange('tsh', e.target.value)}
                disabled={!editMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Reference Image</h2>
          <div className="flex justify-center">
            <img 
              src="/image/image 111.gif" 
              alt="Hirsutism Reference Chart" 
              className="w-full max-w-2xl border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Follow-up Table */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Follow-up</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Sitting</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Dose</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Improvement</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Side Effects (S/E)</th>
                </tr>
              </thead>
              <tbody>
                {formData.followUp && formData.followUp.length > 0 ? (
                  formData.followUp.map((row, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode ? (
                          <input
                            type="date"
                            value={row.date || ''}
                            onChange={(e) => {
                              const updated = [...formData.followUp];
                              updated[index].date = e.target.value;
                              setFormData(prev => ({ ...prev, followUp: updated }));
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          row.date
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode ? (
                          <input
                            type="text"
                            value={row.sitting || ''}
                            onChange={(e) => {
                              const updated = [...formData.followUp];
                              updated[index].sitting = e.target.value;
                              setFormData(prev => ({ ...prev, followUp: updated }));
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          row.sitting
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode ? (
                          <input
                            type="text"
                            value={row.dose || ''}
                            onChange={(e) => {
                              const updated = [...formData.followUp];
                              updated[index].dose = e.target.value;
                              setFormData(prev => ({ ...prev, followUp: updated }));
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          row.dose
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode ? (
                          <input
                            type="text"
                            value={row.improvement || ''}
                            onChange={(e) => {
                              const updated = [...formData.followUp];
                              updated[index].improvement = e.target.value;
                              setFormData(prev => ({ ...prev, followUp: updated }));
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          row.improvement
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editMode ? (
                          <input
                            type="text"
                            value={row.sideEffects || ''}
                            onChange={(e) => {
                              const updated = [...formData.followUp];
                              updated[index].sideEffects = e.target.value;
                              setFormData(prev => ({ ...prev, followUp: updated }));
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          row.sideEffects
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      No follow-up records added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {editMode && (
            <button
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  followUp: [...(prev.followUp || []), { date: '', sitting: '', dose: '', improvement: '', sideEffects: '' }]
                }));
              }}
              className="mt-4 btn btn-primary"
            >
              Add Follow-up Row
            </button>
          )}
        </div>

        {/* Edit/View Toggle */}
        {canEdit && !editMode && (
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={() => setEditMode(true)}
              className="btn btn-primary"
            >
              Edit Form
            </button>
          </div>
        )}

        {editMode && (
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary flex items-center space-x-2"
            >
              <FaSave /> <span>{loading ? 'Saving...' : 'Save Form'}</span>
            </button>
            <button
              onClick={() => {
                if (id) {
                  setEditMode(false);
                } else {
                  navigate(-1);
                }
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HirsutusmFemalesForm;
