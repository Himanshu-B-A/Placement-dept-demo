import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const SuperficialDermatophyticInfections = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    date: '',
    opNo: '',
    name: '',
    age: '',
    sex: '',
    occupation: {
      farmer: false,
      coolie: false,
      housewife: false,
      business: false,
      driver: false,
      hoursOfDriving: '',
      student: false,
      professional: false,
      others: false
    },
    educationalStatus: {
      illiterate: false,
      undergraduate: false,
      postgraduate: false
    },
    monthlyIncome: '',
    address: '',
    informant: '',

    // Major Complaints
    itching: '',
    duration: '',
    site: '',
    discoloration: '',
    scaling: '',
    oozing: '',
    pain: '',
    steroidApplication: '',
    steroidSpecify: '',
    treatmentPast: '',
    treatmentSpecify: '',
    hoDM: '',

    // Episode History
    similarEpisodePast: '',
    lastEpisodeDate: '',
    episodesLastYear: '',
    similarCasesFamily: '',

    // Fomites Sharing
    sharingFomites: '',
    sharingTowel: false,
    sharingSoap: false,
    sharingClothing: false,
    sharingRazor: false,
    sharingFootWear: false,
    sharingOthersSpecify: '',

    // Bathing Habits
    bathingFrequency: '',
    bathingFromWhere: '',

    // Pets
    petsInFamily: '',
    petDog: false,
    petCat: false,
    petBirds: false,
    petOthersSpecify: '',

    // Lesions
    lesionsGeneral: '',

    // Site Affected
    siteAffected: {
      head: false,
      face: false,
      axilla: false,
      inframamammary: false,
      abdomen: false,
      back: false,
      upperlimb: false,
      waistArea: false,
      groin: false,
      lowerLimb: false,
      buttocks: false,
      nails: false
    },

    // Nails - Onychomycosis
    onychomycosis: {
      dlso: false,
      pso: false,
      so: false,
      mixedDlsoSo: false,
      soDlso: false,
      psoDlso: false,
      soPso: false,
      paronychiaWith: false,
      paronychiaWithout: false
    },

    // Description of Lesion
    lesionDescription: {
      macule: false,
      patch: false,
      papule: false,
      pustule: false,
      plaque: false,
      other: false
    },
    ringLesion: '',
    lesionScaling: '',
    lesionDiscolouration: '',
    discolourationType: '',
    discharge: '',
    dischargeColour: '',
    consistency: '',
    bloodStained: '',
    foulSmelling: '',

    // Investigations
    koh: '',
    culture: '',
    lcbMount: '',

    // Sensitivity
    sensitivity: {
      fluconazole: '',
      ketoconazole: '',
      itraconazole: '',
      luliconazole: '',
      terbinafine: ''
    },
    mic: {
      fluconazole: '',
      ketoconazole: '',
      itraconazole: '',
      luliconazole: '',
      terbinafine: ''
    },

    // Final Diagnosis
    finalDiagnosis: '',

    // Follow Up
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
            formType: 'Superficial Dermatophytic Infections',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Superficial Dermatophytic Infections',
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
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-primary-600 mt-2">
              STUDY OF THE PATTERN OF SUPERFICIAL DERMATOPHYTIC INFECTIONS OF THE SKIN
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <label className="label">OP. No.</label>
                <input
                  type="text"
                  name="opNo"
                  value={formData.opNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div className="lg:col-span-1">
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
              <div className="sm:col-span-2">
                <label className="label">Sex</label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sex"
                      value="Male"
                      checked={formData.sex === 'Male'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sex"
                      value="Female"
                      checked={formData.sex === 'Female'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Occupation</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="farmer"
                    checked={formData.occupation?.farmer || false}
                    onChange={(e) => handleInputChange(e, 'occupation')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Farmer</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="coolie"
                    checked={formData.occupation?.coolie || false}
                    onChange={(e) => handleInputChange(e, 'occupation')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Coolie</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="housewife"
                    checked={formData.occupation?.housewife || false}
                    onChange={(e) => handleInputChange(e, 'occupation')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Housewife</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="business"
                    checked={formData.occupation?.business || false}
                    onChange={(e) => handleInputChange(e, 'occupation')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Business</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="student"
                    checked={formData.occupation?.student || false}
                    onChange={(e) => handleInputChange(e, 'occupation')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Student</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="professional"
                    checked={formData.occupation?.professional || false}
                    onChange={(e) => handleInputChange(e, 'occupation')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Professional</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="driver"
                    checked={formData.occupation?.driver || false}
                    onChange={(e) => handleInputChange(e, 'occupation')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Driver</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="others"
                    checked={formData.occupation?.others || false}
                    onChange={(e) => handleInputChange(e, 'occupation')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Others</span>
                </label>
              </div>
              {formData.occupation?.driver && (
                <div className="mt-3">
                  <input
                    type="text"
                    name="hoursOfDriving"
                    value={formData.occupation?.hoursOfDriving || ''}
                    onChange={(e) => handleInputChange(e, 'occupation')}
                    className="input"
                    placeholder="Hours of driving"
                    disabled={!canEdit}
                  />
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="label">Educational Status</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="illiterate"
                    checked={formData.educationalStatus?.illiterate || false}
                    onChange={(e) => handleInputChange(e, 'educationalStatus')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Illiterate</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="undergraduate"
                    checked={formData.educationalStatus?.undergraduate || false}
                    onChange={(e) => handleInputChange(e, 'educationalStatus')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Undergraduate</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="postgraduate"
                    checked={formData.educationalStatus?.postgraduate || false}
                    onChange={(e) => handleInputChange(e, 'educationalStatus')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">Postgraduate</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Monthly Income</label>
                <select
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="No Income">No Income</option>
                  <option value="IN 100">IN 100</option>
                  <option value="IN 1000">IN 1000</option>
                </select>
              </div>
              <div>
                <label className="label">Address</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="address"
                      value="Urban"
                      checked={formData.address === 'Urban'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Urban</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="address"
                      value="Rural"
                      checked={formData.address === 'Rural'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Rural</span>
                  </label>
                </div>
              </div>
              <div className="sm:col-span-2">
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
            </div>
          </div>

          {/* Major Complaints */}
          <div className="card">
            <h3 className="form-section-title">Major Complaints</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">1. Itching</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="itching"
                      value="Yes"
                      checked={formData.itching === 'Yes'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="itching"
                      value="No"
                      checked={formData.itching === 'No'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="label">2. Duration</label>
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
                <label className="label">Site</label>
                <input
                  type="text"
                  name="site"
                  value={formData.site}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">3. Discoloration</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discoloration"
                      value="Yes"
                      checked={formData.discoloration === 'Yes'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discoloration"
                      value="No"
                      checked={formData.discoloration === 'No'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="label">Scaling</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="scaling"
                      value="Yes"
                      checked={formData.scaling === 'Yes'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="scaling"
                      value="No"
                      checked={formData.scaling === 'No'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="label">4. Oozing</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="oozing"
                      value="Yes"
                      checked={formData.oozing === 'Yes'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="oozing"
                      value="No"
                      checked={formData.oozing === 'No'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="label">5. Pain</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pain"
                      value="Yes"
                      checked={formData.pain === 'Yes'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pain"
                      value="No"
                      checked={formData.pain === 'No'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="label">6. H/o Steroid Application</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="steroidApplication"
                      value="Yes"
                      checked={formData.steroidApplication === 'Yes'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="steroidApplication"
                      value="No"
                      checked={formData.steroidApplication === 'No'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              {formData.steroidApplication === 'Yes' && (
                <div className="sm:col-span-2">
                  <label className="label">If Yes, Specify</label>
                  <input
                    type="text"
                    name="steroidSpecify"
                    value={formData.steroidSpecify}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              )}
              <div>
                <label className="label">7. H/o Treatment in the Past</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="treatmentPast"
                      value="Yes"
                      checked={formData.treatmentPast === 'Yes'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="treatmentPast"
                      value="No"
                      checked={formData.treatmentPast === 'No'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              {formData.treatmentPast === 'Yes' && (
                <div className="sm:col-span-2">
                  <label className="label">If Yes, Specify</label>
                  <input
                    type="text"
                    name="treatmentSpecify"
                    value={formData.treatmentSpecify}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              )}
              <div>
                <label className="label">8. H/o DM</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hoDM"
                      value="Yes"
                      checked={formData.hoDM === 'Yes'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hoDM"
                      value="No"
                      checked={formData.hoDM === 'No'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Episode History & Family */}
          <div className="card">
            <h3 className="form-section-title">Episode History & Family</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Similar Episode in the Past</label>
                <input
                  type="text"
                  name="similarEpisodePast"
                  value={formData.similarEpisodePast}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">If yes, when was the last episode</label>
                  <input
                    type="text"
                    name="lastEpisodeDate"
                    value={formData.lastEpisodeDate}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">How many episode in last one year duration</label>
                  <input
                    type="text"
                    name="episodesLastYear"
                    value={formData.episodesLastYear}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>
              <div>
                <label className="label">Similar Cases in family</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="similarCasesFamily"
                      value="Yes"
                      checked={formData.similarCasesFamily === 'Yes'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="similarCasesFamily"
                      value="No"
                      checked={formData.similarCasesFamily === 'No'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label">Sharing of Fomites among family members</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sharingFomites"
                      value="Yes"
                      checked={formData.sharingFomites === 'Yes'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sharingFomites"
                      value="No"
                      checked={formData.sharingFomites === 'No'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {formData.sharingFomites === 'Yes' && (
                <div className="ml-6">
                  <label className="label">If Yes</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="sharingTowel"
                        checked={formData.sharingTowel}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm">(1) Towel</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="sharingSoap"
                        checked={formData.sharingSoap}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm">(2) Soap</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="sharingClothing"
                        checked={formData.sharingClothing}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm">(3) Clothing</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="sharingRazor"
                        checked={formData.sharingRazor}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm">(4) Razor</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="sharingFootWear"
                        checked={formData.sharingFootWear}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm">(5) Foot Wear</span>
                    </label>
                  </div>
                  <div className="mt-3">
                    <input
                      type="text"
                      name="sharingOthersSpecify"
                      value={formData.sharingOthersSpecify}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="(6) Others - Specify"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bathing Habits */}
          <div className="card">
            <h3 className="form-section-title">Bathing Habits</h3>
            <div className="space-y-4">
              <div>
                <label className="label">(1) Frequency of Bathing</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bathingFrequency"
                      value="Daily"
                      checked={formData.bathingFrequency === 'Daily'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">(i) Daily</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bathingFrequency"
                      value="On Alternate Days"
                      checked={formData.bathingFrequency === 'On Alternate Days'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">(ii) On Alternate Days</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bathingFrequency"
                      value="Once in Three Days"
                      checked={formData.bathingFrequency === 'Once in Three Days'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">(iii) Once in Three Days</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bathingFrequency"
                      value="Weekly Once"
                      checked={formData.bathingFrequency === 'Weekly Once'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">(iv) Weekly Once</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="label">(2) From where</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bathingFromWhere"
                      value="Common Pool"
                      checked={formData.bathingFromWhere === 'Common Pool'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">(i) Common Pool</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bathingFromWhere"
                      value="Tap Water"
                      checked={formData.bathingFromWhere === 'Tap Water'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">(ii) Tap Water</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Pets */}
          <div className="card">
            <h3 className="form-section-title">Pets in the family</h3>
            <div className="space-y-4">
              <div>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="petsInFamily"
                      value="Yes"
                      checked={formData.petsInFamily === 'Yes'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="petsInFamily"
                      value="No"
                      checked={formData.petsInFamily === 'No'}
                      onChange={handleInputChange}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {formData.petsInFamily === 'Yes' && (
                <div>
                  <label className="label">If Yes, Specify</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="petDog"
                        checked={formData.petDog}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm">(1) Dog</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="petCat"
                        checked={formData.petCat}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm">(2) Cat</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="petBirds"
                        checked={formData.petBirds}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm">(3) Birds</span>
                    </label>
                  </div>
                  <div className="mt-3">
                    <input
                      type="text"
                      name="petOthersSpecify"
                      value={formData.petOthersSpecify}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="(4) Others Specify"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lesions */}
          <div className="card">
            <h3 className="form-section-title">Lesions</h3>
            <div>
              <label className="label">General</label>
              <textarea
                name="lesionsGeneral"
                value={formData.lesionsGeneral}
                onChange={handleInputChange}
                className="input"
                rows="3"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Site Affected */}
          <div className="card">
            <h3 className="form-section-title">Site Affected</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { key: 'head', label: '(1) Head' },
                { key: 'face', label: '(2) Face' },
                { key: 'axilla', label: '(3) Axilla' },
                { key: 'inframamammary', label: '(4) Infra mammary' },
                { key: 'abdomen', label: '(5) Abdomen' },
                { key: 'back', label: '(6) Back' },
                { key: 'upperlimb', label: '(7) Upperlimb' },
                { key: 'waistArea', label: '(8) Waist Area' },
                { key: 'groin', label: '(9) Groin' },
                { key: 'lowerLimb', label: '(10) Lower Limb' },
                { key: 'buttocks', label: '(11) Buttocks' }
              ].map(site => (
                <label key={site.key} className="flex items-center">
                  <input
                    type="checkbox"
                    name={site.key}
                    checked={formData.siteAffected?.[site.key] || false}
                    onChange={(e) => handleInputChange(e, 'siteAffected')}
                    className="mr-2"
                    disabled={!canEdit}
                  />
                  <span className="text-sm">{site.label}</span>
                </label>
              ))}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="nails"
                  checked={formData.siteAffected?.nails || false}
                  onChange={(e) => handleInputChange(e, 'siteAffected')}
                  className="mr-2"
                  disabled={!canEdit}
                />
                <span className="text-sm">(11) Nails</span>
              </label>
            </div>

            {formData.siteAffected?.nails && (
              <div className="mt-4 ml-6">
                <label className="label">Onychomycosis</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="dlso"
                      checked={formData.onychomycosis?.dlso || false}
                      onChange={(e) => handleInputChange(e, 'onychomycosis')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">- Distal & Lateral Subungual (DLSO)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="pso"
                      checked={formData.onychomycosis?.pso || false}
                      onChange={(e) => handleInputChange(e, 'onychomycosis')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">- Proximal Subungual (PSO)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="so"
                      checked={formData.onychomycosis?.so || false}
                      onChange={(e) => handleInputChange(e, 'onychomycosis')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">- Superficial (SO)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="mixedDlsoSo"
                      checked={formData.onychomycosis?.mixedDlsoSo || false}
                      onChange={(e) => handleInputChange(e, 'onychomycosis')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">- Mixed - DLSO + SO</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="soDlso"
                      checked={formData.onychomycosis?.soDlso || false}
                      onChange={(e) => handleInputChange(e, 'onychomycosis')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">- SO + DLSO</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="psoDlso"
                      checked={formData.onychomycosis?.psoDlso || false}
                      onChange={(e) => handleInputChange(e, 'onychomycosis')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">- PSO + DLSO</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="soPso"
                      checked={formData.onychomycosis?.soPso || false}
                      onChange={(e) => handleInputChange(e, 'onychomycosis')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">- SO + PSO</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="paronychiaWith"
                      checked={formData.onychomycosis?.paronychiaWith || false}
                      onChange={(e) => handleInputChange(e, 'onychomycosis')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">Paronychia with Onychomycosis</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="paronychiaWithout"
                      checked={formData.onychomycosis?.paronychiaWithout || false}
                      onChange={(e) => handleInputChange(e, 'onychomycosis')}
                      className="mr-2"
                      disabled={!canEdit}
                    />
                    <span className="text-sm">without Onychomycosis</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Description of the Lesion */}
          <div className="card">
            <h3 className="form-section-title">Description of the Lesion</h3>
            <div className="space-y-4">
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {['macule', 'patch', 'papule', 'pustule', 'plaque', 'other'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        name={type}
                        checked={formData.lesionDescription?.[type] || false}
                        onChange={(e) => handleInputChange(e, 'lesionDescription')}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span className="text-sm capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="label">Ring Lesion</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="ringLesion"
                        value="Yes"
                        checked={formData.ringLesion === 'Yes'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="ringLesion"
                        value="No"
                        checked={formData.ringLesion === 'No'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="label">Scaling</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="lesionScaling"
                        value="Yes"
                        checked={formData.lesionScaling === 'Yes'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="lesionScaling"
                        value="No"
                        checked={formData.lesionScaling === 'No'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="label">Discolouration</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="lesionDiscolouration"
                        value="Yes"
                        checked={formData.lesionDiscolouration === 'Yes'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="lesionDiscolouration"
                        value="No"
                        checked={formData.lesionDiscolouration === 'No'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>

              {formData.lesionDiscolouration === 'Yes' && (
                <div className="ml-6">
                  <label className="label">If Yes</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="discolourationType"
                        value="Hyperpigmented"
                        checked={formData.discolourationType === 'Hyperpigmented'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>Hyperpigmented</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="discolourationType"
                        value="Hypopigmented"
                        checked={formData.discolourationType === 'Hypopigmented'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>Hypopigmented</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Discharge</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="discharge"
                        value="Yes"
                        checked={formData.discharge === 'Yes'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="discharge"
                        value="No"
                        checked={formData.discharge === 'No'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                {formData.discharge === 'Yes' && (
                  <div>
                    <label className="label">If yes, Colour of Discharge</label>
                    <input
                      type="text"
                      name="dischargeColour"
                      value={formData.dischargeColour}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Consistency</label>
                  <input
                    type="text"
                    name="consistency"
                    value={formData.consistency}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <label className="label">Blood Stained</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="bloodStained"
                        value="Yes"
                        checked={formData.bloodStained === 'Yes'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="bloodStained"
                        value="No"
                        checked={formData.bloodStained === 'No'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="label">Foul Smelling</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="foulSmelling"
                        value="Yes"
                        checked={formData.foulSmelling === 'Yes'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="foulSmelling"
                        value="No"
                        checked={formData.foulSmelling === 'No'}
                        onChange={handleInputChange}
                        className="mr-2"
                        disabled={!canEdit}
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investigations */}
          <div className="card">
            <h3 className="form-section-title">Investigations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">KOH</label>
                <textarea
                  name="koh"
                  value={formData.koh}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Culture</label>
                <textarea
                  name="culture"
                  value={formData.culture}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">LCB Mount</label>
                <textarea
                  name="lcbMount"
                  value={formData.lcbMount}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Sensitivity */}
          <div className="card">
            <h3 className="form-section-title">SENSITIVITY</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Drug</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">RESISTANT</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">SENSITIVE</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">MIC</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {['fluconazole', 'ketoconazole', 'itraconazole', 'luliconazole', 'terbinafine'].map(drug => (
                    <tr key={drug}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 uppercase">{drug}</td>
                      <td className="px-3 py-2">
                        <input
                          type="radio"
                          name={drug}
                          value="RESISTANT"
                          checked={formData.sensitivity?.[drug] === 'RESISTANT'}
                          onChange={(e) => handleInputChange(e, 'sensitivity')}
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="radio"
                          name={drug}
                          value="SENSITIVE"
                          checked={formData.sensitivity?.[drug] === 'SENSITIVE'}
                          onChange={(e) => handleInputChange(e, 'sensitivity')}
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          name={drug}
                          value={formData.mic?.[drug] || ''}
                          onChange={(e) => handleInputChange(e, 'mic')}
                          className="input"
                          disabled={!canEdit}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Diagnosis */}
          <div className="card">
            <h3 className="form-section-title">FINAL DIAGNOSIS</h3>
            <textarea
              name="finalDiagnosis"
              value={formData.finalDiagnosis}
              onChange={handleInputChange}
              className="input"
              rows="3"
              disabled={!canEdit}
            />
          </div>

          {/* Follow Up */}
          <div className="card">
            <h3 className="form-section-title">FOLLOW UP</h3>
            <textarea
              name="followUp"
              value={formData.followUp}
              onChange={handleInputChange}
              className="input"
              rows="4"
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

export default SuperficialDermatophyticInfections;
