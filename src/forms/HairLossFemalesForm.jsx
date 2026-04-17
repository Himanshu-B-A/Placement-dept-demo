import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const HairLossFemalesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const canEdit = userRole === 'faculty' || userRole === 'hod' || !id;

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    opIpNo: '',
    age: '',
    sex: 'Female',
    date: '',
    address: '',
    occupation: '',
    phoneNo: '',
    religion: '',

    // Presenting Complaints
    presentingComplaints: '',

    // History of Presenting Illness
    duration: '',
    distribution: '',
    hairLossRecession: '',
    gitDysfunction: '',
    thyroidProblem: '',
    surgicalIntervention: '',
    chronicIllness: '',
    medication: '',
    hirsutism: '',
    generalisedWeakness: '',
    recentFebrileIllness: '',
    reducedSelfEsteem: '',
    poorBodyImage: '',
    socialWithdrawal: '',

    // Past History
    pastHistory: '',

    // Family History
    familyHistory: '',

    // Menstrual and Obstetric History
    menstrualObstetricHistory: '',

    // History of Local Application
    hairProductsHistory: '',

    // History of Use of Hair Dryers
    hairDryersHistory: '',

    // Examination
    pallor: '',
    icterus: '',
    cyanosis: '',
    clubbing: '',
    lymphadenopathy: '',
    oedema: '',

    // Local Examination of Scalp
    surfaceExamination: '',
    dandruff: '',
    dandruffPTO: '',
    dailyHairCount: '',
    hairPullTest: '',
    hairFeatheringTest: '',
    hairBulbExamination: '',
    distalEndExamination: '',

    // Trichoscopy - Alopecia Areata
    aaBlackDots: '',
    aaTaperingHair: '',
    aaBrokenHair: '',
    aaYellowDots: '',
    aaShortVellusHair: '',

    // Trichoscopy - Androgenic Alopecia
    androHairDiameterDiversity: '',
    androPerifollicularPigmentation: '',
    androYellowDots: '',

    // Trichoscopy - Cicatricial Alopecia
    cicaLossOfOrifices: '',
    cicaPerifollicularErythema: '',
    cicaHairTufting: '',

    // Trichoscopy - Telogen Effluvium
    teloSparseness: '',
    teloIncreasedShortHairs: '',

    // Investigations
    hairPullTestResult: '',
    hb: '',
    peripheralSmear: '',
    thyroidFunctionTest: '',
    hormonalAssay: '',
    serumIronFerritinTIBC: '',

    // Diagnosis
    provisionalDiagnosis: '',
    savinScale: '',

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
            formType: 'Hair Loss in Females',
            data: formData,
            createdBy: currentUser.email,
            createdAt: new Date().toISOString(),
            lastModifiedBy: currentUser.email,
            lastModifiedAt: new Date().toISOString()
          });
        } else {
          await setDoc(newDocRef, {
            formType: 'Hair Loss in Females',
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
              CLINICAL AND DIAGNOSTIC STUDY ON HAIR LOSS IN FEMALES
            </h1>
            <p className="text-center text-gray-600 text-sm mt-2">
              Department of Dermatology, Venereology & Leprosy
            </p>
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
                  required
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
                <input
                  type="text"
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  readOnly
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
            <textarea
              name="presentingComplaints"
              value={formData.presentingComplaints}
              onChange={handleInputChange}
              className="input min-h-[80px]"
              disabled={!canEdit}
              rows="3"
            />
          </div>

          {/* History of Presenting Illness */}
          <div className="card">
            <h3 className="form-section-title">History of Presenting Illness</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1. Duration</label>
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
                <label className="label">2. Distribution</label>
                <input
                  type="text"
                  name="distribution"
                  value={formData.distribution}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">3. History of hair loss & recession of hair line</label>
                <textarea
                  name="hairLossRecession"
                  value={formData.hairLossRecession}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">4. History of GIT dysfunction</label>
                <textarea
                  name="gitDysfunction"
                  value={formData.gitDysfunction}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label">5. Thyroid problem: Wt. gain, Weakness</label>
                <textarea
                  name="thyroidProblem"
                  value={formData.thyroidProblem}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div>
                <label className="label font-semibold">6. History of:</label>
                <div className="ml-4 space-y-3 mt-2">
                  <div>
                    <label className="label">a) Surgical intervention or blood loss</label>
                    <input
                      type="text"
                      name="surgicalIntervention"
                      value={formData.surgicalIntervention}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>

                  <div>
                    <label className="label">b) Chronic illness</label>
                    <input
                      type="text"
                      name="chronicIllness"
                      value={formData.chronicIllness}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>

                  <div>
                    <label className="label">c) Medication</label>
                    <input
                      type="text"
                      name="medication"
                      value={formData.medication}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>

                  <div>
                    <label className="label">d) Hirsutism</label>
                    <input
                      type="text"
                      name="hirsutism"
                      value={formData.hirsutism}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>

                  <div>
                    <label className="label">e) Generalised weakness</label>
                    <input
                      type="text"
                      name="generalisedWeakness"
                      value={formData.generalisedWeakness}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>

                  <div>
                    <label className="label">f) Recent febrile illness</label>
                    <input
                      type="text"
                      name="recentFebrileIllness"
                      value={formData.recentFebrileIllness}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="label font-semibold">6. Psychological & Social concern:</label>
                <div className="ml-4 space-y-3 mt-2">
                  <div>
                    <label className="label">a) Reduced self esteem</label>
                    <input
                      type="text"
                      name="reducedSelfEsteem"
                      value={formData.reducedSelfEsteem}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>

                  <div>
                    <label className="label">b) Poor body image</label>
                    <input
                      type="text"
                      name="poorBodyImage"
                      value={formData.poorBodyImage}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>

                  <div>
                    <label className="label">c) Social withdrawal</label>
                    <input
                      type="text"
                      name="socialWithdrawal"
                      value={formData.socialWithdrawal}
                      onChange={handleInputChange}
                      className="input"
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Past History */}
          <div className="card">
            <h3 className="form-section-title">Past History</h3>
            <textarea
              name="pastHistory"
              value={formData.pastHistory}
              onChange={handleInputChange}
              className="input min-h-[80px]"
              disabled={!canEdit}
              rows="3"
            />
          </div>

          {/* Family History */}
          <div className="card">
            <h3 className="form-section-title">Family History</h3>
            <textarea
              name="familyHistory"
              value={formData.familyHistory}
              onChange={handleInputChange}
              className="input min-h-[80px]"
              disabled={!canEdit}
              rows="3"
            />
          </div>

          {/* Menstrual and Obstetric History */}
          <div className="card">
            <h3 className="form-section-title">Menstrual and Obstetric History</h3>
            <textarea
              name="menstrualObstetricHistory"
              value={formData.menstrualObstetricHistory}
              onChange={handleInputChange}
              className="input min-h-[80px]"
              disabled={!canEdit}
              rows="3"
            />
          </div>

          {/* History of Local Application */}
          <div className="card">
            <h3 className="form-section-title">History of Local Application of Hair Products: Dye / Gel / Shampoos / Oil / Mehandi</h3>
            <textarea
              name="hairProductsHistory"
              value={formData.hairProductsHistory}
              onChange={handleInputChange}
              className="input min-h-[80px]"
              disabled={!canEdit}
              rows="3"
            />
          </div>

          {/* History of Use of Hair Dryers */}
          <div className="card">
            <h3 className="form-section-title">History of Use of Hair Dryers / Straightener / Curlers</h3>
            <textarea
              name="hairDryersHistory"
              value={formData.hairDryersHistory}
              onChange={handleInputChange}
              className="input min-h-[80px]"
              disabled={!canEdit}
              rows="3"
            />
          </div>

          {/* Examination */}
          <div className="card">
            <h3 className="form-section-title">Examination</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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

          {/* Local Examination of Scalp */}
          <div className="card">
            <h3 className="form-section-title">Local Examination of Scalp</h3>
            <div className="space-y-4">
              <div>
                <label className="label">1. Surface Examination of scalp</label>
                <textarea
                  name="surfaceExamination"
                  value={formData.surfaceExamination}
                  onChange={handleInputChange}
                  className="input min-h-[60px]"
                  disabled={!canEdit}
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">2. Dandruff</label>
                  <select
                    name="dandruff"
                    value={formData.dandruff}
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
                  <label className="label">PTO</label>
                  <input
                    type="text"
                    name="dandruffPTO"
                    value={formData.dandruffPTO}
                    onChange={handleInputChange}
                    className="input"
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div>
                <label className="label">3. Daily hair count</label>
                <input
                  type="text"
                  name="dailyHairCount"
                  value={formData.dailyHairCount}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder=">70 true fall, <70 hair fall, >0 hair, anagen / telogen ratio"
                />
              </div>

              <div>
                <label className="label">4. Hair pull test</label>
                <input
                  type="text"
                  name="hairPullTest"
                  value={formData.hairPullTest}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                  placeholder=">0 hair, <5 hair fall"
                />
              </div>

              <div>
                <label className="label">6. Hair feathering test</label>
                <input
                  type="text"
                  name="hairFeatheringTest"
                  value={formData.hairFeatheringTest}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">7. Hair bulb examination</label>
                <input
                  type="text"
                  name="hairBulbExamination"
                  value={formData.hairBulbExamination}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">8. Distal end of hair examination</label>
                <input
                  type="text"
                  name="distalEndExamination"
                  value={formData.distalEndExamination}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
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
                    <td className="border border-gray-300 px-4 py-2">Yellow Dots</td>
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
                    <td className="border border-gray-300 px-4 py-2">Short vellus hair</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="aaShortVellusHair"
                        value="Present"
                        checked={formData.aaShortVellusHair === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="aaShortVellusHair"
                        value="Absent"
                        checked={formData.aaShortVellusHair === 'Absent'}
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
                    <td className="border border-gray-300 px-4 py-2">Yellow Dots</td>
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

                  <tr>
                    <td rowSpan="2" className="border border-gray-300 px-4 py-2 font-semibold">Telogen Effluvium</td>
                    <td className="border border-gray-300 px-4 py-2">Sparseness of hair</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="teloSparseness"
                        value="Present"
                        checked={formData.teloSparseness === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="teloSparseness"
                        value="Absent"
                        checked={formData.teloSparseness === 'Absent'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Increased number of Short, Sharp ended hairs</td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="teloIncreasedShortHairs"
                        value="Present"
                        checked={formData.teloIncreasedShortHairs === 'Present'}
                        onChange={handleInputChange}
                        className="radio"
                        disabled={!canEdit}
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input
                        type="radio"
                        name="teloIncreasedShortHairs"
                        value="Absent"
                        checked={formData.teloIncreasedShortHairs === 'Absent'}
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

          {/* Investigations */}
          <div className="card">
            <h3 className="form-section-title">Investigations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Hair pull test</label>
                <input
                  type="text"
                  name="hairPullTestResult"
                  value={formData.hairPullTestResult}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Peripheral smear examination</label>
                <input
                  type="text"
                  name="peripheralSmear"
                  value={formData.peripheralSmear}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Hb</label>
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
                <label className="label">Thyroid function test</label>
                <input
                  type="text"
                  name="thyroidFunctionTest"
                  value={formData.thyroidFunctionTest}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Serum iron / Serum ferritin / TIBC</label>
                <input
                  type="text"
                  name="serumIronFerritinTIBC"
                  value={formData.serumIronFerritinTIBC}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="label">Hormonal assay</label>
                <input
                  type="text"
                  name="hormonalAssay"
                  value={formData.hormonalAssay}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* Provisional Diagnosis */}
          <div className="card">
            <h3 className="form-section-title">Provisional Diagnosis</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <textarea
                  name="provisionalDiagnosis"
                  value={formData.provisionalDiagnosis}
                  onChange={handleInputChange}
                  className="input min-h-[100px]"
                  disabled={!canEdit}
                  rows="4"
                />
              </div>

              <div>
                <label className="label">Savin Scale</label>
                <select
                  name="savinScale"
                  value={formData.savinScale}
                  onChange={handleInputChange}
                  className="input"
                  disabled={!canEdit}
                >
                  <option value="">Select Grade</option>
                  <option value="I-1">I-1</option>
                  <option value="I-2">I-2</option>
                  <option value="I-3">I-3</option>
                  <option value="I-4">I-4</option>
                  <option value="II-1">II-1</option>
                  <option value="II-2">II-2</option>
                  <option value="III">III</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Frontal">Frontal</option>
                </select>
                
                {/* Ludwig-Savin Classification Visual Reference */}
                <div className="mt-4">
                  <img 
                    src="/image/Savin_Scale_-_Females_1000x1000.webp" 
                    alt="Ludwig-Savin Classification - Female Pattern Hair Loss" 
                    className="w-full rounded-lg border border-gray-300 shadow-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Ludwig-Savin Classification: Female pattern hair loss grading
                  </p>
                </div>
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

export default HairLossFemalesForm;
