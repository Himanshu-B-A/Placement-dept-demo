import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const AcneProforma = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Check if user can edit
  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    hospitalId: '',
    name: '',
    age: '',
    sex: '',
    phoneNumber: '',
    occupation: '',
    socioeconomicStatus: '',
    religion: '',

    // Presenting Complaints
    skinLesionsOver: '',
    scarringOverFace: '',

    // History of Presenting Complaints
    duration: '',
    ageOfOnset: '',
    dandruff: '',
    acneMechanica: '',
    
    // Nature of skin
    natureOfSkin: '',
    
    // Cosmetic Use
    topicalSteroid: '',
    powder: '',
    shampoo: '',
    soap: '',
    others: '',
    useOfBurkha: '',
    
    // Previous therapy
    cream: '',
    oil: '',
    parlorProcedures: '',
    homeRemedies: '',
    gym: '',
    mobileUsage: '',
    smoking: '',
    
    // Other medications
    otherOralMedications: '',
    previousAcneTherapy: '',
    socialPhobiaAnxietyDepression: '',
    anySymptomsSuggestive: '',
    
    // Diet History
    aggravatingFactors: {
      vegNonVeg: '',
      milkBedsTeaCoffee: '',
      chocolateIceCreamJuice: '',
      friedJunkOilyFood: ''
    },
    protectiveFactors: {
      greenLeafyVegetables: '',
      fruits: ''
    },
    impression: '',
    
    // Past History
    pastHistory: '',
    
    // Menstrual History
    menstrualHistory: '',
    
    // Personal History
    sleep: '',
    
    // General Physical Examination
    pulse: '',
    vitals: '',
    bp: '',
    rrTemp: '',
    height: '',
    weight: '',
    
    // Extent and Distribution of Acne Lesions
    natureOfSkin_: '',
    site: '',
    lesionsType: '',
    patternOfDistribution: '',
    associatedFeatures: '',
    otherFindings: '',
    evidenceOfVirilization: '',
    gradeOfAcne: '',
    
    // Lesion Count
    lesionCount: {
      atBeginning: { comedones: '', papules: '', pustules: '', nodules: '', cysts: '' },
      twoWeeks: { comedones: '', papules: '', pustules: '', nodules: '', cysts: '' },
      fourWeeks: { comedones: '', papules: '', pustules: '', nodules: '', cysts: '' },
      eightWeeks: { comedones: '', papules: '', pustules: '', nodules: '', cysts: '' },
      twelveWeeks: { comedones: '', papules: '', pustules: '', nodules: '', cysts: '' }
    },
    percentageReduction: '',
    
    // Pus for Culture and Sensitivity
    culture: {
      sensitive: '',
      resistant: ''
    },
    
    // Cardiff Acne Disability Index
    cardiffIndex: {
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: ''
    },
    
    // Global Acne Grading System
    globalGradingSystem: {
      forehead: '',
      rightCheek: '',
      leftCheek: '',
      nose: '',
      chin: '',
      chestUpperBack: ''
    },
    localScore: '',
    globalScore: ''
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
    const { name, value } = e.target;
    
    if (section && subsection) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [subsection]: {
            ...(prev[section]?.[subsection] || {}),
            [name]: value
          }
        }
      }));
    } else if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode && id) {
        // Update existing record
        const docRef = doc(db, 'patients', id);
        await updateDoc(docRef, {
          data: formData,
          lastModifiedBy: currentUser.email,
          lastModifiedAt: new Date().toISOString()
        });
        alert('Patient record updated successfully!');
      } else {
        // Create new record
        const newId = `patient-${Date.now()}`;
        const newDocRef = doc(db, 'patients', newId);
        await setDoc(newDocRef, {
            formType: 'Acne Proforma',
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
        {/* Header */}
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
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-primary-600 mt-2">ACNE PROFORMA</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Hospital ID / CG</label>
                <input
                  type="text"
                  name="hospitalId"
                  value={formData.hospitalId}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  required
                />
              </div>
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
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
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
                <label className="label">Socioeconomic Status</label>
                <input
                  type="text"
                  name="socioeconomicStatus"
                  value={formData.socioeconomicStatus}
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
            </div>
          </div>

          {/* Presenting Complaints */}
          <div className="card">
            <h3 className="form-section-title">Presenting Complaints</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Skin lesions over the face / back / neck / chest / shoulders / other areas</label>
                <input
                  type="text"
                  name="skinLesionsOver"
                  value={formData.skinLesionsOver}
                  onChange={handleInputChange}
                  placeholder="Specify areas"
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Scarring over face - YES / NO</label>
                <select
                  name="scarringOverFace"
                  value={formData.scarringOverFace}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </div>
            </div>
          </div>

          {/* History of Presenting Complaints */}
          <div className="card">
            <h3 className="form-section-title">History of Presenting Complaints</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="label">Age of Onset</label>
                <input
                  type="text"
                  name="ageOfOnset"
                  value={formData.ageOfOnset}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Dandruff (Seasonal variation / Environmental factors / Stress)</label>
                <input
                  type="text"
                  name="dandruff"
                  value={formData.dandruff}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Acne Mechanica</label>
                <input
                  type="text"
                  name="acneMechanica"
                  value={formData.acneMechanica}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Nature of the skin: Oily/Dry</label>
                <select
                  name="natureOfSkin"
                  value={formData.natureOfSkin}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Oily">Oily</option>
                  <option value="Dry">Dry</option>
                  <option value="Combination">Combination</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cosmetic Use */}
          <div className="card">
            <h3 className="form-section-title">Cosmetic Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Topical Steroid</label>
                <input
                  type="text"
                  name="topicalSteroid"
                  value={formData.topicalSteroid}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Cream</label>
                <input
                  type="text"
                  name="cream"
                  value={formData.cream}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Powder</label>
                <input
                  type="text"
                  name="powder"
                  value={formData.powder}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Oil</label>
                <input
                  type="text"
                  name="oil"
                  value={formData.oil}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Shampoo</label>
                <input
                  type="text"
                  name="shampoo"
                  value={formData.shampoo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Parlor Procedures</label>
                <input
                  type="text"
                  name="parlorProcedures"
                  value={formData.parlorProcedures}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Soap</label>
                <input
                  type="text"
                  name="soap"
                  value={formData.soap}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Home Remedies</label>
                <input
                  type="text"
                  name="homeRemedies"
                  value={formData.homeRemedies}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Gym</label>
                <input
                  type="text"
                  name="gym"
                  value={formData.gym}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Use of Burkha</label>
                <input
                  type="text"
                  name="useOfBurkha"
                  value={formData.useOfBurkha}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Mobile Usage</label>
                <input
                  type="text"
                  name="mobileUsage"
                  value={formData.mobileUsage}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Smoking</label>
                <input
                  type="text"
                  name="smoking"
                  value={formData.smoking}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Others</label>
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

          {/* Previous or Present Acne Therapy */}
          <div className="card">
            <h3 className="form-section-title">Previous or Present Acne Therapy</h3>
            <div className="space-y-3">
              <div>
                <label className="label">Other oral Medications / Any other Medication other than Allopathic</label>
                <textarea
                  name="otherOralMedications"
                  value={formData.otherOralMedications}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Previous Acne Therapy</label>
                <textarea
                  name="previousAcneTherapy"
                  value={formData.previousAcneTherapy}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Social Phobia / Anxiety / Depression due to the Acne</label>
                <input
                  type="text"
                  name="socialPhobiaAnxietyDepression"
                  value={formData.socialPhobiaAnxietyDepression}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Any symptoms suggestive of possible Increase in Androgenic hormones: Deepening voice / Increase in body hair / Decrease in scalp hair / PCOS</label>
                <textarea
                  name="anySymptomsSuggestive"
                  value={formData.anySymptomsSuggestive}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Diet History */}
          <div className="card">
            <h3 className="form-section-title">Diet History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Aggravating Dietary Factors:</h4>
                <div className="space-y-3">
                  <div>
                    <label className="label">Veg / Non Veg</label>
                    <input
                      type="text"
                      name="vegNonVeg"
                      value={formData.aggravatingFactors?.vegNonVeg || ''}
                      onChange={(e) => handleInputChange(e, 'aggravatingFactors')}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label">Milk / Beds / Tea / Coffee</label>
                    <input
                      type="text"
                      name="milkBedsTeaCoffee"
                      value={formData.aggravatingFactors?.milkBedsTeaCoffee || ''}
                      onChange={(e) => handleInputChange(e, 'aggravatingFactors')}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label">Chocolate / Ice cream / Juice</label>
                    <input
                      type="text"
                      name="chocolateIceCreamJuice"
                      value={formData.aggravatingFactors?.chocolateIceCreamJuice || ''}
                      onChange={(e) => handleInputChange(e, 'aggravatingFactors')}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label">Fried food / Junk food / Oily food</label>
                    <input
                      type="text"
                      name="friedJunkOilyFood"
                      value={formData.aggravatingFactors?.friedJunkOilyFood || ''}
                      onChange={(e) => handleInputChange(e, 'aggravatingFactors')}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Protective Dietary Factors:</h4>
                <div className="space-y-3">
                  <div>
                    <label className="label">Green Leafy Vegetables</label>
                    <input
                      type="text"
                      name="greenLeafyVegetables"
                      value={formData.protectiveFactors?.greenLeafyVegetables || ''}
                      onChange={(e) => handleInputChange(e, 'protectiveFactors')}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                  <div>
                    <label className="label">Fruits</label>
                    <input
                      type="text"
                      name="fruits"
                      value={formData.protectiveFactors?.fruits || ''}
                      onChange={(e) => handleInputChange(e, 'protectiveFactors')}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="label">Impression of Diet: High glycemic index diet / Low glycemic index diet</label>
              <input
                type="text"
                name="impression"
                value={formData.impression}
                onChange={handleInputChange}
                className="input"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Past History & Menstrual History */}
          <div className="card">
            <h3 className="form-section-title">Past History & Menstrual History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Past History: Previous history of similar complaints and treatment taken</label>
                <textarea
                  name="pastHistory"
                  value={formData.pastHistory}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Menstrual History: Age of Menarche - Regular / Irregular</label>
                <textarea
                  name="menstrualHistory"
                  value={formData.menstrualHistory}
                  onChange={handleInputChange}
                  className="input"
                  rows="3"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Personal History */}
          <div className="card">
            <h3 className="form-section-title">Personal History</h3>
            <div>
              <label className="label">Sleep: Disturbed / Sound</label>
              <select
                name="sleep"
                value={formData.sleep}
                onChange={handleInputChange}
                className="input"
                disabled={!canEdit}
              >
                <option value="">Select</option>
                <option value="Disturbed">Disturbed</option>
                <option value="Sound">Sound</option>
              </select>
            </div>
          </div>

          {/* General Physical Examination */}
          <div className="card">
            <h3 className="form-section-title">General Physical Examination</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="label">Pulse</label>
                <input
                  type="text"
                  name="pulse"
                  value={formData.pulse}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., Actions / Cyanosis / Clubbing / Oedema / Lymphadenopathy"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Vitals</label>
                <input
                  type="text"
                  name="vitals"
                  value={formData.vitals}
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
                  placeholder="e.g., 120/80"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">RR / Temp</label>
                <input
                  type="text"
                  name="rrTemp"
                  value={formData.rrTemp}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Height</label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="cm"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="kg"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Extent and Distribution of Acne Lesions */}
          <div className="card">
            <h3 className="form-section-title">Extent and Distribution of Acne Lesions</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Nature of Skin: Dry/Oily</label>
                <select
                  name="natureOfSkin_"
                  value={formData.natureOfSkin_}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Dry">Dry</option>
                  <option value="Oily">Oily</option>
                </select>
              </div>
              <div>
                <label className="label">Site</label>
                <input
                  type="text"
                  name="site"
                  value={formData.site}
                  onChange={handleInputChange}
                  placeholder="Face / Back / Shoulders / Chest / Upper arms / Others"
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Lesions of Acne</label>
                <input
                  type="text"
                  name="lesionsType"
                  value={formData.lesionsType}
                  onChange={handleInputChange}
                  placeholder="Comedones (Closed / Open) / Papules / Pustules / Cyst / Nodules"
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Pattern of Distribution</label>
                <input
                  type="text"
                  name="patternOfDistribution"
                  value={formData.patternOfDistribution}
                  onChange={handleInputChange}
                  placeholder="Shiny / Pitysporum folliculitis / Others"
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Associated Features</label>
                <input
                  type="text"
                  name="associatedFeatures"
                  value={formData.associatedFeatures}
                  onChange={handleInputChange}
                  placeholder="Atopic / Ice Scar / Icepick / Rolling / Hypertrophic / Keloid"
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Other Findings</label>
                <input
                  type="text"
                  name="otherFindings"
                  value={formData.otherFindings}
                  onChange={handleInputChange}
                  placeholder="Fissid / Punctured / Singing / Excoriation / Pigmentation"
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Evidence of Virilization</label>
                <input
                  type="text"
                  name="evidenceOfVirilization"
                  value={formData.evidenceOfVirilization}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Grade of Acne</label>
                <select
                  name="gradeOfAcne"
                  value={formData.gradeOfAcne}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Grade I">Grade I</option>
                  <option value="Grade II">Grade II</option>
                  <option value="Grade III">Grade III</option>
                  <option value="Grade IV">Grade IV</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lesion Count */}
          <div className="card">
            <h3 className="form-section-title">Lesion Count</h3>
            <p className="text-xs text-gray-500 mb-3 sm:hidden">← Scroll table horizontally to see all columns →</p>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full divide-y divide-gray-300 border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 border">Time Period</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 border">Comedones</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 border">Papules</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 border">Pustules</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 border">Nodules</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 border">Cysts</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { key: 'atBeginning', label: 'At Beginning' },
                      { key: 'twoWeeks', label: '2 Weeks' },
                      { key: 'fourWeeks', label: '4 Weeks' },
                      { key: 'eightWeeks', label: '8 Weeks' },
                      { key: 'twelveWeeks', label: '12 Weeks' }
                    ].map((period) => (
                      <tr key={period.key}>
                        <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-900 border whitespace-nowrap">{period.label}</td>
                        {['comedones', 'papules', 'pustules', 'nodules', 'cysts'].map((type) => (
                          <td key={type} className="px-2 sm:px-4 py-2 border">
                            <input
                              type="number"
                              name={type}
                              value={formData.lesionCount?.[period.key]?.[type] || ''}
                              onChange={(e) => handleInputChange(e, 'lesionCount', period.key)}
                              className="w-16 sm:w-20 input text-xs sm:text-sm"
                              disabled={!canEdit}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4">
              <label className="label">Percentage Reduction</label>
              <input
                type="text"
                name="percentageReduction"
                value={formData.percentageReduction}
                onChange={handleInputChange}
                className="input"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Pus for Culture and Sensitivity */}
          <div className="card">
            <h3 className="form-section-title">Pus for Culture and Sensitivity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Sensitive</label>
                <textarea
                  name="sensitive"
                  value={formData.culture?.sensitive || ''}
                  onChange={(e) => handleInputChange(e, 'culture')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Resistant</label>
                <textarea
                  name="resistant"
                  value={formData.culture?.resistant || ''}
                  onChange={(e) => handleInputChange(e, 'culture')}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Cardiff Acne Disability Index */}
          <div className="card">
            <h3 className="form-section-title">The Cardiff Acne Disability Index</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1. As a result of having acne, during the last month have you been aggressive, frustrated or embarrassed?</label>
                <select
                  name="q1"
                  value={formData.cardiffIndex?.q1 || ''}
                  onChange={(e) => handleInputChange(e, 'cardiffIndex')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="a">a) Very much indeed</option>
                  <option value="b">b) A lot</option>
                  <option value="c">c) A little</option>
                  <option value="d">d) Not at all</option>
                </select>
              </div>
              <div>
                <label className="label">2. Do you think that having acne during the last month has interfered with your day-to-day social activities or relationships with members of the opposite sex?</label>
                <select
                  name="q2"
                  value={formData.cardiffIndex?.q2 || ''}
                  onChange={(e) => handleInputChange(e, 'cardiffIndex')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="a">a) Severely, affecting all activities</option>
                  <option value="b">b) Moderately, in most activities</option>
                  <option value="c">c) Occasionally in only some activities</option>
                  <option value="d">d) Not at all</option>
                </select>
              </div>
              <div>
                <label className="label">3. During the last month have you avoided public changing facilities or wearing swimming costumes because of your acne?</label>
                <select
                  name="q3"
                  value={formData.cardiffIndex?.q3 || ''}
                  onChange={(e) => handleInputChange(e, 'cardiffIndex')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="a">a) All of the time</option>
                  <option value="b">b) Most of the time</option>
                  <option value="c">c) Occasionally</option>
                  <option value="d">d) Not at all</option>
                </select>
              </div>
              <div>
                <label className="label">4. How would you describe your feeling about the appearance of your skin over the last month?</label>
                <select
                  name="q4"
                  value={formData.cardiffIndex?.q4 || ''}
                  onChange={(e) => handleInputChange(e, 'cardiffIndex')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="a">a) Very depressed and miserable</option>
                  <option value="b">b) Usually concerned</option>
                  <option value="c">c) Occasionally concerned</option>
                  <option value="d">d) Not bothered</option>
                </select>
              </div>
              <div>
                <label className="label">5. Please indicate how bad you think your acne is now?</label>
                <select
                  name="q5"
                  value={formData.cardiffIndex?.q5 || ''}
                  onChange={(e) => handleInputChange(e, 'cardiffIndex')}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="a">a) The worst it could possibly be</option>
                  <option value="b">b) A major problem</option>
                  <option value="c">c) A minor problem</option>
                  <option value="d">d) Not a problem</option>
                </select>
              </div>
            </div>
          </div>

          {/* Global Acne Grading System */}
          <div className="card">
            <h3 className="form-section-title">The Global Acne Grading System</h3>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Note:</strong> Each type of lesion is given a value depending on severity: no lesions = 0, 
              comedones = 1, papules = 2, pustules = 3 and nodules = 4
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Forehead (Factor: 2)</label>
                <input
                  type="number"
                  name="forehead"
                  value={formData.globalGradingSystem?.forehead || ''}
                  onChange={(e) => handleInputChange(e, 'globalGradingSystem')}
                  className="input"
                  min="0"
                  max="4"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Right Cheek (Factor: 2)</label>
                <input
                  type="number"
                  name="rightCheek"
                  value={formData.globalGradingSystem?.rightCheek || ''}
                  onChange={(e) => handleInputChange(e, 'globalGradingSystem')}
                  className="input"
                  min="0"
                  max="4"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Left Cheek (Factor: 2)</label>
                <input
                  type="number"
                  name="leftCheek"
                  value={formData.globalGradingSystem?.leftCheek || ''}
                  onChange={(e) => handleInputChange(e, 'globalGradingSystem')}
                  className="input"
                  min="0"
                  max="4"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Nose (Factor: 1)</label>
                <input
                  type="number"
                  name="nose"
                  value={formData.globalGradingSystem?.nose || ''}
                  onChange={(e) => handleInputChange(e, 'globalGradingSystem')}
                  className="input"
                  min="0"
                  max="4"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Chin (Factor: 1)</label>
                <input
                  type="number"
                  name="chin"
                  value={formData.globalGradingSystem?.chin || ''}
                  onChange={(e) => handleInputChange(e, 'globalGradingSystem')}
                  className="input"
                  min="0"
                  max="4"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Chest and Upper Back (Factor: 3)</label>
                <input
                  type="number"
                  name="chestUpperBack"
                  value={formData.globalGradingSystem?.chestUpperBack || ''}
                  onChange={(e) => handleInputChange(e, 'globalGradingSystem')}
                  className="input"
                  min="0"
                  max="4"
                  disabled={!canEdit}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Local Score (Factor x Grade (0-4))</label>
                <input
                  type="text"
                  name="localScore"
                  value={formData.localScore}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Global Score (Sum of Local Scores)</label>
                <input
                  type="text"
                  name="globalScore"
                  value={formData.globalScore}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="1-18: mild, 19-30: moderate, 31-38: severe, >39: very severe"
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
                    <span className="animate-spin">⏳</span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>{editMode ? 'Update' : 'Save'} Patient Record</span>
                  </>
                )}
              </button>
            </div>
          )}

          {!canEdit && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>View Only:</strong> As a student, you can only view this record. Faculty and HOD can edit this record.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AcneProforma;
