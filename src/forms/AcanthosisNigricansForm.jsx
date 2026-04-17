import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const AcanthosisNigricansForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    date: '',
    age: '',
    maritalStatus: '',
    sex: '',
    occupation: '',
    address: '',
    phoneNo: '',
    education: '',
    urbanRural: '',
    religion: '',

    // History of Presenting Illness
    darknessOfSkin: '',
    darknessOthers: '',
    duration: '',
    onset: '',
    siteOfDistribution: {
      neckBack: false,
      neckSides: false,
      neckFront: false,
      axillaRT: false,
      axillaLT: false,
      groinRT: false,
      groinLT: false,
      elbowRT: false,
      elbowLT: false,
      antecubitalRT: false,
      antecubitalLF: false,
      poplitealRT: false,
      poplitealLT: false,
      knuckles: '',
      temples: false,
      aroundEyes: false,
      nasolabialFold: false,
      periumbilical: false,
      kneeRT: false,
      kneeLT: false,
      others: ''
    },
    weightGain: '',
    weightGained: '',
    weightDuration: '',
    lethargy: false,
    hairLoss: false,
    drySkin: false,
    coldIntolerance: false,
    voiceChange: false,
    increasedSweating: false,
    decreasedSleep: false,
    anxiety: false,
    heatIntolerance: false,
    tremors: false,
    palpitations: false,
    hematemesis: false,
    painAbdomen: false,
    lossOfAppetite: false,
    lossOfWeight: false,
    increasedHairGrowth: '',
    hoFace: false,
    hoNonFacial: false,
    hoDiabetes: false,
    hoHypertension: false,
    hoMalignancy: false,
    hoHypothyroidism: false,
    hoHyperthyroidism: false,
    hoCardiovascular: false,
    hoMedication: '',
    medicationDetails: {
      nicotinicAcid: false,
      fusidicAcid: false,
      stilbestrol: false,
      triazinate: false,
      antiretroviral: false,
      insulin: false,
      corticosteroids: false,
      diethylstilbestrol: false,
      oralContraceptives: false,
      methyltestosterone: false,
      growthHormone: false
    },
    durationOfMedication: '',

    // Past History
    similarComplaints: '',
    treatmentTaken: '',
    pastHistoryOthers: '',

    // Family History
    familyDarkening: false,
    familyDiabetes: false,
    familyHypertension: false,
    familyHypothyroidism: false,
    familyHyperthyroidism: false,
    familyCardiovascular: false,
    familyMalignancy: '',
    associatedSkinChanges: '',

    // Personal History
    diet: '',
    appetite: '',
    sleep: '',
    bladderBowel: '',
    habits: {
      smoking: false,
      alcohol: false,
      others: ''
    },
    physicalActivity: '',

    // Menstrual History
    ageOfMenarche: '',
    menstrualCycles: '',
    menstrualRegularity: '',
    flow: '',

    // General Physical Examination
    pallor: false,
    icterus: false,
    cyanosis: false,
    clubbing: false,
    edema: false,
    lymphadenopathy: false,
    pulseRate: '',
    bp: '',
    height: '',
    weight: '',
    bmi: '',
    waistCircumference: '',
    hipCircumference: '',
    waistHipRatio: '',

    // Cutaneous Examination - Neck Severity
    neckSeverity: '',
    neckSeverityDescription: '',

    // Cutaneous Examination - Axilla
    axillaSeverity: '',
    axillaDescription: '',

    // Cutaneous Examination - Neck Texture
    neckTexture: '',
    neckTextureDescription: '',

    // Cutaneous Examination - Other Sites
    knuckles: '',
    elbows: '',
    knees: '',

    // Associated Conditions
    acneGrade: '',
    acrochordonSites: {
      neck: false,
      axilla: false,
      groin: false,
      others: ''
    },
    bacterialInfections: {
      pyoderma: false,
      erythrasma: false,
      trichomycosis: false
    },
    fungalInfections: {
      pVersicolor: false,
      dermatophytic: false
    },
    striaeDistansae: {
      rubra: false,
      alba: false,
      arms: false,
      trunk: false,
      gluteal: false,
      lowerLimb: false
    },
    hirsutismGrade: '',
    hirsutismSite: '',
    androgenicAlopeciaMale: '',
    androgenicAllopeciaFemale: '',
    seborrheicKeratosis: {
      dpn: false,
      melanoacanthoma: false,
      leserTrelat: false,
      site: ''
    },
    associatedConditionsOthers: '',

    // Systemic Examination
    cardiovascularSystem: '',
    respiratorySystem: '',
    perAbdomen: '',
    centralNervousSystem: '',

    // Investigations
    serumInsulinFasting: '',
    serumInsulinFastingRef: '',
    serumInsulinPostPrandial: '',
    serumInsulinPostPrandialRef: '',
    bloodSugarFasting: '',
    bloodSugarFastingRef: '',
    bloodSugarPostPrandial: '',
    bloodSugarPostPrandialRef: '',
    totalCholesterol: '',
    totalCholesterolRef: '',
    triglycerides: '',
    triglyceridesRef: '',
    hdl: '',
    hdlRef: '',
    vldl: '',
    vldlRef: '',
    ldl: '',
    ldlRef: '',
    cholHdl: '',
    cholHdlRef: '',

    // Treatment
    treatment: ''
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
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('siteOfDistribution.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        siteOfDistribution: {
          ...prev.siteOfDistribution,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('medicationDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        medicationDetails: {
          ...prev.medicationDetails,
          [field]: checked
        }
      }));
    } else if (name.startsWith('habits.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        habits: {
          ...prev.habits,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('acrochordonSites.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        acrochordonSites: {
          ...prev.acrochordonSites,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('bacterialInfections.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bacterialInfections: {
          ...prev.bacterialInfections,
          [field]: checked
        }
      }));
    } else if (name.startsWith('fungalInfections.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        fungalInfections: {
          ...prev.fungalInfections,
          [field]: checked
        }
      }));
    } else if (name.startsWith('striaeDistansae.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        striaeDistansae: {
          ...prev.striaeDistansae,
          [field]: checked
        }
      }));
    } else if (name.startsWith('seborrheicKeratosis.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        seborrheicKeratosis: {
          ...prev.seborrheicKeratosis,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
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
            formType: 'Acanthosis Nigricans',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Acanthosis Nigricans',
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
              ACANTHOSIS NIGRICANS PROFORMA
            </h1>
            <p className="text-center text-gray-600 text-sm mt-2">
              Department of Dermatology, Venereology and Leprology
            </p>
            <p className="text-center text-gray-600 text-sm">
              J.J.M. Medical College, Davangere - 577004
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </select>
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
                <label className="label">Phone No.</label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Urban / Rural</label>
                <select
                  name="urbanRural"
                  value={formData.urbanRural}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
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
            </div>
          </div>

          {/* History of Presenting Illness */}
          <div className="card">
            <h3 className="form-section-title">History of Presenting Illness</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Darkness of the skin</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="darknessOfSkin"
                      value="Asymptomatic"
                      checked={formData.darknessOfSkin === 'Asymptomatic'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>Asymptomatic</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="darknessOfSkin"
                      value="Itchy"
                      checked={formData.darknessOfSkin === 'Itchy'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>Itchy</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="darknessOfSkin"
                      value="Unsightly appearance"
                      checked={formData.darknessOfSkin === 'Unsightly appearance'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>Unsightly appearance</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="darknessOfSkin"
                      value="Others"
                      checked={formData.darknessOfSkin === 'Others'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>Others</span>
                  </label>
                </div>
                {formData.darknessOfSkin === 'Others' && (
                  <input
                    type="text"
                    name="darknessOthers"
                    value={formData.darknessOthers}
                    onChange={handleInputChange}
                    className="input mt-2"
                    placeholder="Specify others"
                    disabled={!canEdit}
                  />
                )}
              </div>

              <div>
                <label className="label">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Onset</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="onset"
                      value="Acute"
                      checked={formData.onset === 'Acute'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>Acute</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="onset"
                      value="Insidious"
                      checked={formData.onset === 'Insidious'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>Insidious</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label font-semibold">Site of Distribution</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2 p-3 bg-gray-50 rounded">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.neckBack"
                      checked={formData.siteOfDistribution.neckBack}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Neck (Back)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.neckSides"
                      checked={formData.siteOfDistribution.neckSides}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Neck (Sides)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.neckFront"
                      checked={formData.siteOfDistribution.neckFront}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Neck (Front)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.axillaRT"
                      checked={formData.siteOfDistribution.axillaRT}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Axilla (RT)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.axillaLT"
                      checked={formData.siteOfDistribution.axillaLT}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Axilla (LT)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.groinRT"
                      checked={formData.siteOfDistribution.groinRT}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Groin (RT/LT)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.elbowRT"
                      checked={formData.siteOfDistribution.elbowRT}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Elbow (RT/LT)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.antecubitalRT"
                      checked={formData.siteOfDistribution.antecubitalRT}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Antecubital fossa</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.poplitealRT"
                      checked={formData.siteOfDistribution.poplitealRT}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Popliteal fossa</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.temples"
                      checked={formData.siteOfDistribution.temples}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Temples</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.aroundEyes"
                      checked={formData.siteOfDistribution.aroundEyes}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Around eyes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.nasolabialFold"
                      checked={formData.siteOfDistribution.nasolabialFold}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Nasolabial fold</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.periumbilical"
                      checked={formData.siteOfDistribution.periumbilical}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Periumbilical region</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="siteOfDistribution.kneeRT"
                      checked={formData.siteOfDistribution.kneeRT}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Knee (RT/LT)</span>
                  </label>
                </div>
                <div className="mt-2">
                  <label className="label text-sm">Knuckles (Specify)</label>
                  <input
                    type="text"
                    name="siteOfDistribution.knuckles"
                    value={formData.siteOfDistribution.knuckles}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div className="mt-2">
                  <label className="label text-sm">Others</label>
                  <input
                    type="text"
                    name="siteOfDistribution.others"
                    value={formData.siteOfDistribution.others}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div>
                <label className="label">H/O Weight Gain</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="weightGain"
                      value="YES"
                      checked={formData.weightGain === 'YES'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>YES</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="weightGain"
                      value="NO"
                      checked={formData.weightGain === 'NO'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>NO</span>
                  </label>
                </div>
                {formData.weightGain === 'YES' && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="label text-sm">Weight gained</label>
                      <input
                        type="text"
                        name="weightGained"
                        value={formData.weightGained}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </div>
                    <div>
                      <label className="label text-sm">In Duration</label>
                      <input
                        type="text"
                        name="weightDuration"
                        value={formData.weightDuration}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="label">H/O (Select applicable)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="lethargy"
                      checked={formData.lethargy}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Lethargy / Hair loss</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="drySkin"
                      checked={formData.drySkin}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Dry skin</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="coldIntolerance"
                      checked={formData.coldIntolerance}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Cold intolerance</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="voiceChange"
                      checked={formData.voiceChange}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Voice change</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="increasedSweating"
                      checked={formData.increasedSweating}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Increased sweating</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="decreasedSleep"
                      checked={formData.decreasedSleep}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Decreased sleep</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="anxiety"
                      checked={formData.anxiety}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Anxiety</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="heatIntolerance"
                      checked={formData.heatIntolerance}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Heat intolerance</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="tremors"
                      checked={formData.tremors}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Tremors</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="palpitations"
                      checked={formData.palpitations}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Palpitations</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="hematemesis"
                      checked={formData.hematemesis}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Hematemesis</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="painAbdomen"
                      checked={formData.painAbdomen}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Pain abdomen</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="lossOfAppetite"
                      checked={formData.lossOfAppetite}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Loss of Appetite</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="lossOfWeight"
                      checked={formData.lossOfWeight}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Loss of weight</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label">H/O Increased hair growth</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="hoFace"
                      checked={formData.hoFace}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Face</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="hoNonFacial"
                      checked={formData.hoNonFacial}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Non facial (For females)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label">H/O Medical Conditions</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="hoDiabetes"
                      checked={formData.hoDiabetes}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Diabetes mellitus</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="hoHypertension"
                      checked={formData.hoHypertension}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Hypertension</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="hoMalignancy"
                      checked={formData.hoMalignancy}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Malignancy</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="hoHypothyroidism"
                      checked={formData.hoHypothyroidism}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Hypothyroidism</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="hoHyperthyroidism"
                      checked={formData.hoHyperthyroidism}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Hyperthyroidism</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="hoCardiovascular"
                      checked={formData.hoCardiovascular}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Cardiovascular disease</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label">H/O Medication</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="hoMedication"
                      value="Yes"
                      checked={formData.hoMedication === 'Yes'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="hoMedication"
                      value="No"
                      checked={formData.hoMedication === 'No'}
                      onChange={handleInputChange}
                      className="radio"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
                {formData.hoMedication === 'Yes' && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium mb-2">If Yes, select medications:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="medicationDetails.nicotinicAcid"
                          checked={formData.medicationDetails.nicotinicAcid}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span className="text-sm">Nicotinic acid</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="medicationDetails.fusidicAcid"
                          checked={formData.medicationDetails.fusidicAcid}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span className="text-sm">Fusidic acid</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="medicationDetails.stilbestrol"
                          checked={formData.medicationDetails.stilbestrol}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span className="text-sm">Stilbestrol in young males</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="medicationDetails.triazinate"
                          checked={formData.medicationDetails.triazinate}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span className="text-sm">Triazinate - Folic acid antagonist</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="medicationDetails.antiretroviral"
                          checked={formData.medicationDetails.antiretroviral}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span className="text-sm">Antiretroviral drugs</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="medicationDetails.insulin"
                          checked={formData.medicationDetails.insulin}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span className="text-sm">Insulin</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="medicationDetails.corticosteroids"
                          checked={formData.medicationDetails.corticosteroids}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span className="text-sm">Systemic corticosteroids</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="medicationDetails.diethylstilbestrol"
                          checked={formData.medicationDetails.diethylstilbestrol}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span className="text-sm">Diethylstilbestrol</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="medicationDetails.oralContraceptives"
                          checked={formData.medicationDetails.oralContraceptives}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span className="text-sm">Oral contraceptives</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="medicationDetails.methyltestosterone"
                          checked={formData.medicationDetails.methyltestosterone}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span className="text-sm">Methyltestosterone</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="medicationDetails.growthHormone"
                          checked={formData.medicationDetails.growthHormone}
                          onChange={handleInputChange}
                          className="checkbox"
                          disabled={!canEdit}
                        />
                        <span className="text-sm">Growth hormone therapy</span>
                      </label>
                    </div>
                    <div className="mt-3">
                      <label className="label text-sm">Duration of medication</label>
                      <input
                        type="text"
                        name="durationOfMedication"
                        value={formData.durationOfMedication}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Past History */}
          <div className="card">
            <h3 className="form-section-title">Past History</h3>
            <div className="space-y-4">
              <div>
                <label className="label">H/o similar complaints</label>
                <textarea
                  name="similarComplaints"
                  value={formData.similarComplaints}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Treatment taken</label>
                <textarea
                  name="treatmentTaken"
                  value={formData.treatmentTaken}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Others</label>
                <textarea
                  name="pastHistoryOthers"
                  value={formData.pastHistoryOthers}
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
                <label className="label">H/o Family Conditions</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="familyDarkening"
                      checked={formData.familyDarkening}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Darkening of skin</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="familyDiabetes"
                      checked={formData.familyDiabetes}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Diabetes mellitus</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="familyHypertension"
                      checked={formData.familyHypertension}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Hypertension</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="familyHypothyroidism"
                      checked={formData.familyHypothyroidism}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Hypothyroidism</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="familyHyperthyroidism"
                      checked={formData.familyHyperthyroidism}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Hyperthyroidism</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="familyCardiovascular"
                      checked={formData.familyCardiovascular}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Cardiovascular disease</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label">H/o Malignancy in the family</label>
                <textarea
                  name="familyMalignancy"
                  value={formData.familyMalignancy}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Any associated skin changes</label>
                <textarea
                  name="associatedSkinChanges"
                  value={formData.associatedSkinChanges}
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
                  <option value="Non-veg">Non-veg</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="label">Appetite</label>
                <select
                  name="appetite"
                  value={formData.appetite}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Reduced">Reduced</option>
                </select>
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
                  <option value="Normal">Normal</option>
                  <option value="Disturbed">Disturbed</option>
                </select>
              </div>

              <div>
                <label className="label">Bladder / Bowel</label>
                <select
                  name="bladderBowel"
                  value={formData.bladderBowel}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Irregular">Irregular</option>
                </select>
              </div>

              <div>
                <label className="label">Habits</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="habits.smoking"
                      checked={formData.habits.smoking}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Smoking</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="habits.alcohol"
                      checked={formData.habits.alcohol}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Alcohol</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="habits.others"
                  value={formData.habits.others}
                  onChange={handleInputChange}
                  className="input mt-2"
                  placeholder="Others"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Physical activity</label>
                <select
                  name="physicalActivity"
                  value={formData.physicalActivity}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Sedentary">Sedentary</option>
                  <option value="Active">Active</option>
                </select>
              </div>
            </div>
          </div>

          {/* Menstrual History */}
          <div className="card">
            <h3 className="form-section-title">Menstrual History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Age of Menarche</label>
                <input
                  type="text"
                  name="ageOfMenarche"
                  value={formData.ageOfMenarche}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Menstrual cycles</label>
                <input
                  type="text"
                  name="menstrualCycles"
                  value={formData.menstrualCycles}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Regularity</label>
                <select
                  name="menstrualRegularity"
                  value={formData.menstrualRegularity}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Irregular">Irregular</option>
                </select>
              </div>

              <div>
                <label className="label">Flow</label>
                <select
                  name="flow"
                  value={formData.flow}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Decreased">Decreased</option>
                  <option value="Increased">Increased</option>
                </select>
              </div>
            </div>
          </div>

          {/* General Physical Examination */}
          <div className="card">
            <h3 className="form-section-title">General Physical Examination</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="pallor"
                    checked={formData.pallor}
                    onChange={handleInputChange}
                    className="checkbox"
                    disabled={!canEdit}
                  />
                  <span>Pallor</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="icterus"
                    checked={formData.icterus}
                    onChange={handleInputChange}
                    className="checkbox"
                    disabled={!canEdit}
                  />
                  <span>Icterus</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="cyanosis"
                    checked={formData.cyanosis}
                    onChange={handleInputChange}
                    className="checkbox"
                    disabled={!canEdit}
                  />
                  <span>Cyanosis</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="clubbing"
                    checked={formData.clubbing}
                    onChange={handleInputChange}
                    className="checkbox"
                    disabled={!canEdit}
                  />
                  <span>Clubbing</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="edema"
                    checked={formData.edema}
                    onChange={handleInputChange}
                    className="checkbox"
                    disabled={!canEdit}
                  />
                  <span>Edema</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="lymphadenopathy"
                    checked={formData.lymphadenopathy}
                    onChange={handleInputChange}
                    className="checkbox"
                    disabled={!canEdit}
                  />
                  <span>Lymphadenopathy</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="label">Pulse rate</label>
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
                  <label className="label">Height (m)</label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">Weight (kg)</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">BMI (Wt in kg / Ht in m²)</label>
                  <input
                    type="text"
                    name="bmi"
                    value={formData.bmi}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">Waist circumference</label>
                  <input
                    type="text"
                    name="waistCircumference"
                    value={formData.waistCircumference}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">Hip circumference</label>
                  <input
                    type="text"
                    name="hipCircumference"
                    value={formData.hipCircumference}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">Waist/Hip ratio</label>
                  <input
                    type="text"
                    name="waistHipRatio"
                    value={formData.waistHipRatio}
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
            
            {/* Neck Severity */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Neck Severity</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Grade</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-center w-24">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">0 (ABSENT)</td>
                      <td className="border border-gray-300 px-4 py-2">Not detectable on close inspection</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="neckSeverity"
                          value="0"
                          checked={formData.neckSeverity === '0'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">1 (PRESENT)</td>
                      <td className="border border-gray-300 px-4 py-2">Clearly present on close visual inspection. Extent not measureable</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="neckSeverity"
                          value="1"
                          checked={formData.neckSeverity === '1'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">2 (MILD)</td>
                      <td className="border border-gray-300 px-4 py-2">Limited to the base of the skull. Does not extend to the lateral margins of neck (Usually 3 inches in breadth)</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="neckSeverity"
                          value="2"
                          checked={formData.neckSeverity === '2'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">3 (MODERATE)</td>
                      <td className="border border-gray-300 px-4 py-2">Extending to the lateral margin of the neck (posterior border of the sternocleidomastoid muscle) (3-6 inches). Not visible from front</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="neckSeverity"
                          value="3"
                          checked={formData.neckSeverity === '3'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">4 (SEVERE)</td>
                      <td className="border border-gray-300 px-4 py-2">Extending anteriorly (&gt;6 inches). visible when the participant is viewed from the front</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="neckSeverity"
                          value="4"
                          checked={formData.neckSeverity === '4'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Axilla Severity */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Axilla</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Grade</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-center w-24">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">0 (ABSENT)</td>
                      <td className="border border-gray-300 px-4 py-2">Not detectable on close inspection</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="axillaSeverity"
                          value="0"
                          checked={formData.axillaSeverity === '0'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">1 (PRESENT)</td>
                      <td className="border border-gray-300 px-4 py-2">Clearly present on close visual inspection. Extent not measureable</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="axillaSeverity"
                          value="1"
                          checked={formData.axillaSeverity === '1'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">2 (MILD)</td>
                      <td className="border border-gray-300 px-4 py-2">Localized to the central portion of the axilla. May have gone unnoticed by the participant</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="axillaSeverity"
                          value="2"
                          checked={formData.axillaSeverity === '2'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">3 (MODERATE)</td>
                      <td className="border border-gray-300 px-4 py-2">Involve entire axillary fossa , but not visible when the arm is against the participant's side</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="axillaSeverity"
                          value="3"
                          checked={formData.axillaSeverity === '3'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">4 (SEVERE)</td>
                      <td className="border border-gray-300 px-4 py-2">Visible from front or back in unclothed participant when the arm is against the participant's side</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="axillaSeverity"
                          value="4"
                          checked={formData.axillaSeverity === '4'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Neck Texture */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Neck Texture</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Grade</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-2 text-center w-24">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">0</td>
                      <td className="border border-gray-300 px-4 py-2">Smooth to touch - No differentiation from normal skin to palpation</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="neckTexture"
                          value="0"
                          checked={formData.neckTexture === '0'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">1</td>
                      <td className="border border-gray-300 px-4 py-2">Rough to touch – Clearly differentiated from normal skin</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="neckTexture"
                          value="1"
                          checked={formData.neckTexture === '1'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">2</td>
                      <td className="border border-gray-300 px-4 py-2">Coarseness can be observed visually , portion of skin clearly raised above other areas</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="neckTexture"
                          value="2"
                          checked={formData.neckTexture === '2'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">3</td>
                      <td className="border border-gray-300 px-4 py-2">Extremely coarse – Hills and valleys observable on visual examination</td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <input
                          type="radio"
                          name="neckTexture"
                          value="3"
                          checked={formData.neckTexture === '3'}
                          onChange={handleInputChange}
                          className="radio"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Other Sites */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Knuckles</label>
                <select
                  name="knuckles"
                  value={formData.knuckles}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                </select>
              </div>

              <div>
                <label className="label">Elbows</label>
                <select
                  name="elbows"
                  value={formData.elbows}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                </select>
              </div>

              <div>
                <label className="label">Knees</label>
                <select
                  name="knees"
                  value={formData.knees}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                </select>
              </div>
            </div>
          </div>

          {/* Associated Conditions */}
          <div className="card">
            <h3 className="form-section-title">Associated Conditions</h3>
            <div className="space-y-4">
              <div>
                <label className="label">ACNE - GRADE</label>
                <select
                  name="acneGrade"
                  value={formData.acneGrade}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="1">GRADE 1</option>
                  <option value="2">GRADE 2</option>
                  <option value="3">GRADE 3</option>
                  <option value="4">GRADE 4</option>
                </select>
              </div>

              <div>
                <label className="label">ACROCHORDON - Sites</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="acrochordonSites.neck"
                      checked={formData.acrochordonSites.neck}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Neck</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="acrochordonSites.axilla"
                      checked={formData.acrochordonSites.axilla}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Axilla</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="acrochordonSites.groin"
                      checked={formData.acrochordonSites.groin}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Groin</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="acrochordonSites.others"
                  value={formData.acrochordonSites.others}
                  onChange={handleInputChange}
                  className="input mt-2"
                  placeholder="Others"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">BACTERIAL INFECTIONS</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="bacterialInfections.pyoderma"
                      checked={formData.bacterialInfections.pyoderma}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Pyoderma</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="bacterialInfections.erythrasma"
                      checked={formData.bacterialInfections.erythrasma}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Erythrasma</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="bacterialInfections.trichomycosis"
                      checked={formData.bacterialInfections.trichomycosis}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Trichomycosis Axillaris</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label">FUNGAL INFECTIONS</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="fungalInfections.pVersicolor"
                      checked={formData.fungalInfections.pVersicolor}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>P. Versicolor</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="fungalInfections.dermatophytic"
                      checked={formData.fungalInfections.dermatophytic}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Dermatophytic Infections</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label">STRIAE DISTANSAE</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="striaeDistansae.rubra"
                      checked={formData.striaeDistansae.rubra}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Rubra</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="striaeDistansae.alba"
                      checked={formData.striaeDistansae.alba}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Alba</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-2">Sites:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="striaeDistansae.arms"
                      checked={formData.striaeDistansae.arms}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Arms</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="striaeDistansae.trunk"
                      checked={formData.striaeDistansae.trunk}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Trunk</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="striaeDistansae.gluteal"
                      checked={formData.striaeDistansae.gluteal}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Gluteal region</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="striaeDistansae.lowerLimb"
                      checked={formData.striaeDistansae.lowerLimb}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Lower limb</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">HIRSUTISM - Grade</label>
                  <input
                    type="text"
                    name="hirsutismGrade"
                    value={formData.hirsutismGrade}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">Site</label>
                  <input
                    type="text"
                    name="hirsutismSite"
                    value={formData.hirsutismSite}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Androgenic Alopecia - Grade in males (Modified Hamilton Norwood classification)</label>
                  <input
                    type="text"
                    name="androgenicAlopeciaMale"
                    value={formData.androgenicAlopeciaMale}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <label className="label">Grade in females (Ludwig scale)</label>
                  <input
                    type="text"
                    name="androgenicAllopeciaFemale"
                    value={formData.androgenicAllopeciaFemale}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div>
                <label className="label">SEBORRHEIC KERATOSIS</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="seborrheicKeratosis.dpn"
                      checked={formData.seborrheicKeratosis.dpn}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>DPN</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="seborrheicKeratosis.melanoacanthoma"
                      checked={formData.seborrheicKeratosis.melanoacanthoma}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Melanoacanthoma</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="seborrheicKeratosis.leserTrelat"
                      checked={formData.seborrheicKeratosis.leserTrelat}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Sign of leser trelat</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="seborrheicKeratosis.site"
                  value={formData.seborrheicKeratosis.site}
                  onChange={handleInputChange}
                  className="input mt-2"
                  placeholder="Site"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Others</label>
                <textarea
                  name="associatedConditionsOthers"
                  value={formData.associatedConditionsOthers}
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
            <div className="space-y-4">
              <div>
                <label className="label">Cardiovascular System</label>
                <textarea
                  name="cardiovascularSystem"
                  value={formData.cardiovascularSystem}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Respiratory System</label>
                <textarea
                  name="respiratorySystem"
                  value={formData.respiratorySystem}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Per Abdomen</label>
                <textarea
                  name="perAbdomen"
                  value={formData.perAbdomen}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Central Nervous System</label>
                <textarea
                  name="centralNervousSystem"
                  value={formData.centralNervousSystem}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Investigations */}
          <div className="card">
            <h3 className="form-section-title">Investigations</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">TEST</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">PATIENT VALUE</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">REFERENCE VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowSpan="2" className="border border-gray-300 px-4 py-2 font-semibold">SERUM INSULIN</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="serumInsulinFasting"
                        value={formData.serumInsulinFasting}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="FASTING"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="serumInsulinFastingRef"
                        value={formData.serumInsulinFastingRef}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="serumInsulinPostPrandial"
                        value={formData.serumInsulinPostPrandial}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="POST PRANDIAL"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="serumInsulinPostPrandialRef"
                        value={formData.serumInsulinPostPrandialRef}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td rowSpan="2" className="border border-gray-300 px-4 py-2 font-semibold">BLOOD SUGAR</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="bloodSugarFasting"
                        value={formData.bloodSugarFasting}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="FASTING"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="bloodSugarFastingRef"
                        value={formData.bloodSugarFastingRef}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="bloodSugarPostPrandial"
                        value={formData.bloodSugarPostPrandial}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="POST PRANDIAL"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="bloodSugarPostPrandialRef"
                        value={formData.bloodSugarPostPrandialRef}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td rowSpan="6" className="border border-gray-300 px-4 py-2 font-semibold">LIPID PROFILE</td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="totalCholesterol"
                        value={formData.totalCholesterol}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="TOTAL CHOLESTEROL"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="totalCholesterolRef"
                        value={formData.totalCholesterolRef}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="triglycerides"
                        value={formData.triglycerides}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="TRIGLYCERIDES"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="triglyceridesRef"
                        value={formData.triglyceridesRef}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="hdl"
                        value={formData.hdl}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="HDL"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="hdlRef"
                        value={formData.hdlRef}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="vldl"
                        value={formData.vldl}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="VLDL"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="vldlRef"
                        value={formData.vldlRef}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="ldl"
                        value={formData.ldl}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="LDL"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="ldlRef"
                        value={formData.ldlRef}
                        onChange={handleInputChange}
                        className="input"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="cholHdl"
                        value={formData.cholHdl}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="CHOL/HDL"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        name="cholHdlRef"
                        value={formData.cholHdlRef}
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

          {/* Treatment */}
          <div className="card">
            <h3 className="form-section-title">Treatment</h3>
            <textarea
              name="treatment"
              value={formData.treatment}
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

export default AcanthosisNigricansForm;
