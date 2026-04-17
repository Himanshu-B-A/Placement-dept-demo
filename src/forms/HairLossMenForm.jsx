import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const HairLossMenForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    ipNo: '',
    age: '',
    dateOfRecording: '',
    address: '',
    occupation: '',
    phoneNo: '',

    // Clinical History
    durationOfHairLoss: '',
    assoComplaints: '',
    assoSystemicDs: {
      nil: false,
      diabetes: false,
      ht: false,
      atopy: false,
      thyroid: false,
      malignancy: false,
      others: false,
      othersText: ''
    },
    medicationForSystemicDs: '',
    otherRelevantHistory: {
      trauma: false,
      starvation: false,
      crashDiet: false,
      operation: false,
      emotionalStress: false,
      pregnancy: false
    },
    familyHistoryOfSimilar: '',

    // O/E (On Examination)
    pulse: '',
    bp: '',
    febrileAfebrile: '',
    pallor: '',
    icterus: '',
    cyanosis: '',
    clubbing: '',
    lymphadenopathy: '',
    oedema: '',

    // Cutaneous Examination
    scalp: '',
    nails: '',

    // General Examination - Investigations
    cbp: '',
    serumFe: '',
    serumZn: '',
    tft: '',
    t3: '',
    t4: '',
    tsh: '',
    ana: '',
    serumFerritin: '',
    tibc: '',

    // Hair Pull Test
    hairPullTestTotal: '',
    hairPullTestPhase: '',

    // Hair Pluck Test (Trichogram) - F
    trichogramF: {
      totalExamined: '',
      pigmentation: Array(20).fill(''),
      sheath: Array(20).fill(''),
      clubbing: Array(20).fill(''),
      angulation: Array(20).fill(''),
      brokenShaft: Array(20).fill(''),
      tapering: Array(20).fill('')
    },

    // Hair Pluck Test (Trichogram) - Q
    trichogramQ: {
      totalExamined: '',
      pigmentation: Array(20).fill(''),
      sheath: Array(20).fill(''),
      clubbing: Array(20).fill(''),
      angulation: Array(20).fill(''),
      brokenShaft: Array(20).fill(''),
      tapering: Array(20).fill('')
    },

    // Trichoscopy - Alopecia Areata
    aaBlackDots: '',
    aaTaperingHair: '',
    aaBrokenHair: '',
    aaYellowDots: '',
    aaShortVillusHair: '',

    // Trichoscopy - Androgenic Alopecia
    androHairDiameterDiversity: '',
    androPerifollicularPigmentation: '',
    androYellowDots: '',

    // Trichoscopy - Cicatricial Alopecia
    cicaLossOfOrifices: '',
    cicaPerifollicularErythema: '',
    cicaHairTufting: '',

    // Hamilton-Norwood Scale
    hamiltonNorwoodScale: '',

    // Treatment
    treatment: '',

    // Follow up
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('assoSystemicDs.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        assoSystemicDs: {
          ...prev.assoSystemicDs,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('otherRelevantHistory.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        otherRelevantHistory: {
          ...prev.otherRelevantHistory,
          [field]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTrichogramChange = (section, field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: field === 'totalExamined' ? value : prev[section][field].map((item, i) => i === index ? value : item)
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
            formType: 'Hair Loss in Men',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Hair Loss in Men',
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
              HAIR LOSS PROFORMA MEN
            </h1>
            <p className="text-center text-gray-600 text-sm mt-2">
              IADVL Dermatological Association (India)
            </p>
            <p className="text-center text-gray-600 text-sm">
              Department of Dermatology, Venereology & Leprosy
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
                <label className="label">IP No.</label>
                <input
                  type="text"
                  name="ipNo"
                  value={formData.ipNo}
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
                <label className="label">Ph. No.</label>
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Clinical History */}
          <div className="card">
            <h3 className="form-section-title">Clinical History</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Duration of Hair Loss</label>
                <input
                  type="text"
                  name="durationOfHairLoss"
                  value={formData.durationOfHairLoss}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Asso. Complaints</label>
                <textarea
                  name="assoComplaints"
                  value={formData.assoComplaints}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Asso. Systemic d/s</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="assoSystemicDs.nil"
                      checked={formData.assoSystemicDs.nil}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Nil</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="assoSystemicDs.diabetes"
                      checked={formData.assoSystemicDs.diabetes}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Diabetes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="assoSystemicDs.ht"
                      checked={formData.assoSystemicDs.ht}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>H.T.</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="assoSystemicDs.atopy"
                      checked={formData.assoSystemicDs.atopy}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Atopy</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="assoSystemicDs.thyroid"
                      checked={formData.assoSystemicDs.thyroid}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Thyroid</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="assoSystemicDs.malignancy"
                      checked={formData.assoSystemicDs.malignancy}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Malignancy</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="assoSystemicDs.others"
                      checked={formData.assoSystemicDs.others}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Others</span>
                  </label>
                </div>
                {formData.assoSystemicDs.others && (
                  <input
                    type="text"
                    name="assoSystemicDs.othersText"
                    value={formData.assoSystemicDs.othersText}
                    onChange={handleInputChange}
                    className="input mt-2"
                    placeholder="Specify others"
                    disabled={!canEdit}
                  />
                )}
              </div>

              <div>
                <label className="label">Medication for Systemic d/s</label>
                <textarea
                  name="medicationForSystemicDs"
                  value={formData.medicationForSystemicDs}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">Other relevant History</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="otherRelevantHistory.trauma"
                      checked={formData.otherRelevantHistory.trauma}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Trauma</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="otherRelevantHistory.starvation"
                      checked={formData.otherRelevantHistory.starvation}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Starvation</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="otherRelevantHistory.crashDiet"
                      checked={formData.otherRelevantHistory.crashDiet}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Crash diet</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="otherRelevantHistory.operation"
                      checked={formData.otherRelevantHistory.operation}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Operation</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="otherRelevantHistory.emotionalStress"
                      checked={formData.otherRelevantHistory.emotionalStress}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Emotional stress</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="otherRelevantHistory.pregnancy"
                      checked={formData.otherRelevantHistory.pregnancy}
                      onChange={handleInputChange}
                      className="checkbox"
                      disabled={!canEdit}
                    />
                    <span>Pregnancy</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label">F/H of Similar d/s</label>
                <textarea
                  name="familyHistoryOfSimilar"
                  value={formData.familyHistoryOfSimilar}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* O/E (On Examination) */}
          <div className="card">
            <h3 className="form-section-title">O/E (On Examination)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <label className="label">B.P.</label>
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
                <label className="label">Febrile / Afebrile</label>
                <select
                  name="febrileAfebrile"
                  value={formData.febrileAfebrile}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Febrile">Febrile</option>
                  <option value="Afebrile">Afebrile</option>
                </select>
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
                <label className="label">Icterus</label>
                <input
                  type="text"
                  name="icterus"
                  value={formData.icterus}
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
                <label className="label">Clubbing</label>
                <input
                  type="text"
                  name="clubbing"
                  value={formData.clubbing}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Lymphadenopathy</label>
                <input
                  type="text"
                  name="lymphadenopathy"
                  value={formData.lymphadenopathy}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Oedema</label>
                <input
                  type="text"
                  name="oedema"
                  value={formData.oedema}
                  onChange={handleInputChange}
                  className="input"
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
                <label className="label">Scalp</label>
                <textarea
                  name="scalp"
                  value={formData.scalp}
                  onChange={handleInputChange}
                  className="input min-h-[80px]"
                  disabled={!canEdit}
                  rows="3"
                />
              </div>

              <div>
                <label className="label">Nails</label>
                <textarea
                  name="nails"
                  value={formData.nails}
                  onChange={handleInputChange}
                  className="input min-h-[80px]"
                  disabled={!canEdit}
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* General Examination - Investigations */}
          <div className="card">
            <h3 className="form-section-title">General Examination - Investigations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">C.B.P.</label>
                <input
                  type="text"
                  name="cbp"
                  value={formData.cbp}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Serum Fe</label>
                <input
                  type="text"
                  name="serumFe"
                  value={formData.serumFe}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Serum Zn</label>
                <input
                  type="text"
                  name="serumZn"
                  value={formData.serumZn}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">T.F.T.</label>
                <input
                  type="text"
                  name="tft"
                  value={formData.tft}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">T3</label>
                <input
                  type="text"
                  name="t3"
                  value={formData.t3}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">T4</label>
                <input
                  type="text"
                  name="t4"
                  value={formData.t4}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">TSH</label>
                <input
                  type="text"
                  name="tsh"
                  value={formData.tsh}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">ANA</label>
                <input
                  type="text"
                  name="ana"
                  value={formData.ana}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Serum Ferritin</label>
                <input
                  type="text"
                  name="serumFerritin"
                  value={formData.serumFerritin}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">TIBC</label>
                <input
                  type="text"
                  name="tibc"
                  value={formData.tibc}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Hair Pull Test */}
          <div className="card">
            <h3 className="form-section-title">Hair Pull Test</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Total No. of Hair pulled out</label>
                <input
                  type="text"
                  name="hairPullTestTotal"
                  value={formData.hairPullTestTotal}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Phase</label>
                <input
                  type="text"
                  name="hairPullTestPhase"
                  value={formData.hairPullTestPhase}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Hair Pluck Test (Trichogram) */}
          <div className="card">
            <h3 className="form-section-title">Hair Pluck Test (Trichogram)</h3>
            
            {/* Trichogram F */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-700">Section "F"</h4>
                <div className="flex items-center space-x-2">
                  <label className="label mb-0">Total Hair examined:</label>
                  <input
                    type="text"
                    value={formData.trichogramF.totalExamined}
                    onChange={(e) => handleTrichogramChange('trichogramF', 'totalExamined', null, e.target.value)}
                    className="input w-24"
                    disabled={!canEdit}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 py-2 text-left w-32">Parameter</th>
                      {Array.from({ length: 20 }, (_, i) => (
                        <th key={i} className="border border-gray-300 px-1 py-2 text-center">{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['pigmentation', 'sheath', 'clubbing', 'angulation', 'brokenShaft', 'tapering'].map((field) => (
                      <tr key={field}>
                        <td className="border border-gray-300 px-2 py-1 font-medium capitalize">
                          {field === 'brokenShaft' ? 'Broken Shaft' : field}
                        </td>
                        {Array.from({ length: 20 }, (_, i) => (
                          <td key={i} className="border border-gray-300 px-1 py-1">
                            <input
                              type="text"
                              value={formData.trichogramF[field][i]}
                              onChange={(e) => handleTrichogramChange('trichogramF', field, i, e.target.value)}
                              className="w-full px-1 py-1 text-center border-0 focus:ring-1 focus:ring-primary-500"
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

            {/* Trichogram Q */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-700">Section "Q"</h4>
                <div className="flex items-center space-x-2">
                  <label className="label mb-0">Total Hair examined:</label>
                  <input
                    type="text"
                    value={formData.trichogramQ.totalExamined}
                    onChange={(e) => handleTrichogramChange('trichogramQ', 'totalExamined', null, e.target.value)}
                    className="input w-24"
                    disabled={!canEdit}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 py-2 text-left w-32">Parameter</th>
                      {Array.from({ length: 20 }, (_, i) => (
                        <th key={i} className="border border-gray-300 px-1 py-2 text-center">{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['pigmentation', 'sheath', 'clubbing', 'angulation', 'brokenShaft', 'tapering'].map((field) => (
                      <tr key={field}>
                        <td className="border border-gray-300 px-2 py-1 font-medium capitalize">
                          {field === 'brokenShaft' ? 'Broken Shaft' : field}
                        </td>
                        {Array.from({ length: 20 }, (_, i) => (
                          <td key={i} className="border border-gray-300 px-1 py-1">
                            <input
                              type="text"
                              value={formData.trichogramQ[field][i]}
                              onChange={(e) => handleTrichogramChange('trichogramQ', field, i, e.target.value)}
                              className="w-full px-1 py-1 text-center border-0 focus:ring-1 focus:ring-primary-500"
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
          </div>

          {/* Trichoscopy */}
          <div className="card">
            <h3 className="form-section-title">Trichoscopy</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Characteristics</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Present</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowSpan="5" className="border border-gray-300 px-4 py-2 font-semibold">Alopecia Areata</td>
                    <td className="border border-gray-300 px-4 py-2">Black Dots</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="aaBlackDots"
                        value="Present"
                        checked={formData.aaBlackDots === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="aaBlackDots"
                        value="Absent"
                        checked={formData.aaBlackDots === 'Absent'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Tapering hair (Exclamation mark hair)</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="aaTaperingHair"
                        value="Present"
                        checked={formData.aaTaperingHair === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="aaTaperingHair"
                        value="Absent"
                        checked={formData.aaTaperingHair === 'Absent'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Broken Hair</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="aaBrokenHair"
                        value="Present"
                        checked={formData.aaBrokenHair === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="aaBrokenHair"
                        value="Absent"
                        checked={formData.aaBrokenHair === 'Absent'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Yellow dots</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="aaYellowDots"
                        value="Present"
                        checked={formData.aaYellowDots === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="aaYellowDots"
                        value="Absent"
                        checked={formData.aaYellowDots === 'Absent'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Short villus hair</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="aaShortVillusHair"
                        value="Present"
                        checked={formData.aaShortVillusHair === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="aaShortVillusHair"
                        value="Absent"
                        checked={formData.aaShortVillusHair === 'Absent'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td rowSpan="3" className="border border-gray-300 px-4 py-2 font-semibold">Androgenic Alopecia</td>
                    <td className="border border-gray-300 px-4 py-2">Hair diameter diversity</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="androHairDiameterDiversity"
                        value="Present"
                        checked={formData.androHairDiameterDiversity === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="androHairDiameterDiversity"
                        value="Absent"
                        checked={formData.androHairDiameterDiversity === 'Absent'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Perifollicular pigmentation</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="androPerifollicularPigmentation"
                        value="Present"
                        checked={formData.androPerifollicularPigmentation === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="androPerifollicularPigmentation"
                        value="Absent"
                        checked={formData.androPerifollicularPigmentation === 'Absent'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Yellow dots</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="androYellowDots"
                        value="Present"
                        checked={formData.androYellowDots === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="androYellowDots"
                        value="Absent"
                        checked={formData.androYellowDots === 'Absent'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td rowSpan="3" className="border border-gray-300 px-4 py-2 font-semibold">Cicatricial Alopecia</td>
                    <td className="border border-gray-300 px-4 py-2">Loss of orifices</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="cicaLossOfOrifices"
                        value="Present"
                        checked={formData.cicaLossOfOrifices === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="cicaLossOfOrifices"
                        value="Absent"
                        checked={formData.cicaLossOfOrifices === 'Absent'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Perifollicular erythema / scale</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="cicaPerifollicularErythema"
                        value="Present"
                        checked={formData.cicaPerifollicularErythema === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="cicaPerifollicularErythema"
                        value="Absent"
                        checked={formData.cicaPerifollicularErythema === 'Absent'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Hair tufting</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="cicaHairTufting"
                        value="Present"
                        checked={formData.cicaHairTufting === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="cicaHairTufting"
                        value="Absent"
                        checked={formData.cicaHairTufting === 'Absent'}
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

          {/* Hamilton-Norwood Scale */}
          <div className="card">
            <h3 className="form-section-title">Tick the appropriate - Hamilton-Norwood Scale</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['I', 'II', 'IIA', 'III', 'IIIA', 'III Vertex', 'IV', 'IVA', 'V', 'VA', 'VI', 'VII'].map((grade) => (
                <label key={grade} className="flex items-center space-x-2 p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="hamiltonNorwoodScale"
                    value={grade}
                    checked={formData.hamiltonNorwoodScale === grade}
                    onChange={handleInputChange}
                    className="radio"
                    disabled={!canEdit}
                  />
                  <span className="font-medium">{grade}</span>
                </label>
              ))}
            </div>
            
            {/* Hamilton-Norwood Scale Visual Reference */}
            <div className="mt-6">
              <img 
                src="/image/Where-Are-You-on-the-Norwood-Hair-Loss-Scale.jpg" 
                alt="Hamilton-Norwood Scale - Male Pattern Baldness Classification" 
                className="w-full max-w-4xl mx-auto rounded-lg border border-gray-300 shadow-sm"
              />
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

          {/* Follow up */}
          <div className="card">
            <h3 className="form-section-title">Follow up</h3>
            <textarea
              name="followUp"
              value={formData.followUp}
              onChange={handleInputChange}
              className="input min-h-[80px]"
              disabled={!canEdit}
              rows="3"
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

export default HairLossMenForm;
