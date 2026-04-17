import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const UrticariaProforma = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    fillNo: '',
    name: '',
    age: '',
    sex: '',
    pNo: '',
    date: '',
    address: '',
    phoneNo: '',
    occupation: '',

    // Type of Urticaria Section
    // Chief Complaints
    chiefComplaints: '',

    // Present Illness
    onset: '',
    onsetOther: '',
    timeOfDay: '',
    pruritus: '',
    localisedGeneralised: '',
    duration: '',
    arthralgiaFeverGastritis: '',

    // Precipitating Factors
    precipitatingFactors: {
      alcohol: false,
      heat: false,
      fever: false,
      exercise: false,
      emotionalStress: false,
      premenstrual: false,
      cold: false,
      aquagenic: false
    },
    aquagenicFactorsPressure: '',

    // Relation to
    relationToDrugs: '',
    relationToFood: '',
    relationToInhalants: '',
    relationToInfection: '',
    relationToInsectBites: '',
    relationToStings: '',
    relationToPenerants: '',
    relationToContacts: '',
    relationToEnvironmentalChanges: '',
    relationToGeneticAbnormalities: '',
    relationToPsychogenicFactors: '',
    relationToAutogenicFactors: '',

    // Past History
    pastHistorySimilarLesion: '',
    pastHistoryOtherIllness: '',

    // Menstrual History
    menstrualHistory: '',
    whiteDischarge: '',

    // Family History
    familyHistoryAsthma: false,
    familyHistoryEczema: false,
    familyHistoryUrticaria: false,
    familyHistoryAllergicRhinitis: false,

    // Personal History
    personalHistoryAllergicDiathesis: '',
    diet: '',
    habitSmoking: false,
    habitAlcohol: false,
    habitDrugs: false,

    // General Examination
    built: '',
    hair: '',
    edema: '',
    pallor: '',
    distributionOfSkinLesion: '',
    lymphNodes: '',
    nails: '',
    mucousMembrane: '',
    cyanosis: '',

    // Local Examination
    localExaminationEczematousChanges: '',
    whiteDermographism: '',
    redDermographism: '',

    // Systematic Examination
    cvs: '',
    ent: '',
    dental: '',
    rs: '',
    thyroid: '',
    pa: '',
    gynec: '',

    // Investigation
    // 1) Blood
    hb: '',
    tc: '',
    dc: '',
    esr: '',
    absoluteEosinophilCount: '',

    // 2) Urine
    urineAlbumin: '',
    urineSugar: '',
    urineMicroscopy: '',

    // 3) Stool
    stoolOvaAndCysts: '',

    // 4) FBS
    fbs: '',
    ppbs: '',

    // 5-9) Other tests
    iceCubeTest: '',
    coldImmersionTest: '',
    exerciseTest: '',
    testForDermographism: '',
    otherInvestigations: '',
    liverFunctionTests: '',
    biopsy: '',

    // Treatment
    treatment: '',

    // Follow up - UAS Scores
    uas0WeeksWheals: '',
    uas0WeeksItching: '',
    uas0WeeksTotal: '',
    
    uas2WeeksWheals: '',
    uas2WeeksItching: '',
    uas2WeeksTotal: '',
    
    uas4WeeksWheals: '',
    uas4WeeksItching: '',
    uas4WeeksTotal: ''
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

  // Calculate UAS total scores
  const calculateUASTotal = (wheals, itching) => {
    const whealsScore = parseInt(wheals) || 0;
    const itchingScore = parseInt(itching) || 0;
    return whealsScore + itchingScore;
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      uas0WeeksTotal: calculateUASTotal(prev.uas0WeeksWheals, prev.uas0WeeksItching),
      uas2WeeksTotal: calculateUASTotal(prev.uas2WeeksWheals, prev.uas2WeeksItching),
      uas4WeeksTotal: calculateUASTotal(prev.uas4WeeksWheals, prev.uas4WeeksItching)
    }));
  }, [
    formData.uas0WeeksWheals, formData.uas0WeeksItching,
    formData.uas2WeeksWheals, formData.uas2WeeksItching,
    formData.uas4WeeksWheals, formData.uas4WeeksItching
  ]);

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
            formType: 'Urticaria',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Urticaria',
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
              PROFORMA - URTICARIA
            </h1>
            <p className="text-center text-gray-600 mt-2 text-sm sm:text-base">
              Department of Dermatology, Venereology & Leprosy
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Fill No.</label>
                <input
                  type="text"
                  name="fillNo"
                  value={formData.fillNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
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
                <label className="label">P No.</label>
                <input
                  type="text"
                  name="pNo"
                  value={formData.pNo}
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
            </div>
          </div>

          {/* Type of Urticaria */}
          <div className="card">
            <h3 className="form-section-title">TYPE OF URTICARIA</h3>
            
            {/* Chief Complaints */}
            <div className="mb-6">
              <label className="label font-semibold">Chief Complaints:</label>
              <textarea
                name="chiefComplaints"
                value={formData.chiefComplaints}
                onChange={handleInputChange}
                className="input"
                rows="3"
                disabled={!canEdit}
              />
            </div>

            {/* Present Illness */}
            <div className="space-y-4">
              <label className="label font-semibold">Present Illness:</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <option value="Slow">Slow</option>
                    <option value="Gradual">Gradual</option>
                  </select>
                </div>
                <div>
                  <label className="label">Time of the day</label>
                  <input
                    type="text"
                    name="timeOfDay"
                    value={formData.timeOfDay}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">Pruritus</label>
                  <select
                    name="pruritus"
                    value={formData.pruritus}
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
                  <label className="label">Localised / Generalised</label>
                  <select
                    name="localisedGeneralised"
                    value={formData.localisedGeneralised}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  >
                    <option value="">Select</option>
                    <option value="Localised">Localised</option>
                    <option value="Generalised">Generalised</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Duration (Acute: Days to weeks; Chronic: &gt; 6w)</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., 2 weeks, 3 months"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Arthralgia / Fever / Gastritis</label>
                <input
                  type="text"
                  name="arthralgiaFeverGastritis"
                  value={formData.arthralgiaFeverGastritis}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Precipitating Factors */}
          <div className="card">
            <h3 className="form-section-title">Precipitating Factors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="alcohol"
                  name="alcohol"
                  checked={formData.precipitatingFactors.alcohol}
                  onChange={(e) => handleInputChange(e, 'precipitatingFactors')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <label htmlFor="alcohol" className="label mb-0">Alcohol</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="heat"
                  name="heat"
                  checked={formData.precipitatingFactors.heat}
                  onChange={(e) => handleInputChange(e, 'precipitatingFactors')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <label htmlFor="heat" className="label mb-0">Heat</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fever"
                  name="fever"
                  checked={formData.precipitatingFactors.fever}
                  onChange={(e) => handleInputChange(e, 'precipitatingFactors')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <label htmlFor="fever" className="label mb-0">Fever</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="exercise"
                  name="exercise"
                  checked={formData.precipitatingFactors.exercise}
                  onChange={(e) => handleInputChange(e, 'precipitatingFactors')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <label htmlFor="exercise" className="label mb-0">Exercise</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emotionalStress"
                  name="emotionalStress"
                  checked={formData.precipitatingFactors.emotionalStress}
                  onChange={(e) => handleInputChange(e, 'precipitatingFactors')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <label htmlFor="emotionalStress" className="label mb-0">Emotional Stress</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="premenstrual"
                  name="premenstrual"
                  checked={formData.precipitatingFactors.premenstrual}
                  onChange={(e) => handleInputChange(e, 'precipitatingFactors')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <label htmlFor="premenstrual" className="label mb-0">Premenstrual</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cold"
                  name="cold"
                  checked={formData.precipitatingFactors.cold}
                  onChange={(e) => handleInputChange(e, 'precipitatingFactors')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <label htmlFor="cold" className="label mb-0">Cold / Aquagenic</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="aquagenic"
                  name="aquagenic"
                  checked={formData.precipitatingFactors.aquagenic}
                  onChange={(e) => handleInputChange(e, 'precipitatingFactors')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <label htmlFor="aquagenic" className="label mb-0">Aquagenic Factors / Pressure</label>
              </div>
            </div>
          </div>

          {/* Relation to */}
          <div className="card">
            <h3 className="form-section-title">Relation to:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Drugs</label>
                <input
                  type="text"
                  name="relationToDrugs"
                  value={formData.relationToDrugs}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Food / Inhalants / Infection</label>
                <input
                  type="text"
                  name="relationToFood"
                  value={formData.relationToFood}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Insect bites / Stings / Penetrants / Contacts</label>
                <input
                  type="text"
                  name="relationToInsectBites"
                  value={formData.relationToInsectBites}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Environmental changes / Genetic abnormalities</label>
                <input
                  type="text"
                  name="relationToEnvironmentalChanges"
                  value={formData.relationToEnvironmentalChanges}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Psychogenic factors / Autogenic factors</label>
                <input
                  type="text"
                  name="relationToPsychogenicFactors"
                  value={formData.relationToPsychogenicFactors}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Past History */}
          <div className="card">
            <h3 className="form-section-title">Past History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">H/o similar lesion / any other illness</label>
                <input
                  type="text"
                  name="pastHistorySimilarLesion"
                  value={formData.pastHistorySimilarLesion}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Menstrual History */}
          <div className="card">
            <h3 className="form-section-title">Menstrual History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Regular / Irregular</label>
                <select
                  name="menstrualHistory"
                  value={formData.menstrualHistory}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Irregular">Irregular</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div>
                <label className="label">H/o white discharge</label>
                <select
                  name="whiteDischarge"
                  value={formData.whiteDischarge}
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

          {/* Family History */}
          <div className="card">
            <h3 className="form-section-title">Family History</h3>
            <p className="text-sm text-gray-600 mb-4">H/o allergic diathesis:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="familyHistoryAsthma"
                  name="familyHistoryAsthma"
                  checked={formData.familyHistoryAsthma}
                  onChange={handleInputChange}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <label htmlFor="familyHistoryAsthma" className="label mb-0">Asthma</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="familyHistoryEczema"
                  name="familyHistoryEczema"
                  checked={formData.familyHistoryEczema}
                  onChange={handleInputChange}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <label htmlFor="familyHistoryEczema" className="label mb-0">Eczema</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="familyHistoryUrticaria"
                  name="familyHistoryUrticaria"
                  checked={formData.familyHistoryUrticaria}
                  onChange={handleInputChange}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <label htmlFor="familyHistoryUrticaria" className="label mb-0">Urticaria</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="familyHistoryAllergicRhinitis"
                  name="familyHistoryAllergicRhinitis"
                  checked={formData.familyHistoryAllergicRhinitis}
                  onChange={handleInputChange}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <label htmlFor="familyHistoryAllergicRhinitis" className="label mb-0">Allergic Rhinitis</label>
              </div>
            </div>
          </div>

          {/* Personal History */}
          <div className="card">
            <h3 className="form-section-title">Personal History</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">H/o Allergic diathesis</label>
                <input
                  type="text"
                  name="personalHistoryAllergicDiathesis"
                  value={formData.personalHistoryAllergicDiathesis}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Diet</label>
                <input
                  type="text"
                  name="diet"
                  value={formData.diet}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="label">Habit:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="habitSmoking"
                    name="habitSmoking"
                    checked={formData.habitSmoking}
                    onChange={handleInputChange}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <label htmlFor="habitSmoking" className="label mb-0">Smoking</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="habitAlcohol"
                    name="habitAlcohol"
                    checked={formData.habitAlcohol}
                    onChange={handleInputChange}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <label htmlFor="habitAlcohol" className="label mb-0">Alcohol</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="habitDrugs"
                    name="habitDrugs"
                    checked={formData.habitDrugs}
                    onChange={handleInputChange}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <label htmlFor="habitDrugs" className="label mb-0">Drugs</label>
                </div>
              </div>
            </div>
          </div>

          {/* General Examination */}
          <div className="card">
            <h3 className="form-section-title">General Examination</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Built</label>
                <select
                  name="built"
                  value={formData.built}
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
                <label className="label">Lymph nodes</label>
                <input
                  type="text"
                  name="lymphNodes"
                  value={formData.lymphNodes}
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
              <div>
                <label className="label">Edema</label>
                <input
                  type="text"
                  name="edema"
                  value={formData.edema}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Mucous Membrane</label>
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
                <label className="label">Pallor</label>
                <input
                  type="text"
                  name="pallor"
                  value={formData.pallor}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Cyanosis</label>
                <input
                  type="text"
                  name="cyanosis"
                  value={formData.cyanosis}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Distribution of Skin lesion</label>
                <input
                  type="text"
                  name="distributionOfSkinLesion"
                  value={formData.distributionOfSkinLesion}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Local Examination */}
          <div className="card">
            <h3 className="form-section-title">Local Examination</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Any eczematous Changes</label>
                <input
                  type="text"
                  name="localExaminationEczematousChanges"
                  value={formData.localExaminationEczematousChanges}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">White dermographism / Red Dermographism</label>
                <select
                  name="whiteDermographism"
                  value={formData.whiteDermographism}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="White dermographism">White dermographism</option>
                  <option value="Red Dermographism">Red Dermographism</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>
          </div>

          {/* Systematic Examination */}
          <div className="card">
            <h3 className="form-section-title">Systematic Examination</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">C.V.S.</label>
                <input
                  type="text"
                  name="cvs"
                  value={formData.cvs}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">E.N.T / Dental</label>
                <input
                  type="text"
                  name="ent"
                  value={formData.ent}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">R.S.</label>
                <input
                  type="text"
                  name="rs"
                  value={formData.rs}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Thyroid</label>
                <input
                  type="text"
                  name="thyroid"
                  value={formData.thyroid}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">P.A.</label>
                <input
                  type="text"
                  name="pa"
                  value={formData.pa}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Gynec</label>
                <input
                  type="text"
                  name="gynec"
                  value={formData.gynec}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Investigation */}
          <div className="card">
            <h3 className="form-section-title">Investigation</h3>
            
            {/* Blood Tests */}
            <div className="mb-6">
              <label className="label font-semibold mb-3">1) Blood:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="label text-sm">Hb</label>
                  <input
                    type="text"
                    name="hb"
                    value={formData.hb}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label text-sm">TC</label>
                  <input
                    type="text"
                    name="tc"
                    value={formData.tc}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label text-sm">DC</label>
                  <input
                    type="text"
                    name="dc"
                    value={formData.dc}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label text-sm">E.S.R.</label>
                  <input
                    type="text"
                    name="esr"
                    value={formData.esr}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="label text-sm">Absolute Eosinophil count</label>
                  <input
                    type="text"
                    name="absoluteEosinophilCount"
                    value={formData.absoluteEosinophilCount}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>

            {/* Urine Tests */}
            <div className="mb-6">
              <label className="label font-semibold mb-3">2) Urine:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label text-sm">Albumin +/-</label>
                  <input
                    type="text"
                    name="urineAlbumin"
                    value={formData.urineAlbumin}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label text-sm">Sugar +/-</label>
                  <input
                    type="text"
                    name="urineSugar"
                    value={formData.urineSugar}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label text-sm">Microscopy</label>
                  <input
                    type="text"
                    name="urineMicroscopy"
                    value={formData.urineMicroscopy}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>

            {/* Stool */}
            <div className="mb-6">
              <label className="label font-semibold mb-3">3) Stool:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-sm">Ova and Cysts</label>
                  <input
                    type="text"
                    name="stoolOvaAndCysts"
                    value={formData.stoolOvaAndCysts}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>

            {/* FBS */}
            <div className="mb-6">
              <label className="label font-semibold mb-3">4) FBS:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-sm">FBS</label>
                  <input
                    type="text"
                    name="fbs"
                    value={formData.fbs}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label text-sm">P.P.B.S.</label>
                  <input
                    type="text"
                    name="ppbs"
                    value={formData.ppbs}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>

            {/* Other Tests */}
            <div className="space-y-4">
              <div>
                <label className="label">5) Ice cube test / cold immersion test / exercise test</label>
                <input
                  type="text"
                  name="iceCubeTest"
                  value={formData.iceCubeTest}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">6) Test for dermographism</label>
                <input
                  type="text"
                  name="testForDermographism"
                  value={formData.testForDermographism}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">7) Other Investigations</label>
                <textarea
                  name="otherInvestigations"
                  value={formData.otherInvestigations}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">8) Liver function tests</label>
                <input
                  type="text"
                  name="liverFunctionTests"
                  value={formData.liverFunctionTests}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">9) Biopsy</label>
                <input
                  type="text"
                  name="biopsy"
                  value={formData.biopsy}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Treatment */}
          <div className="card">
            <h3 className="form-section-title">Treatment</h3>
            <textarea
              name="treatment"
              value={formData.treatment}
              onChange={handleInputChange}
              className="input"
              rows="4"
              disabled={!canEdit}
            />
          </div>

          {/* Follow up - UAS Score */}
          <div className="card">
            <h3 className="form-section-title">Follow up - URTICARIA ACTIVITY SCORE (U.A.S.)</h3>
            <p className="text-sm text-gray-600 mb-4">(U.A.S. is the sum of wheal score and itch severity)</p>
            
            {/* UAS Reference Table */}
            <div className="mb-6 overflow-x-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">WHEALS (0-3)</h4>
                  <table className="min-w-full border border-gray-300 text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="border-r px-2 py-1 font-semibold">0</td>
                        <td className="px-2 py-1">Less than 10 small wheals (diameter 3cm)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="border-r px-2 py-1 font-semibold">1</td>
                        <td className="px-2 py-1">10 - 50 small wheals or more than 10 large wheals (d&gt;3cm)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="border-r px-2 py-1 font-semibold">2</td>
                        <td className="px-2 py-1">More than 50 small wheals or 10 - 50 large wheals</td>
                      </tr>
                      <tr>
                        <td className="border-r px-2 py-1 font-semibold">3</td>
                        <td className="px-2 py-1">Involving almost entire body</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">SEVERITY OF ITCHING (0-3)</h4>
                  <table className="min-w-full border border-gray-300 text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="border-r px-2 py-1 font-semibold">0</td>
                        <td className="px-2 py-1">None</td>
                      </tr>
                      <tr className="border-b">
                        <td className="border-r px-2 py-1 font-semibold">1</td>
                        <td className="px-2 py-1">Mild</td>
                      </tr>
                      <tr className="border-b">
                        <td className="border-r px-2 py-1 font-semibold">2</td>
                        <td className="px-2 py-1">Moderate</td>
                      </tr>
                      <tr>
                        <td className="border-r px-2 py-1 font-semibold">3</td>
                        <td className="px-2 py-1">Severe</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* UAS Score Entry */}
            <div className="space-y-6">
              {/* 0 Weeks */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold mb-3">0 Weeks:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label text-sm">Wheals Score (0-3)</label>
                    <input
                      type="number"
                      name="uas0WeeksWheals"
                      value={formData.uas0WeeksWheals}
                      onChange={handleInputChange}
                      className="input"
                      min="0"
                      max="3"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Itching Score (0-3)</label>
                    <input
                      type="number"
                      name="uas0WeeksItching"
                      value={formData.uas0WeeksItching}
                      onChange={handleInputChange}
                      className="input"
                      min="0"
                      max="3"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Total UAS</label>
                    <input
                      type="text"
                      value={formData.uas0WeeksTotal}
                      className="input bg-gray-100"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* 2 Weeks */}
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold mb-3">2 Weeks:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label text-sm">Wheals Score (0-3)</label>
                    <input
                      type="number"
                      name="uas2WeeksWheals"
                      value={formData.uas2WeeksWheals}
                      onChange={handleInputChange}
                      className="input"
                      min="0"
                      max="3"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Itching Score (0-3)</label>
                    <input
                      type="number"
                      name="uas2WeeksItching"
                      value={formData.uas2WeeksItching}
                      onChange={handleInputChange}
                      className="input"
                      min="0"
                      max="3"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Total UAS</label>
                    <input
                      type="text"
                      value={formData.uas2WeeksTotal}
                      className="input bg-gray-100"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* 4 Weeks */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold mb-3">4 Weeks:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label text-sm">Wheals Score (0-3)</label>
                    <input
                      type="number"
                      name="uas4WeeksWheals"
                      value={formData.uas4WeeksWheals}
                      onChange={handleInputChange}
                      className="input"
                      min="0"
                      max="3"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Itching Score (0-3)</label>
                    <input
                      type="number"
                      name="uas4WeeksItching"
                      value={formData.uas4WeeksItching}
                      onChange={handleInputChange}
                      className="input"
                      min="0"
                      max="3"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Total UAS</label>
                    <input
                      type="text"
                      value={formData.uas4WeeksTotal}
                      className="input bg-gray-100"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {canEdit && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex items-center space-x-2"
              >
                <FaSave />
                <span>{loading ? 'Saving...' : editMode ? 'Update Record' : 'Save Record'}</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UrticariaProforma;
