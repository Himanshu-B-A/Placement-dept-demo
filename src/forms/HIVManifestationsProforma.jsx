import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const HIVManifestationsProforma = () => {
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
    age: '',
    sex: '',
    date: '',
    religion: '',
    opIpNo: '',
    doesOccupationInvolveTravel: '',
    income: '',
    area: '',
    telNo: '',
    educationalStatus: '',
    maritalStatus: '',
    dateOfDiagnosis: '',
    reactiveFor: '',
    indicationOfInvestigation: '',

    // Presenting Complaints
    presentingComplaintsAndDuration: '',

    // History of Presenting Illness
    historyOfPresentingIllness: '',
    modeOfInfection: '',
    modeOfInfectionOther: '',
    course: '',
    onset: '',
    typesOfLesions: {
      solid: false,
      fluidFilled: false,
      pusFilled: false,
      flat: false,
      ulcerated: false,
      drynessOfSkin: false,
      nailChanges: false,
      hairLoss: false,
      others: ''
    },
    distribution: '',
    sitesInvolved: {
      scalp: false,
      oralCavity: false,
      face: false,
      neck: false,
      ul: false,
      abd: false,
      chest: false,
      back: false,
      ll: false,
      flexures: false,
      glutealReg: false,
      hairs: false,
      nails: false,
      genitalia: false
    },
    mucousMembrane: {
      itching: false,
      pain: false,
      burning: false,
      numbness: false,
      others: ''
    },
    itchingIntensity: '',
    diurnalVariation: '',
    painIntensity: '',
    constitutional: {
      fever: '',
      weightLoss: '',
      cough: false,
      looseStools: false,
      others: ''
    },
    drugIntake: {
      details: '',
      type: '',
      ht: false,
      dm: false,
      tb: false,
      atopy: false,
      drugAllergy: false,
      hz: false,
      hepatitis: false
    },
    pastHistory: {
      exposureToSTD: '',
      similarComplaints: '',
      genitalUlcersDischarge: ''
    },

    // Family History
    familyHistory: {
      similarComplaintsInSpouse: '',
      spouseTested: '',
      spouseStatus: '',
      children: []
    },

    // Sexual History
    sexualHistory: {
      typesOfActivity: '',
      numberOfPartners: '',
      numberOfIntercourse: '',
      typeOfPartner: '',
      contraceptiveUsed: '',
      contraceptiveType: ''
    },

    // Personal History
    personalHistory: {
      dietAppetite: '',
      sleep: '',
      bowel: '',
      bladder: '',
      habits: ''
    },

    // Obstetric and Menstrual History
    obstetricMenstrualHistory: {
      pastMenstrualCycles: '',
      numberOfPregnancies: '',
      numberOfMiscarriage: ''
    },

    // General Physical Examination
    generalPhysicalExam: {
      builtWeight: '',
      nutrition: '',
      pallor: '',
      icterus: '',
      cyanosis: '',
      clubbing: '',
      lymphadenopathy: '',
      edema: '',
      lymphNodes: {
        number: '',
        site: '',
        matted: '',
        others: ''
      },
      pulse: '',
      rr: '',
      temperature: '',
      bp: ''
    },

    // Oral Cavity
    oralCavity: {
      hygiene: '',
      lesions: '',
      colourLocation: '',
      dentation: ''
    },

    // Ocular Examination
    ocularExam: {
      conjunctiva: '',
      sclera: ''
    },

    // Nails and Hair
    nails: '',
    hair: '',

    // Cutaneous Examination
    cutaneousExam: {
      distribution: '',
      typesSites: '',
      numberOfLesions: ''
    },

    // Genital Lesion
    genitalLesion: {
      typeOfLesion: '',
      site: '',
      surface: '',
      colour: '',
      number: '',
      size: '',
      ulcerFloor: '',
      ulcerEdge: '',
      ulcerDischarge: '',
      ulcerTenderness: '',
      ulcerSurroundingSkin: ''
    },

    // Palpation
    palpation: {
      bleedingOnManipulation: '',
      induration: '',
      consistency: ''
    },

    // Systemic Examination
    systemicExam: {
      cvs: '',
      rs: '',
      pa: '',
      cns: '',
      musculoskeletal: ''
    },

    // Investigations
    investigations: {
      bloodCBC: '',
      tissueSmear: '',
      gramStain: '',
      tzanckSmear: '',
      serologicalTests: '',
      koh: '',
      biopsy: '',
      culture: '',
      others: ''
    },

    // Diagnosis, Treatment, Follow-up
    diagnosis: '',
    treatmentGiven: '',
    followUp: ''
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

  const handleInputChange = (e, section = null, subsection = null) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    if (section && subsection) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [subsection]: {
            ...(prev[section]?.[subsection] || {}),
            [name]: inputValue
          }
        }
      }));
    } else if (section) {
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

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      familyHistory: {
        ...(prev.familyHistory || {}),
        children: [
          ...(prev.familyHistory?.children || []),
          { sex: '', age: '', hivStatus: '' }
        ]
      }
    }));
  };

  const removeChild = (index) => {
    setFormData(prev => ({
      ...prev,
      familyHistory: {
        ...(prev.familyHistory || {}),
        children: prev.familyHistory.children.filter((_, i) => i !== index)
      }
    }));
  };

  const updateChild = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      familyHistory: {
        ...(prev.familyHistory || {}),
        children: prev.familyHistory.children.map((child, i) => 
          i === index ? { ...child, [field]: value } : child
        )
      }
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
            formType: 'HIV Manifestations',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'HIV Manifestations',
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
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-primary-600 mt-2">MUCOCUTANEOUS MANIFESTATIONS OF HIV</h3>
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
                <label className="label">OP / IP No.</label>
                <input
                  type="text"
                  name="opIpNo"
                  value={formData.opIpNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div className="lg:col-span-2">
                <label className="label">Does Occupation involve Travel</label>
                <input
                  type="text"
                  name="doesOccupationInvolveTravel"
                  value={formData.doesOccupationInvolveTravel}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Income</label>
                <input
                  type="text"
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Area</label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                  <option value="Migrant">Migrant</option>
                </select>
              </div>
              <div>
                <label className="label">Tel. No.</label>
                <input
                  type="tel"
                  name="telNo"
                  value={formData.telNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div className="lg:col-span-2">
                <label className="label">Educational Status</label>
                <select
                  name="educationalStatus"
                  value={formData.educationalStatus}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Illit">Illit</option>
                  <option value="Primary">Primary</option>
                  <option value="Middle">Middle</option>
                  <option value="Sec Degree">Sec Degree</option>
                  <option value="Master Degree">Master Degree</option>
                </select>
              </div>
              <div className="lg:col-span-2">
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
                  <option value="Separated">Separated</option>
                </select>
              </div>
              <div>
                <label className="label">Date of Diagnosis</label>
                <input
                  type="date"
                  name="dateOfDiagnosis"
                  value={formData.dateOfDiagnosis}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div className="lg:col-span-2">
                <label className="label">Reactive For</label>
                <select
                  name="reactiveFor"
                  value={formData.reactiveFor}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="HIV1">HIV1</option>
                  <option value="HIV2">HIV2</option>
                  <option value="HIV1 and 2">HIV1 and 2</option>
                </select>
              </div>
              <div className="lg:col-span-3">
                <label className="label">Indication of Investigation</label>
                <input
                  type="text"
                  name="indicationOfInvestigation"
                  value={formData.indicationOfInvestigation}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Pre-Operative / Gen. Checkup / ANC / Infertility / STRS / Premerital / Symptomatic / Risk of Infection"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Presenting Complaints */}
          <div className="card">
            <h3 className="form-section-title">Presenting Complaints and Duration</h3>
            <textarea
              name="presentingComplaintsAndDuration"
              value={formData.presentingComplaintsAndDuration}
              onChange={handleInputChange}
              className="input"
              rows="3"
              disabled={!canEdit}
            />
          </div>

          {/* History of Presenting Illness */}
          <div className="card">
            <h3 className="form-section-title">History of Presenting Illness</h3>
            <div className="space-y-4">
              <div>
                <label className="label">History</label>
                <textarea
                  name="historyOfPresentingIllness"
                  value={formData.historyOfPresentingIllness}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  disabled={!canEdit}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Mode of Infection</label>
                  <select
                    name="modeOfInfection"
                    value={formData.modeOfInfection}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Sexual">Sexual</option>
                    <option value="Blood products">Blood products</option>
                    <option value="Vertical">Vertical</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                {formData.modeOfInfection === 'Others' && (
                  <div>
                    <label className="label">Specify Others</label>
                    <input
                      type="text"
                      name="modeOfInfectionOther"
                      value={formData.modeOfInfectionOther}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                )}
                <div>
                  <label className="label">Course</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Progressive">Progressive</option>
                    <option value="Non Progressive">Non Progressive</option>
                  </select>
                </div>
                <div>
                  <label className="label">Onset</label>
                  <select
                    name="onset"
                    value={formData.onset}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Sudden">Sudden</option>
                    <option value="Insidious">Insidious</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label font-semibold">Types of Lesions</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="solid"
                      checked={formData.typesOfLesions?.solid || false}
                      onChange={(e) => handleInputChange(e, 'typesOfLesions')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Solid</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="fluidFilled"
                      checked={formData.typesOfLesions?.fluidFilled || false}
                      onChange={(e) => handleInputChange(e, 'typesOfLesions')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Fluid filled</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="pusFilled"
                      checked={formData.typesOfLesions?.pusFilled || false}
                      onChange={(e) => handleInputChange(e, 'typesOfLesions')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Pus filled</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="flat"
                      checked={formData.typesOfLesions?.flat || false}
                      onChange={(e) => handleInputChange(e, 'typesOfLesions')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Flat</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="ulcerated"
                      checked={formData.typesOfLesions?.ulcerated || false}
                      onChange={(e) => handleInputChange(e, 'typesOfLesions')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Ulcerated</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="drynessOfSkin"
                      checked={formData.typesOfLesions?.drynessOfSkin || false}
                      onChange={(e) => handleInputChange(e, 'typesOfLesions')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Dryness of Skin</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="nailChanges"
                      checked={formData.typesOfLesions?.nailChanges || false}
                      onChange={(e) => handleInputChange(e, 'typesOfLesions')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Nail changes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hairLoss"
                      checked={formData.typesOfLesions?.hairLoss || false}
                      onChange={(e) => handleInputChange(e, 'typesOfLesions')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Hair Loss</span>
                  </label>
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    name="others"
                    value={formData.typesOfLesions?.others || ''}
                    onChange={(e) => handleInputChange(e, 'typesOfLesions')}
                    className="input"
                    placeholder="Others"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div>
                <label className="label">Distribution</label>
                <select
                  name="distribution"
                  value={formData.distribution}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Localized">Localized</option>
                  <option value="Generalized">Generalized</option>
                </select>
              </div>

              <div>
                <label className="label font-semibold">Sites Involved</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
                  {['scalp', 'oralCavity', 'face', 'neck', 'ul', 'abd', 'chest', 'back', 'll', 'flexures', 'glutealReg', 'hairs', 'nails', 'genitalia'].map(site => (
                    <label key={site} className="flex items-center">
                      <input
                        type="checkbox"
                        name={site}
                        checked={formData.sitesInvolved?.[site] || false}
                        onChange={(e) => handleInputChange(e, 'sitesInvolved')}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm capitalize">{site.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label font-semibold">Mucous Membrane</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="itching"
                      checked={formData.mucousMembrane?.itching || false}
                      onChange={(e) => handleInputChange(e, 'mucousMembrane')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Itching</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="pain"
                      checked={formData.mucousMembrane?.pain || false}
                      onChange={(e) => handleInputChange(e, 'mucousMembrane')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Pain</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="burning"
                      checked={formData.mucousMembrane?.burning || false}
                      onChange={(e) => handleInputChange(e, 'mucousMembrane')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Burning</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="numbness"
                      checked={formData.mucousMembrane?.numbness || false}
                      onChange={(e) => handleInputChange(e, 'mucousMembrane')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Numbness</span>
                  </label>
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    name="others"
                    value={formData.mucousMembrane?.others || ''}
                    onChange={(e) => handleInputChange(e, 'mucousMembrane')}
                    className="input"
                    placeholder="Others"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Itching Intensity</label>
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
                  <label className="label">Diurnal Variation</label>
                  <select
                    name="diurnalVariation"
                    value={formData.diurnalVariation}
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
                  <label className="label">Pain Intensity</label>
                  <select
                    name="painIntensity"
                    value={formData.painIntensity}
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
              </div>

              <div>
                <label className="label font-semibold">Constitutional Symptoms</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="label text-sm">Fever</label>
                    <input
                      type="text"
                      name="fever"
                      value={formData.constitutional?.fever || ''}
                      onChange={(e) => handleInputChange(e, 'constitutional')}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Weight Loss (%)</label>
                    <input
                      type="text"
                      name="weightLoss"
                      value={formData.constitutional?.weightLoss || ''}
                      onChange={(e) => handleInputChange(e, 'constitutional')}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="cough"
                        checked={formData.constitutional?.cough || false}
                        onChange={(e) => handleInputChange(e, 'constitutional')}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm">Cough</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="looseStools"
                        checked={formData.constitutional?.looseStools || false}
                        onChange={(e) => handleInputChange(e, 'constitutional')}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm">Loose stools</span>
                    </label>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="others"
                      value={formData.constitutional?.others || ''}
                      onChange={(e) => handleInputChange(e, 'constitutional')}
                      className="input"
                      placeholder="Others"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Drug Intake */}
          <div className="card">
            <h3 className="form-section-title">Drug Intake</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Details</label>
                  <select
                    name="details"
                    value={formData.drugIntake?.details || ''}
                    onChange={(e) => handleInputChange(e, 'drugIntake')}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="label">Type</label>
                  <select
                    name="type"
                    value={formData.drugIntake?.type || ''}
                    onChange={(e) => handleInputChange(e, 'drugIntake')}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Topical">Topical</option>
                    <option value="Systemic">Systemic</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {['ht', 'dm', 'tb', 'atopy', 'drugAllergy', 'hz', 'hepatitis'].map(item => (
                  <label key={item} className="flex items-center">
                    <input
                      type="checkbox"
                      name={item}
                      checked={formData.drugIntake?.[item] || false}
                      onChange={(e) => handleInputChange(e, 'drugIntake')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm uppercase">{item.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Past History */}
          <div className="card">
            <h3 className="form-section-title">Past History</h3>
            <div className="space-y-4">
              <div>
                <label className="label">H/o Exposure to risk to STD's</label>
                <select
                  name="exposureToSTD"
                  value={formData.pastHistory?.exposureToSTD || ''}
                  onChange={(e) => handleInputChange(e, 'pastHistory')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="label">H/o Similar complaints in the past</label>
                <select
                  name="similarComplaints"
                  value={formData.pastHistory?.similarComplaints || ''}
                  onChange={(e) => handleInputChange(e, 'pastHistory')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="label">H/o any genital ulcers / discharge</label>
                <textarea
                  name="genitalUlcersDischarge"
                  value={formData.pastHistory?.genitalUlcersDischarge || ''}
                  onChange={(e) => handleInputChange(e, 'pastHistory')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Family History */}
          <div className="card">
            <h3 className="form-section-title">Family History</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">H/o similar complaints in the spouse</label>
                  <select
                    name="similarComplaintsInSpouse"
                    value={formData.familyHistory?.similarComplaintsInSpouse || ''}
                    onChange={(e) => handleInputChange(e, 'familyHistory')}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="label">Spouse Tested</label>
                  <select
                    name="spouseTested"
                    value={formData.familyHistory?.spouseTested || ''}
                    onChange={(e) => handleInputChange(e, 'familyHistory')}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Tested">Tested</option>
                    <option value="Not tested">Not tested</option>
                  </select>
                </div>
                <div>
                  <label className="label">Spouse Status</label>
                  <select
                    name="spouseStatus"
                    value={formData.familyHistory?.spouseStatus || ''}
                    onChange={(e) => handleInputChange(e, 'familyHistory')}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="+ve">+ve</option>
                    <option value="-">-</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label mb-0">Children Information</label>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={addChild}
                      className="btn btn-primary text-sm py-1 px-3"
                    >
                      + Add Child
                    </button>
                  )}
                </div>
                {formData.familyHistory?.children?.length > 0 ? (
                  <div className="space-y-3">
                    {formData.familyHistory.children.map((child, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-gray-50 rounded">
                        <div>
                          <label className="label text-xs">Sex</label>
                          <select
                            value={child.sex}
                            onChange={(e) => updateChild(index, 'sex', e.target.value)}
                            className="input text-sm"
                            disabled={!canEdit}
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <div>
                          <label className="label text-xs">Age</label>
                          <input
                            type="number"
                            value={child.age}
                            onChange={(e) => updateChild(index, 'age', e.target.value)}
                            className="input text-sm"
                            disabled={!canEdit}
                          />
                        </div>
                        <div>
                          <label className="label text-xs">HIV Status</label>
                          <select
                            value={child.hivStatus}
                            onChange={(e) => updateChild(index, 'hivStatus', e.target.value)}
                            className="input text-sm"
                            disabled={!canEdit}
                          >
                            <option value="">Select</option>
                            <option value="Tested">Tested</option>
                            <option value="Not Tested">Not Tested</option>
                          </select>
                        </div>
                        {canEdit && (
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => removeChild(index)}
                              className="btn btn-secondary w-full text-sm py-2"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No children added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sexual History */}
          <div className="card">
            <h3 className="form-section-title">Sexual History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Types of Sexual Activity</label>
                <input
                  type="text"
                  name="typesOfActivity"
                  value={formData.sexualHistory?.typesOfActivity || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  placeholder="Hetero / Homo, Genital / Oral / Oro-anal / Oro-genital / Ano-genital"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Number of Partners</label>
                <input
                  type="text"
                  name="numberOfPartners"
                  value={formData.sexualHistory?.numberOfPartners || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Number of Intercourse</label>
                <input
                  type="text"
                  name="numberOfIntercourse"
                  value={formData.sexualHistory?.numberOfIntercourse || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Type of Partner</label>
                <select
                  name="typeOfPartner"
                  value={formData.sexualHistory?.typeOfPartner || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Known">Known</option>
                  <option value="Unknown">Unknown</option>
                  <option value="CSW">CSW</option>
                </select>
              </div>
              <div>
                <label className="label">Contraceptive Used</label>
                <select
                  name="contraceptiveUsed"
                  value={formData.sexualHistory?.contraceptiveUsed || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {formData.sexualHistory?.contraceptiveUsed === 'Yes' && (
                <div>
                  <label className="label">Type</label>
                  <input
                    type="text"
                    name="contraceptiveType"
                    value={formData.sexualHistory?.contraceptiveType || ''}
                    onChange={(e) => handleInputChange(e, 'sexualHistory')}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Personal History */}
          <div className="card">
            <h3 className="form-section-title">Personal History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Diet / Appetite</label>
                <input
                  type="text"
                  name="dietAppetite"
                  value={formData.personalHistory?.dietAppetite || ''}
                  onChange={(e) => handleInputChange(e, 'personalHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Sleep</label>
                <select
                  name="sleep"
                  value={formData.personalHistory?.sleep || ''}
                  onChange={(e) => handleInputChange(e, 'personalHistory')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Sound">Sound</option>
                  <option value="Distributed">Distributed</option>
                </select>
              </div>
              <div>
                <label className="label">Bowel</label>
                <select
                  name="bowel"
                  value={formData.personalHistory?.bowel || ''}
                  onChange={(e) => handleInputChange(e, 'personalHistory')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Constipation">Constipation</option>
                  <option value="Diarrhoea">Diarrhoea</option>
                </select>
              </div>
              <div>
                <label className="label">Bladder</label>
                <select
                  name="bladder"
                  value={formData.personalHistory?.bladder || ''}
                  onChange={(e) => handleInputChange(e, 'personalHistory')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Increased frequency">Increased frequency</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">Habits</label>
                <input
                  type="text"
                  name="habits"
                  value={formData.personalHistory?.habits || ''}
                  onChange={(e) => handleInputChange(e, 'personalHistory')}
                  className="input"
                  placeholder="Alcohol / Smoking / Tobacco / Drugs / Gambling / Others"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Obstetric and Menstrual History */}
          <div className="card">
            <h3 className="form-section-title">Obstetric and Menstrual History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Past Menstrual Cycles</label>
                <select
                  name="pastMenstrualCycles"
                  value={formData.obstetricMenstrualHistory?.pastMenstrualCycles || ''}
                  onChange={(e) => handleInputChange(e, 'obstetricMenstrualHistory')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Irregular">Irregular</option>
                </select>
              </div>
              <div>
                <label className="label">Number if Pregnancies</label>
                <input
                  type="number"
                  name="numberOfPregnancies"
                  value={formData.obstetricMenstrualHistory?.numberOfPregnancies || ''}
                  onChange={(e) => handleInputChange(e, 'obstetricMenstrualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Miscarriage</label>
                <input
                  type="number"
                  name="numberOfMiscarriage"
                  value={formData.obstetricMenstrualHistory?.numberOfMiscarriage || ''}
                  onChange={(e) => handleInputChange(e, 'obstetricMenstrualHistory')}
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
                <label className="label">Built / Weight</label>
                <input
                  type="text"
                  name="builtWeight"
                  value={formData.generalPhysicalExam?.builtWeight || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Nutrition</label>
                <input
                  type="text"
                  name="nutrition"
                  value={formData.generalPhysicalExam?.nutrition || ''}
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
                <label className="label">Icterus</label>
                <input
                  type="text"
                  name="icterus"
                  value={formData.generalPhysicalExam?.icterus || ''}
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
                <label className="label">Lymphadenopathy</label>
                <input
                  type="text"
                  name="lymphadenopathy"
                  value={formData.generalPhysicalExam?.lymphadenopathy || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Edema</label>
                <input
                  type="text"
                  name="edema"
                  value={formData.generalPhysicalExam?.edema || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-3">Lymph Nodes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Number</label>
                  <select
                    name="number"
                    value={formData.generalPhysicalExam?.lymphNodes?.number || ''}
                    onChange={(e) => handleInputChange(e, 'generalPhysicalExam', 'lymphNodes')}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Multiple">Multiple</option>
                  </select>
                </div>
                <div>
                  <label className="label">Site</label>
                  <input
                    type="text"
                    name="site"
                    value={formData.generalPhysicalExam?.lymphNodes?.site || ''}
                    onChange={(e) => handleInputChange(e, 'generalPhysicalExam', 'lymphNodes')}
                    className="input"
                    placeholder="Submandibular / Axillary / Epitrochlear / Inguinal"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">Matted / Discreete</label>
                  <select
                    name="matted"
                    value={formData.generalPhysicalExam?.lymphNodes?.matted || ''}
                    onChange={(e) => handleInputChange(e, 'generalPhysicalExam', 'lymphNodes')}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Matted">Matted</option>
                    <option value="Discreete">Discreete</option>
                  </select>
                </div>
                <div>
                  <label className="label">Others</label>
                  <input
                    type="text"
                    name="others"
                    value={formData.generalPhysicalExam?.lymphNodes?.others || ''}
                    onChange={(e) => handleInputChange(e, 'generalPhysicalExam', 'lymphNodes')}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label">Pulse</label>
                <input
                  type="text"
                  name="pulse"
                  value={formData.generalPhysicalExam?.pulse || ''}
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
                <label className="label">Temperature</label>
                <select
                  name="temperature"
                  value={formData.generalPhysicalExam?.temperature || ''}
                  onChange={(e) => handleInputChange(e, 'generalPhysicalExam')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Febrile">Febrile</option>
                  <option value="Afebrile">Afebrile</option>
                </select>
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
            </div>
          </div>

          {/* Oral Cavity */}
          <div className="card">
            <h3 className="form-section-title">Oral Cavity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Hygiene / Lesions</label>
                <input
                  type="text"
                  name="hygiene"
                  value={formData.oralCavity?.hygiene || ''}
                  onChange={(e) => handleInputChange(e, 'oralCavity')}
                  className="input"
                  placeholder="Good / Poor"
                  disabled={!canEdit}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Lesions</label>
                <textarea
                  name="lesions"
                  value={formData.oralCavity?.lesions || ''}
                  onChange={(e) => handleInputChange(e, 'oralCavity')}
                  className="input"
                  rows="2"
                  placeholder="Angular Stomatitis / Xerostomia / Pigmentation / Ulcer / Erosion / Bleeding / Papules / Plaque / Vesicles / Glossitis / Geographic / Fissure"
                  disabled={!canEdit}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Colour / Location</label>
                <input
                  type="text"
                  name="colourLocation"
                  value={formData.oralCavity?.colourLocation || ''}
                  onChange={(e) => handleInputChange(e, 'oralCavity')}
                  className="input"
                  placeholder="Lips / Buccal Mucosa / Gums / Palate / Tongue - Dorsum, Lat, Border, Ventral border"
                  disabled={!canEdit}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Dentation</label>
                <input
                  type="text"
                  name="dentation"
                  value={formData.oralCavity?.dentation || ''}
                  onChange={(e) => handleInputChange(e, 'oralCavity')}
                  className="input"
                  placeholder="Gingivitis, Periodontitis, Necrosis, Linear Gingival Erythema"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Ocular Examination, Nails, Hair */}
          <div className="card">
            <h3 className="form-section-title">Ocular Examination</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="label">Conjunctiva</label>
                <textarea
                  name="conjunctiva"
                  value={formData.ocularExam?.conjunctiva || ''}
                  onChange={(e) => handleInputChange(e, 'ocularExam')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Sclera</label>
                <textarea
                  name="sclera"
                  value={formData.ocularExam?.sclera || ''}
                  onChange={(e) => handleInputChange(e, 'ocularExam')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nails</label>
                <textarea
                  name="nails"
                  value={formData.nails}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Hair</label>
                <textarea
                  name="hair"
                  value={formData.hair}
                  onChange={handleInputChange}
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
            <div className="space-y-4">
              <div>
                <label className="label">Distribution</label>
                <textarea
                  name="distribution"
                  value={formData.cutaneousExam?.distribution || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  rows="2"
                  placeholder="Generalised / Localised / Dermatomal, Symmetrical / Asymmetrical, Grouped / Discrete"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Types / Sites</label>
                <textarea
                  name="typesSites"
                  value={formData.cutaneousExam?.typesSites || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  rows="3"
                  placeholder="Macules / Papules / Patches / Plaque / Nodule / Vesicles / Bullae / Pustules / Discharge / Crusts / Bleeding / Ulcers / Edema / Excoriation / Erosion / Follicular / Oriented / Hyperpigmented / Hypopigmented / Depigmented / Thickening / Telengiectasia / Purpura / Petichial / Erythema / Exfoliation / Scaling / Ichtyosis / Wheals / Lentigenes / Striae, others"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">No. of Lesions / Others</label>
                <select
                  name="numberOfLesions"
                  value={formData.cutaneousExam?.numberOfLesions || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Few">Few</option>
                  <option value="More">More</option>
                  <option value="Innumerable">Innumerable</option>
                </select>
              </div>
            </div>
          </div>

          {/* Genital Lesion */}
          <div className="card">
            <h3 className="form-section-title">Genital Lesion</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Type of Lesion</label>
                <input
                  type="text"
                  name="typeOfLesion"
                  value={formData.genitalLesion?.typeOfLesion || ''}
                  onChange={(e) => handleInputChange(e, 'genitalLesion')}
                  className="input"
                  placeholder="Papule / Umbilicated / Plaque / Erosion / Ulcer / Vesicle / Pustule"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Site</label>
                <input
                  type="text"
                  name="site"
                  value={formData.genitalLesion?.site || ''}
                  onChange={(e) => handleInputChange(e, 'genitalLesion')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Surface</label>
                <select
                  name="surface"
                  value={formData.genitalLesion?.surface || ''}
                  onChange={(e) => handleInputChange(e, 'genitalLesion')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Flat">Flat</option>
                  <option value="Verrucous">Verrucous</option>
                  <option value="Moist">Moist</option>
                  <option value="Shiny">Shiny</option>
                </select>
              </div>
              <div>
                <label className="label">Colour</label>
                <input
                  type="text"
                  name="colour"
                  value={formData.genitalLesion?.colour || ''}
                  onChange={(e) => handleInputChange(e, 'genitalLesion')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Number</label>
                <input
                  type="text"
                  name="number"
                  value={formData.genitalLesion?.number || ''}
                  onChange={(e) => handleInputChange(e, 'genitalLesion')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Size</label>
                <input
                  type="text"
                  name="size"
                  value={formData.genitalLesion?.size || ''}
                  onChange={(e) => handleInputChange(e, 'genitalLesion')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-3">Ulcer Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Floor</label>
                  <input
                    type="text"
                    name="ulcerFloor"
                    value={formData.genitalLesion?.ulcerFloor || ''}
                    onChange={(e) => handleInputChange(e, 'genitalLesion')}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">Edge</label>
                  <input
                    type="text"
                    name="ulcerEdge"
                    value={formData.genitalLesion?.ulcerEdge || ''}
                    onChange={(e) => handleInputChange(e, 'genitalLesion')}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">Discharge</label>
                  <input
                    type="text"
                    name="ulcerDischarge"
                    value={formData.genitalLesion?.ulcerDischarge || ''}
                    onChange={(e) => handleInputChange(e, 'genitalLesion')}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">Tenderness</label>
                  <input
                    type="text"
                    name="ulcerTenderness"
                    value={formData.genitalLesion?.ulcerTenderness || ''}
                    onChange={(e) => handleInputChange(e, 'genitalLesion')}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">Surrounding Skin</label>
                  <input
                    type="text"
                    name="ulcerSurroundingSkin"
                    value={formData.genitalLesion?.ulcerSurroundingSkin || ''}
                    onChange={(e) => handleInputChange(e, 'genitalLesion')}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Palpation */}
          <div className="card">
            <h3 className="form-section-title">Palpation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Bleeding on manipulation</label>
                <input
                  type="text"
                  name="bleedingOnManipulation"
                  value={formData.palpation?.bleedingOnManipulation || ''}
                  onChange={(e) => handleInputChange(e, 'palpation')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Induration</label>
                <input
                  type="text"
                  name="induration"
                  value={formData.palpation?.induration || ''}
                  onChange={(e) => handleInputChange(e, 'palpation')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Consistency</label>
                <select
                  name="consistency"
                  value={formData.palpation?.consistency || ''}
                  onChange={(e) => handleInputChange(e, 'palpation')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Soft">Soft</option>
                  <option value="Form">Form</option>
                  <option value="Cystic">Cystic</option>
                  <option value="Hard">Hard</option>
                </select>
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
                <label className="label">P/A</label>
                <textarea
                  name="pa"
                  value={formData.systemicExam?.pa || ''}
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
                <label className="label">Musculoskeletal</label>
                <textarea
                  name="musculoskeletal"
                  value={formData.systemicExam?.musculoskeletal || ''}
                  onChange={(e) => handleInputChange(e, 'systemicExam')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Investigations */}
          <div className="card">
            <h3 className="form-section-title">Investigations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Blood CBC</label>
                <input
                  type="text"
                  name="bloodCBC"
                  value={formData.investigations?.bloodCBC || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Tissue Smear</label>
                <input
                  type="text"
                  name="tissueSmear"
                  value={formData.investigations?.tissueSmear || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Gram Stain</label>
                <input
                  type="text"
                  name="gramStain"
                  value={formData.investigations?.gramStain || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Tzanck Smear</label>
                <input
                  type="text"
                  name="tzanckSmear"
                  value={formData.investigations?.tzanckSmear || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Serological Tests VDRL / ELISA</label>
                <input
                  type="text"
                  name="serologicalTests"
                  value={formData.investigations?.serologicalTests || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">KOH</label>
                <input
                  type="text"
                  name="koh"
                  value={formData.investigations?.koh || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Biopsy</label>
                <input
                  type="text"
                  name="biopsy"
                  value={formData.investigations?.biopsy || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Culture</label>
                <input
                  type="text"
                  name="culture"
                  value={formData.investigations?.culture || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Others</label>
                <input
                  type="text"
                  name="others"
                  value={formData.investigations?.others || ''}
                  onChange={(e) => handleInputChange(e, 'investigations')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Diagnosis, Treatment, Follow-up */}
          <div className="card">
            <h3 className="form-section-title">Diagnosis, Treatment & Follow-up</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Diagnosis</label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Treatment Given</label>
                <textarea
                  name="treatmentGiven"
                  value={formData.treatmentGiven}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Follow Up</label>
                <textarea
                  name="followUp"
                  value={formData.followUp}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  disabled={!canEdit}
                />
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

export default HIVManifestationsProforma;
