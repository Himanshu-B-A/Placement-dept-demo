import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const HerpesZosterProforma = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    age: '',
    sex: '',
    address: '',
    opdIpNo: '',
    informant: '',
    dateOfRecording: '',
    socioEconomicStatus: '',
    maritalStatus: '',

    // Complaint
    skinLesions: '',
    associatedSymptoms: {
      itching: false,
      burningSensation: false,
      pain: false,
      asymptomatic: false
    },
    complaintDuration: '',

    // History of Presenting Complaints
    historyDuration: '',
    historyDurationType: '',
    modeOfOnset: '',
    evolution: '',
    typeOfLesions: {
      vesicular: false,
      bullous: false,
      papular: false,
      erosions: false,
      crusts: false,
      scales: false,
      pustular: false,
      urticarial: false,
      anyOther: ''
    },
    numberOfLesions: '',
    contentOfVesicle: '',
    sitesOfInvolvement: {
      scalp: false,
      face: false,
      neck: false,
      ears: false,
      chest: false,
      abdomen: false,
      upperExtremities: false,
      lowerExtremities: false,
      palms: false,
      soles: false,
      oral: false,
      genital: false
    },
    prodromalSymptoms: {
      pain: false,
      burningSensation: false,
      hyperesthesia: false,
      paresthesia: false,
      itching: false,
      tinglingSensation: false,
      headache: false
    },
    durationOfProdromes: '',

    // Pain Details
    nameOfPain: '',
    historyOf: {
      chickenPox: false,
      diabetes: false,
      hiv: false,
      surgery: false,
      drugs: false,
      postherpeticNeuralgia: false,
      naiveMedication: false
    },
    surroundingSkin: '',

    // Itching Details
    itchingIntensity: '',
    diurnalVariation: '',
    itchingStarted: '',
    aggRelievingFactors: '',

    // Other Constitutional Symptoms
    constitutionalSymptoms: {
      fever: false,
      nausea: false,
      anorexia: false,
      lossOfWeight: false,
      vomiting: false
    },

    // Past History
    pastHistory: {
      similarIllness: '',
      onset: '',
      duration: '',
      course: ''
    },

    // Family History
    familyHistory: '',

    // Personal History
    personalHistory: {
      appetite: '',
      diet: '',
      sleep: '',
      bowelBladderHabits: ''
    },

    // General Physical Examination
    generalPhysicalExam: {
      generalCondition: '',
      nutrition: '',
      build: '',
      pallor: '',
      jaundice: '',
      clubbing: '',
      cyanosis: '',
      edema: '',
      lymphnodes: '',
      pr: '',
      rr: '',
      bp: '',
      wt: '',
      temp: '',
      ht: '',
      hydration: '',
      hair: '',
      nail: '',
      mucosaOral: '',
      mucosaGenital: ''
    },

    // Systemic Examination
    systemicExam: {
      cvs: '',
      rs: '',
      cns: '',
      abdomen: ''
    },

    // Cutaneous Examination
    cutaneousExam: {
      distribution: '',
      number: '',
      numberMultiple: '',
      typeOfLesion: '',
      configuration: '',
      natureOfVesicle: '',
      content: '',
      sites: '',
      surroundingSkin: ''
    },

    // Investigations
    investigations: {
      bloodHb: '',
      bloodTC: '',
      bloodDC: '',
      bloodESR: '',
      tzankSmear: '',
      anyOtherTests: '',
      hiv1And2: '',
      cd4Count: '',
      noOfDermatomes: '',
      whichDermatomes: '',
      cranialNerveInvolvement: '',
      difficultySwallowingUrinaryRetention: '',
      complicationsOphthalmic: '',
      complicationsCutaneous: '',
      complicationsNeurological: ''
    }
  });

  useEffect(() => {
    if (id) {
      setEditMode(true);
      fetchPatientData();
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
            formType: 'Herpes Zoster',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Herpes Zoster',
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
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Department of Dermatology, Venereology & Leprosy
            </h1>
            <h2 className="text-sm sm:text-base lg:text-lg text-gray-600">J.J.M. Medical College, Davangere - 577 004</h2>
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-primary-600 mt-2">HERPES ZOSTER PROFORMA</h3>
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
                <label className="label">Age</label>
                <input
                  type="number"
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
                <label className="label">OPD / IP No.</label>
                <input
                  type="text"
                  name="opdIpNo"
                  value={formData.opdIpNo}
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
                <label className="label">Date of Recording</label>
                <input
                  type="date"
                  name="dateOfRecording"
                  value={formData.dateOfRecording}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Socio Economic Status</label>
                <input
                  type="text"
                  name="socioEconomicStatus"
                  value={formData.socioEconomicStatus}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
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
                  <option value="Unmarried">Unmarried</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widow">Widow</option>
                  <option value="Widower">Widower</option>
                </select>
              </div>
            </div>
          </div>

          {/* Complaint */}
          <div className="card">
            <h3 className="form-section-title">Complaint</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Skin lesions</label>
                <select
                  name="skinLesions"
                  value={formData.skinLesions}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>
              <div>
                <label className="label font-semibold">Associated / W</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="itching"
                      checked={formData.associatedSymptoms?.itching || false}
                      onChange={(e) => handleInputChange(e, 'associatedSymptoms')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Itching</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="burningSensation"
                      checked={formData.associatedSymptoms?.burningSensation || false}
                      onChange={(e) => handleInputChange(e, 'associatedSymptoms')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Burning Sensation</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="pain"
                      checked={formData.associatedSymptoms?.pain || false}
                      onChange={(e) => handleInputChange(e, 'associatedSymptoms')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Pain</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="asymptomatic"
                      checked={formData.associatedSymptoms?.asymptomatic || false}
                      onChange={(e) => handleInputChange(e, 'associatedSymptoms')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Asymptomatic</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="label">Duration</label>
                <input
                  type="text"
                  name="complaintDuration"
                  value={formData.complaintDuration}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* History of Presenting Complaints */}
          <div className="card">
            <h3 className="form-section-title">History of Presenting Complaints</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="historyDuration"
                    value={formData.historyDuration}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Number"
                    disabled={!canEdit}
                  />
                  <select
                    name="historyDurationType"
                    value={formData.historyDurationType}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Days">Days</option>
                    <option value="Months">Months</option>
                    <option value="Years">Years</option>
                    <option value="Since birth">Since birth</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Mode of onset</label>
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
                <label className="label">Evolution</label>
                <select
                  name="evolution"
                  value={formData.evolution}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Gradual">Gradual</option>
                  <option value="Rapid">Rapid</option>
                  <option value="Stationary">Stationary</option>
                  <option value="Resolving">Resolving</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="label font-semibold">Type of lesions</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                {['vesicular', 'bullous', 'papular', 'erosions', 'crusts', 'scales', 'pustular', 'urticarial'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      name={type}
                      checked={formData.typeOfLesions?.[type] || false}
                      onChange={(e) => handleInputChange(e, 'typeOfLesions')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm capitalize">{type}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  name="anyOther"
                  value={formData.typeOfLesions?.anyOther || ''}
                  onChange={(e) => handleInputChange(e, 'typeOfLesions')}
                  className="input"
                  placeholder="Any other"
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Number of lesions</label>
                <select
                  name="numberOfLesions"
                  value={formData.numberOfLesions}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>
              <div>
                <label className="label">Content of vesicle</label>
                <select
                  name="contentOfVesicle"
                  value={formData.contentOfVesicle}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Clear">Clear</option>
                  <option value="Turbid">Turbid</option>
                  <option value="Haemorrhagic">Haemorrhagic</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="label font-semibold">Sites of involvement</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                {['scalp', 'face', 'neck', 'ears', 'chest', 'abdomen', 'upperExtremities', 'lowerExtremities', 'palms', 'soles', 'oral', 'genital'].map(site => (
                  <label key={site} className="flex items-center">
                    <input
                      type="checkbox"
                      name={site}
                      checked={formData.sitesOfInvolvement?.[site] || false}
                      onChange={(e) => handleInputChange(e, 'sitesOfInvolvement')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm capitalize">{site.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="label font-semibold">Prodromal symptoms</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                {['pain', 'burningSensation', 'hyperesthesia', 'paresthesia', 'itching', 'tinglingSensation', 'headache'].map(symptom => (
                  <label key={symptom} className="flex items-center">
                    <input
                      type="checkbox"
                      name={symptom}
                      checked={formData.prodromalSymptoms?.[symptom] || false}
                      onChange={(e) => handleInputChange(e, 'prodromalSymptoms')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm capitalize">{symptom.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Duration of prodromes</label>
              <select
                name="durationOfProdromes"
                value={formData.durationOfProdromes}
                onChange={handleInputChange}
                className="input"
                disabled={!canEdit}
              >
                <option value="">Select</option>
                <option value="Days">Days</option>
                <option value="Months">Months</option>
              </select>
            </div>
          </div>

          {/* Pain & History Details */}
          <div className="card">
            <h3 className="form-section-title">Pain & History Details</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Name of Pain</label>
                <input
                  type="text"
                  name="nameOfPain"
                  value={formData.nameOfPain}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Pricking / Burning / Stabbing / Dulaching / Dragging / Spasmodic"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label font-semibold">H/o</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                  {['chickenPox', 'diabetes', 'hiv', 'surgery', 'drugs', 'postherpeticNeuralgia', 'naiveMedication'].map(item => (
                    <label key={item} className="flex items-center">
                      <input
                        type="checkbox"
                        name={item}
                        checked={formData.historyOf?.[item] || false}
                        onChange={(e) => handleInputChange(e, 'historyOf')}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm capitalize">{item.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Surrounding skin</label>
                <select
                  name="surroundingSkin"
                  value={formData.surroundingSkin}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Erythematous">Erythematous</option>
                  <option value="Pigmented">Pigmented</option>
                </select>
              </div>
            </div>
          </div>

          {/* Itching Details */}
          <div className="card">
            <h3 className="form-section-title">Itching</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Intensity</label>
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
                <label className="label">Diurnal variation</label>
                <select
                  name="diurnalVariation"
                  value={formData.diurnalVariation}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                  <option value="Constant">Constant</option>
                  <option value="Occasional">Occasional</option>
                </select>
              </div>
              <div>
                <label className="label">Started</label>
                <select
                  name="itchingStarted"
                  value={formData.itchingStarted}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Prior to">Prior to</option>
                  <option value="Along">Along</option>
                  <option value="After the onset of lesions">After the onset of lesions</option>
                </select>
              </div>
              <div>
                <label className="label">Agg / relieving factors</label>
                <input
                  type="text"
                  name="aggRelievingFactors"
                  value={formData.aggRelievingFactors}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Other Constitutional Symptoms */}
          <div className="card">
            <h3 className="form-section-title">Other Constitutional Symptoms</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {['fever', 'nausea', 'anorexia', 'lossOfWeight', 'vomiting'].map(symptom => (
                <label key={symptom} className="flex items-center">
                  <input
                    type="checkbox"
                    name={symptom}
                    checked={formData.constitutionalSymptoms?.[symptom] || false}
                    onChange={(e) => handleInputChange(e, 'constitutionalSymptoms')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm capitalize">{symptom.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Past History */}
          <div className="card">
            <h3 className="form-section-title">Past History</h3>
            <div className="space-y-4">
              <div>
                <label className="label">History of similar illness</label>
                <select
                  name="similarIllness"
                  value={formData.pastHistory?.similarIllness || ''}
                  onChange={(e) => handleInputChange(e, 'pastHistory')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              {formData.pastHistory?.similarIllness === 'Present' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ml-6">
                  <div>
                    <label className="label">Onset</label>
                    <input
                      type="text"
                      name="onset"
                      value={formData.pastHistory?.onset || ''}
                      onChange={(e) => handleInputChange(e, 'pastHistory')}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.pastHistory?.duration || ''}
                      onChange={(e) => handleInputChange(e, 'pastHistory')}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label">Course</label>
                    <input
                      type="text"
                      name="course"
                      value={formData.pastHistory?.course || ''}
                      onChange={(e) => handleInputChange(e, 'pastHistory')}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Family History */}
          <div className="card">
            <h3 className="form-section-title">Family History</h3>
            <div>
              <label className="label">Similar complaints in Mother / Father / Brother / Sister / Others</label>
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

          {/* Personal History */}
          <div className="card">
            <h3 className="form-section-title">Personal History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Appetite</label>
                <input
                  type="text"
                  name="appetite"
                  value={formData.personalHistory?.appetite || ''}
                  onChange={(e) => handleInputChange(e, 'personalHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Diet</label>
                <input
                  type="text"
                  name="diet"
                  value={formData.personalHistory?.diet || ''}
                  onChange={(e) => handleInputChange(e, 'personalHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Sleep</label>
                <input
                  type="text"
                  name="sleep"
                  value={formData.personalHistory?.sleep || ''}
                  onChange={(e) => handleInputChange(e, 'personalHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Bowel and bladder habits</label>
                <input
                  type="text"
                  name="bowelBladderHabits"
                  value={formData.personalHistory?.bowelBladderHabits || ''}
                  onChange={(e) => handleInputChange(e, 'personalHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* General Physical Examination */}
          <div className="card">
            <h3 className="form-section-title">General Physical Examination</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">General condition</label>
                <select
                  name="generalCondition"
                  value={formData.generalPhysicalExam?.generalCondition || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="label">Nutrition - Build</label>
                <input
                  type="text"
                  name="build"
                  value={formData.generalPhysicalExam?.build || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Pallor</label>
                <input
                  type="text"
                  name="pallor"
                  value={formData.generalPhysicalExam?.pallor || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Jaundice</label>
                <input
                  type="text"
                  name="jaundice"
                  value={formData.generalPhysicalExam?.jaundice || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Clubbing</label>
                <input
                  type="text"
                  name="clubbing"
                  value={formData.generalPhysicalExam?.clubbing || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Cyanosis</label>
                <input
                  type="text"
                  name="cyanosis"
                  value={formData.generalPhysicalExam?.cyanosis || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Edema</label>
                <select
                  name="edema"
                  value={formData.generalPhysicalExam?.edema || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Pitting">Pitting</option>
                  <option value="Non pitting">Non pitting</option>
                  <option value="Generalized">Generalized</option>
                </select>
              </div>
              <div>
                <label className="label">Lymphnodes</label>
                <input
                  type="text"
                  name="lymphnodes"
                  value={formData.generalPhysicalExam?.lymphnodes || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
              <div>
                <label className="label">PR</label>
                <input
                  type="text"
                  name="pr"
                  value={formData.generalPhysicalExam?.pr || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">RR</label>
                <input
                  type="text"
                  name="rr"
                  value={formData.generalPhysicalExam?.rr || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">BP</label>
                <input
                  type="text"
                  name="bp"
                  value={formData.generalPhysicalExam?.bp || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Wt</label>
                <input
                  type="text"
                  name="wt"
                  value={formData.generalPhysicalExam?.wt || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Temp</label>
                <input
                  type="text"
                  name="temp"
                  value={formData.generalPhysicalExam?.temp || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Ht</label>
                <input
                  type="text"
                  name="ht"
                  value={formData.generalPhysicalExam?.ht || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="label">Hydration</label>
                <select
                  name="hydration"
                  value={formData.generalPhysicalExam?.hydration || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="label">Hair</label>
                <select
                  name="hair"
                  value={formData.generalPhysicalExam?.hair || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Scarring alopecia">Scarring alopecia</option>
                </select>
              </div>
              <div>
                <label className="label">Nail</label>
                <input
                  type="text"
                  name="nail"
                  value={formData.generalPhysicalExam?.nail || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  placeholder="Normal / Absent / Any changes"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Mucosa - Oral</label>
                <input
                  type="text"
                  name="mucosaOral"
                  value={formData.generalPhysicalExam?.mucosaOral || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Mucosa - Genital</label>
                <input
                  type="text"
                  name="mucosaGenital"
                  value={formData.generalPhysicalExam?.mucosaGenital || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
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
                  value={formData.systemicExam?.cvs || ''}
                  onChange={(e) => handleInputChange(e, 'systemicExam')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">RS</label>
                <textarea
                  name="rs"
                  value={formData.systemicExam?.rs || ''}
                  onChange={(e) => handleInputChange(e, 'systemicExam')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">CNS</label>
                <textarea
                  name="cns"
                  value={formData.systemicExam?.cns || ''}
                  onChange={(e) => handleInputChange(e, 'systemicExam')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Abdomen</label>
                <textarea
                  name="abdomen"
                  value={formData.systemicExam?.abdomen || ''}
                  onChange={(e) => handleInputChange(e, 'systemicExam')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Cutaneous Examination */}
          <div className="card">
            <h3 className="form-section-title">Cutaneous Examination</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Distribution</label>
                <select
                  name="distribution"
                  value={formData.cutaneousExam?.distribution || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Unilateral">Unilateral</option>
                  <option value="Bilateral">Bilateral</option>
                  <option value="Symmetrical">Symmetrical</option>
                  <option value="Asymmetrical">Asymmetrical</option>
                </select>
              </div>
              <div>
                <label className="label">Number</label>
                <select
                  name="number"
                  value={formData.cutaneousExam?.number || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>
              {formData.cutaneousExam?.number === 'Multiple' && (
                <div>
                  <label className="label">Multiple type</label>
                  <select
                    name="numberMultiple"
                    value={formData.cutaneousExam?.numberMultiple || ''}
                    onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Disseminated">Disseminated</option>
                    <option value="Generalized">Generalized</option>
                    <option value="Multidermatomal">Multidermatomal</option>
                  </select>
                </div>
              )}
              <div>
                <label className="label">Type of lesion</label>
                <input
                  type="text"
                  name="typeOfLesion"
                  value={formData.cutaneousExam?.typeOfLesion || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  placeholder="Vesicles / Bullae / Crusts / Scabs / Erosions"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Configuration</label>
                <select
                  name="configuration"
                  value={formData.cutaneousExam?.configuration || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Discrete">Discrete</option>
                  <option value="Grouped">Grouped</option>
                </select>
              </div>
              <div>
                <label className="label">Nature of vesicle</label>
                <select
                  name="natureOfVesicle"
                  value={formData.cutaneousExam?.natureOfVesicle || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Tense">Tense</option>
                  <option value="Flaccid">Flaccid</option>
                </select>
              </div>
              <div>
                <label className="label">Content</label>
                <select
                  name="content"
                  value={formData.cutaneousExam?.content || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Clear fluid">Clear fluid</option>
                  <option value="Turbid">Turbid</option>
                  <option value="Hemorrhagic">Hemorrhagic</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">Sites</label>
                <input
                  type="text"
                  name="sites"
                  value={formData.cutaneousExam?.sites || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  placeholder="Scalp / Face / Neck / Ears / Chest / Abdomen / Back / Upper extremities / Lower extremities / Palms / Soles / Oral / Genital"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Surrounding skin</label>
                <select
                  name="surroundingSkin"
                  value={formData.cutaneousExam?.surroundingSkin || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Erythematous">Erythematous</option>
                </select>
              </div>
            </div>
          </div>

          {/* Investigations */}
          <div className="card">
            <h3 className="form-section-title">Investigations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label">Blood - Hb</label>
                <input
                  type="text"
                  name="bloodHb"
                  value={formData.investigations?.bloodHb || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Blood - TC</label>
                <input
                  type="text"
                  name="bloodTC"
                  value={formData.investigations?.bloodTC || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Blood - DC</label>
                <input
                  type="text"
                  name="bloodDC"
                  value={formData.investigations?.bloodDC || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Blood - ESR</label>
                <input
                  type="text"
                  name="bloodESR"
                  value={formData.investigations?.bloodESR || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Tzank smear</label>
                <textarea
                  name="tzankSmear"
                  value={formData.investigations?.tzankSmear || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Any other tests</label>
                <textarea
                  name="anyOtherTests"
                  value={formData.investigations?.anyOtherTests || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">HIV 1 and 2</label>
                <input
                  type="text"
                  name="hiv1And2"
                  value={formData.investigations?.hiv1And2 || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">CD4 count</label>
                <input
                  type="text"
                  name="cd4Count"
                  value={formData.investigations?.cd4Count || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">1. No. of dermatomes</label>
                  <input
                    type="text"
                    name="noOfDermatomes"
                    value={formData.investigations?.noOfDermatomes || ''}
                    onChange={(e) => handleInputChange(e, 'investigations')}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">2. Which dermatomes</label>
                  <input
                    type="text"
                    name="whichDermatomes"
                    value={formData.investigations?.whichDermatomes || ''}
                    onChange={(e) => handleInputChange(e, 'investigations')}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">3. Cranial nerve involvement</label>
                  <input
                    type="text"
                    name="cranialNerveInvolvement"
                    value={formData.investigations?.cranialNerveInvolvement || ''}
                    onChange={(e) => handleInputChange(e, 'investigations')}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">4. Difficulty in swallowing, urinary retention</label>
                  <input
                    type="text"
                    name="difficultySwallowingUrinaryRetention"
                    value={formData.investigations?.difficultySwallowingUrinaryRetention || ''}
                    onChange={(e) => handleInputChange(e, 'investigations')}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div>
                <label className="label font-semibold">5. Complications</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div>
                    <label className="label text-sm">1. Ophthalmic</label>
                    <textarea
                      name="complicationsOphthalmic"
                      value={formData.investigations?.complicationsOphthalmic || ''}
                      onChange={(e) => handleInputChange(e, 'investigations')}
                      className="input"
                      rows="2"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">2. Cutaneous</label>
                    <textarea
                      name="complicationsCutaneous"
                      value={formData.investigations?.complicationsCutaneous || ''}
                      onChange={(e) => handleInputChange(e, 'investigations')}
                      className="input"
                      rows="2"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">3. Neurological</label>
                    <textarea
                      name="complicationsNeurological"
                      value={formData.investigations?.complicationsNeurological || ''}
                      onChange={(e) => handleInputChange(e, 'investigations')}
                      className="input"
                      rows="2"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>
            </div>
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

export default HerpesZosterProforma;
