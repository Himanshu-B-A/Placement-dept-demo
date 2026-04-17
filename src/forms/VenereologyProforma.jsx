import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const VenereologyProforma = () => {
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
    occupation: '',
    religion: '',
    place: '',
    address: '',
    socioEconomicStatus: '',
    doa: '',
    dod: '',
    maritalStatus: '',

    // 1) Presenting Complaints
    genitalSoreLesion: false,
    urethralVaginalDischarge: false,
    burningMicturition: false,
    otherComplaints: '',

    // 2A) History - Genital Sore/Lesion
    genitalSore: {
      duration: '',
      incubationPeriod: '',
      onset: '',
      site: '',
      progression: '',
      number: '',
      extent: '',
      discharge: '',
      painBleeding: '',
      similarLesionBefore: '',
      medicationAppliedLocally: '',
      personalHygiene: ''
    },

    // 2B) Discharge
    discharge: {
      duration: '',
      natureColour: '',
      amount: '',
      consistency: ''
    },

    // 2C) Burning Micturition
    burningMict: {
      duration: '',
      whenInAct: '',
      timing: '',
      frequency: ''
    },

    // 2D) Other Complaints
    otherComplaintsDetails: {
      fever: '',
      malaiseHeadache: '',
      penileSwelling: '',
      labialSwelling: '',
      difficultyRetractionForeskin: '',
      painSwellingScrotum: '',
      swellingInguinalRegion: '',
      difficultyDurationDefecation: '',
      painfulErection: '',
      skinLesions: ''
    },

    // 2E) Sexual History
    sexualHistory: {
      dateLastExposure: '',
      numberOfExposures: '',
      placesOfContact: '',
      typesOfContact: '',
      amountPaidContact: '',
      heterosexualHomosexual: '',
      typesOfSexualActivity: '',
      contactWithWife: '',
      treatmentTaken: ''
    },

    // 3) Past History
    pastHistory: {
      previousSTD: '',
      detailsTreatment: '',
      penicillinAllergy: '',
      otherIllness: ''
    },

    // 4) Family History
    familyHistory: {
      maritalStatus: '',
      healthSpouse: '',
      healthParents: '',
      numberOfChildrenMale: '',
      numberOfChildrenFemale: '',
      patientSpousePregnancy: '',
      birthHistory: ''
    },

    // 5) Occupational History
    occupationalHistory: '',

    // 6) Menstrual History
    menstrualHistory: {
      ageOfMenarche: '',
      presentCycleHistory: '',
      recentChanges: '',
      contraceptiveUsed: ''
    },

    // 7) Obstetric History
    obstetricHistory: {
      numberOfPregnancies: '',
      numberOfLivingChildren: '',
      numberOfAbortion: '',
      numberOfStillBirths: '',
      deformities: '',
      labourProblems: ''
    },

    // Physical Examination
    physicalExam: {
      lymphnodes: '',
      pr: '',
      rr: '',
      bp: '',
      wt: '',
      ht: '',
      temp: '',
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
      otherTests: '',
      hiv1And2: '',
      cd4Count: '',
      numberOfDermatomes: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode && id) {
        const docRef = doc(db, 'patients', id);
        await updateDoc(docRef, {
          data: formData,
          lastModifiedBy: currentUser.email,
          lastModifiedAt: new Date().toISOString()
        });
        alert('Patient record updated successfully!');
      } else {
        const newId = `patient-${Date.now()}`;
        const newDocRef = doc(db, 'patients', newId);
        await setDoc(newDocRef, {
          formType: 'Venereology Proforma',
          data: formData,
          createdBy: currentUser.email,
          createdAt: new Date().toISOString(),
          lastModifiedBy: currentUser.email,
          lastModifiedAt: new Date().toISOString()
        });
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
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-primary-600 mt-2">VENEREOLOGY PROFORMA</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
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
                <label className="label">Place</label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div className="sm:col-span-2">
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
                <label className="label">DOA (Date of Admission)</label>
                <input
                  type="date"
                  name="doa"
                  value={formData.doa}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">DOD (Date of Discharge)</label>
                <input
                  type="date"
                  name="dod"
                  value={formData.dod}
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
            </div>
          </div>

          {/* Presenting Complaints */}
          <div className="card">
            <h3 className="form-section-title">1) Presenting Complaints</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="genitalSoreLesion"
                  checked={formData.genitalSoreLesion}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4"
                  disabled={!canEdit}
                />
                <label className="label mb-0">a) Genital sore / lesion</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="urethralVaginalDischarge"
                  checked={formData.urethralVaginalDischarge}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4"
                  disabled={!canEdit}
                />
                <label className="label mb-0">b) Urethral or vaginal discharge</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="burningMicturition"
                  checked={formData.burningMicturition}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4"
                  disabled={!canEdit}
                />
                <label className="label mb-0">c) Burning micturition</label>
              </div>
              <div>
                <label className="label">d) Other complaints</label>
                <textarea
                  name="otherComplaints"
                  value={formData.otherComplaints}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* 2A) Genital Sore/Lesion */}
          <div className="card">
            <h3 className="form-section-title">2A) History of Present Illness - Genital Sore / Lesion</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.genitalSore?.duration || ''}
                  onChange={(e) => handleInputChange(e, 'genitalSore')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Incubation Period</label>
                <input
                  type="text"
                  name="incubationPeriod"
                  value={formData.genitalSore?.incubationPeriod || ''}
                  onChange={(e) => handleInputChange(e, 'genitalSore')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Onset</label>
                <input
                  type="text"
                  name="onset"
                  value={formData.genitalSore?.onset || ''}
                  onChange={(e) => handleInputChange(e, 'genitalSore')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Site</label>
                <input
                  type="text"
                  name="site"
                  value={formData.genitalSore?.site || ''}
                  onChange={(e) => handleInputChange(e, 'genitalSore')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Progression</label>
                <input
                  type="text"
                  name="progression"
                  value={formData.genitalSore?.progression || ''}
                  onChange={(e) => handleInputChange(e, 'genitalSore')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Number</label>
                <input
                  type="text"
                  name="number"
                  value={formData.genitalSore?.number || ''}
                  onChange={(e) => handleInputChange(e, 'genitalSore')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Extent</label>
                <input
                  type="text"
                  name="extent"
                  value={formData.genitalSore?.extent || ''}
                  onChange={(e) => handleInputChange(e, 'genitalSore')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Discharge</label>
                <input
                  type="text"
                  name="discharge"
                  value={formData.genitalSore?.discharge || ''}
                  onChange={(e) => handleInputChange(e, 'genitalSore')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Pain and Bleeding</label>
                <input
                  type="text"
                  name="painBleeding"
                  value={formData.genitalSore?.painBleeding || ''}
                  onChange={(e) => handleInputChange(e, 'genitalSore')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Similar Lesion Before</label>
                <select
                  name="similarLesionBefore"
                  value={formData.genitalSore?.similarLesionBefore || ''}
                  onChange={(e) => handleInputChange(e, 'genitalSore')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="label">Medication Applied Locally</label>
                <input
                  type="text"
                  name="medicationAppliedLocally"
                  value={formData.genitalSore?.medicationAppliedLocally || ''}
                  onChange={(e) => handleInputChange(e, 'genitalSore')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Personal Hygiene</label>
                <input
                  type="text"
                  name="personalHygiene"
                  value={formData.genitalSore?.personalHygiene || ''}
                  onChange={(e) => handleInputChange(e, 'genitalSore')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* 2B) Discharge per Urethra / Vaginal Discharge */}
          <div className="card">
            <h3 className="form-section-title">2B) Discharge per Urethra / Vaginal Discharge</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.discharge?.duration || ''}
                  onChange={(e) => handleInputChange(e, 'discharge')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Nature and Colour (Purulent / Yellow / Yellowish Green)</label>
                <input
                  type="text"
                  name="natureColour"
                  value={formData.discharge?.natureColour || ''}
                  onChange={(e) => handleInputChange(e, 'discharge')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Amount (Scanty / Profuse)</label>
                <select
                  name="amount"
                  value={formData.discharge?.amount || ''}
                  onChange={(e) => handleInputChange(e, 'discharge')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Scanty">Scanty</option>
                  <option value="Profuse">Profuse</option>
                </select>
              </div>
              <div>
                <label className="label">Consistency (Thick / Thin)</label>
                <select
                  name="consistency"
                  value={formData.discharge?.consistency || ''}
                  onChange={(e) => handleInputChange(e, 'discharge')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Thick">Thick</option>
                  <option value="Thin">Thin</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2C) Burning Micturition */}
          <div className="card">
            <h3 className="form-section-title">2C) Burning Micturition</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.burningMict?.duration || ''}
                  onChange={(e) => handleInputChange(e, 'burningMict')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">When in act of micturition</label>
                <input
                  type="text"
                  name="whenInAct"
                  value={formData.burningMict?.whenInAct || ''}
                  onChange={(e) => handleInputChange(e, 'burningMict')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Before / during / after</label>
                <select
                  name="timing"
                  value={formData.burningMict?.timing || ''}
                  onChange={(e) => handleInputChange(e, 'burningMict')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Before">Before</option>
                  <option value="During">During</option>
                  <option value="After">After</option>
                </select>
              </div>
              <div>
                <label className="label">Frequency of micturition</label>
                <input
                  type="text"
                  name="frequency"
                  value={formData.burningMict?.frequency || ''}
                  onChange={(e) => handleInputChange(e, 'burningMict')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* 2D) Other Complaints Details */}
          <div className="card">
            <h3 className="form-section-title">2D) Other Complaints</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Fever</label>
                <input
                  type="text"
                  name="fever"
                  value={formData.otherComplaintsDetails?.fever || ''}
                  onChange={(e) => handleInputChange(e, 'otherComplaintsDetails')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Malaise / Headache</label>
                <input
                  type="text"
                  name="malaiseHeadache"
                  value={formData.otherComplaintsDetails?.malaiseHeadache || ''}
                  onChange={(e) => handleInputChange(e, 'otherComplaintsDetails')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Penile Swelling</label>
                <input
                  type="text"
                  name="penileSwelling"
                  value={formData.otherComplaintsDetails?.penileSwelling || ''}
                  onChange={(e) => handleInputChange(e, 'otherComplaintsDetails')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Labial Swelling</label>
                <input
                  type="text"
                  name="labialSwelling"
                  value={formData.otherComplaintsDetails?.labialSwelling || ''}
                  onChange={(e) => handleInputChange(e, 'otherComplaintsDetails')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Difficulty in retraction of foreskin</label>
                <input
                  type="text"
                  name="difficultyRetractionForeskin"
                  value={formData.otherComplaintsDetails?.difficultyRetractionForeskin || ''}
                  onChange={(e) => handleInputChange(e, 'otherComplaintsDetails')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Pain and swelling of scrotum</label>
                <input
                  type="text"
                  name="painSwellingScrotum"
                  value={formData.otherComplaintsDetails?.painSwellingScrotum || ''}
                  onChange={(e) => handleInputChange(e, 'otherComplaintsDetails')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Swelling in inguinal region</label>
                <input
                  type="text"
                  name="swellingInguinalRegion"
                  value={formData.otherComplaintsDetails?.swellingInguinalRegion || ''}
                  onChange={(e) => handleInputChange(e, 'otherComplaintsDetails')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Difficulty duration defecation</label>
                <input
                  type="text"
                  name="difficultyDurationDefecation"
                  value={formData.otherComplaintsDetails?.difficultyDurationDefecation || ''}
                  onChange={(e) => handleInputChange(e, 'otherComplaintsDetails')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Painful erection</label>
                <input
                  type="text"
                  name="painfulErection"
                  value={formData.otherComplaintsDetails?.painfulErection || ''}
                  onChange={(e) => handleInputChange(e, 'otherComplaintsDetails')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Skin lesions</label>
                <input
                  type="text"
                  name="skinLesions"
                  value={formData.otherComplaintsDetails?.skinLesions || ''}
                  onChange={(e) => handleInputChange(e, 'otherComplaintsDetails')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* 2E) Sexual History */}
          <div className="card">
            <h3 className="form-section-title">2E) Sexual History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Date of last exposure</label>
                <input
                  type="date"
                  name="dateLastExposure"
                  value={formData.sexualHistory?.dateLastExposure || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Number of exposures with dates and period of infection</label>
                <input
                  type="text"
                  name="numberOfExposures"
                  value={formData.sexualHistory?.numberOfExposures || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Places of contact (House / Hotel / Period)</label>
                <input
                  type="text"
                  name="placesOfContact"
                  value={formData.sexualHistory?.placesOfContact || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Types of contact (Marital / Professional / Casual / Cal Girl / EM played)</label>
                <input
                  type="text"
                  name="typesOfContact"
                  value={formData.sexualHistory?.typesOfContact || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Amount paid to contact</label>
                <input
                  type="text"
                  name="amountPaidContact"
                  value={formData.sexualHistory?.amountPaidContact || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Heterosexual and Homosexual (Active / Passive)</label>
                <input
                  type="text"
                  name="heterosexualHomosexual"
                  value={formData.sexualHistory?.heterosexualHomosexual || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Types of Sexual activity (Oro-anal / Oro-genital / Ano-genetial)</label>
                <input
                  type="text"
                  name="typesOfSexualActivity"
                  value={formData.sexualHistory?.typesOfSexualActivity || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Contact with wife</label>
                <input
                  type="text"
                  name="contactWithWife"
                  value={formData.sexualHistory?.contactWithWife || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Treatment taken if any and its effect on present complaints</label>
                <textarea
                  name="treatmentTaken"
                  value={formData.sexualHistory?.treatmentTaken || ''}
                  onChange={(e) => handleInputChange(e, 'sexualHistory')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Continue in next part due to length... */}
          {/* I'll add the remaining sections in the response */}

          {/* 3) Past History */}
          <div className="card">
            <h3 className="form-section-title">3) Past History</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Previous history of STD ulcers over Genitalia / Bubo / Discharging bubo / Discharging per urethra</label>
                <textarea
                  name="previousSTD"
                  value={formData.pastHistory?.previousSTD || ''}
                  onChange={(e) => handleInputChange(e, 'pastHistory')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Details of treatment taken and its effect</label>
                <textarea
                  name="detailsTreatment"
                  value={formData.pastHistory?.detailsTreatment || ''}
                  onChange={(e) => handleInputChange(e, 'pastHistory')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">History of penicillin allergy</label>
                <select
                  name="penicillinAllergy"
                  value={formData.pastHistory?.penicillinAllergy || ''}
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
                <label className="label">Other significant illness</label>
                <textarea
                  name="otherIllness"
                  value={formData.pastHistory?.otherIllness || ''}
                  onChange={(e) => handleInputChange(e, 'pastHistory')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* 4) Family History */}
          <div className="card">
            <h3 className="form-section-title">4) Family History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Marital Status (Married / Single / Widow / Widower / Divorce)</label>
                <select
                  name="maritalStatus"
                  value={formData.familyHistory?.maritalStatus || ''}
                  onChange={(e) => handleInputChange(e, 'familyHistory')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Married">Married</option>
                  <option value="Single">Single</option>
                  <option value="Widow">Widow</option>
                  <option value="Widower">Widower</option>
                  <option value="Divorce">Divorce</option>
                </select>
              </div>
              <div>
                <label className="label">Health of wife or husband or regular consort</label>
                <input
                  type="text"
                  name="healthSpouse"
                  value={formData.familyHistory?.healthSpouse || ''}
                  onChange={(e) => handleInputChange(e, 'familyHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Health of parents</label>
                <input
                  type="text"
                  name="healthParents"
                  value={formData.familyHistory?.healthParents || ''}
                  onChange={(e) => handleInputChange(e, 'familyHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Number of Children (Male)</label>
                <input
                  type="number"
                  name="numberOfChildrenMale"
                  value={formData.familyHistory?.numberOfChildrenMale || ''}
                  onChange={(e) => handleInputChange(e, 'familyHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Number of Children (Female)</label>
                <input
                  type="number"
                  name="numberOfChildrenFemale"
                  value={formData.familyHistory?.numberOfChildrenFemale || ''}
                  onChange={(e) => handleInputChange(e, 'familyHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Patient or spouse in pregnancy</label>
                <input
                  type="text"
                  name="patientSpousePregnancy"
                  value={formData.familyHistory?.patientSpousePregnancy || ''}
                  onChange={(e) => handleInputChange(e, 'familyHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Birth history with history of abortion in Wife / Patient</label>
                <textarea
                  name="birthHistory"
                  value={formData.familyHistory?.birthHistory || ''}
                  onChange={(e) => handleInputChange(e, 'familyHistory')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* 5) Occupational History */}
          <div className="card">
            <h3 className="form-section-title">5) Occupational History</h3>
            <textarea
              name="occupationalHistory"
              value={formData.occupationalHistory}
              onChange={handleInputChange}
              className="input"
              rows="3"
              disabled={!canEdit}
            />
          </div>

          {/* 6) Menstrual History */}
          <div className="card">
            <h3 className="form-section-title">6) Menstrual History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Age of menarche</label>
                <input
                  type="number"
                  name="ageOfMenarche"
                  value={formData.menstrualHistory?.ageOfMenarche || ''}
                  onChange={(e) => handleInputChange(e, 'menstrualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Present cycle history</label>
                <input
                  type="text"
                  name="presentCycleHistory"
                  value={formData.menstrualHistory?.presentCycleHistory || ''}
                  onChange={(e) => handleInputChange(e, 'menstrualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Recent changes</label>
                <input
                  type="text"
                  name="recentChanges"
                  value={formData.menstrualHistory?.recentChanges || ''}
                  onChange={(e) => handleInputChange(e, 'menstrualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Contraceptive used</label>
                <input
                  type="text"
                  name="contraceptiveUsed"
                  value={formData.menstrualHistory?.contraceptiveUsed || ''}
                  onChange={(e) => handleInputChange(e, 'menstrualHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* 7) Obstetric History */}
          <div className="card">
            <h3 className="form-section-title">7) Obstetric History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">No. of Pregnancies</label>
                <input
                  type="number"
                  name="numberOfPregnancies"
                  value={formData.obstetricHistory?.numberOfPregnancies || ''}
                  onChange={(e) => handleInputChange(e, 'obstetricHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">No. of living children & their health</label>
                <input
                  type="text"
                  name="numberOfLivingChildren"
                  value={formData.obstetricHistory?.numberOfLivingChildren || ''}
                  onChange={(e) => handleInputChange(e, 'obstetricHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">No. of abortion</label>
                <input
                  type="number"
                  name="numberOfAbortion"
                  value={formData.obstetricHistory?.numberOfAbortion || ''}
                  onChange={(e) => handleInputChange(e, 'obstetricHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">No. of still births</label>
                <input
                  type="number"
                  name="numberOfStillBirths"
                  value={formData.obstetricHistory?.numberOfStillBirths || ''}
                  onChange={(e) => handleInputChange(e, 'obstetricHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Deformities</label>
                <input
                  type="text"
                  name="deformities"
                  value={formData.obstetricHistory?.deformities || ''}
                  onChange={(e) => handleInputChange(e, 'obstetricHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Labour problems</label>
                <input
                  type="text"
                  name="labourProblems"
                  value={formData.obstetricHistory?.labourProblems || ''}
                  onChange={(e) => handleInputChange(e, 'obstetricHistory')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Physical Examination */}
          <div className="card">
            <h3 className="form-section-title">Physical Examination</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label">Lymphnodes</label>
                <input
                  type="text"
                  name="lymphnodes"
                  value={formData.physicalExam?.lymphnodes || ''}
                  onChange={(e) => handleInputChange(e, 'physicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">PR (Pulse Rate)</label>
                <input
                  type="text"
                  name="pr"
                  value={formData.physicalExam?.pr || ''}
                  onChange={(e) => handleInputChange(e, 'physicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">RR (Respiration Rate)</label>
                <input
                  type="text"
                  name="rr"
                  value={formData.physicalExam?.rr || ''}
                  onChange={(e) => handleInputChange(e, 'physicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">BP</label>
                <input
                  type="text"
                  name="bp"
                  value={formData.physicalExam?.bp || ''}
                  onChange={(e) => handleInputChange(e, 'physicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Wt (Weight)</label>
                <input
                  type="text"
                  name="wt"
                  value={formData.physicalExam?.wt || ''}
                  onChange={(e) => handleInputChange(e, 'physicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Ht (Height)</label>
                <input
                  type="text"
                  name="ht"
                  value={formData.physicalExam?.ht || ''}
                  onChange={(e) => handleInputChange(e, 'physicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Temp (Temperature)</label>
                <input
                  type="text"
                  name="temp"
                  value={formData.physicalExam?.temp || ''}
                  onChange={(e) => handleInputChange(e, 'physicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Hydration (Good / Fair / Poor)</label>
                <select
                  name="hydration"
                  value={formData.physicalExam?.hydration || ''}
                  onChange={(e) => handleInputChange(e, 'physicalExam')}
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
                <label className="label">Hair (Normal / Scarring alopecia)</label>
                <input
                  type="text"
                  name="hair"
                  value={formData.physicalExam?.hair || ''}
                  onChange={(e) => handleInputChange(e, 'physicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Nail (Normal / Absent / Any changes)</label>
                <input
                  type="text"
                  name="nail"
                  value={formData.physicalExam?.nail || ''}
                  onChange={(e) => handleInputChange(e, 'physicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Mucosa - Oral</label>
                <input
                  type="text"
                  name="mucosaOral"
                  value={formData.physicalExam?.mucosaOral || ''}
                  onChange={(e) => handleInputChange(e, 'physicalExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Mucosa - Genital</label>
                <input
                  type="text"
                  name="mucosaGenital"
                  value={formData.physicalExam?.mucosaGenital || ''}
                  onChange={(e) => handleInputChange(e, 'physicalExam')}
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
                <label className="label">Distribution (Unilateral / Bilateral / Symmetrical / Asymmetrical)</label>
                <input
                  type="text"
                  name="distribution"
                  value={formData.cutaneousExam?.distribution || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Number (Single / Multiple)</label>
                <input
                  type="text"
                  name="number"
                  value={formData.cutaneousExam?.number || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  placeholder="Single / Multiple - Disseminated / Generalized / Multidermatomal"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Type of lesion (Vesicles / Bullae / Crusts / Scabs / Erosions)</label>
                <input
                  type="text"
                  name="typeOfLesion"
                  value={formData.cutaneousExam?.typeOfLesion || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Configuration (Discrete / Grouped)</label>
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
                <label className="label">Nature of vesicle (Tense / Flaccid)</label>
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
                <label className="label">Content (Clear fluid / Turbid / Hemorrhagic)</label>
                <input
                  type="text"
                  name="content"
                  value={formData.cutaneousExam?.content || ''}
                  onChange={(e) => handleInputChange(e, 'cutaneousExam')}
                  className="input"
                  disabled={!canEdit}
                />
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
                <label className="label">Surrounding skin (Normal / Erythematous)</label>
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
              <div className="sm:col-span-2">
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
              <div className="sm:col-span-2">
                <label className="label">Any other tests</label>
                <textarea
                  name="otherTests"
                  value={formData.investigations?.otherTests || ''}
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
              <div>
                <label className="label">1. No. of dermatomes</label>
                <input
                  type="text"
                  name="numberOfDermatomes"
                  value={formData.investigations?.numberOfDermatomes || ''}
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
              <div className="lg:col-span-3">
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
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-3">5. Complications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">1. Ophthalmic</label>
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
                  <label className="label">2. Cutaneous</label>
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
                  <label className="label">3. Neurological</label>
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

export default VenereologyProforma;
