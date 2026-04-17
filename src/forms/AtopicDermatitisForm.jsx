import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const AtopicDermatitisForm = () => {
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
    ageSex: '',
    slNo: '',
    ipOpNo: '',
    informant: '',
    date: '',

    // I. Socio Economic Status
    parentsOccupation: '',
    overCrowding: '',

    // II. Presenting Complaints
    modeOfOnset: '',
    course: '',
    symptomsYesNo: '',
    
    // Itching
    itchingPresent: '',
    itchingIntensity: '',
    interferenceWithSleep: '',
    diurnalVariation: '',
    aggravationTime: '',
    distribution: '',
    seasonalVariation: '',
    
    // Sweating
    sweatingStatus: '',
    sweatingAggravates: '',
    
    // Skin Lesions
    skinLesions: '',
    
    // Medication
    topicalSystemicMedication: '',
    medicationSpecify: '',
    responseToMedication: '',
    
    // Contact
    prolongedSkinContact: '',

    // h) Systemic Symptoms
    systemicSymptoms: {
      fever: false,
      chills: false,
      cough: false,
      headache: false,
      weakness: false,
      weightLoss: false,
      looseMotions: false
    },

    // i) Associated Conditions
    associatedConditions: {
      alopeciaAreata: false,
      herpesSimplex: false,
      urticaria: false,
      bronchialAsthma: false,
      rhinitis: false,
      cataract: false,
      deafness: false,
      erythroderma: false,
      pellagra: false,
      recurrentPersistentPyoderma: false,
      diabetesMellitus: false
    },

    // j) Triggers
    triggers: {
      emotionalFactors: false,
      environmentalFactors: false,
      food: false,
      skinIrritants: false,
      seasonalVariation: false
    },

    // k) Other
    otherFactors: {
      earlyAgeOfOnset: false,
      drySkin: false,
      ichthyosis: false,
      hyperlinearPalms: false,
      keratosisPilaris: false,
      handFootDermatitis: false,
      nippleEczema: false,
      whiteDermographism: false,
      perifollicularAccentuation: false
    },

    // III. Past History
    pastHistory: '',

    // IV. Family History
    familyHistory: '',

    // V. Personal History
    diet: '',
    teethingCrawling: '',
    habits: '',
    playingHabits: '',
    immunization: '',
    appetite: '',
    sleep: '',
    bowelBladder: '',
    usageOfSocksShoes: '',
    usageOfDiapers: '',

    // VI. General Physical Examination
    nourishmentBuild: '',
    mucusMembrane: '',
    eyesVisualDisturbances: '',
    eyesCataract: '',
    hair: '',
    nails: '',
    weight: '',
    pulse: '',
    bp: '',
    rr: '',

    // VII. Examination of Cutaneous System
    cutaneousDistribution: '',
    cutaneousSite: '',
    
    // Morphology
    primaryLesion: '',
    margins: '',
    surface: '',
    colour: '',
    configuration: '',
    
    // Secondary Changes
    scalesGreasy: '',
    scalesFineLamellar: '',
    crusts: '',
    scarringExcoriation: '',
    
    // Other Cutaneous
    hairStatus: '',
    sensation: '',
    regionalLymphadenopathy: '',
    tripleResponseLewis: '',

    // VIII. Systemic Examination
    cvs: '',
    rs: '',
    cns: '',
    pa: '',

    // IX. Provisional Diagnosis
    provisionalDiagnosis: ''
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
            formType: 'Atopic Dermatitis',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Atopic Dermatitis',
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
              CLINICAL STUDY OF ATOPIC DERMATITIS
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
                />
              </div>
              <div>
                <label className="label">Sl. No.</label>
                <input
                  type="text"
                  name="slNo"
                  value={formData.slNo}
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
                <label className="label">I.P/O.P. No.</label>
                <input
                  type="text"
                  name="ipOpNo"
                  value={formData.ipOpNo}
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
                <label className="label">Age/ Sex</label>
                <input
                  type="text"
                  name="ageSex"
                  value={formData.ageSex}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Informant</label>
                <input
                  type="text"
                  name="informant"
                  value={formData.informant}
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

          {/* I. Socio Economic Status */}
          <div className="card">
            <h3 className="form-section-title">I. SOCIO ECONOMIC STATUS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Parents' Occupation::</label>
                <input
                  type="text"
                  name="parentsOccupation"
                  value={formData.parentsOccupation}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Over Crowding:</label>
                <input
                  type="text"
                  name="overCrowding"
                  value={formData.overCrowding}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* II. Presenting Complaints with Duration */}
          <div className="card">
            <h3 className="form-section-title">II. PRESENTING COMPLAINTS WITH DURATION</h3>
            
            <div className="space-y-4">
              <div>
                <label className="label font-semibold">History of present illness:</label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">a) Mode of onset:</label>
                  <select
                    name="modeOfOnset"
                    value={formData.modeOfOnset}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Sudden">Sudden</option>
                    <option value="Gradual">Gradual</option>
                  </select>
                </div>
                <div>
                  <label className="label">b) Course</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Progressive">Progressive</option>
                    <option value="Regressive">Regressive</option>
                    <option value="Temporarily quiescent">Temporarily quiescent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Symptoms-Yes/No</label>
                <input
                  type="text"
                  name="symptomsYesNo"
                  value={formData.symptomsYesNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              {/* c) Itching */}
              <div className="border-l-4 border-blue-400 pl-4">
                <label className="label font-semibold">c) Itching</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="label text-sm">Present/ absent</label>
                    <select
                      name="itchingPresent"
                      value={formData.itchingPresent}
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
                    <label className="label text-sm">Intensity</label>
                    <select
                      name="itchingIntensity"
                      value={formData.itchingIntensity}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    >
                      <option value="">Select</option>
                      <option value="Mild">Mild</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe">Severe</option>
                    </select>
                  </div>
                  <div>
                    <label className="label text-sm">Interference with sleep</label>
                    <input
                      type="text"
                      name="interferenceWithSleep"
                      value={formData.interferenceWithSleep}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Diurnal variation (Yes/No)</label>
                    <input
                      type="text"
                      name="diurnalVariation"
                      value={formData.diurnalVariation}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label text-sm">Aggravation in the morning/afternoon/at night</label>
                    <input
                      type="text"
                      name="aggravationTime"
                      value={formData.aggravationTime}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Distribution</label>
                    <select
                      name="distribution"
                      value={formData.distribution}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    >
                      <option value="">Select</option>
                      <option value="Circumscribed area">Circumscribed area</option>
                      <option value="Widespread & symmetrical">Widespread & symmetrical</option>
                    </select>
                  </div>
                  <div>
                    <label className="label text-sm">Seasonal variation</label>
                    <select
                      name="seasonalVariation"
                      value={formData.seasonalVariation}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    >
                      <option value="">Select</option>
                      <option value="More during summer">More during summer</option>
                      <option value="More during winter">More during winter</option>
                      <option value="More during autumn">More during autumn</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* d) Sweating */}
              <div className="border-l-4 border-green-400 pl-4">
                <label className="label font-semibold">d) Sweating (h/o hyperhidrosis)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="label text-sm">Normal/excessive</label>
                    <select
                      name="sweatingStatus"
                      value={formData.sweatingStatus}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    >
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Excessive">Excessive</option>
                    </select>
                  </div>
                  <div>
                    <label className="label text-sm">Aggravates the condition (Yes/No)</label>
                    <select
                      name="sweatingAggravates"
                      value={formData.sweatingAggravates}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* e) Skin Lesions */}
              <div>
                <label className="label font-semibold">e) Skin Lesions</label>
                <textarea
                  name="skinLesions"
                  value={formData.skinLesions}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  placeholder="Redness, Weepy, exudative/ Less Weepy with scale/ minimal redness, scaling and thickening of skin/ hyperpigmentation/ hypopigmentation"
                  disabled={!canEdit}
                />
              </div>

              {/* f) Medication */}
              <div className="border-l-4 border-yellow-400 pl-4">
                <label className="label font-semibold">f) Topical/ systemic medication</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="label text-sm">Yes/No</label>
                    <select
                      name="topicalSystemicMedication"
                      value={formData.topicalSystemicMedication}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  {formData.topicalSystemicMedication === 'Yes' && (
                    <>
                      <div>
                        <label className="label text-sm">If yes, specify</label>
                        <input
                          type="text"
                          name="medicationSpecify"
                          value={formData.medicationSpecify}
                          onChange={handleInputChange}
                          className="input"
                          disabled={!canEdit}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="label text-sm">Response to topical medication</label>
                        <select
                          name="responseToMedication"
                          value={formData.responseToMedication}
                          onChange={handleInputChange}
                          className="input"
                          disabled={!canEdit}
                        >
                          <option value="">Select</option>
                          <option value="Aggravated">Aggravated</option>
                          <option value="No change">No change</option>
                          <option value="Remission">Remission</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* g) Prolonged skin contact */}
              <div>
                <label className="label font-semibold">g) Prolonged skin contact with urine and faeces</label>
                <select
                  name="prolongedSkinContact"
                  value={formData.prolongedSkinContact}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* h) Systemic Symptoms */}
          <div className="card">
            <h3 className="form-section-title">h) Systemic Symptoms</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {['fever', 'chills', 'cough', 'headache', 'weakness', 'weightLoss', 'looseMotions'].map(symptom => (
                <label key={symptom} className="flex items-center">
                  <input
                    type="checkbox"
                    name={symptom}
                    checked={formData.systemicSymptoms?.[symptom] || false}
                    onChange={(e) => handleInputChange(e, 'systemicSymptoms')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm capitalize">{symptom.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* i) Associated Conditions */}
          <div className="card">
            <h3 className="form-section-title">i) Associated Conditions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: 'alopeciaAreata', label: 'Alopecia areata' },
                { key: 'herpesSimplex', label: 'Herpes simplex' },
                { key: 'urticaria', label: 'Urticaria' },
                { key: 'bronchialAsthma', label: 'Bronchial asthma' },
                { key: 'rhinitis', label: 'Rhinitis' },
                { key: 'cataract', label: 'Cataract' },
                { key: 'deafness', label: 'Deafness' },
                { key: 'erythroderma', label: 'Erythroderma' },
                { key: 'pellagra', label: 'Pellagra' },
                { key: 'recurrentPersistentPyoderma', label: 'Recurrent & persistent pyoderma' },
                { key: 'diabetesMellitus', label: 'Diabetes mellitus' }
              ].map(condition => (
                <label key={condition.key} className="flex items-center">
                  <input
                    type="checkbox"
                    name={condition.key}
                    checked={formData.associatedConditions?.[condition.key] || false}
                    onChange={(e) => handleInputChange(e, 'associatedConditions')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">{condition.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* j) Triggers */}
          <div className="card">
            <h3 className="form-section-title">j) Triggers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { key: 'emotionalFactors', label: 'Emotional factors' },
                { key: 'environmentalFactors', label: 'Environmental factors' },
                { key: 'food', label: 'Food' },
                { key: 'skinIrritants', label: 'Skin irritants' },
                { key: 'seasonalVariation', label: 'Seasonal variation' }
              ].map(trigger => (
                <label key={trigger.key} className="flex items-center">
                  <input
                    type="checkbox"
                    name={trigger.key}
                    checked={formData.triggers?.[trigger.key] || false}
                    onChange={(e) => handleInputChange(e, 'triggers')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">{trigger.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* k) Other */}
          <div className="card">
            <h3 className="form-section-title">k) Other</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: 'earlyAgeOfOnset', label: 'Early age of onset' },
                { key: 'drySkin', label: 'Dry skin' },
                { key: 'ichthyosis', label: 'Ichthyosis' },
                { key: 'hyperlinearPalms', label: 'Hyperlinear palms' },
                { key: 'keratosisPilaris', label: 'Keratosis pilaris' },
                { key: 'handFootDermatitis', label: 'Hand and foot dermatitis' },
                { key: 'nippleEczema', label: 'Nipple eczema' },
                { key: 'whiteDermographism', label: 'White dermographism' },
                { key: 'perifollicularAccentuation', label: 'Perifollicular accentuation' }
              ].map(other => (
                <label key={other.key} className="flex items-center">
                  <input
                    type="checkbox"
                    name={other.key}
                    checked={formData.otherFactors?.[other.key] || false}
                    onChange={(e) => handleInputChange(e, 'otherFactors')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">{other.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* III. Past History */}
          <div className="card">
            <h3 className="form-section-title">III. PAST HISTORY</h3>
            <div>
              <label className="label">History of trauma/cuts/scratches/insect bites</label>
              <textarea
                name="pastHistory"
                value={formData.pastHistory}
                onChange={handleInputChange}
                className="input"
                rows="2"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* IV. Family History */}
          <div className="card">
            <h3 className="form-section-title">IV. FAMILY HISTORY</h3>
            <div>
              <label className="label">H/ o atopy & / others</label>
              <textarea
                name="familyHistory"
                value={formData.familyHistory}
                onChange={handleInputChange}
                className="input"
                rows="2"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* V. Personal History */}
          <div className="card">
            <h3 className="form-section-title">V. PERSONAL HISTORY</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Diet</label>
                <textarea
                  name="diet"
                  value={formData.diet}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  placeholder="Infant breast fed/ fed with Cow's milk formula food indiscretion (allergy)/ Nandini milk (colour)"
                  disabled={!canEdit}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Teething/ Crawling</label>
                  <input
                    type="text"
                    name="teethingCrawling"
                    value={formData.teethingCrawling}
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
                    placeholder="Lip-licking/ thumb sucking/ dribbling/ chapping"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">Playing Habits</label>
                  <input
                    type="text"
                    name="playingHabits"
                    value={formData.playingHabits}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Exposure to sand/ rugs/ play-mates"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">Immunization</label>
                  <input
                    type="text"
                    name="immunization"
                    value={formData.immunization}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
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
                  <input
                    type="text"
                    name="sleep"
                    value={formData.sleep}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">Bowel and bladder</label>
                  <input
                    type="text"
                    name="bowelBladder"
                    value={formData.bowelBladder}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">Usage of socks and shoes (Yes/No)</label>
                  <select
                    name="usageOfSocksShoes"
                    value={formData.usageOfSocksShoes}
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
                  <label className="label">Usages of diapers (Yes/No)</label>
                  <select
                    name="usageOfDiapers"
                    value={formData.usageOfDiapers}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* VI. General Physical Examination */}
          <div className="card">
            <h3 className="form-section-title">VI. GENERAL PHYSICAL EXAMINATION</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">a) Nourishment and build</label>
                <select
                  name="nourishmentBuild"
                  value={formData.nourishmentBuild}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Poor">Poor</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Well">Well</option>
                </select>
              </div>
              <div>
                <label className="label">b) Mucus membrane</label>
                <input
                  type="text"
                  name="mucusMembrane"
                  value={formData.mucusMembrane}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">c) Eyes: visual disturbances</label>
                <input
                  type="text"
                  name="eyesVisualDisturbances"
                  value={formData.eyesVisualDisturbances}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Cataract</label>
                <input
                  type="text"
                  name="eyesCataract"
                  value={formData.eyesCataract}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">d) Hair</label>
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
                <label className="label">e) Nails</label>
                <input
                  type="text"
                  name="nails"
                  value={formData.nails}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Pulse</label>
                <input
                  type="text"
                  name="pulse"
                  value={formData.pulse}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">B.P</label>
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
                <label className="label">R.R</label>
                <input
                  type="text"
                  name="rr"
                  value={formData.rr}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">g) Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* VII. Examination of Cutaneous System */}
          <div className="card">
            <h3 className="form-section-title">VII. EXAMINATION OF CUTANEOUS SYSTEM</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">a) Distribution</label>
                  <input
                    type="text"
                    name="cutaneousDistribution"
                    value={formData.cutaneousDistribution}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Localised/ generalized; symmetrical/ asymmetrical"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">b) Site</label>
                  <input
                    type="text"
                    name="cutaneousSite"
                    value={formData.cutaneousSite}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="face/ flexural/ extensor"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div>
                <label className="label font-semibold">c) Morphology</label>
                <div className="grid grid-cols-1 gap-4 mt-2 ml-4">
                  <div>
                    <label className="label text-sm">i. Primary lesion</label>
                    <textarea
                      name="primaryLesion"
                      value={formData.primaryLesion}
                      onChange={handleInputChange}
                      className="input"
                      rows="2"
                      placeholder="Macule/Papule/Vesicle/Pustule Nodule/ patch/bulla /plaque/erosion/ulcer/Paulo vesicles/vesico-pustules /erythema/odema"
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label text-sm">ii. Margins</label>
                      <select
                        name="margins"
                        value={formData.margins}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      >
                        <option value="">Select</option>
                        <option value="Well-defined">Well-defined</option>
                        <option value="Ill-defined">Ill-defined</option>
                      </select>
                    </div>
                    <div>
                      <label className="label text-sm">iii. Surface</label>
                      <input
                        type="text"
                        name="surface"
                        value={formData.surface}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Smooth/dry/irregular/crusted/scaly/warty"
                        disabled={!canEdit}
                      />
                    </div>
                    <div>
                      <label className="label text-sm">iv. Colour</label>
                      <textarea
                        name="colour"
                        value={formData.colour}
                        onChange={handleInputChange}
                        className="input"
                        rows="2"
                        placeholder="Hypo-pigmented/de pigmented/ hyper-pigmented/ reddish/ brownish/ yellowish/pinkish/skin coloured"
                        disabled={!canEdit}
                      />
                    </div>
                    <div>
                      <label className="label text-sm">v. Configuration</label>
                      <select
                        name="configuration"
                        value={formData.configuration}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      >
                        <option value="">Select</option>
                        <option value="Discrete">Discrete</option>
                        <option value="Confluent">Confluent</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="label text-sm">vi. Secondary changes</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="label text-xs">Scales - greasy (Yes/no)</label>
                        <input
                          type="text"
                          name="scalesGreasy"
                          value={formData.scalesGreasy}
                          onChange={handleInputChange}
                          className="input"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">fine lamellar (branny)</label>
                        <input
                          type="text"
                          name="scalesFineLamellar"
                          value={formData.scalesFineLamellar}
                          onChange={handleInputChange}
                          className="input"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Crusts</label>
                        <input
                          type="text"
                          name="crusts"
                          value={formData.crusts}
                          onChange={handleInputChange}
                          className="input"
                          placeholder="Reddish/brownish/yellowish"
                          disabled={!canEdit}
                        />
                      </div>
                      <div>
                        <label className="label text-xs">Scarring/ excoriation/lichenification</label>
                        <input
                          type="text"
                          name="scarringExcoriation"
                          value={formData.scarringExcoriation}
                          onChange={handleInputChange}
                          className="input"
                          disabled={!canEdit}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="label">d) Hair</label>
                  <select
                    name="hairStatus"
                    value={formData.hairStatus}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Normal">Normal</option>
                    <option value="Sparse">Sparse</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <div>
                  <label className="label">e) Sensation</label>
                  <select
                    name="sensation"
                    value={formData.sensation}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Normal">Normal</option>
                    <option value="Impaired">Impaired</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="label">f) Regional lymphadenopathy</label>
                  <input
                    type="text"
                    name="regionalLymphadenopathy"
                    value={formData.regionalLymphadenopathy}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">g) Triple response of Lewis</label>
                  <input
                    type="text"
                    name="tripleResponseLewis"
                    value={formData.tripleResponseLewis}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* VIII. Systemic Examination */}
          <div className="card">
            <h3 className="form-section-title">VIII. SYSTEMIC EXAMINATION</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">1) C.V.S.</label>
                <textarea
                  name="cvs"
                  value={formData.cvs}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">2) R.S</label>
                <textarea
                  name="rs"
                  value={formData.rs}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">3) C N.S.</label>
                <textarea
                  name="cns"
                  value={formData.cns}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">4) P/A</label>
                <textarea
                  name="pa"
                  value={formData.pa}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* IX. Provisional Diagnosis */}
          <div className="card">
            <h3 className="form-section-title">IX. PROVISIONAL DIAGNOSIS</h3>
            <textarea
              name="provisionalDiagnosis"
              value={formData.provisionalDiagnosis}
              onChange={handleInputChange}
              className="input"
              rows="3"
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
                    <span>Save Record</span>
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

export default AtopicDermatitisForm;
