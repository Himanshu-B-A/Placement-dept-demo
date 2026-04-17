import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const PyodermaProforma = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    slNo: '',
    name: '',
    age: '',
    sex: '',
    address: '',
    hospital: '',
    date: '',
    ipOpNo: '',
    occupation: '',
    religion: '',
    socioEconomicStatus: '',
    phoneNo: '',

    // Chief Complaints
    chiefComplaints: '',
    duration: '',

    // History of Presenting Illness
    onset: '',
    site: '',
    associatedSystemicConditions: '',
    constitutionalSymptom: '',

    // Past History
    pastHistory: '',

    // Associated Systemic Conditions
    associatedConditions: '',

    // Drug History
    topicalApplication: '',
    systemicDrugs: '',

    // Personal History
    diet: '',
    sleep: '',
    appetite: '',
    bowelBladder: '',
    personalHygiene: '',

    // General Physical Examination
    builtNourishment: '',
    pallor: '',
    icterus: '',
    cyanosis: '',
    clubbing: '',
    lymphadenopathy: '',
    oedema: '',
    pulseRate: '',
    bp: '',
    respirationRate: '',
    temperature: '',

    // Cutaneous Examination - Inspection
    typeOfLesion: '',
    sites: '',
    numberOfLesion: '',

    // Palpation
    palpationTemp: '',
    tenderness: '',
    induration: '',
    discharge: '',
    consistency: '',
    fluctuation: '',

    // Systemic Examination
    cvs: '',
    rs: '',
    pa: '',
    cns: '',
    diagnosis: '',

    // Investigations
    completeBloodCount: '',
    randomBloodSugar: '',

    // Culture & Sensitivity
    natureOfSample: '',
    pathogenIsolated: '',
    antibiogram: '',
    sensitive: '',
    moderatelySensitive: '',
    resistant: '',

    // Treatment & Followup
    treatment: '',
    followup: ''
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
          formType: 'Pyoderma Proforma',
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
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-primary-600 mt-2">CLINICO BACTERIOLOGICAL STUDY IN PYODERMA</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Sl.No.</label>
                <input
                  type="text"
                  name="slNo"
                  value={formData.slNo}
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
                <label className="label">IP / OP No.</label>
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
                  <option value="Other">Other</option>
                </select>
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
                <label className="label">Hospital (BH / CH)</label>
                <input
                  type="text"
                  name="hospital"
                  value={formData.hospital}
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
            </div>
          </div>

          {/* Chief Complaints */}
          <div className="card">
            <h3 className="form-section-title">Chief Complaints</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Chief Complaints</label>
                <textarea
                  name="chiefComplaints"
                  value={formData.chiefComplaints}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
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
            </div>
          </div>

          {/* History of Presenting Illness */}
          <div className="card">
            <h3 className="form-section-title">History of Presenting Illness</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="Gradual">Gradual</option>
                  <option value="Sudden">Sudden</option>
                </select>
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
                <label className="label">Associated Systemic Conditions</label>
                <input
                  type="text"
                  name="associatedSystemicConditions"
                  value={formData.associatedSystemicConditions}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Pain / Itching / Discharge"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Constitutional Symptom</label>
                <input
                  type="text"
                  name="constitutionalSymptom"
                  value={formData.constitutionalSymptom}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Fever / URTI"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Past History */}
          <div className="card">
            <h3 className="form-section-title">Past History</h3>
            <div>
              <label className="label">History of similar complaints in the past (Yes / No)</label>
              <select
                name="pastHistory"
                value={formData.pastHistory}
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

          {/* Associated Systemic Conditions */}
          <div className="card">
            <h3 className="form-section-title">Associated Systemic Conditions</h3>
            <div>
              <label className="label">Diabetic Mellitus / Obesity / Others</label>
              <input
                type="text"
                name="associatedConditions"
                value={formData.associatedConditions}
                onChange={handleInputChange}
                className="input"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Drug History */}
          <div className="card">
            <h3 className="form-section-title">Drug History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Topical Application (Yes / No)</label>
                <select
                  name="topicalApplication"
                  value={formData.topicalApplication}
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
                <label className="label">Systemic Drugs</label>
                <input
                  type="text"
                  name="systemicDrugs"
                  value={formData.systemicDrugs}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Steroids / Antibiotics / Others"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Personal History */}
          <div className="card">
            <h3 className="form-section-title">Personal History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <label className="label">Sleep</label>
                <select
                  name="sleep"
                  value={formData.sleep}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Adequate">Adequate</option>
                  <option value="Disturbed">Disturbed</option>
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
                  <option value="Poor">Poor</option>
                  <option value="Good">Good</option>
                </select>
              </div>
              <div>
                <label className="label">Bowel & Bladder</label>
                <select
                  name="bowelBladder"
                  value={formData.bowelBladder}
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
                <label className="label">Personal Hygiene</label>
                <input
                  type="text"
                  name="personalHygiene"
                  value={formData.personalHygiene}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* General Physical Examination */}
          <div className="card">
            <h3 className="form-section-title">General Physical Examination</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Built & Nourishment</label>
                <select
                  name="builtNourishment"
                  value={formData.builtNourishment}
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
              <div>
                <label className="label">Pulse Rate</label>
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
                <label className="label">Respiration Rate</label>
                <input
                  type="text"
                  name="respirationRate"
                  value={formData.respirationRate}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Temperature</label>
                <select
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Afebrile">Afebrile</option>
                  <option value="Febrile">Febrile</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cutaneous Examination - Inspection */}
          <div className="card">
            <h3 className="form-section-title">Cutaneous Examination - Inspection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Type of Lesion</label>
                <input
                  type="text"
                  name="typeOfLesion"
                  value={formData.typeOfLesion}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Sites</label>
                <input
                  type="text"
                  name="sites"
                  value={formData.sites}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Number of Lesion</label>
                <select
                  name="numberOfLesion"
                  value={formData.numberOfLesion}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Solitary">Solitary</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>
            </div>
          </div>

          {/* Palpation */}
          <div className="card">
            <h3 className="form-section-title">Palpation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Temperature</label>
                <select
                  name="palpationTemp"
                  value={formData.palpationTemp}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Normal">Normal</option>
                  <option value="Raised">Raised</option>
                </select>
              </div>
              <div>
                <label className="label">Tenderness</label>
                <select
                  name="tenderness"
                  value={formData.tenderness}
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
                <label className="label">Induration</label>
                <select
                  name="induration"
                  value={formData.induration}
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
                <label className="label">Discharge</label>
                <select
                  name="discharge"
                  value={formData.discharge}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Serous">Serous</option>
                  <option value="Bloody">Bloody</option>
                  <option value="Purulent">Purulent</option>
                </select>
              </div>
              <div>
                <label className="label">Consistency</label>
                <select
                  name="consistency"
                  value={formData.consistency}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Soft">Soft</option>
                  <option value="Firm">Firm</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="label">Fluctuation</label>
                <select
                  name="fluctuation"
                  value={formData.fluctuation}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Systemic Examination */}
          <div className="card">
            <h3 className="form-section-title">Systemic Examination</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">CVS</label>
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
                <label className="label">RS</label>
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
                <label className="label">PA</label>
                <textarea
                  name="pa"
                  value={formData.pa}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">CNS</label>
                <textarea
                  name="cns"
                  value={formData.cns}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Diagnosis</label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Complete Blood Count</label>
                <textarea
                  name="completeBloodCount"
                  value={formData.completeBloodCount}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Random Blood Sugar</label>
                <input
                  type="text"
                  name="randomBloodSugar"
                  value={formData.randomBloodSugar}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Culture & Sensitivity */}
          <div className="card">
            <h3 className="form-section-title">Culture & Sensitivity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Nature of Sample</label>
                <input
                  type="text"
                  name="natureOfSample"
                  value={formData.natureOfSample}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Pathogen Isolated</label>
                <input
                  type="text"
                  name="pathogenIsolated"
                  value={formData.pathogenIsolated}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Antibiogram</label>
                <textarea
                  name="antibiogram"
                  value={formData.antibiogram}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Sensitive</label>
                <textarea
                  name="sensitive"
                  value={formData.sensitive}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="label">Moderately Sensitive</label>
                <textarea
                  name="moderatelySensitive"
                  value={formData.moderatelySensitive}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Resistant</label>
                <textarea
                  name="resistant"
                  value={formData.resistant}
                  onChange={handleInputChange}
                  className="input"
                  rows="2"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Treatment */}
          <div className="card">
            <h3 className="form-section-title">Treatment</h3>
            <div>
              <label className="label">Treatment Plan</label>
              <textarea
                name="treatment"
                value={formData.treatment}
                onChange={handleInputChange}
                className="input"
                rows="4"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Followup */}
          <div className="card">
            <h3 className="form-section-title">Followup</h3>
            <div>
              <label className="label">Followup Notes</label>
              <textarea
                name="followup"
                value={formData.followup}
                onChange={handleInputChange}
                className="input"
                rows="4"
                disabled={!canEdit}
              />
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

export default PyodermaProforma;
