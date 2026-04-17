import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const LeprosyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    address: '',
    occupation: '',
    sex: '',
    age: '',
    religion: '',
    date: '',
    opNo: '',
    phNo: '',

    // Diagnosis at Presentation
    diagnosisAtPresentation: '',

    // Mode of Detection
    modeOfDetection: '',

    // Previous Treatment Details
    previousTreatmentDetails: '',

    // Patient Status
    patientStatus: '',

    // Contact History
    contactHistory: '',
    contactHistorySpecify: '',

    // Details of Household Contacts (table)
    householdContacts: [
      { slNo: '', name: '', sex: '', age: '', relationToPatient: '' }
    ],

    // History - Presenting Symptom
    presentingSymptom: '',
    hypopigmentedErythematousPatches: '',
    ulcerFormation: '',
    others: '',

    // Personal History
    profession: '',
    livingCondition: '',
    ses: '',
    diet: '',
    gynaecHistory: '',
    familyHistory: '',

    // Past History
    pastHistory: '',

    // General Physical Examination
    gait: '',
    ht: '',
    wt: '',

    // Local Examination - Skin Patches
    skinPatchesNumber: '',
    skinPatchesDescription: '',
    skinPatchesSensation: '',
    skinPatchesFeedingNerve: '',

    // Peripheral Nerve Examination (Right)
    peripheralNerveR: {
      supraOrbital: '',
      infraOrbital: '',
      postAuricular: '',
      supraCircular: '',
      greaterAuricular: '',
      radial: '',
      ulnar: '',
      median: '',
      radialCutaneous: '',
      commonPeroneal: '',
      posteriorTibial: '',
      suralNerve: ''
    },

    // Peripheral Nerve Examination (Left)
    peripheralNerveL: {
      supraOrbital: '',
      infraOrbital: '',
      postAuricular: '',
      supraCircular: '',
      greaterAuricular: '',
      radial: '',
      ulnar: '',
      median: '',
      radialCutaneous: '',
      commonPeroneal: '',
      posteriorTibial: '',
      suralNerve: ''
    },

    // Ridley-Jopling Classification
    ridleyJoplingClassification: '',

    // WHO Disability Grading
    whoDisabilityGrading: '',

    // Voluntary Muscle Testing - Right
    vmtRight: {
      orbicularisOculi: '',
      extensionWristJoint: '',
      flexionAbductorPollicisBrevis: '',
      backTest: '',
      lumbricalInterosseus: '',
      curlTestAnteriorInterosseus: '',
      dorsalInterosseus: '',
      dorsiflexorsAnkle: '',
      intrinsicMusclesFoot: ''
    },

    // Voluntary Muscle Testing - Left
    vmtLeft: {
      orbicularisOculi: '',
      extensionWristJoint: '',
      flexionAbductorPollicisBrevis: '',
      backTest: '',
      lumbricalInterosseus: '',
      curlTestAnteriorInterosseus: '',
      dorsalInterosseus: '',
      dorsiflexorsAnkle: '',
      intrinsicMusclesFoot: ''
    },

    // Sensory Examination
    sensoryExamination: '',

    // Systemic Examination  
    systemicExamination: '',

    // General Exam
    generalExam: '',

    // Result of S S S (Slit Skin Smear)
    resultOfSSS: '',

    // BI/MI (Bacterial Index / Morphological Index)
    biMi: '',

    // Histopathology
    histopathology: '',

    // Lepromin Test
    leprominTest: '',

    // Others
    investigationOthers: '',

    // Follow-up Notes
    followUpNotes: ''
  });

  useEffect(() => {
    if (id) {
      setEditMode(true);
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const docRef = demoMode ? mockDoc('patients', id) : doc(db, 'patients', id);
      const docSnap = demoMode ? await mockDb.getDoc(docRef) : await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData(data.data);
      } else {
        alert('Patient record not found');
        navigate(-1);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      alert('Error loading patient data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('peripheralNerveR.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        peripheralNerveR: {
          ...prev.peripheralNerveR,
          [field]: value
        }
      }));
    } else if (name.startsWith('peripheralNerveL.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        peripheralNerveL: {
          ...prev.peripheralNerveL,
          [field]: value
        }
      }));
    } else if (name.startsWith('vmtRight.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vmtRight: {
          ...prev.vmtRight,
          [field]: value
        }
      }));
    } else if (name.startsWith('vmtLeft.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vmtLeft: {
          ...prev.vmtLeft,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleHouseholdContactChange = (index, field, value) => {
    const newContacts = [...formData.householdContacts];
    newContacts[index][field] = value;
    setFormData(prev => ({
      ...prev,
      householdContacts: newContacts
    }));
  };

  const addHouseholdContact = () => {
    setFormData(prev => ({
      ...prev,
      householdContacts: [
        ...prev.householdContacts,
        { slNo: '', name: '', sex: '', age: '', relationToPatient: '' }
      ]
    }));
  };

  const removeHouseholdContact = (index) => {
    setFormData(prev => ({
      ...prev,
      householdContacts: prev.householdContacts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode && id) {
        const docRef = demoMode ? mockDoc('patients', id) : doc(db, 'patients', id);
        if (demoMode) {
          await mockDb.updateDoc(docRef, {
            data: formData,
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await updateDoc(docRef, {
            data: formData,
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        }
        alert('Patient record updated successfully!');
      } else {
        const newId = `patient-${Date.now()}`;
        const newDocRef = demoMode ? mockDoc('patients', newId) : doc(db, 'patients', newId);
        if (demoMode) {
          await mockDb.setDoc(newDocRef, {
            formType: 'Leprosy Case Sheet',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Leprosy Case Sheet',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        }
        alert('Patient record created successfully!');
      }
      
      navigate(-1);
    } catch (error) {
      console.error('Error saving patient data:', error);
      alert('Error saving patient data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary mb-3 sm:mb-4 flex items-center space-x-2 text-sm sm:text-base"
          >
            <FaArrowLeft /> <span>Back</span>
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-primary-600">
            <div className="flex items-center justify-center mb-2">
              <img src="/logo.png" alt="Logo" className="h-12 w-12 mr-3" onError={(e) => e.target.style.display = 'none'} />
              <div className="text-center">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  LEPROSY CASE SHEET
                </h1>
                <p className="text-center text-gray-600 text-sm mt-1">
                  Department of Dermatology, Venereology and Leprology
                </p>
                <p className="text-center text-gray-600 text-sm">
                  J.J.M. Medical College, Davangere - 577004
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  required
                />
              </div>

              <div>
                <label className="label">Age</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">OP No</label>
                <input
                  type="text"
                  name="opNo"
                  value={formData.opNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Ph. No</label>
                <input
                  type="tel"
                  name="phNo"
                  value={formData.phNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Clinical Status Section */}
          <div className="card">
            <h3 className="form-section-title">Clinical Status</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Diagnosis at Presentation</label>
                <input
                  type="text"
                  name="diagnosisAtPresentation"
                  value={formData.diagnosisAtPresentation}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Mode of Detection</label>
                <input
                  type="text"
                  name="modeOfDetection"
                  value={formData.modeOfDetection}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Contact Survey / Others/ Voluntary / Referred"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Previous Treatment Details</label>
                <textarea
                  name="previousTreatmentDetails"
                  value={formData.previousTreatmentDetails}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Patient Status</label>
                <textarea
                  name="patientStatus"
                  value={formData.patientStatus}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  placeholder="New/Release Post PB-MDT/Release Post MB-MDT Treatment after Default /Transferred in"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Contact History</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contactHistory"
                      value="Yes"
                      checked={formData.contactHistory === 'Yes'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="contactHistory"
                      value="No"
                      checked={formData.contactHistory === 'No'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
                {formData.contactHistory === 'Yes' && (
                  <div className="mt-2">
                    <label className="label text-sm">If yes Specify</label>
                    <input
                      type="text"
                      name="contactHistorySpecify"
                      value={formData.contactHistorySpecify}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details of Household Contacts */}
          <div className="card">
            <h3 className="form-section-title">Details of Household Contacts</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left w-16">Sl No.</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left w-24">Sex</th>
                    <th className="border border-gray-300 px-4 py-2 text-left w-24">Age</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Relation To Patient</th>
                    {canEdit && <th className="border border-gray-300 px-4 py-2 text-center w-24">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {formData.householdContacts.map((contact, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          value={contact.slNo}
                          onChange={(e) => handleHouseholdContactChange(index, 'slNo', e.target.value)}
                          className="input"
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) => handleHouseholdContactChange(index, 'name', e.target.value)}
                          className="input"
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <select
                          value={contact.sex}
                          onChange={(e) => handleHouseholdContactChange(index, 'sex', e.target.value)}
                          className="input"
                          disabled={!canEdit}
                        >
                          <option value="">-</option>
                          <option value="M">M</option>
                          <option value="F">F</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          value={contact.age}
                          onChange={(e) => handleHouseholdContactChange(index, 'age', e.target.value)}
                          className="input"
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          value={contact.relationToPatient}
                          onChange={(e) => handleHouseholdContactChange(index, 'relationToPatient', e.target.value)}
                          className="input"
                          disabled={!canEdit}
                        />
                      </td>
                      {canEdit && (
                        <td className="border border-gray-300 px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeHouseholdContact(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                            disabled={formData.householdContacts.length === 1}
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={addHouseholdContact}
                className="mt-3 btn btn-secondary text-sm"
              >
                Add Contact
              </button>
            )}
          </div>

          {/* History Section */}
          <div className="card">
            <h3 className="form-section-title">HISTORY</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">PRESENTING SYMPTOM:</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="label text-sm">Hypopigmented or Erythematous Patches</label>
                    <input
                      type="text"
                      name="hypopigmentedErythematousPatches"
                      value={formData.hypopigmentedErythematousPatches}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Ulcer Formation</label>
                    <input
                      type="text"
                      name="ulcerFormation"
                      value={formData.ulcerFormation}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Others</label>
                    <input
                      type="text"
                      name="others"
                      value={formData.others}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">PERSONAL HISTORY:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label text-sm">Profession</label>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Living Condition</label>
                    <input
                      type="text"
                      name="livingCondition"
                      value={formData.livingCondition}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">SES</label>
                    <input
                      type="text"
                      name="ses"
                      value={formData.ses}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Diet</label>
                    <input
                      type="text"
                      name="diet"
                      value={formData.diet}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Gynaec History</label>
                    <input
                      type="text"
                      name="gynaecHistory"
                      value={formData.gynaecHistory}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Family History</label>
                    <input
                      type="text"
                      name="familyHistory"
                      value={formData.familyHistory}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">PAST HISTORY</h4>
                <textarea
                  name="pastHistory"
                  value={formData.pastHistory}
                  onChange={handleInputChange}
                  className="input min-h-[80px]"
                  disabled={!canEdit}
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* General Physical Examination */}
          <div className="card">
            <h3 className="form-section-title">GENERAL PHYSICAL EXAMINATION</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="label">Gait</label>
                <input
                  type="text"
                  name="gait"
                  value={formData.gait}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Ht</label>
                <input
                  type="text"
                  name="ht"
                  value={formData.ht}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Wt</label>
                <input
                  type="text"
                  name="wt"
                  value={formData.wt}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-3">LOCAL EXAMINATION: Skin Patches</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold w-1/4">Number</td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          name="skinPatchesNumber"
                          value={formData.skinPatchesNumber}
                          onChange={handleInputChange}
                          className="input"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Description</td>
                      <td className="border border-gray-300 px-2 py-2">
                        <textarea
                          name="skinPatchesDescription"
                          value={formData.skinPatchesDescription}
                          onChange={handleInputChange}
                          className="input min-h-[60px]"
                          disabled={!canEdit}
                          rows="2"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Sensation</td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          name="skinPatchesSensation"
                          value={formData.skinPatchesSensation}
                          onChange={handleInputChange}
                          className="input"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Feeding Nerve</td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          name="skinPatchesFeedingNerve"
                          value={formData.skinPatchesFeedingNerve}
                          onChange={handleInputChange}
                          className="input"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Peripheral Nerve Examination */}
          <div className="card">
            <h3 className="form-section-title">PERIPHERAL NERVE EXAMINATION</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Nerve</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Right (R)</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Left (L)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Supra Orbital', key: 'supraOrbital' },
                    { label: 'Infra Orbital', key: 'infraOrbital' },
                    { label: 'Post Auricular', key: 'postAuricular' },
                    { label: 'Supra Clavicular', key: 'supraClavicular' },
                    { label: 'Greater Auricular', key: 'greaterAuricular' },
                    { label: 'Radial', key: 'radial' },
                    { label: 'Ulnar', key: 'ulnar' },
                    { label: 'Median', key: 'median' },
                    { label: 'Radial Cutaneous', key: 'radialCutaneous' },
                    { label: 'Common Peroneal', key: 'commonPeroneal' },
                    { label: 'Posterior Tibial', key: 'posteriorTibial' },
                    { label: 'Sural Nerve', key: 'suralNerve' }
                  ].map((nerve) => (
                    <tr key={nerve.key}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{nerve.label}</td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          name={`peripheralNerveR.${nerve.key}`}
                          value={formData.peripheralNerveR[nerve.key]}
                          onChange={handleInputChange}
                          className="input text-center"
                          placeholder="Pain/Thick/Tender"
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          name={`peripheralNerveL.${nerve.key}`}
                          value={formData.peripheralNerveL[nerve.key]}
                          onChange={handleInputChange}
                          className="input text-center"
                          placeholder="Pain/Thick/Tender"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-3 bg-gray-50 rounded text-xs">
              <p className="font-semibold mb-1">Grading Guide:</p>
              <p><strong>Pain:</strong> 0=No pain, 1=Mild, 2=Moderate, 3=Severe</p>
              <p><strong>Thickness:</strong> 0=Not palpable, 1=Palpable, 2=Enlarged, 3=Markedly enlarged</p>
              <p><strong>Tenderness:</strong> 0=No tenderness, 1=Mild, 2=Moderate, 3=Severe</p>
            </div>
          </div>

          {/* Ridley-Jopling Classification with Image */}
          <div className="card">
            <h3 className="form-section-title">RIDLEY-JOPLING CLASSIFICATION</h3>
            <div className="mb-4">
              <img src="/image/r2.webp" alt="Ridley-Jopling Classification" className="w-full max-w-4xl mx-auto rounded-lg shadow-md" />
            </div>
            <div>
              <label className="label">Classification</label>
              <input
                type="text"
                name="ridleyJoplingClassification"
                value={formData.ridleyJoplingClassification}
                onChange={handleInputChange}
                className="input"
                placeholder="TT / BT / BB / BL / LL / I"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* WHO Disability Grading */}
          <div className="card">
            <h3 className="form-section-title">WHO DISABILITY GRADING</h3>
            <div>
              <label className="label">WHO Disability Grade</label>
              <input
                type="text"
                name="whoDisabilityGrading"
                value={formData.whoDisabilityGrading}
                onChange={handleInputChange}
                className="input"
                placeholder="Grade 0, 1, or 2"
                disabled={!canEdit}
              />
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded text-sm space-y-2">
              <div>
                <p className="font-semibold">Grade 0:</p>
                <p className="ml-4">No anaesthesia, no visible deformity or damage</p>
              </div>
              <div>
                <p className="font-semibold">Grade 1:</p>
                <p className="ml-4">Anaesthesia present but no visible deformity or damage</p>
              </div>
              <div>
                <p className="font-semibold">Grade 2:</p>
                <p className="ml-4">Visible deformity or damage present</p>
                <ul className="ml-8 list-disc">
                  <li>Eyes: Lagophthalmos, iridocyclitis, corneal opacity, severe visual impairment (vision less than 6/60; Cannot count fingers at 6 meters)</li>
                  <li>Hands: Ulcers, wounds, tissue loss, shortening; Wrist drop, claw hand, intrinsic muscle wasting</li>
                  <li>Feet: Ulcers, wounds, tissue loss, shortening; Foot drop, claw toes, intrinsic muscle wasting</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Voluntary Muscle Testing (VMT) */}
          <div className="card">
            <h3 className="form-section-title">VOLUNTARY MUSCLE TESTING (VMT)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Muscle/Test</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Right</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Left</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Orbicularis Oculi', key: 'orbicularisOculi' },
                    { label: 'Extension of Wrist Joint', key: 'extensionWristJoint' },
                    { label: 'Flexion of Abductor Pollicis Brevis', key: 'flexionAbductorPollicisBrevis' },
                    { label: 'Back Test', key: 'backTest' },
                    { label: 'Lumbrical & Interosseus', key: 'lumbricalInterosseus' },
                    { label: 'Curl Test (Anterior Interosseus)', key: 'curlTestAnteriorInterosseus' },
                    { label: 'Dorsal Interosseus', key: 'dorsalInterosseus' },
                    { label: 'Dorsiflexors of Ankle', key: 'dorsiflexorsAnkle' },
                    { label: 'Intrinsic Muscles of Foot', key: 'intrinsicMusclesFoot' }
                  ].map((muscle) => (
                    <tr key={muscle.key}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{muscle.label}</td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          name={`vmtRight.${muscle.key}`}
                          value={formData.vmtRight[muscle.key]}
                          onChange={handleInputChange}
                          className="input text-center"
                          placeholder="0-5"
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          name={`vmtLeft.${muscle.key}`}
                          value={formData.vmtLeft[muscle.key]}
                          onChange={handleInputChange}
                          className="input text-center"
                          placeholder="0-5"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-3 bg-gray-50 rounded text-xs space-y-1">
              <p className="font-semibold mb-2">VMT Grading (0-5 Scale):</p>
              <p><strong>0:</strong> No contraction (paralysis)</p>
              <p><strong>1:</strong> Flicker or trace contraction (No movement)</p>
              <p><strong>2:</strong> Active movement, gravity eliminated</p>
              <p><strong>3:</strong> Active movement against gravity</p>
              <p><strong>4:</strong> Active movement against gravity and resistance</p>
              <p><strong>5:</strong> Normal power</p>
            </div>
          </div>

          {/* Sensory Examination */}
          <div className="card">
            <h3 className="form-section-title">SENSORY EXAMINATION</h3>
            <textarea
              name="sensoryExamination"
              value={formData.sensoryExamination}
              onChange={handleInputChange}
              className="input min-h-[80px]"
              placeholder="Touch, pain, temperature sensation"
              disabled={!canEdit}
              rows="3"
            />
          </div>

          {/* Systemic Examination */}
          <div className="card">
            <h3 className="form-section-title">SYSTEMIC EXAMINATION</h3>
            <textarea
              name="systemicExamination"
              value={formData.systemicExamination}
              onChange={handleInputChange}
              className="input min-h-[80px]"
              placeholder="CVS, RS, P/A, CNS"
              disabled={!canEdit}
              rows="3"
            />
          </div>

          {/* General Exam */}
          <div className="card">
            <h3 className="form-section-title">GENERAL EXAMINATION</h3>
            <textarea
              name="generalExam"
              value={formData.generalExam}
              onChange={handleInputChange}
              className="input min-h-[80px]"
              disabled={!canEdit}
              rows="3"
            />
          </div>

          {/* Leprosy Manifestations Image */}
          <div className="card">
            <h3 className="form-section-title">LEPROSY MANIFESTATIONS</h3>
            <div>
              <img src="/image/n2.jpg" alt="Leprosy Manifestations Chart" className="w-full max-w-4xl mx-auto rounded-lg shadow-md" />
            </div>
          </div>

          {/* Investigations */}
          <div className="card">
            <h3 className="form-section-title">INVESTIGATIONS</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Result of SSS (Slit Skin Smear)</label>
                <textarea
                  name="resultOfSSS"
                  value={formData.resultOfSSS}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">BI / MI (Bacteriological Index / Morphological Index)</label>
                <input
                  type="text"
                  name="biMi"
                  value={formData.biMi}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., BI: 3+, MI: 10%"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Histopathology</label>
                <textarea
                  name="histopathology"
                  value={formData.histopathology}
                  onChange={handleInputChange}
                  className="input min-h-[80px]"
                  disabled={!canEdit}
                  rows="3"
                />
              </div>

              <div>
                <label className="label">Lepromin Test</label>
                <input
                  type="text"
                  name="leprominTest"
                  value={formData.leprominTest}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Positive/Negative"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Others</label>
                <textarea
                  name="investigationOthers"
                  value={formData.investigationOthers}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Follow-up Notes */}
          <div className="card">
            <h3 className="form-section-title">FOLLOW-UP NOTES</h3>
            <textarea
              name="followUpNotes"
              value={formData.followUpNotes}
              onChange={handleInputChange}
              className="input min-h-[100px]"
              disabled={!canEdit}
              rows="4"
            />
          </div>


          {/* Submit Button */}
          {canEdit && (
            <div className="flex justify-center pb-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex items-center space-x-2 px-8 py-3"
              >
                <FaSave />
                <span>{loading ? 'Saving...' : (editMode ? 'Update Patient' : 'Save Patient')}</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LeprosyForm;