import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const AmyloidosisForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    opdNo: '',
    age: '',
    sex: '',
    date: '',
    occupation: '',
    caseNo: '',
    address: '',
    hospital: '',
    socioEconomicStatus: '',
    maritalStatus: '',

    // Presenting Complaints and Duration
    onset: '',
    siteOfOnset: '',
    progression: '',
    provokingFactors: '',
    pruritis: '',
    cosmeticHistory: '',
    historyOfAtopy: '',

    // Past History
    similarComplaintsPast: '',
    topicalSystemicDrugs: '',
    diabetesHypertensionTB: '',

    // Family History
    similarComplaintsFamily: '',
    atopyInFamily: '',

    // Personal History
    diet: '',
    appetite: '',
    sleep: '',
    bowels: '',
    bladder: '',
    habits: '',

    // General Examination
    builtNourishment: '',
    pallorCyanosis: '',
    lymphadenopathy: '',
    pulseRate: '',
    temp: '',
    bp: '',
    rr: '',
    mucousMembrane: '',
    hair: '',
    nails: '',

    // Cutaneous Examination
    distributionOfLesion: {
      localized: false,
      widespread: false,
      unilateral: false,
      bilateral: false
    },
    distributionPattern: '',
    site: '',
    typeOfLesions: '',

    // Secondary Changes
    secondaryChanges: {
      decreasedHairs: false,
      atrophy: false,
      hypopigmentation: false,
      xerosis: false,
      lichenification: false,
      purpura: false,
      scaling: false
    },

    anyOtherFeatures: '',

    // Systemic Examination
    cvs: '',
    cns: '',
    rs: '',
    git: '',

    // Clinical Diagnosis
    clinicalDiagnosisDD: '',

    // Investigations
    histopathologicalStudy: '',
    labNo: '',
    stainUsed: '',
    epidermalChanges: '',
    dermalChanges: '',
    otherChanges: '',
    histopathologicalImpression: '',

    // Final Diagnosis
    finalDiagnosis: ''
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
            formType: 'Amyloidosis',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Amyloidosis',
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
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
              AMYLOIDOSIS PROFORMA
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
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
                <label className="label">OPD No.</label>
                <input
                  type="text"
                  name="opdNo"
                  value={formData.opdNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
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
                </select>
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
                <label className="label">Case No.</label>
                <input
                  type="text"
                  name="caseNo"
                  value={formData.caseNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Hospital</label>
                <input
                  type="text"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div className="lg:col-span-2">
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
                <label className="label">Socio-economic Status</label>
                <select
                  name="socioEconomicStatus"
                  value={formData.socioEconomicStatus}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Poor">Poor</option>
                  <option value="Middle">Middle</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="label">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Presenting Complaints and Duration */}
          <div className="card">
            <h3 className="form-section-title">Presenting Complaints and Duration</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1) Onset</label>
                <input
                  type="text"
                  name="onset"
                  value={formData.onset}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="Slow / Sudden / Gradual / From birth / From early childhood"
                />
              </div>

              <div>
                <label className="label">2) Site of Onset</label>
                <input
                  type="text"
                  name="siteOfOnset"
                  value={formData.siteOfOnset}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">3) Progression</label>
                <input
                  type="text"
                  name="progression"
                  value={formData.progression}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="Stationary / Rapid / Gradual Spread / Remission / Exacerbations"
                />
              </div>

              <div>
                <label className="label">4) Provoking Factors</label>
                <textarea
                  name="provokingFactors"
                  value={formData.provokingFactors}
                  onChange={handleInputChange}
                  className="input min-h-[80px]"
                  disabled={!canEdit}
                  placeholder="Emotional Factors - Normal strain / Physical Strain / Infection / Ill Pregnancy / Seasonal Variation / Drugs"
                  rows="3"
                />
              </div>

              <div>
                <label className="label">5) Pruritis</label>
                <select
                  name="pruritis"
                  value={formData.pruritis}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div>
                <label className="label">6) Cosmetic History (Type of Soap)</label>
                <input
                  type="text"
                  name="cosmeticHistory"
                  value={formData.cosmeticHistory}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">7) History of Atopy</label>
                <textarea
                  name="historyOfAtopy"
                  value={formData.historyOfAtopy}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Past History */}
          <div className="card">
            <h3 className="form-section-title">Past History</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1) Any h/o similar complaints in the past</label>
                <select
                  name="similarComplaintsPast"
                  value={formData.similarComplaintsPast}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="label">2) Any topical / Systemic drugs used</label>
                <select
                  name="topicalSystemicDrugs"
                  value={formData.topicalSystemicDrugs}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="label">3) Any h/o Diabetes / Hypertension / Tuberculosis / Atopy</label>
                <textarea
                  name="diabetesHypertensionTB"
                  value={formData.diabetesHypertensionTB}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Family History */}
          <div className="card">
            <h3 className="form-section-title">Family History</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1) Any similar complaints in family</label>
                <textarea
                  name="similarComplaintsFamily"
                  value={formData.similarComplaintsFamily}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">2) H/o atopy in the family</label>
                <textarea
                  name="atopyInFamily"
                  value={formData.atopyInFamily}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Personal History */}
          <div className="card">
            <h3 className="form-section-title">Personal History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Diet</label>
                <select
                  name="diet"
                  value={formData.diet}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Veg">Veg</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="label">Appetite</label>
                <input
                  type="text"
                  name="appetite"
                  value={formData.appetite}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Sleep</label>
                <select
                  name="sleep"
                  value={formData.sleep}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Sound">Sound</option>
                  <option value="Disturbed">Disturbed</option>
                </select>
              </div>

              <div>
                <label className="label">Bowels</label>
                <input
                  type="text"
                  name="bowels"
                  value={formData.bowels}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Bladder</label>
                <input
                  type="text"
                  name="bladder"
                  value={formData.bladder}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Habits</label>
                <input
                  type="text"
                  name="habits"
                  value={formData.habits}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="Smoking / Alcohol / Tobacco / Drugs"
                />
              </div>
            </div>
          </div>

          {/* General Examination */}
          <div className="card">
            <h3 className="form-section-title">General Examination</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1) Built and Nourishment</label>
                <input
                  type="text"
                  name="builtNourishment"
                  value={formData.builtNourishment}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">2) Pallor / Cyanosis / Icterus / Edema / Clubbing</label>
                <input
                  type="text"
                  name="pallorCyanosis"
                  value={formData.pallorCyanosis}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">3) Lymphadenopathy</label>
                <input
                  type="text"
                  name="lymphadenopathy"
                  value={formData.lymphadenopathy}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="label">4) Pulse Rate</label>
                  <input
                    type="text"
                    name="pulseRate"
                    value={formData.pulseRate}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">Temp</label>
                  <input
                    type="text"
                    name="temp"
                    value={formData.temp}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">BP</label>
                  <input
                    type="text"
                    name="bp"
                    value={formData.bp}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">RR</label>
                  <input
                    type="text"
                    name="rr"
                    value={formData.rr}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">5) Mucous Membrane</label>
                  <input
                    type="text"
                    name="mucousMembrane"
                    value={formData.mucousMembrane}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">Hair</label>
                  <input
                    type="text"
                    name="hair"
                    value={formData.hair}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">Nails</label>
                  <input
                    type="text"
                    name="nails"
                    value={formData.nails}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cutaneous Examination */}
          <div className="card">
            <h3 className="form-section-title">Cutaneous Examination</h3>
            <div className="space-y-4">
              <div>
                <label className="label font-semibold">1) Distribution of Lesion</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                  <div className="checkbox-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="localized"
                        checked={formData.distributionOfLesion.localized}
                        onChange={(e) => handleInputChange(e, 'distributionOfLesion')}
                        className="checkbox"
                        disabled={!canEdit}
                      />
                      <span className="label">Localized</span>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="widespread"
                        checked={formData.distributionOfLesion.widespread}
                        onChange={(e) => handleInputChange(e, 'distributionOfLesion')}
                        className="checkbox"
                        disabled={!canEdit}
                      />
                      <span className="label">Widespread</span>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="unilateral"
                        checked={formData.distributionOfLesion.unilateral}
                        onChange={(e) => handleInputChange(e, 'distributionOfLesion')}
                        className="checkbox"
                        disabled={!canEdit}
                      />
                      <span className="label">Unilateral</span>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="bilateral"
                        checked={formData.distributionOfLesion.bilateral}
                        onChange={(e) => handleInputChange(e, 'distributionOfLesion')}
                        className="checkbox"
                        disabled={!canEdit}
                      />
                      <span className="label">Bilateral</span>
                    </label>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="label">Distribution Pattern</label>
                  <input
                    type="text"
                    name="distributionPattern"
                    value={formData.distributionPattern}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                    placeholder="Symmetrical / Asymmetrical / Linear / Zosteriform / Scattered / Confluent / Rippled / Reticulate / Discrete / Others"
                  />
                </div>
              </div>

              <div>
                <label className="label">2) Site</label>
                <input
                  type="text"
                  name="site"
                  value={formData.site}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="Pretibial / Interscapular / Extensor of arm and forearm / Others"
                />
              </div>

              <div>
                <label className="label">3) Type of Lesions</label>
                <input
                  type="text"
                  name="typeOfLesions"
                  value={formData.typeOfLesions}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder="Macular / Papular / Waxy nodular / Bullous / Poikiloderma-like / Others"
                />
              </div>

              <div>
                <label className="label font-semibold">4) Secondary Changes</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                  <div className="checkbox-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="decreasedHairs"
                        checked={formData.secondaryChanges.decreasedHairs}
                        onChange={(e) => handleInputChange(e, 'secondaryChanges')}
                        className="checkbox"
                        disabled={!canEdit}
                      />
                      <span className="label">Decreased Hairs</span>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="atrophy"
                        checked={formData.secondaryChanges.atrophy}
                        onChange={(e) => handleInputChange(e, 'secondaryChanges')}
                        className="checkbox"
                        disabled={!canEdit}
                      />
                      <span className="label">Atrophy</span>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="hypopigmentation"
                        checked={formData.secondaryChanges.hypopigmentation}
                        onChange={(e) => handleInputChange(e, 'secondaryChanges')}
                        className="checkbox"
                        disabled={!canEdit}
                      />
                      <span className="label">Hypopigmentation</span>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="xerosis"
                        checked={formData.secondaryChanges.xerosis}
                        onChange={(e) => handleInputChange(e, 'secondaryChanges')}
                        className="checkbox"
                        disabled={!canEdit}
                      />
                      <span className="label">Xerosis</span>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="lichenification"
                        checked={formData.secondaryChanges.lichenification}
                        onChange={(e) => handleInputChange(e, 'secondaryChanges')}
                        className="checkbox"
                        disabled={!canEdit}
                      />
                      <span className="label">Lichenification</span>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="purpura"
                        checked={formData.secondaryChanges.purpura}
                        onChange={(e) => handleInputChange(e, 'secondaryChanges')}
                        className="checkbox"
                        disabled={!canEdit}
                      />
                      <span className="label">Purpura</span>
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="scaling"
                        checked={formData.secondaryChanges.scaling}
                        onChange={(e) => handleInputChange(e, 'secondaryChanges')}
                        className="checkbox"
                        disabled={!canEdit}
                      />
                      <span className="label">Scaling</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="label">5) Any Other Features</label>
                <textarea
                  name="anyOtherFeatures"
                  value={formData.anyOtherFeatures}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Systemic Examination */}
          <div className="card">
            <h3 className="form-section-title">Systemic Examination</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">CVS</label>
                <textarea
                  name="cvs"
                  value={formData.cvs}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">CNS</label>
                <textarea
                  name="cns"
                  value={formData.cns}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">RS</label>
                <textarea
                  name="rs"
                  value={formData.rs}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">GIT</label>
                <textarea
                  name="git"
                  value={formData.git}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Clinical Diagnosis */}
          <div className="card">
            <h3 className="form-section-title">Clinical Diagnosis & DD</h3>
            <div>
              <textarea
                name="clinicalDiagnosisDD"
                value={formData.clinicalDiagnosisDD}
                onChange={handleInputChange}
                className="input min-h-[80px]"
                disabled={!canEdit}
                rows="3"
              />
            </div>
          </div>

          {/* Investigations */}
          <div className="card">
            <h3 className="form-section-title">Investigations</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1) Histopathological Study / Dermoscopic Findings</label>
                <textarea
                  name="histopathologicalStudy"
                  value={formData.histopathologicalStudy}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Lab No.</label>
                  <input
                    type="text"
                    name="labNo"
                    value={formData.labNo}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">Stain Used</label>
                  <input
                    type="text"
                    name="stainUsed"
                    value={formData.stainUsed}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                    placeholder="H&E / Congo red / Others"
                  />
                </div>
              </div>

              <div>
                <label className="label">Epidermal Changes</label>
                <textarea
                  name="epidermalChanges"
                  value={formData.epidermalChanges}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Dermal Changes</label>
                <textarea
                  name="dermalChanges"
                  value={formData.dermalChanges}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Other Changes</label>
                <textarea
                  name="otherChanges"
                  value={formData.otherChanges}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Histopathological Impression</label>
                <textarea
                  name="histopathologicalImpression"
                  value={formData.histopathologicalImpression}
                  onChange={handleInputChange}
                  className="input min-h-[80px]"
                  disabled={!canEdit}
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Final Diagnosis */}
          <div className="card">
            <h3 className="form-section-title">Final Diagnosis</h3>
            <div>
              <textarea
                name="finalDiagnosis"
                value={formData.finalDiagnosis}
                onChange={handleInputChange}
                className="input min-h-[80px]"
                disabled={!canEdit}
                rows="3"
              />
            </div>
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

export default AmyloidosisForm;
