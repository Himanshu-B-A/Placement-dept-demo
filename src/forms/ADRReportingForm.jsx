import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const ADRReportingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // AMC/NCC Use only
    amcReportNo: '',
    worldwideUniqueNo: '',

    // A. Patient Information
    patientInitials: '',
    ageAtEvent: '',
    dateOfBirth: '',
    sex: '',
    weightKg: '',

    // B. Suspected Adverse Reaction
    dateReactionStarted: '',
    dateOfRecovery: '',
    describeReaction: '',

    // 12. Relevant tests
    relevantTests: '',

    // 13. Other relevant history
    otherRelevantHistory: '',

    // 14. Seriousness of the reaction
    seriousness: {
      death: false,
      deathDate: '',
      lifeThreatening: false,
      hospitalizationInitial: false,
      hospitalizationProlonged: false,
      disability: false,
      congenitalAnomaly: false,
      requiredIntervention: false,
      preventPermanentImpairment: false,
      other: false,
      otherSpecify: ''
    },

    // 15. Outcomes
    outcome: {
      fatal: false,
      recovering: false,
      unknown: false,
      continuing: false,
      recovered: false,
      other: false,
      otherSpecify: ''
    },

    // C. Suspected Medication(s)
    suspectedMedications: [],

    // 9. Reaction abated after drug stopped or dose reduced
    reactionAbated: [],

    // 10. Reaction reappeared after reintroduction
    reactionReappeared: [],

    // 11. Concomitant medical products
    concomitantMedicalProducts: '',

    // D. Reporter
    reporter: {
      name: '',
      professionalAddress: '',
      pinCode: '',
      email: '',
      telNo: '',
      signature: '',
      occupation: '',
      causalityAssessment: ''
    },

    // 18. Date of this report
    dateOfReport: ''
  });

  useEffect(() => {
    if (id) {
      setEditMode(true);
      fetchPatientData();
    } else {
      // Initialize with one empty medication
      setFormData(prev => ({
        ...prev,
        suspectedMedications: [{ 
          slNo: 1,
          brandName: '', 
          genericName: '', 
          batchNo: '', 
          lotNo: '', 
          expDate: '', 
          dose: '', 
          route: '', 
          frequency: '', 
          dateStarted: '', 
          dateStopped: '', 
          duration: '',
          reasonForUse: '', 
          prescribedFor: '' 
        }],
        reactionAbated: [{ slNo: 1, yes: false, no: false, unknown: false, na: false, reducedDose: '' }],
        reactionReappeared: [{ slNo: 1, yes: false, no: false, unknown: false, na: false, reintroducedDose: '' }]
      }));
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const docRef = doc(db, 'patients', id);
      const docSnap = await getDoc(docRef);
      
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

  const handleInputChange = (e, section = null) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [name]: inputValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: inputValue
      }));
    }
  };

  const addMedication = () => {
    const newSlNo = formData.suspectedMedications.length + 1;
    setFormData(prev => ({
      ...prev,
      suspectedMedications: [
        ...(prev.suspectedMedications || []),
        { 
          slNo: newSlNo,
          brandName: '', 
          genericName: '', 
          batchNo: '', 
          lotNo: '', 
          expDate: '', 
          dose: '', 
          route: '', 
          frequency: '', 
          dateStarted: '', 
          dateStopped: '', 
          duration: '',
          reasonForUse: '', 
          prescribedFor: '' 
        }
      ],
      reactionAbated: [
        ...(prev.reactionAbated || []),
        { slNo: newSlNo, yes: false, no: false, unknown: false, na: false, reducedDose: '' }
      ],
      reactionReappeared: [
        ...(prev.reactionReappeared || []),
        { slNo: newSlNo, yes: false, no: false, unknown: false, na: false, reintroducedDose: '' }
      ]
    }));
  };

  const removeMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      suspectedMedications: prev.suspectedMedications.filter((_, i) => i !== index),
      reactionAbated: prev.reactionAbated.filter((_, i) => i !== index),
      reactionReappeared: prev.reactionReappeared.filter((_, i) => i !== index)
    }));
  };

  const updateMedication = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      suspectedMedications: prev.suspectedMedications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const updateReactionAbated = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      reactionAbated: prev.reactionAbated.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateReactionReappeared = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      reactionReappeared: prev.reactionReappeared.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
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
        alert('ADR Report updated successfully!');
      } else {
        const newId = `patient-${Date.now()}`;
        const newDocRef = demoMode ? mockDoc('patients', newId) : doc(db, 'patients', newId);
        if (demoMode) {
          await mockDb.setDoc(newDocRef, {
            formType: 'ADR Report',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'ADR Report',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        }
        alert('ADR Report created successfully!');
      }
      
      navigate(-1);
    } catch (error) {
      console.error('Error saving ADR report:', error);
      alert('Error saving ADR report. Please try again.');
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
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Department of Dermatology, Venereology & Leprosy
            </h1>
            <h2 className="text-sm sm:text-base lg:text-lg text-gray-600">J.J.M. Medical College, Davangere - 577 004</h2>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-primary-600 mt-2">
              SUSPECTED ADVERSE DRUG REACTION REPORTING FORM
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              For Voluntary reporting of Adverse Drug Reactions by healthcare professionals
            </p>
            <p className="text-xs text-gray-500 mt-2">
              CDSCO - Central Drugs Standard Control Organisation<br />
              Directorate General of Health Services<br />
              Ministry of Health & Family Welfare, Government of India
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* AMC/NCC Use Only */}
          <div className="card bg-yellow-50 border-yellow-200">
            <h3 className="form-section-title text-yellow-800">AMC / NCC Use only</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">AMC Report No.</label>
                <input
                  type="text"
                  name="amcReportNo"
                  value={formData.amcReportNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Worldwide Unique No.</label>
                <input
                  type="text"
                  name="worldwideUniqueNo"
                  value={formData.worldwideUniqueNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* A. Patient Information */}
          <div className="card">
            <h3 className="form-section-title">A. Patient Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">1. Patient Initials</label>
                <input
                  type="text"
                  name="patientInitials"
                  value={formData.patientInitials}
                  onChange={handleInputChange}
                  className="input"
                  maxLength="3"
                  placeholder="e.g., ABC"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">2. Age at time of Event</label>
                <input
                  type="number"
                  name="ageAtEvent"
                  value={formData.ageAtEvent}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Or Date of birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">3. Sex</label>
                <div className="flex items-center space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sex"
                      value="M"
                      checked={formData.sex === 'M'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">M</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sex"
                      value="F"
                      checked={formData.sex === 'F'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">F</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="label">4. Weight (Kgs)</label>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleInputChange}
                  className="input"
                  step="0.1"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* B. Suspected Adverse Reaction */}
          <div className="card">
            <h3 className="form-section-title">B. Suspected Adverse Reaction</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">5. Date of reaction started (dd/mm/yy)</label>
                <input
                  type="date"
                  name="dateReactionStarted"
                  value={formData.dateReactionStarted}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">6. Date of recovery (dd/mm/yy)</label>
                <input
                  type="date"
                  name="dateOfRecovery"
                  value={formData.dateOfRecovery}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
            <div>
              <label className="label">7. Describe reaction or problem</label>
              <textarea
                name="describeReaction"
                value={formData.describeReaction}
                onChange={handleInputChange}
                className="input"
                rows="4"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Tests and History */}
          <div className="card">
            <h3 className="form-section-title">Relevant Tests & History</h3>
            <div className="space-y-4">
              <div>
                <label className="label">12. Relevant tests / Laboratory data with dates</label>
                <textarea
                  name="relevantTests"
                  value={formData.relevantTests}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">13. Other relevant history, Including pre-existing medical conditions (e.g., Allergies, race, pregnancy, smoking, alcohol use, hepatic / renal dysfunction, etc.)</label>
                <textarea
                  name="otherRelevantHistory"
                  value={formData.otherRelevantHistory}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* 14. Seriousness of the reaction */}
          <div className="card">
            <h3 className="form-section-title">14. Seriousness of the reaction</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="death"
                    checked={formData.seriousness?.death || false}
                    onChange={(e) => handleInputChange(e, 'seriousness')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Death (dd/mm/yy)</span>
                </label>
                {formData.seriousness?.death && (
                  <input
                    type="date"
                    name="deathDate"
                    value={formData.seriousness?.deathDate || ''}
                    onChange={(e) => handleInputChange(e, 'seriousness')}
                    className="input ml-6"
                    disabled={!canEdit}
                  />
                )}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="lifeThreatening"
                    checked={formData.seriousness?.lifeThreatening || false}
                    onChange={(e) => handleInputChange(e, 'seriousness')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Life threatening</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hospitalizationInitial"
                    checked={formData.seriousness?.hospitalizationInitial || false}
                    onChange={(e) => handleInputChange(e, 'seriousness')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Hospitalization - initial</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hospitalizationProlonged"
                    checked={formData.seriousness?.hospitalizationProlonged || false}
                    onChange={(e) => handleInputChange(e, 'seriousness')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">or prolonged</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="disability"
                    checked={formData.seriousness?.disability || false}
                    onChange={(e) => handleInputChange(e, 'seriousness')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Disability</span>
                </label>
              </div>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="congenitalAnomaly"
                    checked={formData.seriousness?.congenitalAnomaly || false}
                    onChange={(e) => handleInputChange(e, 'seriousness')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Congenital anomaly</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="requiredIntervention"
                    checked={formData.seriousness?.requiredIntervention || false}
                    onChange={(e) => handleInputChange(e, 'seriousness')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Required intervention</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="preventPermanentImpairment"
                    checked={formData.seriousness?.preventPermanentImpairment || false}
                    onChange={(e) => handleInputChange(e, 'seriousness')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">to prevent permanent impairment/damage</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="other"
                    checked={formData.seriousness?.other || false}
                    onChange={(e) => handleInputChange(e, 'seriousness')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Other (specify)</span>
                </label>
                {formData.seriousness?.other && (
                  <input
                    type="text"
                    name="otherSpecify"
                    value={formData.seriousness?.otherSpecify || ''}
                    onChange={(e) => handleInputChange(e, 'seriousness')}
                    className="input ml-6"
                    disabled={!canEdit}
                  />
                )}
              </div>
            </div>
          </div>

          {/* 15. Outcomes */}
          <div className="card">
            <h3 className="form-section-title">15. Outcomes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="fatal"
                  checked={formData.outcome?.fatal || false}
                  onChange={(e) => handleInputChange(e, 'outcome')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <span className="text-sm">Fatal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="recovering"
                  checked={formData.outcome?.recovering || false}
                  onChange={(e) => handleInputChange(e, 'outcome')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <span className="text-sm">Recovering</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="unknown"
                  checked={formData.outcome?.unknown || false}
                  onChange={(e) => handleInputChange(e, 'outcome')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <span className="text-sm">Unknown</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="continuing"
                  checked={formData.outcome?.continuing || false}
                  onChange={(e) => handleInputChange(e, 'outcome')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <span className="text-sm">Continuing</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="recovered"
                  checked={formData.outcome?.recovered || false}
                  onChange={(e) => handleInputChange(e, 'outcome')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <span className="text-sm">Recovered</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="other"
                  checked={formData.outcome?.other || false}
                  onChange={(e) => handleInputChange(e, 'outcome')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <span className="text-sm">Other</span>
              </label>
            </div>
            {formData.outcome?.other && (
              <div className="mt-3">
                <input
                  type="text"
                  name="otherSpecify"
                  value={formData.outcome?.otherSpecify || ''}
                  onChange={(e) => handleInputChange(e, 'outcome')}
                  className="input"
                  placeholder="Specify other outcome"
                  disabled={!canEdit}
                />
              </div>
            )}
          </div>

          {/* C. Suspected Medication(s) */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="form-section-title mb-0">C. Suspected Medication(s)</h3>
              {canEdit && (
                <button
                  type="button"
                  onClick={addMedication}
                  className="btn btn-primary text-sm py-2 px-4"
                >
                  + Add Medication
                </button>
              )}
            </div>

            {formData.suspectedMedications?.length > 0 ? (
              <div className="space-y-6">
                {formData.suspectedMedications.map((med, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-700">Medication {med.slNo}</h4>
                      {canEdit && formData.suspectedMedications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="label text-xs">Name (Brand and / or Generic Name)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={med.brandName}
                            onChange={(e) => updateMedication(index, 'brandName', e.target.value)}
                            className="input text-sm"
                            placeholder="Brand Name"
                            disabled={!canEdit}
                          />
                          <input
                            type="text"
                            value={med.genericName}
                            onChange={(e) => updateMedication(index, 'genericName', e.target.value)}
                            className="input text-sm"
                            placeholder="Generic Name"
                            disabled={!canEdit}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="label text-xs">Batch No.</label>
                        <input
                          type="text"
                          value={med.batchNo}
                          onChange={(e) => updateMedication(index, 'batchNo', e.target.value)}
                          className="input text-sm"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Lot No.</label>
                        <input
                          type="text"
                          value={med.lotNo}
                          onChange={(e) => updateMedication(index, 'lotNo', e.target.value)}
                          className="input text-sm"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Exp. Date (if known)</label>
                        <input
                          type="date"
                          value={med.expDate}
                          onChange={(e) => updateMedication(index, 'expDate', e.target.value)}
                          className="input text-sm"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Dose</label>
                        <input
                          type="text"
                          value={med.dose}
                          onChange={(e) => updateMedication(index, 'dose', e.target.value)}
                          className="input text-sm"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Route used</label>
                        <input
                          type="text"
                          value={med.route}
                          onChange={(e) => updateMedication(index, 'route', e.target.value)}
                          className="input text-sm"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Frequency</label>
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          className="input text-sm"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Date started</label>
                        <input
                          type="date"
                          value={med.dateStarted}
                          onChange={(e) => updateMedication(index, 'dateStarted', e.target.value)}
                          className="input text-sm"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Date stopped</label>
                        <input
                          type="date"
                          value={med.dateStopped}
                          onChange={(e) => updateMedication(index, 'dateStopped', e.target.value)}
                          className="input text-sm"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Duration (if unknown)</label>
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                          className="input text-sm"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Reason for use</label>
                        <input
                          type="text"
                          value={med.reasonForUse}
                          onChange={(e) => updateMedication(index, 'reasonForUse', e.target.value)}
                          className="input text-sm"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Prescribed for</label>
                        <input
                          type="text"
                          value={med.prescribedFor}
                          onChange={(e) => updateMedication(index, 'prescribedFor', e.target.value)}
                          className="input text-sm"
                          disabled={!canEdit}
                        />
                      </div>
                    </div>

                    {/* Reaction Abated */}
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <label className="label text-xs font-semibold">9. Reaction abated after drug stopped or dose reduced</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.reactionAbated?.[index]?.yes || false}
                            onChange={(e) => updateReactionAbated(index, 'yes', e.target.checked)}
                            className="mr-2"
                            disabled={!canEdit}
                          />
                          <span className="text-xs">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.reactionAbated?.[index]?.no || false}
                            onChange={(e) => updateReactionAbated(index, 'no', e.target.checked)}
                            className="mr-2"
                            disabled={!canEdit}
                          />
                          <span className="text-xs">No</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.reactionAbated?.[index]?.unknown || false}
                            onChange={(e) => updateReactionAbated(index, 'unknown', e.target.checked)}
                            className="mr-2"
                            disabled={!canEdit}
                          />
                          <span className="text-xs">Unknown</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.reactionAbated?.[index]?.na || false}
                            onChange={(e) => updateReactionAbated(index, 'na', e.target.checked)}
                            className="mr-2"
                            disabled={!canEdit}
                          />
                          <span className="text-xs">NA</span>
                        </label>
                        <div>
                          <input
                            type="text"
                            value={formData.reactionAbated?.[index]?.reducedDose || ''}
                            onChange={(e) => updateReactionAbated(index, 'reducedDose', e.target.value)}
                            className="input text-xs"
                            placeholder="Reduced dose"
                            disabled={!canEdit}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reaction Reappeared */}
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <label className="label text-xs font-semibold">10. Reaction reappeared after reintroduction</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.reactionReappeared?.[index]?.yes || false}
                            onChange={(e) => updateReactionReappeared(index, 'yes', e.target.checked)}
                            className="mr-2"
                            disabled={!canEdit}
                          />
                          <span className="text-xs">Yes</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.reactionReappeared?.[index]?.no || false}
                            onChange={(e) => updateReactionReappeared(index, 'no', e.target.checked)}
                            className="mr-2"
                            disabled={!canEdit}
                          />
                          <span className="text-xs">No</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.reactionReappeared?.[index]?.unknown || false}
                            onChange={(e) => updateReactionReappeared(index, 'unknown', e.target.checked)}
                            className="mr-2"
                            disabled={!canEdit}
                          />
                          <span className="text-xs">Unknown</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.reactionReappeared?.[index]?.na || false}
                            onChange={(e) => updateReactionReappeared(index, 'na', e.target.checked)}
                            className="mr-2"
                            disabled={!canEdit}
                          />
                          <span className="text-xs">NA</span>
                        </label>
                        <div>
                          <input
                            type="text"
                            value={formData.reactionReappeared?.[index]?.reintroducedDose || ''}
                            onChange={(e) => updateReactionReappeared(index, 'reintroducedDose', e.target.value)}
                            className="input text-xs"
                            placeholder="If reintroduced, dose"
                            disabled={!canEdit}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No medications added yet</p>
            )}
          </div>

          {/* 11. Concomitant medical products */}
          <div className="card">
            <h3 className="form-section-title">11. Concomitant medical products including self medication and herbal remedies with therapy dates (exclude those used to treat reaction)</h3>
            <textarea
              name="concomitantMedicalProducts"
              value={formData.concomitantMedicalProducts}
              onChange={handleInputChange}
              className="input"
              rows="4"
              disabled={!canEdit}
            />
          </div>

          {/* D. Reporter */}
          <div className="card">
            <h3 className="form-section-title">D. Reporter (see Confidentiality section in first page)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">16. Name and Professional Address</label>
                <input
                  type="text"
                  name="name"
                  value={formData.reporter?.name || ''}
                  onChange={(e) => handleInputChange(e, 'reporter')}
                  className="input mb-2"
                  placeholder="Name"
                  disabled={!canEdit}
                />
                <textarea
                  name="professionalAddress"
                  value={formData.reporter?.professionalAddress || ''}
                  onChange={(e) => handleInputChange(e, 'reporter')}
                  className="input"
                  rows="2"
                  placeholder="Professional Address"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Pin code</label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.reporter?.pinCode || ''}
                  onChange={(e) => handleInputChange(e, 'reporter')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">e-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.reporter?.email || ''}
                  onChange={(e) => handleInputChange(e, 'reporter')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Tel. No. (with STD Code)</label>
                <input
                  type="tel"
                  name="telNo"
                  value={formData.reporter?.telNo || ''}
                  onChange={(e) => handleInputChange(e, 'reporter')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Signature</label>
                <input
                  type="text"
                  name="signature"
                  value={formData.reporter?.signature || ''}
                  onChange={(e) => handleInputChange(e, 'reporter')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.reporter?.occupation || ''}
                  onChange={(e) => handleInputChange(e, 'reporter')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">17. Causality Assessment</label>
                <input
                  type="text"
                  name="causalityAssessment"
                  value={formData.reporter?.causalityAssessment || ''}
                  onChange={(e) => handleInputChange(e, 'reporter')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Date of Report */}
          <div className="card">
            <h3 className="form-section-title">18. Date of this report (dd/mm/yy)</h3>
            <input
              type="date"
              name="dateOfReport"
              value={formData.dateOfReport}
              onChange={handleInputChange}
              className="input max-w-md"
              disabled={!canEdit}
            />
          </div>

          {/* Submit Button */}
          {canEdit && (
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 sticky bottom-0 bg-gray-50 py-4 -mx-4 sm:-mx-6 px-4 sm:px-6 shadow-lg sm:shadow-none sm:static sm:bg-transparent sm:py-0">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto order-1 sm:order-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Save ADR Report</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ADRReportingForm;
